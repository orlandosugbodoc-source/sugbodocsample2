import React from 'react';
import { Pill, Printer, Plus } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';

export const PrescriptionsModule: React.FC = () => {
  const { activeEncounter, activePatient, setActiveModule } = useEMR();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <Pill className="h-5 w-5 text-primary" /> Medication Orders & Prescriptions
          </h1>
          <p className="text-xs text-text-muted">Rx Prescription generator and pharmacy order catalog</p>
        </div>
        <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
          Print Rx Prescription Sheet
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Encounter Prescription Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Medication Name</TableHead>
                <TableHead>Dosage</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Special Instructions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeEncounter?.prescriptions.map(rx => (
                <TableRow key={rx.id}>
                  <TableCell className="font-semibold text-xs text-text-main">{rx.medicineName}</TableCell>
                  <TableCell className="font-mono text-xs">{rx.dosage}</TableCell>
                  <TableCell className="text-xs">{rx.frequency}</TableCell>
                  <TableCell className="text-xs">{rx.duration}</TableCell>
                  <TableCell className="font-mono text-xs font-bold">{rx.quantity} pcs</TableCell>
                  <TableCell className="text-xs text-primary italic">{rx.instructions}</TableCell>
                </TableRow>
              )) || (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-text-muted py-6 italic">
                    No active prescriptions in current encounter context.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
