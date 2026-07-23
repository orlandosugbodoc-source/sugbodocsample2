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
    updateAppointmentStatus,
    showToast
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
      showToast('Please select a registered patient to issue queue ticket', 'error');
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
          <div className="px-4 py-2 rounded-full bg-[#4454c3] text-white flex items-center justify-center font-mono font-bold text-sm shadow-2xs shrink-0 tracking-wide">
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
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'queue' ? 'bg-[#4454c3] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Live OPD Queue ({queueItems.filter(q => q.status !== 'completed').length})
          </button>
          <button
            onClick={() => {
              setActiveTab('appointments');
              setActiveModule('appointments');
            }}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              activeTab === 'appointments' ? 'bg-[#4454c3] text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Scheduled Appointments ({appointments.length})
          </button>
        </div>
      </div>

      {/* Queue View */}
      {activeTab === 'queue' && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#4454c3]" /> Live OPD Outpatient Waiting Queue
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket #</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Patient Details</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Est. Wait</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queueItems.map(item => (
                  <TableRow key={item.id}>
                    <TableCell className="whitespace-nowrap">
                      <span className="px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-[#4454c3] font-mono font-bold text-xs inline-block">
                        {item.queueNumber}
                      </span>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-500 whitespace-nowrap">
                      {item.checkInTime}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-bold text-slate-900">{item.patientName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.patientMrn} • {item.patientGender}, {item.patientAge}y</div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge variant={item.category === 'Urgent' ? 'danger' : item.category === 'Senior/PWD' ? 'info' : 'neutral'} size="sm">
                        {item.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-mono text-slate-600 whitespace-nowrap">
                      ~{item.estimatedWaitMins} mins
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
                          Consult EMR
                        </Button>
                      )}
                      {item.status === 'completed' && (
                        <Badge variant="success" size="sm">Done</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Appointments View */}
      {activeTab === 'appointments' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-[#4454c3]" /> Scheduled Appointments Registry
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time Slot</TableHead>
                  <TableHead>Patient Name & MRN</TableHead>
                  <TableHead>Consultation Specialty</TableHead>
                  <TableHead>Assigned Doctor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map(apt => (
                  <TableRow key={apt.id}>
                    <TableCell className="font-mono text-xs font-bold text-slate-800 whitespace-nowrap">
                      {apt.date} • {apt.timeSlot}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{apt.patientName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{apt.patientMrn}</div>
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 whitespace-nowrap">
                      {apt.specialty}
                    </TableCell>
                    <TableCell className="text-xs text-slate-700 whitespace-nowrap">
                      {apt.doctorName}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <Badge 
                        variant={
                          apt.status === 'Completed' ? 'success' :
                          apt.status === 'In Progress' ? 'primary' :
                          apt.status === 'Cancelled' ? 'danger' : 'warning'
                        }
                        size="sm"
                      >
                        {apt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {apt.status === 'Scheduled' && (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => {
                            updateAppointmentStatus(apt.id, 'In Progress');
                            setActivePatientId(apt.patientId);
                            setActiveModule('consultation');
                          }}
                        >
                          Check-In Patient
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

      {/* Walk-in Check-in Modal */}
      <Dialog
        isOpen={isWalkInOpen}
        onClose={() => setIsWalkInOpen(false)}
        title="Issue Walk-in OPD Queue Ticket"
        description="Select registered patient to issue sequential ticket number."
        maxWidth="md"
      >
        <form onSubmit={handleIssueWalkIn} className="space-y-4 text-xs">
          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Select Registered Patient *</label>
            <select
              className="w-full h-9 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-900"
              value={selectedPatientId}
              onChange={e => setSelectedPatientId(e.target.value)}
              required
            >
              <option value="">-- Choose Patient from Registry --</option>
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.lastName}, {p.firstName} ({p.mrn}) — {p.gender}, {new Date().getFullYear() - new Date(p.dob).getFullYear()}y
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Triage Priority Category</label>
            <select
              className="w-full h-9 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-900"
              value={category}
              onChange={e => setCategory(e.target.value as any)}
            >
              <option value="Regular">Regular Queue</option>
              <option value="Senior/PWD">Senior Citizen / PWD Priority</option>
              <option value="Urgent">Urgent / High Priority</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Chief Complaint Summary</label>
            <textarea
              className="w-full h-20 p-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4454c3]"
              placeholder="e.g. High fever for 3 days, dry cough..."
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
