import React from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Download, Printer } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { formatCurrency } from '../../utils/cn';

export const ReportsModule: React.FC = () => {
  const { patients, encounters, appointments, invoices } = useEMR();

  const totalPatients = patients.length;
  const totalEncounters = encounters.length;
  const totalRevenue = invoices.reduce((acc, i) => acc + i.paidAmount, 0);

  const doctorPerformance = [
    { name: 'Dr. Maria Santos, MD', dept: 'Internal Medicine', consultations: 14, completed: 12, revenue: 11200 },
    { name: 'Dr. Alejandro Gomez, MD', dept: 'Pediatrics', consultations: 9, completed: 8, revenue: 7200 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Reports & Health Informatics Census
          </h1>
          <p className="text-xs text-text-muted">Outpatient census reports, physician productivity, and revenue analytics</p>
        </div>
        <Button variant="outline" size="sm" icon={<Download className="h-4 w-4" />}>
          Export CSV Census
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-text-muted uppercase">Total Registered Census</p>
            <p className="text-2xl font-bold text-text-main mt-1">{totalPatients} Patients</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-text-muted uppercase">Monthly Encounters</p>
            <p className="text-2xl font-bold text-text-main mt-1">{totalEncounters} Visits</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs font-semibold text-text-muted uppercase">Collected Outpatient Revenue</p>
            <p className="text-2xl font-bold text-primary mt-1">{formatCurrency(totalRevenue)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Physician Productivity & Clinical Performance Report</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Physician Name</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Assigned Encounters</TableHead>
                <TableHead>Completed EMR Charts</TableHead>
                <TableHead className="text-right">Generated Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorPerformance.map((doc, idx) => (
                <TableRow key={idx}>
                  <TableCell className="font-semibold text-xs text-text-main">{doc.name}</TableCell>
                  <TableCell className="text-xs text-text-muted">{doc.dept}</TableCell>
                  <TableCell className="text-xs font-mono">{doc.consultations}</TableCell>
                  <TableCell className="text-xs font-mono text-status-success">{doc.completed}</TableCell>
                  <TableCell className="text-right font-mono font-bold text-xs text-text-main">
                    {formatCurrency(doc.revenue)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};
