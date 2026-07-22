import React from 'react';
import { ShieldAlert, Users, Database, KeyRound, CheckCircle2 } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Badge } from '../ui/Badge';

export const AdminModule: React.FC = () => {
  const { staffList } = useEMR();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-primary" /> System Administration & Role Permissions
        </h1>
        <p className="text-xs text-text-muted">Staff accounts, role access matrix, master data catalogs, and security logs</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Staff Directory & Access Control</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Staff Name</TableHead>
                <TableHead>Assigned Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Professional License No</TableHead>
                <TableHead>System Access Level</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffList.map(staff => (
                <TableRow key={staff.id}>
                  <TableCell className="font-semibold text-xs text-text-main">{staff.name}</TableCell>
                  <TableCell><Badge variant="outline" size="sm">{staff.role.toUpperCase()}</Badge></TableCell>
                  <TableCell className="text-xs text-text-muted">{staff.department}</TableCell>
                  <TableCell className="text-xs font-mono">{staff.licenseNo || 'N/A'}</TableCell>
                  <TableCell>
                    <span className="text-xs text-status-success font-medium flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Full Access
                    </span>
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
