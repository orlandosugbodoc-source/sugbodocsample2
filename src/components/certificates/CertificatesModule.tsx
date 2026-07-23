import React, { useState } from 'react';
import { FileBadge, Printer } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';

export const CertificatesModule: React.FC = () => {
  const { activeEncounter, activePatient, currentUser } = useEMR();
  const [logoError, setLogoError] = useState(false);

  const currentDateFormatted = new Date().toLocaleDateString('en-US', { 
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
          <p className="text-xs text-slate-500">Standard Outpatient Medical Certificate & Fit-to-Work Clearance</p>
        </div>
        <Button 
          variant="primary" 
          size="sm" 
          icon={<Printer className="h-4 w-4" />} 
          onClick={() => window.print()}
        >
          Print Medical Certificate
        </Button>
      </div>

      {/* Clean International Standard Printable Document Container */}
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
              {activeEncounter?.diagnoses.map(d => `${d.code} - ${d.description}`).join('; ') || 'E11.9 - Type 2 Diabetes Mellitus without complications; I10 - Essential Hypertension'}
            </p>
          </div>

          <p>
            <strong>Medical Recommendations:</strong> Patient is advised to observe <strong>three (3) days of medical rest</strong> from work/school duties from <strong>{currentDateFormatted}</strong> to <strong>{new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>. Patient is cleared to resume regular activities on <strong>{new Date(Date.now() + 3 * 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>.
          </p>
        </div>

        {/* Physician Official Signature Block */}
        <div className="pt-10 flex justify-end text-xs">
          <div className="text-center w-64 space-y-1">
            <div className="h-10 flex items-end justify-center">
              <span className="font-serif italic text-slate-400 text-sm">Dr. {currentUser.name.split(' ')[0]}</span>
            </div>
            <div className="border-t border-slate-300 pt-1.5">
              <p className="font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser.title}</p>
              <p className="text-[10px] font-mono text-slate-400">PRC License No.: {currentUser.licenseNo || '0149204'}</p>
              <p className="text-[10px] font-mono text-slate-400">PTR No.: PTR-2026-9918234</p>
            </div>
          </div>
        </div>

        {/* Official Fine Print Disclaimer */}
        <div className="mt-8 pt-3 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase tracking-wider">
          NOT VALID FOR MEDICO-LEGAL PURPOSES WITHOUT OFFICIAL CLINIC STAMP AND SIGNATURE.
        </div>
      </div>
    </div>
  );
};
