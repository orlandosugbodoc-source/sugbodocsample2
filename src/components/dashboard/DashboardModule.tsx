import React from 'react';
import { 
  Users, 
  Clock, 
  Calendar, 
  FlaskConical, 
  TrendingUp, 
  UserPlus, 
  PhoneCall, 
  Activity, 
  CheckCircle2, 
  ChevronRight
} from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { formatCurrency } from '../../utils/cn';
import { PesoReceiptIcon } from '../ui/PesoIcon';
import { Avatar } from '../ui/Avatar';

export const DashboardModule: React.FC = () => {
  const { 
    currentUser, 
    queueItems, 
    appointments, 
    labOrders, 
    invoices, 
    setActiveModule, 
    setActivePatientId,
    callNextPatientInQueue,
    advanceQueueItemStatus,
    staffList
  } = useEMR();

  const waitingQueue = queueItems.filter(q => q.status === 'waiting' || q.status === 'called' || q.status === 'in_consultation');
  const pendingLabs = labOrders.filter(l => l.status === 'pending');
  const unpaidInvoices = invoices.filter(i => i.status === 'unpaid');
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.paidAmount, 0);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs text-slate-500">
            Welcome back, <strong className="text-slate-800">{currentUser.name}</strong> • Active Persona: <span className="font-semibold text-[#4454c3] uppercase">{currentUser.role}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="sm"
            icon={<PhoneCall className="h-3.5 w-3.5" />}
            onClick={() => callNextPatientInQueue()}
          >
            Call Next Patient
          </Button>
          <Button
            variant="outline"
            size="sm"
            icon={<UserPlus className="h-3.5 w-3.5" />}
            onClick={() => setActiveModule('patients')}
          >
            New Patient
          </Button>
        </div>
      </div>

      {/* Clean 4-Card Summary Metrics with Philippine Peso Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Patients in Queue</p>
              <div className="text-2xl font-bold text-slate-900 mt-1">{waitingQueue.length}</div>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium whitespace-nowrap">
                <Clock className="h-3 w-3 shrink-0" /> ~15 mins avg wait
              </p>
            </div>
            <Users className="h-5 w-5 text-slate-400 shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Appointments</p>
              <div className="text-2xl font-bold text-slate-900 mt-1">{appointments.length}</div>
              <p className="text-[11px] text-slate-500 mt-1 font-medium whitespace-nowrap">
                {appointments.filter(a => a.status === 'Completed').length} completed today
              </p>
            </div>
            <Calendar className="h-5 w-5 text-slate-400 shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Pending Lab Tests</p>
              <div className="text-2xl font-bold text-slate-900 mt-1">{pendingLabs.length}</div>
              <p className="text-[11px] text-amber-600 flex items-center gap-1 mt-1 font-medium whitespace-nowrap">
                {pendingLabs.length} requiring test processing
              </p>
            </div>
            <FlaskConical className="h-5 w-5 text-slate-400 shrink-0" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Today's Revenue</p>
              <div className="text-2xl font-bold text-slate-900 mt-1">{formatCurrency(totalRevenue)}</div>
              <p className="text-[11px] text-emerald-600 flex items-center gap-1 mt-1 font-medium whitespace-nowrap">
                <TrendingUp className="h-3 w-3 shrink-0" /> {unpaidInvoices.length} pending collections
              </p>
            </div>
            <PesoReceiptIcon className="h-5 w-5 text-slate-400 shrink-0" />
          </CardContent>
        </Card>
      </div>

      {/* Main Grid: Left 2/3 OPD Queue Table, Right 1/3 Quick Actions & Staff Availability */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2/3: Live OPD Waiting Queue */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <CardTitle>Active OPD Waiting Queue</CardTitle>
                <CardDescription>Live status of patients currently waiting in clinic</CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-[#4454c3] shrink-0"
                onClick={() => setActiveModule('queue')}
              >
                Full Queue <ChevronRight className="h-3.5 w-3.5 ml-1 shrink-0" />
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ticket</TableHead>
                    <TableHead>Patient Name & MRN</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {queueItems.map(item => (
                    <TableRow key={item.id}>
                      <TableCell className="font-mono font-bold text-xs text-[#4454c3] whitespace-nowrap">
                        {item.queueNumber}
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <div className="font-semibold text-slate-900">{item.patientName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{item.patientMrn} • {item.patientGender}, {item.patientAge}y</div>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge variant={item.category === 'Urgent' ? 'danger' : item.category === 'Senior/PWD' ? 'info' : 'neutral'} size="sm">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap">
                        <Badge 
                          variant={
                            item.status === 'in_consultation' ? 'primary' :
                            item.status === 'called' ? 'warning' :
                            item.status === 'completed' ? 'success' : 'neutral'
                          } 
                          size="sm"
                        >
                          {item.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right whitespace-nowrap">
                        {item.status === 'waiting' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => advanceQueueItemStatus(item.id, 'called')}
                          >
                            Call Ticket
                          </Button>
                        )}
                        {item.status === 'called' && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => {
                              advanceQueueItemStatus(item.id, 'in_consultation');
                              setActivePatientId(item.patientId);
                              setActiveModule('consultation');
                            }}
                          >
                            Start Consultation
                          </Button>
                        )}
                        {item.status === 'in_consultation' && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => {
                              setActivePatientId(item.patientId);
                              setActiveModule('consultation');
                            }}
                          >
                            Resume EMR
                          </Button>
                        )}
                        {item.status === 'completed' && (
                          <span className="text-xs text-emerald-600 font-medium inline-flex items-center justify-end gap-1 whitespace-nowrap">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Done
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Right 1/3: Quick Actions & Staff Availability */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Quick Workflows</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 p-3">
              <Button
                variant="outline"
                className="w-full justify-start text-xs text-slate-800"
                icon={<Clock className="h-3.5 w-3.5 text-slate-500" />}
                onClick={() => setActiveModule('consultation')}
              >
                Active Consultation Hub
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-xs text-slate-800"
                icon={<UserPlus className="h-3.5 w-3.5 text-slate-500" />}
                onClick={() => setActiveModule('patients')}
              >
                Register New Patient Record
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-xs text-slate-800"
                icon={<FlaskConical className="h-3.5 w-3.5 text-slate-500" />}
                onClick={() => setActiveModule('laboratory')}
              >
                Process Laboratory Orders
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start text-xs text-slate-800"
                icon={<PesoReceiptIcon className="h-3.5 w-3.5 text-slate-500" />}
                onClick={() => setActiveModule('billing')}
              >
                Collect Patient Payments
              </Button>
            </CardContent>
          </Card>

          {/* Active Staff Roster */}
          <Card>
            <CardHeader>
              <CardTitle>On-Duty Roster</CardTitle>
            </CardHeader>
            <CardContent className="p-0 divide-y divide-slate-200/70">
              {staffList.map(staff => (
                <div key={staff.id} className="p-3 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Avatar src={staff.avatar} name={staff.name} size="sm" />
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">{staff.name}</div>
                      <div className="text-[10px] text-slate-500 truncate">{staff.department}</div>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">Online</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
