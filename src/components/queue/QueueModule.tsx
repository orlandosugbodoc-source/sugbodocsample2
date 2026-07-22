import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  PhoneCall, 
  UserPlus, 
  Calendar
} from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Dialog } from '../ui/Dialog';

export const QueueModule: React.FC = () => {
  const { 
    activeModule,
    queueItems, 
    patients, 
    callNextPatientInQueue, 
    advanceQueueItemStatus, 
    addWalkInToQueue,
    setActivePatientId,
    setActiveModule,
    appointments,
    updateAppointmentStatus
  } = useEMR();

  const [activeTab, setActiveTab] = useState<'queue' | 'appointments'>(
    activeModule === 'appointments' ? 'appointments' : 'queue'
  );

  useEffect(() => {
    if (activeModule === 'appointments') setActiveTab('appointments');
    if (activeModule === 'queue') setActiveTab('queue');
  }, [activeModule]);

  const [isWalkInOpen, setIsWalkInOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [category, setCategory] = useState<'Regular' | 'Senior/PWD' | 'Urgent'>('Regular');

  const currentlyCalled = queueItems.find(q => q.status === 'called' || q.status === 'in_consultation');

  const handleIssueWalkIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) {
      alert('Please select a registered patient');
      return;
    }
    addWalkInToQueue(selectedPatientId, chiefComplaint, category);
    setIsWalkInOpen(false);
    setChiefComplaint('');
  };

  return (
    <div className="space-y-6">
      {/* Active Calling Announcement Header Banner */}
      <div className="p-4 rounded-lg bg-white border border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-full bg-blue-600 text-white flex items-center justify-center font-mono font-bold text-sm shadow-2xs shrink-0 tracking-wide">
            {currentlyCalled ? currentlyCalled.queueNumber : '---'}
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Now Serving Ticket</div>
            <div className="text-base font-bold text-slate-900">
              {currentlyCalled ? `${currentlyCalled.patientName} (${currentlyCalled.patientMrn})` : 'No Ticket Currently Called'}
            </div>
            <div className="text-xs text-slate-500">
              Assigned: {currentlyCalled ? currentlyCalled.assignedDoctorName : 'All Doctors Ready'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="primary"
            size="md"
            icon={<PhoneCall className="h-4 w-4" />}
            onClick={() => callNextPatientInQueue()}
          >
            Call Next Waiting Patient
          </Button>
          <Button
            variant="outline"
            size="md"
            icon={<UserPlus className="h-4 w-4" />}
            onClick={() => setIsWalkInOpen(true)}
          >
            Check-in Walk-in Ticket
          </Button>
        </div>
      </div>

      {/* Segmented Pill Tab Bar */}
      <div className="border-b border-slate-200 pb-3 select-none">
        <div className="inline-flex items-center p-1 bg-slate-100 rounded-full border border-slate-200 gap-1">
          <button
            onClick={() => {
              setActiveTab('queue');
              setActiveModule('queue');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'queue'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Clock className="h-3.5 w-3.5 shrink-0" /> OPD Waiting Queue ({queueItems.length})
          </button>
          <button
            onClick={() => {
              setActiveTab('appointments');
              setActiveModule('appointments');
            }}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'appointments'
                ? 'bg-white text-blue-600 shadow-2xs border border-slate-200'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="h-3.5 w-3.5 shrink-0" /> Today's Scheduled Appointments ({appointments.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Live OPD Waiting Queue */}
      {activeTab === 'queue' && (
        <Card>
          <CardHeader>
            <CardTitle>Live OPD Queue Status & Caller</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Queue #</TableHead>
                  <TableHead>Patient Name & MRN</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Chief Complaint</TableHead>
                  <TableHead>Check-in Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 font-mono font-bold text-xs text-blue-600">
                        {item.queueNumber}
                      </span>
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
                    <TableCell className="text-xs text-slate-500 max-w-xs truncate">
                      {item.chiefComplaint}
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 font-mono whitespace-nowrap">
                      {item.checkInTime} (~{item.estimatedWaitMins}m wait)
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
                          Call Patient
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Tab 2: Appointments Schedule */}
      {activeTab === 'appointments' && (
        <Card>
          <CardHeader>
            <CardTitle>Scheduled Appointments</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Patient Name</TableHead>
                  <TableHead>Assigned Physician</TableHead>
                  <TableHead>Visit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map(apt => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-900 whitespace-nowrap">{apt.timeSlot}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{apt.patientMrn}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-500 whitespace-nowrap">{apt.doctorName}</TableCell>
                    <TableCell className="whitespace-nowrap"><Badge variant="outline" size="sm">{apt.type}</Badge></TableCell>
                    <TableCell className="whitespace-nowrap"><Badge variant={apt.status === 'In Consultation' ? 'info' : apt.status === 'Completed' ? 'success' : 'neutral'} size="sm">{apt.status}</Badge></TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {apt.status === 'Scheduled' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            updateAppointmentStatus(apt.id, 'Checked-in');
                            addWalkInToQueue(apt.patientId, apt.reason, 'Regular');
                          }}
                        >
                          Check-in to Queue
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Issue Walk-in Queue Ticket Dialog */}
      <Dialog
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        title="Check-in Walk-in Patient to OPD Queue"
        description="Issue a sequential queue ticket and assign patient to active clinic queue"
        maxWidth="md"
      >
        <form onSubmit={handleIssueWalkIn} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Select Patient *</label>
            <select
              className="w-full h-9 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-900"
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              required
            >
              <option value="">-- Choose Registered Patient --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>{p.lastName}, {p.firstName} ({p.mrn})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Priority Category *</label>
            <select
              className="w-full h-9 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-900"
              value={category}
              onChange={e => setCategory(e.target.value as any)}
            >
              <option value="Regular">Regular Queue</option>
              <option value="Senior/PWD">Senior Citizen / PWD Priority</option>
              <option value="Urgent">Urgent / Triage Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Chief Complaint / Reason for Visit</label>
            <textarea
              className="w-full h-20 rounded-lg border border-slate-200 bg-white p-3 text-xs text-slate-900"
              placeholder="e.g. Fever, cough, follow-up blood test result..."
              value={chiefComplaint}
              onChange={e => setChiefComplaint(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsWalkInOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Generate Queue Ticket</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
