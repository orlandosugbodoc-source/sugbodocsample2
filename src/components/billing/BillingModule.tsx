import React, { useState } from 'react';
import { 
  Receipt, 
  CreditCard, 
  CheckCircle2, 
  Printer, 
  Search, 
  DollarSign, 
  ShieldCheck, 
  FileText,
  User
} from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Invoice } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Dialog } from '../ui/Dialog';
import { formatCurrency } from '../../utils/cn';

export const BillingModule: React.FC = () => {
  const { invoices, payInvoice } = useEMR();
  const [search, setSearch] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('cash');
  const [amountTendered, setAmountTendered] = useState<number>(0);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  const filteredInvoices = invoices.filter(inv => 
    `${inv.invoiceNumber} ${inv.patientName} ${inv.patientMrn}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleOpenPayment = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setAmountTendered(inv.total - inv.paidAmount);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) return;
    payInvoice(selectedInvoice.id, paymentMethod, amountTendered);
    setIsReceiptOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Receipt className="h-5 w-5 text-[#4454c3]" /> Billing, Receipts & Cashier
          </h1>
          <p className="text-xs text-slate-500">Itemized outpatient invoices, pharmacy receipts, and HMO insurance claims</p>
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search by Invoice Number (e.g. INV-2026-0091), Patient Name, or MRN..."
            icon={<Search className="h-4 w-4 text-slate-400" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Invoices List Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice #</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Patient Name & MRN</TableHead>
                <TableHead>Subtotal</TableHead>
                <TableHead>Discount / HMO</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map(inv => (
                <TableRow key={inv.id}>
                  <TableCell className="font-mono font-bold text-xs text-[#4454c3] whitespace-nowrap">
                    {inv.invoiceNumber}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-500 whitespace-nowrap">
                    {inv.date}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{inv.patientName}</div>
                    <div className="text-[11px] font-mono text-slate-500">{inv.patientMrn}</div>
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-700 whitespace-nowrap">
                    {formatCurrency(inv.subtotal)}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-emerald-600 whitespace-nowrap">
                    -{formatCurrency(inv.discount)}
                  </TableCell>
                  <TableCell className="font-mono font-bold text-xs text-slate-900 whitespace-nowrap">
                    {formatCurrency(inv.total)}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'partially_paid' ? 'warning' : 'danger'} size="sm">
                      {inv.status.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {inv.status !== 'paid' ? (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<CreditCard className="h-3.5 w-3.5" />}
                        onClick={() => handleOpenPayment(inv)}
                      >
                        Collect Payment
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Printer className="h-3.5 w-3.5" />}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setIsReceiptOpen(true);
                        }}
                      >
                        View Official Receipt
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Collect Payment Modal */}
      {selectedInvoice && !isReceiptOpen && (
        <Dialog
          isOpen={!!selectedInvoice && !isReceiptOpen}
          onClose={() => setSelectedInvoice(null)}
          title={`Process Payment: ${selectedInvoice.invoiceNumber}`}
          description={`Patient: ${selectedInvoice.patientName} (${selectedInvoice.patientMrn})`}
          maxWidth="md"
        >
          <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
            {/* Itemized breakdown */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2">
              <div className="font-bold text-slate-900 uppercase text-[11px]">Itemized Services</div>
              {selectedInvoice.items.map(item => (
                <div key={item.id} className="flex items-center justify-between text-xs text-slate-700">
                  <span>{item.description} (x{item.quantity})</span>
                  <span className="font-mono">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900">
                <span>Total Amount Due:</span>
                <span className="font-mono text-sm text-[#4454c3]">{formatCurrency(selectedInvoice.total)}</span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Select Payment Method *</label>
              <select
                className="w-full h-9 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-900"
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value as any)}
              >
                <option value="cash">Cash Payment</option>
                <option value="card">Credit / Debit Card</option>
                <option value="insurance">PhilHealth / HMO Direct Claim</option>
                <option value="e_wallet">GCash / Maya e-Wallet</option>
              </select>
            </div>

            <Input
              label="Amount Tendered / Paid (₱) *"
              type="number"
              value={amountTendered}
              onChange={e => setAmountTendered(parseFloat(e.target.value) || 0)}
            />

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button type="button" variant="outline" onClick={() => setSelectedInvoice(null)}>Cancel</Button>
              <Button type="submit" variant="primary">Confirm Payment & Issue Receipt</Button>
            </div>
          </form>
        </Dialog>
      )}

      {/* Official Receipt Dialog */}
      {selectedInvoice && isReceiptOpen && (
        <Dialog
          isOpen={isReceiptOpen}
          onClose={() => {
            setIsReceiptOpen(false);
            setSelectedInvoice(null);
          }}
          title="Official Clinic Cash Receipt"
          description="SugboDoc Outpatient Health Facility • BIR Registered Official Receipt"
          maxWidth="lg"
        >
          <div className="space-y-4 p-2 font-mono text-xs">
            <div className="text-center space-y-1 pb-3 border-b border-slate-200">
              <h2 className="font-bold text-base font-sans text-slate-900">SUGBODOC HEALTH CLINIC</h2>
              <p className="text-[11px] text-slate-500">142 Mango Avenue, Cebu City, Philippines • Tel: (032) 254-9000</p>
              <p className="text-[11px] font-bold text-[#4454c3]">OFFICIAL RECEIPT #: {selectedInvoice.invoiceNumber}</p>
            </div>

            <div className="flex justify-between text-xs">
              <div>
                <div><strong>Patient Name:</strong> {selectedInvoice.patientName}</div>
                <div><strong>MRN:</strong> {selectedInvoice.patientMrn}</div>
              </div>
              <div className="text-right">
                <div><strong>Date:</strong> {selectedInvoice.date}</div>
                <div><strong>Cashier:</strong> Mark Anthony Villa</div>
              </div>
            </div>

            {/* Receipt Items */}
            <table className="w-full border-collapse my-3">
              <thead>
                <tr className="border-b border-slate-300 text-left text-[11px]">
                  <th className="py-1">DESCRIPTION</th>
                  <th className="py-1 text-center">QTY</th>
                  <th className="py-1 text-right">UNIT</th>
                  <th className="py-1 text-right">AMOUNT</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedInvoice.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-1.5">{item.description}</td>
                    <td className="py-1.5 text-center">{item.quantity}</td>
                    <td className="py-1.5 text-right">{formatCurrency(item.unitPrice)}</td>
                    <td className="py-1.5 text-right font-bold">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-1 text-right pt-2 border-t border-slate-300">
              <div>Subtotal: {formatCurrency(selectedInvoice.subtotal)}</div>
              <div className="text-emerald-600">Discount / HMO: -{formatCurrency(selectedInvoice.discount)}</div>
              <div className="text-sm font-bold text-slate-900">TOTAL PAID: {formatCurrency(selectedInvoice.total)}</div>
              <div className="text-[11px] text-slate-500 uppercase">Payment Method: {selectedInvoice.paymentMethod || 'CASH'}</div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t border-slate-200 font-sans">
              <Button
                variant="outline"
                icon={<Printer className="h-4 w-4" />}
                onClick={() => window.print()}
              >
                Print Receipt
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setIsReceiptOpen(false);
                  setSelectedInvoice(null);
                }}
              >
                Done
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
