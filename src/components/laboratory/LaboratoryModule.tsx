import React, { useState } from 'react';
import { FlaskConical, Search, CheckCircle2, AlertCircle, FileText, Upload } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { LabOrder } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Dialog } from '../ui/Dialog';

export const LaboratoryModule: React.FC = () => {
  const { labOrders, updateLabResult } = useEMR();
  const [search, setSearch] = useState('');
  const [selectedLab, setSelectedLab] = useState<LabOrder | null>(null);
  const [resultInput, setResultInput] = useState('');

  const filteredLabs = labOrders.filter(l => 
    `${l.patientName} ${l.testName} ${l.testCode} ${l.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleSaveResult = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLab || !resultInput.trim()) return;
    updateLabResult(selectedLab.id, resultInput.trim());
    setSelectedLab(null);
    setResultInput('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <FlaskConical className="h-5 w-5 text-primary" /> Clinical Laboratory Orders
          </h1>
          <p className="text-xs text-text-muted font-normal">Diagnostic test requests, blood chemistry, hematology, and result publishing</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <Input
            placeholder="Search by Patient Name, Lab Test Name, or LOINC Code..."
            icon={<Search className="h-4 w-4 text-text-muted" />}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Test LOINC Code</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Patient Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Ordered By</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Diagnostic Result</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLabs.map(lab => (
                <TableRow key={lab.id}>
                  <TableCell className="font-mono font-bold text-xs text-primary">{lab.testCode}</TableCell>
                  <TableCell className="font-semibold text-xs text-text-main">{lab.testName}</TableCell>
                  <TableCell className="text-xs text-text-main">{lab.patientName}</TableCell>
                  <TableCell><Badge variant="outline" size="sm">{lab.category}</Badge></TableCell>
                  <TableCell className="text-xs text-text-muted">{lab.orderedBy}</TableCell>
                  <TableCell>
                    <Badge variant={lab.status === 'completed' ? 'success' : 'warning'} size="sm">
                      {lab.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs font-mono text-text-main max-w-xs truncate">
                    {lab.resultText || <span className="text-text-muted italic">Pending Result</span>}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant={lab.status === 'completed' ? 'outline' : 'primary'}
                      size="sm"
                      icon={<Upload className="h-3.5 w-3.5" />}
                      onClick={() => {
                        setSelectedLab(lab);
                        setResultInput(lab.resultText || '');
                      }}
                    >
                      {lab.status === 'completed' ? 'Edit Result' : 'Input Result'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Input Result Modal */}
      {selectedLab && (
        <Dialog
          isOpen={!!selectedLab}
          onClose={() => setSelectedLab(null)}
          title={`Upload Laboratory Result: ${selectedLab.testName}`}
          description={`Patient: ${selectedLab.patientName} • Code: ${selectedLab.testCode}`}
          maxWidth="md"
        >
          <form onSubmit={handleSaveResult} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-text-main mb-1">Diagnostic Findings / Result Values *</label>
              <textarea
                className="w-full h-24 p-2 border border-border rounded text-xs text-text-main focus:ring-1 focus:ring-primary outline-none"
                placeholder="Enter quantitative values, reference ranges, and lab tech notes..."
                required
                value={resultInput}
                onChange={e => setResultInput(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Button type="button" variant="outline" onClick={() => setSelectedLab(null)}>Cancel</Button>
              <Button type="submit" variant="primary" icon={<CheckCircle2 className="h-4 w-4" />}>
                Publish Result to EMR
              </Button>
            </div>
          </form>
        </Dialog>
      )}
    </div>
  );
};
