import React, { useState } from 'react';
import { 
  Stethoscope, 
  Activity, 
  FileText, 
  Pill, 
  FlaskConical, 
  ShieldAlert, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  Printer, 
  HeartPulse, 
  Search, 
  FileBadge,
  User,
  AlertTriangle
} from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { ICD10Diagnosis, MedicationOrder } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Dialog } from '../ui/Dialog';
import { Avatar } from '../ui/Avatar';
import { calculateAge } from '../../utils/cn';

export const ConsultationModule: React.FC = () => {
  const { 
    activePatient, 
    activeEncounter, 
    updateActiveEncounterSOAP, 
    updateActiveEncounterVitals, 
    addDiagnosisToEncounter, 
    removeDiagnosisFromEncounter, 
    addPrescriptionToEncounter, 
    removePrescriptionFromEncounter, 
    addLabOrderToEncounter, 
    generateCertificateForEncounter, 
    completeActiveEncounter,
    setActiveModule 
  } = useEMR();

  // Local SOAP Note state initialized from encounter or defaults
  const [soap, setSoap] = useState({
    subjective: activeEncounter?.soap?.subjective || '',
    objective: activeEncounter?.soap?.objective || '',
    assessment: activeEncounter?.soap?.assessment || '',
    plan: activeEncounter?.soap?.plan || '',
  });

  // Local Vitals state
  const [vitalsForm, setVitalsForm] = useState({
    bpSystolic: activeEncounter?.vitals?.bpSystolic || 120,
    bpDiastolic: activeEncounter?.vitals?.bpDiastolic || 80,
    heartRate: activeEncounter?.vitals?.heartRate || 72,
    respRate: activeEncounter?.vitals?.respRate || 16,
    tempCelsius: activeEncounter?.vitals?.tempCelsius || 36.6,
    spo2: activeEncounter?.vitals?.spo2 || 98,
    heightCm: activeEncounter?.vitals?.heightCm || 170,
    weightKg: activeEncounter?.vitals?.weightKg || 70,
  });

  // ICD-10 Search state
  const [icdSearch, setIcdSearch] = useState('');
  
  // Rx Form State
  const [rxForm, setRxForm] = useState({
    medicineName: '',
    dosage: '500 mg',
    frequency: 'Twice daily (BID)',
    duration: '30 days',
    quantity: 60,
    instructions: 'Take 1 tablet after meals',
    route: 'Oral',
  });

  // Lab Order input
  const [labInput, setLabInput] = useState('');

  // Medical Certificate Modal state
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [certRec, setCertRec] = useState('Strict home rest and continuation of prescribed medications.');
  const [certDays, setCertDays] = useState(3);
  const [activeCert, setActiveCert] = useState<any>(null);

  const mockICD10Database: ICD10Diagnosis[] = [
    { code: 'E11.9', description: 'Type 2 diabetes mellitus without complications', category: 'Endocrine', type: 'primary', status: 'active' },
    { code: 'I10', description: 'Essential (primary) hypertension', category: 'Cardiovascular', type: 'primary', status: 'active' },
    { code: 'J45.909', description: 'Unspecified asthma, uncomplicated', category: 'Respiratory', type: 'primary', status: 'active' },
    { code: 'J06.9', description: 'Acute upper respiratory infection, unspecified', category: 'Respiratory', type: 'primary', status: 'active' },
    { code: 'M25.561', description: 'Pain in right knee', category: 'Musculoskeletal', type: 'secondary', status: 'active' },
    { code: 'E78.5', description: 'Hyperlipidemia, unspecified', category: 'Endocrine', type: 'secondary', status: 'active' },
    { code: 'K21.9', description: 'Gastro-esophageal reflux disease without esophagitis', category: 'Gastrointestinal', type: 'secondary', status: 'active' },
  ];

  const filteredICD10 = mockICD10Database.filter(d => 
    `${d.code} ${d.description}`.toLowerCase().includes(icdSearch.toLowerCase())
  );

  if (!activePatient || !activeEncounter) {
    return (
      <div className="p-12 text-center bg-white border border-slate-200 rounded-lg space-y-4">
        <Stethoscope className="h-10 w-10 text-slate-400 mx-auto" />
        <h2 className="text-base font-bold text-slate-900">No Active Patient Consultation Selected</h2>
        <p className="text-xs text-slate-500 max-w-md mx-auto">Please select a patient from the OPD Queue or Patient Registry to start an EMR consultation.</p>
        <Button variant="primary" onClick={() => setActiveModule('queue')}>Go to OPD Queue</Button>
      </div>
    );
  }

  const bmi = (vitalsForm.weightKg / Math.pow(vitalsForm.heightCm / 100, 2)).toFixed(1);

  const handleSaveVitals = () => {
    updateActiveEncounterVitals({
      id: `vit-${Date.now()}`,
      patientId: activePatient.id,
      encounterId: activeEncounter.id,
      ...vitalsForm,
      bmi: parseFloat(bmi),
      recordedAt: new Date().toLocaleString(),
      recordedBy: 'Attending Physician',
    });
  };

  const handleSaveSOAP = () => {
    updateActiveEncounterSOAP(soap);
  };

  const handleAddRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rxForm.medicineName.trim()) return;
    addPrescriptionToEncounter({
      id: `rx-${Date.now()}`,
      ...rxForm,
    });
    setRxForm({
      medicineName: '',
      dosage: '500 mg',
      frequency: 'Twice daily (BID)',
      duration: '30 days',
      quantity: 60,
      instructions: 'Take 1 tablet after meals',
      route: 'Oral',
    });
  };

  const handleGenerateCert = (e: React.FormEvent) => {
    e.preventDefault();
    const cert = generateCertificateForEncounter(certRec, certDays);
    setActiveCert(cert);
    setIsCertOpen(false);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Structured Patient Context Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-2xs">
        {/* Left Side: Avatar + Name & Demographics + Chief Complaint */}
        <div className="flex items-center gap-3.5 min-w-0">
          <Avatar 
            src={activePatient.avatar} 
            name={`${activePatient.firstName} ${activePatient.lastName}`} 
            size="xl" 
          />
          <div className="min-w-0 space-y-1">
            {/* Row 1: Name, MRN, Gender/Age, Blood Type */}
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-bold text-base text-slate-900 tracking-tight">
                {activePatient.firstName} {activePatient.lastName}
              </h2>
              <span className="font-mono text-xs text-[#4454c3] font-bold bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {activePatient.mrn}
              </span>
              <Badge variant="outline" size="sm">
                {activePatient.gender}, {calculateAge(activePatient.dob)} yrs
              </Badge>
              {activePatient.bloodType && (
                <Badge variant="outline" size="sm" className="font-mono">
                  Blood: {activePatient.bloodType}
                </Badge>
              )}
            </div>

            {/* Row 2: Chief Complaint */}
            <div className="text-xs text-slate-600 max-w-3xl">
              <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mr-1">Chief Complaint:</span>
              <span className="font-medium text-slate-900">{activeEncounter.chiefComplaint}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Allergies Warning Pill & Action CTAs */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          {activePatient.allergies.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-rose-300 rounded-md text-xs text-rose-700 font-medium shrink-0">
              <ShieldAlert className="h-3.5 w-3.5 text-rose-600 shrink-0" />
              <span className="whitespace-nowrap">
                <strong className="text-rose-700 font-bold uppercase tracking-wider text-[10px] mr-1">Allergies:</strong>
                <span className="font-semibold text-rose-900">{activePatient.allergies.map(a => a.allergen).join(', ')}</span>
              </span>
            </div>
          )}
          <Button
            variant="primary"
            size="md"
            icon={<CheckCircle2 className="h-4 w-4" />}
            onClick={() => completeActiveEncounter()}
          >
            Complete Encounter & Bill
          </Button>
        </div>
      </div>

      {/* 3-Column Split Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* LEFT COLUMN (3/12): Vitals & Medical History */}
        <div className="lg:col-span-3 space-y-4">
          {/* Vitals Entry Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                <HeartPulse className="h-4 w-4 text-red-500 shrink-0" /> Patient Vitals
              </CardTitle>
              <Button variant="ghost" size="sm" className="h-7 text-[11px] text-blue-600" onClick={handleSaveVitals}>
                Update
              </Button>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">BP Systolic</label>
                  <Input 
                    type="number" 
                    className="h-8 text-xs font-mono" 
                    value={vitalsForm.bpSystolic} 
                    onChange={e => setVitalsForm({ ...vitalsForm, bpSystolic: parseInt(e.target.value) || 0 })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">BP Diastolic</label>
                  <Input 
                    type="number" 
                    className="h-8 text-xs font-mono" 
                    value={vitalsForm.bpDiastolic} 
                    onChange={e => setVitalsForm({ ...vitalsForm, bpDiastolic: parseInt(e.target.value) || 0 })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Heart Rate (bpm)</label>
                  <Input 
                    type="number" 
                    className="h-8 text-xs font-mono" 
                    value={vitalsForm.heartRate} 
                    onChange={e => setVitalsForm({ ...vitalsForm, heartRate: parseInt(e.target.value) || 0 })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">Temp (°C)</label>
                  <Input 
                    type="number" 
                    step="0.1" 
                    className="h-8 text-xs font-mono" 
                    value={vitalsForm.tempCelsius} 
                    onChange={e => setVitalsForm({ ...vitalsForm, tempCelsius: parseFloat(e.target.value) || 0 })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">SpO2 (%)</label>
                  <Input 
                    type="number" 
                    className="h-8 text-xs font-mono" 
                    value={vitalsForm.spo2} 
                    onChange={e => setVitalsForm({ ...vitalsForm, spo2: parseInt(e.target.value) || 0 })} 
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-500 uppercase">BMI (kg/m²)</label>
                  <div className="h-8 px-3 rounded-md border border-slate-200 bg-white flex items-center font-mono font-bold text-xs text-[#4454c3]">
                    {bmi}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Chronic Conditions & History */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Medical Background
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Chronic Diagnoses</span>
                <div className="flex gap-1 flex-wrap">
                  {activePatient.chronicConditions.map((c, i) => (
                    <Badge key={i} variant="outline" size="sm">{c}</Badge>
                  ))}
                </div>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">HMO & Insurance</span>
                <div className="text-slate-800 font-semibold">{activePatient.insurance?.provider || 'None'}</div>
                <div className="text-[11px] text-slate-500 font-mono">Policy: {activePatient.insurance?.policyNumber}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* MIDDLE COLUMN (5/12): SOAP Notes Documentation */}
        <div className="lg:col-span-5 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                <FileText className="h-4 w-4 text-blue-600 shrink-0" /> SOAP Clinical Documentation
              </CardTitle>
              <Button variant="primary" size="sm" className="h-7 text-xs" onClick={handleSaveSOAP}>
                Save Progress
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subjective (S) — Patient Complaints & Symptoms
                </label>
                <textarea
                  className="w-full h-24 p-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  placeholder="Record patient history, symptoms, onset..."
                  value={soap.subjective}
                  onChange={e => setSoap({ ...soap, subjective: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Objective (O) — Physical Exam & Observations
                </label>
                <textarea
                  className="w-full h-24 p-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  placeholder="Record physical exam findings, general appearance..."
                  value={soap.objective}
                  onChange={e => setSoap({ ...soap, objective: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Assessment (A) — Impression & Differential
                </label>
                <textarea
                  className="w-full h-20 p-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  placeholder="Clinical assessment and impression..."
                  value={soap.assessment}
                  onChange={e => setSoap({ ...soap, assessment: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Plan (P) — Treatment & Directives
                </label>
                <textarea
                  className="w-full h-20 p-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 bg-white"
                  placeholder="Management plan, follow-up date..."
                  value={soap.plan}
                  onChange={e => setSoap({ ...soap, plan: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN (4/12): ICD-10 Search, Prescriber & Lab Orders */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* ICD-10 Diagnosis Search & Coding */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                ICD-10 Diagnostic Coding
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="Search ICD-10 Code or Disease..."
                value={icdSearch}
                onChange={e => setIcdSearch(e.target.value)}
                icon={<Search className="h-3.5 w-3.5" />}
              />

              {icdSearch && (
                <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-md divide-y divide-slate-100 bg-white text-xs">
                  {filteredICD10.map(d => (
                    <div
                      key={d.code}
                      onClick={() => {
                        addDiagnosisToEncounter(d);
                        setIcdSearch('');
                      }}
                      className="p-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between"
                    >
                      <div>
                        <strong className="font-mono text-blue-600">{d.code}</strong> — {d.description}
                      </div>
                      <Plus className="h-3.5 w-3.5 text-slate-400" />
                    </div>
                  ))}
                </div>
              )}

              {/* Active Diagnoses List */}
              <div className="space-y-1.5 pt-1">
                {activeEncounter.diagnoses.map(d => (
                  <div key={d.code} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <span className="font-mono font-bold text-blue-600 mr-1.5">{d.code}</span>
                      <span className="text-slate-800">{d.description}</span>
                    </div>
                    <button
                      onClick={() => removeDiagnosisFromEncounter(d.code)}
                      className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Rx Prescriber Workbench */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                <Pill className="h-4 w-4 text-emerald-600 shrink-0" /> E-Prescriber Workbench
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <form onSubmit={handleAddRx} className="space-y-2">
                <Input
                  placeholder="Medicine Name & Strength..."
                  value={rxForm.medicineName}
                  onChange={e => setRxForm({ ...rxForm, medicineName: e.target.value })}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Dosage (500mg)"
                    value={rxForm.dosage}
                    onChange={e => setRxForm({ ...rxForm, dosage: e.target.value })}
                  />
                  <Input
                    placeholder="Frequency (BID)"
                    value={rxForm.frequency}
                    onChange={e => setRxForm({ ...rxForm, frequency: e.target.value })}
                  />
                </div>
                <Button type="submit" variant="outline" size="sm" className="w-full" icon={<Plus className="h-3.5 w-3.5" />}>
                  Add Medication Order
                </Button>
              </form>

              {/* Active Prescriptions List */}
              <div className="space-y-1.5 pt-1">
                {activeEncounter.prescriptions.map(rx => (
                  <div key={rx.id} className="flex items-center justify-between p-2 rounded-md bg-slate-50 border border-slate-200 text-xs">
                    <div>
                      <div className="font-semibold text-slate-900">{rx.medicineName}</div>
                      <div className="text-[11px] text-slate-500">{rx.dosage} • {rx.frequency}</div>
                    </div>
                    <button
                      onClick={() => removePrescriptionFromEncounter(rx.id)}
                      className="text-slate-400 hover:text-red-600 p-0.5 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions & Documents Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Medical Documents & Requests
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                icon={<FileBadge className="h-3.5 w-3.5 text-blue-600" />}
                onClick={() => setIsCertOpen(true)}
              >
                Generate Medical Certificate
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-start text-xs"
                icon={<FlaskConical className="h-3.5 w-3.5 text-amber-600" />}
                onClick={() => {
                  addLabOrderToEncounter('Routine Urinalysis', 'Microbiology');
                  alert('Added Lab Order for Routine Urinalysis');
                }}
              >
                Order Laboratory Diagnostic Test
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Medical Certificate Modal */}
      <Dialog
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        title="Generate Official Medical Certificate"
        description={`Issued for ${activePatient.firstName} ${activePatient.lastName} (${activePatient.mrn})`}
        maxWidth="md"
      >
        <form onSubmit={handleGenerateCert} className="space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Doctor Recommendation & Directive</label>
            <textarea
              className="w-full h-24 p-2.5 text-xs text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={certRec}
              onChange={e => setCertRec(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Recommended Sick Leave Days</label>
            <Input
              type="number"
              value={certDays}
              onChange={e => setCertDays(parseInt(e.target.value) || 1)}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
            <Button type="button" variant="outline" onClick={() => setIsCertOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Generate Certificate</Button>
          </div>
        </form>
      </Dialog>
    </div>
  );
};
