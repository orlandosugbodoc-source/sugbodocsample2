import React, { useState } from 'react';
import { FileBadge, Printer } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';

export const CertificatesModule: React.FC = () => {
  const { activeEncounter, activePatient, currentUser } = useEMR();
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileBadge className="h-5 w-5 text-[#4454c3]" /> Medical Certificates & Legal Documents
          </h1>
          <p className="text-xs text-slate-500">Official fit-to-work, medical leave, and physician referral documents</p>
        </div>
        <Button variant="primary" size="sm" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
          Print Medical Certificate
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto border border-slate-200/90 shadow-sm rounded-xl">
        <CardContent className="p-8 sm:p-10 space-y-6 bg-white text-xs select-none">
          
          {/* Clinic Letterhead Header with Official SugboDoc Logo */}
          <div className="flex flex-col items-center justify-center border-b border-slate-200 pb-5 text-center space-y-2">
            {!logoError ? (
              <img 
                src="https://sugbodoc.com/public/assets/images/brand/logo.png" 
                alt="SugboDoc Official Logo" 
                onError={() => setLogoError(true)}
                className="h-10 w-auto object-contain" 
              />
            ) : (
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-[#4454c3] flex items-center justify-center text-white font-bold text-sm font-sans shadow-2xs">
                  S
                </div>
                <span className="font-bold text-lg tracking-tight text-slate-900">SUGBODOC CLINICAL CENTER</span>
              </div>
            )}
            <div>
              <p className="text-[11px] font-semibold text-slate-700">Department of Outpatient Medicine & Specialist Healthcare</p>
              <p className="text-[10px] text-slate-500 font-mono">142 Mango Avenue, Cebu City, Philippines • Contact: (032) 412-9000</p>
            </div>
          </div>

          <div className="text-center py-2">
            <h1 className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b-2 border-[#4454c3] inline-block pb-1">
              MEDICAL CERTIFICATE
            </h1>
          </div>

          <div className="space-y-4 leading-relaxed text-slate-800">
            <p className="text-right font-mono text-xs text-slate-600">
              Date Issued: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <p className="font-semibold text-slate-900">
              To Whom It May Concern:
            </p>

            <p className="indent-6 text-slate-700">
              This is to certify that <strong>{activePatient ? `${activePatient.firstName} ${activePatient.lastName}` : 'Juan Dela Cruz'}</strong>, 
              {' '}{activePatient ? '35' : '47'} years of age, {activePatient?.gender || 'Male'}, residing at {activePatient?.address || 'Cebu City, Philippines'}, 
              has been examined and clinically evaluated at SugboDoc Healthcare Center on this date.
            </p>

            <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
              <span className="font-bold text-slate-900 block text-[11px] uppercase tracking-wider">Clinical Impression / Diagnosis:</span>
              <p className="font-mono text-xs text-[#4454c3] font-semibold">
                {activeEncounter?.diagnoses.map(d => `${d.code} - ${d.description}`).join('; ') || 'E11.9 - Type 2 diabetes mellitus; I10 - Essential hypertension'}
              </p>
            </div>

            <p className="indent-6 text-slate-700">
              <strong>Physician Recommendation:</strong> Patient is advised to observe <strong>3 days</strong> of strict medical rest, adequate hydration, and continuation of prescribed oral medications.
            </p>
          </div>

          {/* Attending Physician Signature Line */}
          <div className="pt-12 flex justify-end">
            <div className="text-center w-64 border-t border-slate-300 pt-2 space-y-0.5">
              <p className="font-bold text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser.title}</p>
              <p className="text-[10px] font-mono text-slate-500">PRC License No.: {currentUser.licenseNo || 'PRC-0149204'}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
