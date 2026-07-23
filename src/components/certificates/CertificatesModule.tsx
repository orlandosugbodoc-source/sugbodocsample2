import React, { useState } from 'react';
import { FileBadge, Printer, Edit3, Check } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const CertificatesModule: React.FC = () => {
  const { activeEncounter, activePatient, currentUser } = useEMR();
  const [logoError, setLogoError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Editable Certificate Fields (Initialized from Active Patient & Encounter)
  const [patientName, setPatientName] = useState(
    activePatient ? `${activePatient.firstName} ${activePatient.lastName}` : 'Juan Dela Cruz'
  );
  const [patientAge, setPatientAge] = useState(
    activePatient ? (new Date().getFullYear() - new Date(activePatient.dob).getFullYear()).toString() : '35'
  );
  const [patientGender, setPatientGender] = useState<string>(activePatient?.gender || 'Male');
  const [patientAddress, setPatientAddress] = useState(activePatient?.address || 'Cebu City, Philippines');

  const defaultDiagnosis = activeEncounter?.diagnoses.map(d => `${d.code} - ${d.description}`).join('; ') 
    || 'E11.9 - Type 2 Diabetes Mellitus without complications; I10 - Essential Hypertension';
  
  const [diagnosis, setDiagnosis] = useState(defaultDiagnosis);
  const [restDays, setRestDays] = useState(3);
  const [recommendation, setRecommendation] = useState(
    'Patient is advised to observe medical rest from work/school duties with continuation of prescribed oral medications.'
  );

  const [doctorName, setDoctorName] = useState(currentUser.name);
  const [licenseNo, setLicenseNo] = useState(currentUser.licenseNo || '0149204');
  const [ptrNo, setPtrNo] = useState('PTR-2026-9918234');

  const currentDateFormatted = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const clearanceDateFormatted = new Date(Date.now() + restDays * 86400000).toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBadge className="h-5 w-5 text-[#4454c3]" /> Official Medical Certificate
          </h1>
          <p className="text-xs text-slate-500">Standard Outpatient Medical Certificate & Fit-to-Work Clearance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isEditing ? "primary" : "outline"} 
            size="sm" 
            icon={isEditing ? <Check className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />} 
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Finish Editing" : "Edit Details"}
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            icon={<Printer className="h-4 w-4" />} 
            onClick={() => window.print()}
          >
            Print Certificate
          </Button>
        </div>
      </div>

      {/* Main Grid: Form Editor (when editing) + Certificate Preview */}
      <div className={`grid grid-cols-1 ${isEditing ? 'lg:grid-cols-12' : ''} gap-6`}>
        
        {/* Interactive Editor Form Sidebar */}
        {isEditing && (
          <div className="lg:col-span-4 space-y-4 animate-in fade-in slide-in-from-left-2 duration-150">
            <Card>
              <CardHeader>
                <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Edit Certificate Content
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-xs">
                <Input
                  label="Patient Full Name"
                  value={patientName}
                  onChange={e => setPatientName(e.target.value)}
                />

                <div className="grid grid-cols-2 gap-2">
                  <Input
                    label="Age"
                    value={patientAge}
                    onChange={e => setPatientAge(e.target.value)}
                  />
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Gender</label>
                    <select
                      className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900"
                      value={patientGender}
                      onChange={e => setPatientGender(e.target.value)}
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>

                <Input
                  label="Residential Address"
                  value={patientAddress}
                  onChange={e => setPatientAddress(e.target.value)}
                />

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Diagnosis</label>
                  <textarea
                    className="w-full h-20 rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4454c3]"
                    value={diagnosis}
                    onChange={e => setDiagnosis(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Recommended Medical Rest (Days)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    className="w-full h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-900"
                    value={restDays}
                    onChange={e => setRestDays(parseInt(e.target.value) || 1)}
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-1">Physician Remarks</label>
                  <textarea
                    className="w-full h-16 rounded-lg border border-slate-200 bg-white p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#4454c3]"
                    value={recommendation}
                    onChange={e => setRecommendation(e.target.value)}
                  />
                </div>

                <div className="pt-2 border-t border-slate-200 space-y-2">
                  <Input
                    label="Attending Physician"
                    value={doctorName}
                    onChange={e => setDoctorName(e.target.value)}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      label="PRC Lic. No."
                      value={licenseNo}
                      onChange={e => setLicenseNo(e.target.value)}
                    />
                    <Input
                      label="PTR No."
                      value={ptrNo}
                      onChange={e => setPtrNo(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Printable Document Preview Card */}
        <div className={isEditing ? 'lg:col-span-8' : 'w-full'}>
          <div className="max-w-2xl mx-auto bg-white border border-slate-200/90 rounded-xl p-8 sm:p-12 shadow-sm text-slate-900 leading-relaxed select-none">
            
            {/* Clinic Official Header */}
            <div className="flex flex-col items-center justify-center border-b border-slate-200 pb-6 text-center space-y-2">
              {!logoError ? (
                <img 
                  src="https://sugbodoc.com/public/assets/images/brand/logo.png" 
                  alt="SugboDoc Brand" 
                  onError={() => setLogoError(true)}
                  className="h-10 w-auto object-contain mb-1" 
                />
              ) : (
                <div className="h-9 w-9 bg-[#4454c3] text-white flex items-center justify-center font-bold text-base rounded-lg mb-1">
                  S
                </div>
              )}
              <div>
                <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900">SUGBODOC HEALTHCARE CLINIC</h2>
                <p className="text-[11px] text-slate-500">142 General Maxilom Ave (Mango Ave), Cebu City, Philippines</p>
                <p className="text-[10px] text-slate-400 font-mono">Tel: +63 (32) 412-9000 • Email: contact@sugbodoc.com</p>
              </div>
            </div>

            {/* Document Title & Metadata */}
            <div className="flex items-center justify-between pt-6 pb-4 border-b border-slate-100 text-xs">
              <div>
                <span className="font-bold text-slate-900 text-sm uppercase tracking-widest">MEDICAL CERTIFICATE</span>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-500 space-y-0.5">
                <div>Ref No: <strong className="text-slate-800">MC-2026-0842</strong></div>
                <div>Date: <strong className="text-slate-800">{currentDateFormatted}</strong></div>
              </div>
            </div>

            {/* Document Body */}
            <div className="py-6 space-y-5 text-xs text-slate-800 leading-6">
              <p className="font-semibold text-slate-900">
                TO WHOM IT MAY CONCERN:
              </p>

              <p>
                This is to certify that <strong>{patientName}</strong>, 
                {' '}{patientAge} years of age, {patientGender}, residing at <strong>{patientAddress}</strong>, 
                was clinically examined and evaluated at SugboDoc Healthcare Center on <strong>{currentDateFormatted}</strong>.
              </p>

              {/* Diagnosis Block */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                <span className="font-bold text-[11px] text-slate-900 uppercase tracking-wider block">Clinical Impression / Diagnosis:</span>
                <p className="font-mono text-xs text-slate-900 font-semibold">
                  {diagnosis}
                </p>
              </div>

              <p>
                <strong>Medical Recommendations:</strong> {recommendation} Patient is advised to observe <strong>{restDays} day(s) of medical rest</strong> from duties and is cleared to resume regular activities on <strong>{clearanceDateFormatted}</strong>.
              </p>
            </div>

            {/* Physician Official Signature Block */}
            <div className="pt-10 flex justify-end text-xs">
              <div className="text-center w-64 space-y-1">
                <div className="h-10 flex items-end justify-center">
                  <span className="font-serif italic text-slate-400 text-sm">Dr. {doctorName.split(' ')[0]}</span>
                </div>
                <div className="border-t border-slate-300 pt-1.5">
                  <p className="font-bold text-slate-900">{doctorName}</p>
                  <p className="text-[10px] text-slate-500 capitalize">Attending Physician</p>
                  <p className="text-[10px] font-mono text-slate-400">PRC License No.: {licenseNo}</p>
                  <p className="text-[10px] font-mono text-slate-400">PTR No.: {ptrNo}</p>
                </div>
              </div>
            </div>

            {/* Official Fine Print Disclaimer */}
            <div className="mt-8 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-wider">
              NOT VALID FOR MEDICO-LEGAL PURPOSES WITHOUT OFFICIAL CLINIC STAMP AND SIGNATURE.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
