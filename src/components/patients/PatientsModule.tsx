import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  FileText, 
  Phone, 
  Mail, 
  MapPin, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  ChevronRight
} from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Patient } from '../../types';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../ui/Table';
import { Dialog } from '../ui/Dialog';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { calculateAge } from '../../utils/cn';

export const PatientsModule: React.FC = () => {
  const { patients, addPatient, setActivePatientId, setActiveModule } = useEMR();
  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // New Patient Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    middleName: '',
    dob: '1990-01-01',
    gender: 'Male' as any,
    bloodType: 'O+' as any,
    phone: '',
    email: '',
    address: '',
    avatar: '',
    emergencyName: '',
    emergencyRel: '',
    emergencyPhone: '',
    insuranceProvider: 'PhilHealth / Private HMO',
    insurancePolicy: '',
    allergyText: '',
  });

  const filteredPatients = patients.filter(p => {
    const matchesSearch = 
      p.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.mrn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery);
    
    const matchesGender = genderFilter === 'all' || p.gender.toLowerCase() === genderFilter.toLowerCase();
    return matchesSearch && matchesGender;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.phone) {
      alert('Please fill in required patient information');
      return;
    }

    const newPatient = addPatient({
      firstName: formData.firstName,
      lastName: formData.lastName,
      middleName: formData.middleName,
      dob: formData.dob,
      gender: formData.gender,
      bloodType: formData.bloodType,
      phone: formData.phone,
      email: formData.email || `${formData.firstName.toLowerCase()}@example.ph`,
      address: formData.address || 'Cebu City, Philippines',
      avatar: formData.avatar,
      emergencyContact: {
        name: formData.emergencyName || 'Emergency Contact',
        relationship: formData.emergencyRel || 'Relative',
        phone: formData.emergencyPhone || formData.phone,
      },
      insurance: {
        provider: formData.insuranceProvider,
        policyNumber: formData.insurancePolicy || 'POL-908123',
        coverageType: 'Standard Outpatient',
      },
      allergies: formData.allergyText ? [
        { id: `alg-${Date.now()}`, allergen: formData.allergyText, severity: 'moderate', reaction: 'Clinical note allergy' }
      ] : [],
      chronicConditions: [],
      status: 'active',
    });

    setIsRegisterOpen(false);
    setSelectedPatient(newPatient);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight">Patient Registry & EMR Index</h1>
          <p className="text-xs text-slate-500">Search master index of registered patients with complete demographic profiles</p>
        </div>
        <Button
          variant="primary"
          icon={<UserPlus className="h-4 w-4" />}
          onClick={() => setIsRegisterOpen(true)}
        >
          Register New Patient
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
        <div className="w-full md:w-80">
          <Input
            placeholder="Search by MRN, Name, Phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search className="h-4 w-4" />}
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gender:</span>
          {['all', 'male', 'female'].map(g => (
            <button
              key={g}
              onClick={() => setGenderFilter(g)}
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize cursor-pointer transition-colors ${
                genderFilter === g
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Main Patients Table with Profile Photos & Initials Fallback */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Patient Photo & Name</TableHead>
                <TableHead>MRN</TableHead>
                <TableHead>Age / Gender</TableHead>
                <TableHead>Contact & Address</TableHead>
                <TableHead>Severe Allergies</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPatients.map(p => (
                <TableRow key={p.id}>
                  {/* Photo & Name with Automatic Initials Fallback */}
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <Avatar 
                        src={p.avatar} 
                        name={`${p.firstName} ${p.lastName}`}
                        size="lg"
                      />
                      <div>
                        <div className="font-semibold text-slate-900">{p.lastName}, {p.firstName} {p.middleName ? `${p.middleName[0]}.` : ''}</div>
                        <div className="text-[11px] text-slate-500">DOB: {p.dob}</div>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-mono font-bold text-xs text-blue-600 whitespace-nowrap">
                    {p.mrn}
                  </TableCell>

                  <TableCell className="whitespace-nowrap text-xs text-slate-800">
                    {calculateAge(p.dob)} yrs • {p.gender}
                    {p.bloodType && <Badge variant="outline" size="sm" className="ml-2">{p.bloodType}</Badge>}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <div className="text-xs text-slate-900 font-mono">{p.phone}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{p.address}</div>
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    {p.allergies.length > 0 ? (
                      <div className="flex gap-1 flex-wrap">
                        {p.allergies.map(a => (
                          <Badge key={a.id} variant={a.severity === 'severe' ? 'danger' : 'warning'} size="sm">
                            {a.allergen}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400">No Known Allergies</span>
                    )}
                  </TableCell>

                  <TableCell className="whitespace-nowrap">
                    <Badge variant="success" size="sm">ACTIVE</Badge>
                  </TableCell>

                  <TableCell className="text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedPatient(p)}
                      >
                        Chart View
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => {
                          setActivePatientId(p.id);
                          setActiveModule('consultation');
                        }}
                      >
                        Open EMR
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Patient Detailed Master Chart Modal */}
      {selectedPatient && (
        <Dialog
          isOpen={!!selectedPatient}
          onClose={() => setSelectedPatient(null)}
          title={`Master Patient Chart: ${selectedPatient.lastName}, ${selectedPatient.firstName}`}
          description={`MRN: ${selectedPatient.mrn} • Master Demographic Record`}
          maxWidth="2xl"
        >
          <div className="space-y-4">
            {/* Header Profile Photo Card */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <Avatar 
                src={selectedPatient.avatar} 
                name={`${selectedPatient.firstName} ${selectedPatient.lastName}`}
                size="xl"
              />
              <div className="min-w-0 flex-1">
                <h3 className="text-base font-bold text-slate-900">
                  {selectedPatient.lastName}, {selectedPatient.firstName} {selectedPatient.middleName}
                </h3>
                <div className="text-xs text-slate-500 font-mono mt-0.5">
                  MRN: <strong className="text-blue-600">{selectedPatient.mrn}</strong> • DOB: {selectedPatient.dob} ({calculateAge(selectedPatient.dob)} yrs old)
                </div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" size="sm">Blood: {selectedPatient.bloodType || 'N/A'}</Badge>
                  <Badge variant="outline" size="sm">Gender: {selectedPatient.gender}</Badge>
                  <Badge variant="success" size="sm">Status: Active</Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2 p-3 rounded-lg border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Contact & Address</h4>
                <div className="flex items-center gap-2 text-slate-700"><Phone className="h-3.5 w-3.5 text-slate-400" /> {selectedPatient.phone}</div>
                <div className="flex items-center gap-2 text-slate-700"><Mail className="h-3.5 w-3.5 text-slate-400" /> {selectedPatient.email}</div>
                <div className="flex items-center gap-2 text-slate-700"><MapPin className="h-3.5 w-3.5 text-slate-400" /> {selectedPatient.address}</div>
              </div>

              <div className="space-y-2 p-3 rounded-lg border border-slate-200 bg-white">
                <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Emergency Contact & Insurance</h4>
                <div className="text-slate-700"><strong>Contact:</strong> {selectedPatient.emergencyContact.name} ({selectedPatient.emergencyContact.relationship})</div>
                <div className="text-slate-700"><strong>Phone:</strong> {selectedPatient.emergencyContact.phone}</div>
                <div className="text-slate-700 pt-1 border-t border-slate-200"><strong>HMO Provider:</strong> {selectedPatient.insurance?.provider}</div>
                <div className="text-slate-700 font-mono text-[11px]">Policy #: {selectedPatient.insurance?.policyNumber}</div>
              </div>
            </div>

            {/* Allergies Alert Box */}
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs">
              <div className="font-bold text-red-900 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" /> Severe Medical Allergies
              </div>
              {selectedPatient.allergies.length > 0 ? (
                <div className="mt-2 space-y-1">
                  {selectedPatient.allergies.map(a => (
                    <div key={a.id} className="text-red-800 font-medium">
                      • <strong className="uppercase">{a.allergen}</strong> ({a.severity}) — {a.reaction}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-red-700 mt-1">No documented drug allergies recorded in chart.</div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
              <Button variant="outline" onClick={() => setSelectedPatient(null)}>Close Chart</Button>
              <Button
                variant="primary"
                onClick={() => {
                  setActivePatientId(selectedPatient.id);
                  setSelectedPatient(null);
                  setActiveModule('consultation');
                }}
              >
                Launch Consultation Workbench
              </Button>
            </div>
          </div>
        </Dialog>
      )}

      {/* Registration Modal */}
      <Dialog
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register New Patient Record"
        description="Create master patient index entry with demographic details"
        maxWidth="xl"
      >
        <form onSubmit={handleRegisterSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="First Name *"
              required
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            />
            <Input
              label="Last Name *"
              required
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            />
            <Input
              label="Middle Name"
              value={formData.middleName}
              onChange={e => setFormData({ ...formData, middleName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              label="Date of Birth *"
              type="date"
              required
              value={formData.dob}
              onChange={e => setFormData({ ...formData, dob: e.target.value })}
            />
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Gender *</label>
              <select
                className="w-full h-9 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-900"
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1.5">Blood Type</label>
              <select
                className="w-full h-9 rounded-full border border-slate-200 bg-white px-4 text-xs text-slate-900"
                value={formData.bloodType}
                onChange={e => setFormData({ ...formData, bloodType: e.target.value as any })}
              >
                <option value="O+">O+</option>
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="Phone Number *"
              required
              placeholder="+63 9xx xxx xxxx"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Profile Photo URL (Optional)"
              placeholder="Leave blank for automatic initials fallback"
              value={formData.avatar}
              onChange={e => setFormData({ ...formData, avatar: e.target.value })}
            />
          </div>

          <Input
            label="Residential Address"
            placeholder="Street address, City, Province"
            value={formData.address}
            onChange={e => setFormData({ ...formData, address: e.target.value })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-slate-200 pt-3">
            <Input
              label="Emergency Contact Name"
              value={formData.emergencyName}
              onChange={e => setFormData({ ...formData, emergencyName: e.target.value })}
            />
            <Input
              label="Relationship"
              value={formData.emergencyRel}
              onChange={e => setFormData({ ...formData, emergencyRel: e.target.value })}
            />
            <Input
              label="Emergency Contact Phone"
              value={formData.emergencyPhone}
              onChange={e => setFormData({ ...formData, emergencyPhone: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsRegisterOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Create Patient Record</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
