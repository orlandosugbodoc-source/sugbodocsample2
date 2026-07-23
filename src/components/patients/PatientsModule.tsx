import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Eye, 
  Stethoscope, 
  ShieldAlert, 
  Filter
} from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Patient, BloodType } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Dialog } from '../ui/Dialog';
import { Avatar } from '../ui/Avatar';
import { calculateAge } from '../../utils/cn';

export const PatientsModule: React.FC = () => {
  const { patients, addPatient, setActivePatientId, setActiveModule, showToast } = useEMR();
  const [search, setSearch] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  
  // Modals
  const [isNewPatientOpen, setIsNewPatientOpen] = useState(false);
  const [selectedPatientForView, setSelectedPatientForView] = useState<Patient | null>(null);

  // New Patient Form
  const [newPatientForm, setNewPatientForm] = useState({
    firstName: '',
    lastName: '',
    dob: '1990-01-15',
    gender: 'Male' as 'Male' | 'Female',
    phone: '+63 917 555 1234',
    email: '',
    address: 'Cebu City, Philippines',
    bloodType: 'O+' as BloodType,
    allergies: [{ id: 'all-1', allergen: 'Penicillin', severity: 'severe' as const, reaction: 'Rash / Anaphylaxis' }],
    chronicConditions: ['Hypertension'],
  });

  const filteredPatients = patients.filter(p => {
    const matchesSearch = `${p.firstName} ${p.lastName} ${p.mrn} ${p.phone}`
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesGender = genderFilter === 'all' || p.gender.toLowerCase() === genderFilter.toLowerCase();
    return matchesSearch && matchesGender;
  });

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientForm.firstName || !newPatientForm.lastName) {
      showToast('Please fill in required patient information (First Name & Last Name)', 'error');
      return;
    }
    const created = addPatient({
      ...newPatientForm,
      status: 'active',
      emergencyContact: { name: 'Emergency Contact', relationship: 'Family', phone: newPatientForm.phone }
    });
    setIsNewPatientOpen(false);
    setActivePatientId(created.id);
    setActiveModule('consultation');
  };

  return (
    <div className="space-y-6">
      {/* Top Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="h-5 w-5 text-[#4454c3]" /> Patient Master Index (MPI)
          </h1>
          <p className="text-xs text-slate-500">Centralized patient health records, demographics, allergies, and master chart index</p>
        </div>

        <Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
          onClick={() => setIsNewPatientOpen(true)}
        >
          Register New Patient
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card>
        <CardContent className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-96">
            <Input
              placeholder="Search by Name, MRN (e.g. MRN-2026-0101), or Phone..."
              icon={<Search className="h-4 w-4 text-slate-400" />}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <Filter className="h-4 w-4 text-slate-400 shrink-0" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender:</span>
            <div className="flex gap-1 bg-slate-100 p-1 rounded-full border border-slate-200">
              {['all', 'male', 'female'].map(g => (
                <button
                  key={g}
                  onClick={() => setGenderFilter(g)}
                  className={`px-3 py-1 text-xs font-semibold rounded-full capitalize transition-colors cursor-pointer ${
                    genderFilter === g ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patients Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>MRN & Patient Name</TableHead>
                <TableHead>Age / Gender</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Severe Allergies</TableHead>
                <TableHead>Contact Number</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map(patient => (
                <TableRow key={patient.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar src={patient.avatar} name={`${patient.firstName} ${patient.lastName}`} size="md" />
                      <div>
                        <div className="font-bold text-slate-900">
                          {patient.lastName}, {patient.firstName}
                        </div>
                        <div className="text-[11px] font-mono font-semibold text-[#4454c3]">
                          {patient.mrn}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs font-medium text-slate-700">
                    {calculateAge(patient.dob)} yrs • {patient.gender}
                  </TableCell>
                  <TableCell>
                    <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {patient.bloodType || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell>
                    {patient.allergies.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {patient.allergies.map((a, i) => (
                          <Badge key={i} variant="danger" size="sm">
                            <ShieldAlert className="h-3 w-3 shrink-0" /> {a.allergen}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">No Known Allergies (NKDA)</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-mono text-slate-600">
                    {patient.phone}
                  </TableCell>
                  <TableCell>
                    <Badge variant="success" size="sm">Active</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Stethoscope className="h-3.5 w-3.5" />}
                        onClick={() => {
                          setActivePatientId(patient.id);
                          setActiveModule('consultation');
                        }}
                      >
                        Consult EMR
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye className="h-3.5 w-3.5" />}
                        onClick={() => setSelectedPatientForView(patient)}
                      >
                        Master Chart
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Register New Patient Modal */}
      <Dialog
        isOpen={isNewPatientOpen}
        onClose={() => setIsNewPatientOpen(false)}
        title="Register New Patient Record"
        description="Enter patient demographics to generate a unique Medical Record Number (MRN)."
        maxWidth="lg"
      >
        <form onSubmit={handleCreatePatient} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name *"
              required
              value={newPatientForm.firstName}
              onChange={e => setNewPatientForm({ ...newPatientForm, firstName: e.target.value })}
            />
            <Input
              label="Last Name *"
              required
              value={newPatientForm.lastName}
              onChange={e => setNewPatientForm({ ...newPatientForm, lastName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              label="Date of Birth *"
              type="date"
              required
              value={newPatientForm.dob}
              onChange={e => setNewPatientForm({ ...newPatientForm, dob: e.target.value })}
            />
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Gender *</label>
              <select
                className="w-full h-9 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-900"
                value={newPatientForm.gender}
                onChange={e => setNewPatientForm({ ...newPatientForm, gender: e.target.value as any })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Blood Type</label>
              <select
                className="w-full h-9 rounded-full border border-slate-200 bg-white px-3 text-xs text-slate-900"
                value={newPatientForm.bloodType}
                onChange={e => setNewPatientForm({ ...newPatientForm, bloodType: e.target.value as BloodType })}
              >
                <option value="O+">O Positive (O+)</option>
                <option value="A+">A Positive (A+)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="O-">O Negative (O-)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Mobile Phone *"
              required
              value={newPatientForm.phone}
              onChange={e => setNewPatientForm({ ...newPatientForm, phone: e.target.value })}
            />
            <Input
              label="Email Address"
              type="email"
              value={newPatientForm.email}
              onChange={e => setNewPatientForm({ ...newPatientForm, email: e.target.value })}
            />
          </div>

          <Input
            label="Residential Address"
            value={newPatientForm.address}
            onChange={e => setNewPatientForm({ ...newPatientForm, address: e.target.value })}
          />

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsNewPatientOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Master Patient Record</Button>
          </div>
        </form>
      </Dialog>

      {/* View Master Patient Chart Modal */}
      {selectedPatientForView && (
        <Dialog
          isOpen={!!selectedPatientForView}
          onClose={() => setSelectedPatientForView(null)}
          title={`Master Patient Chart: ${selectedPatientForView.firstName} ${selectedPatientForView.lastName}`}
          description={`MRN: ${selectedPatientForView.mrn} • Registered Health Record`}
          maxWidth="lg"
        >
          <div className="space-y-6 text-xs">
            {/* Header Identity Bar */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-4">
              <Avatar 
                src={selectedPatientForView.avatar} 
                name={`${selectedPatientForView.firstName} ${selectedPatientForView.lastName}`} 
                size="xl" 
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{selectedPatientForView.firstName} {selectedPatientForView.lastName}</h3>
                  <Badge variant="neutral" size="sm">{selectedPatientForView.gender}, {calculateAge(selectedPatientForView.dob)} yrs</Badge>
                </div>
                <div className="text-slate-500 font-mono text-xs">
                  Phone: {selectedPatientForView.phone} | Address: {selectedPatientForView.address}
                </div>
              </div>
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Clinical Alerts & Risks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Severe Allergies</span>
                    <div className="flex gap-1 flex-wrap">
                      {selectedPatientForView.allergies.map((a, i) => (
                        <Badge key={i} variant="danger" size="sm"><ShieldAlert className="h-3 w-3" /> {a.allergen}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Chronic Conditions</span>
                    <div className="flex gap-1 flex-wrap">
                      {selectedPatientForView.chronicConditions.map((c, i) => (
                        <Badge key={i} variant="outline" size="sm">{c}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">Insurance & HMO</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <span className="text-slate-500 block">HMO Provider:</span>
                    <strong className="text-slate-900">{selectedPatientForView.insurance?.provider || 'None'}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Policy Number:</span>
                    <span className="font-mono text-slate-800">{selectedPatientForView.insurance?.policyNumber || 'N/A'}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button
                variant="primary"
                icon={<Stethoscope className="h-3.5 w-3.5" />}
                onClick={() => {
                  setActivePatientId(selectedPatientForView.id);
                  setSelectedPatientForView(null);
                  setActiveModule('consultation');
                }}
              >
                Open Consultation Workbench
              </Button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
};
