import React, { useState } from 'react';
import { FileBadge, Printer } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';

export const CertificatesModule: React.FC = () => {
  const { activeEncounter, activePatient, currentUser } = useEMR();
  const [logoError, setLogoError] = useState(false);

  const currentDateFormatted = new Date().toLocaleDateString('en-PH', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const patientName = activePatient 
    ? `${activePatient.firstName} ${activePatient.lastName}` 
    : 'Juan Dela Cruz';
  
  const patientAge = activePatient 
    ? new Date().getFullYear() - new Date(activePatient.dob).getFullYear()
    : 35;

  const patientGender = activePatient?.gender || 'Male';
  const patientAddress = activePatient?.address || 'Cebu City, Philippines';

  return (
    <div className="space-y-6">
      {/* Top Bar Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBadge className="h-5 w-5 text-[#4454c3]" /> Official Medical Certificate
          </h1>
          <p className="text-xs text-slate-500">Standard Philippine Outpatient Medical Certificate & Fit-to-Work Clearance</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<Printer className="h-4 w-4" />} 
          onClick={() => window.print()}
        >
          Print Official Document
        </Button>
      </div>

      {/* Authentic Printable Document Container */}
      <div className="max-w-2xl mx-auto bg-white border border-slate-300 rounded-sm p-8 sm:p-12 shadow-sm text-slate-900 font-serif leading-relaxed select-none">
        
        {/* Clinic Official Header with No-Wrap Doc No */}
        <div className="flex items-start justify-between border-b-2 border-slate-900 pb-4 mb-6 gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {!logoError ? (
              <img 
                src="https://sugbodoc.com/public/assets/images/brand/logo.png" 
                alt="SugboDoc Brand" 
                onError={() => setLogoError(true)}
                className="h-11 sm:h-12 w-auto object-contain shrink-0" 
              />
            ) : (
              <div className="h-10 w-10 bg-[#4454c3] text-white flex items-center justify-center font-sans font-bold text-xl rounded shrink-0">
                S
              </div>
            )}
            <div className="min-w-0">
              <h2 className="font-bold text-sm uppercase tracking-wider text-slate-900 font-sans truncate">SUGBODOC HEALTHCARE CLINIC</h2>
              <p className="text-[11px] text-slate-600 font-sans">142 General Maxilom Ave (Mango Ave), Cebu City, 6000 Philippines</p>
              <p className="text-[10px] text-slate-500 font-mono font-sans">Tel: (032) 412-9000 • Email: contact@sugbodoc.com</p>
            </div>
          </div>

          <div className="text-right font-sans text-[11px] shrink-0 whitespace-nowrap">
            <div className="font-mono text-slate-600">Doc No: <strong className="text-slate-900 font-bold">MC-2026-0842</strong></div>
            <div className="text-slate-600 mt-1">Date: <strong className="text-slate-900 font-bold">{currentDateFormatted}</strong></div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h1 className="text-base font-bold uppercase tracking-widest text-slate-900 border-b-2 border-slate-900 inline-block px-4 pb-0.5 font-sans">
            MEDICAL CERTIFICATE
          </h1>
        </div>

        {/* Document Body */}
        <div className="space-y-5 text-xs text-slate-900 text-justify">
          <p className="font-bold text-xs uppercase tracking-wider font-sans">
            TO WHOM IT MAY CONCERN:
          </p>

          <p className="indent-8 leading-6">
            This is to certify that <strong>{patientName}</strong>, 
            {' '}{patientAge} years of age, {patientGender}, residing at <strong>{patientAddress}</strong>, 
            was physically examined and evaluated at this clinic on <strong>{currentDateFormatted}</strong>.
          </p>

          <div className="my-4 p-4 border border-slate-300 bg-slate-50/50 rounded-sm font-sans space-y-2">
            <div className="text-[11px] font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1">
              CLINICAL DIAGNOSIS / IMPRESSION:
            </div>
            <p className="font-mono text-xs text-[#4454c3] font-bold">
              {activeEncounter?.diagnoses.map(d => `${d.code} - ${d.description}`).join('; ') || 'E11.9 - Type 2 Diabetes Mellitus without complications; I10 - Essential Hypertension'}
            </p>
          </div>

          <p className="indent-8 leading-6">
            <strong>REMARKS & RECOMMENDATIONS:</strong> Patient has undergone outpatient treatment and is advised to observe <strong>three (3) days of medical rest</strong> from duties, with regular intake of prescribed oral medications. Patient is cleared to resume regular work on <strong>{new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
          </p>
        </div>

        {/* Physician Official Signature Block */}
        <div className="mt-14 pt-6 flex justify-end font-sans">
          <div className="text-center w-64 space-y-1">
            <div className="h-10 flex items-end justify-center">
              <span className="font-serif italic text-slate-400 text-sm">Dr. {currentUser.name.split(' ')[0]}</span>
            </div>
            <div className="border-t border-slate-900 pt-1">
              <p className="font-bold text-xs text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-600 capitalize">{currentUser.title}</p>
              <p className="text-[10px] font-mono text-slate-500">PRC Lic. No.: {currentUser.licenseNo || '0149204'}</p>
              <p className="text-[10px] font-mono text-slate-500">PTR No.: PTR-2026-9918234</p>
            </div>
          </div>
        </div>

        {/* Official Fine Print Disclaimer */}
        <div className="mt-10 border-t border-slate-200 pt-3 text-center font-sans text-[9px] text-slate-400 uppercase tracking-wider">
          NOTE: NOT VALID FOR MEDICO-LEGAL PURPOSES WITHOUT OFFICIAL CLINIC STAMP AND PHYSICIAN SIGNATURE.
        </div>
      </div>
    </div>
  );
};
