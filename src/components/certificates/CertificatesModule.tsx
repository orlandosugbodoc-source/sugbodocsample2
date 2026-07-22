import React from 'react';
import { FileBadge, Printer } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';

export const CertificatesModule: React.FC = () => {
  const { activeEncounter, activePatient } = useEMR();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <FileBadge className="h-5 w-5 text-primary" /> Medical Certificates & Legal Documents
          </h1>
          <p className="text-xs text-text-muted">Official fit-to-work, sick leave, and physician referral documents</p>
        </div>
        <Button variant="primary" size="sm" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
          Print Document
        </Button>
      </div>

      <Card className="max-w-2xl mx-auto border border-border shadow-md">
        <CardContent className="p-8 space-y-6 bg-white text-xs">
          {/* Clinic Letterhead Header */}
          <div className="text-center border-b border-border pb-4">
            <h2 className="text-base font-bold text-text-main tracking-tight">SUGBODOC CLINICAL CENTER</h2>
            <p className="text-[11px] text-text-muted">Department of Outpatient Medicine & Specialist Services</p>
            <p className="text-[10px] text-text-muted">142 Mango Ave, Cebu City • Contact: (032) 412-9000</p>
          </div>

          <div className="text-center py-2">
            <h1 className="text-sm font-bold uppercase tracking-widest text-text-main border-b-2 border-primary inline-block pb-1">
              MEDICAL CERTIFICATE
            </h1>
          </div>

          <div className="space-y-4 leading-relaxed text-text-main">
            <p className="text-right font-mono">Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

            <p>
              To Whom It May Concern:
            </p>

            <p className="indent-6">
              This is to certify that <strong>{activePatient ? `${activePatient.firstName} ${activePatient.lastName}` : 'Juan Dela Cruz'}</strong>, 
              {' '}47 years of age, Male, residing at 142 Mango Ave, Cebu City, has been examined and treated at SugboDoc Outpatient Clinic on this date.
            </p>

            <div className="p-3 bg-surface border border-border rounded">
              <span className="font-bold text-text-main block mb-1">Clinical Impression / Diagnosis:</span>
              <p className="font-mono text-primary">
                {activeEncounter?.diagnoses.map(d => `${d.code} - ${d.description}`).join('; ') || 'E11.9 - Type 2 diabetes mellitus; I10 - Essential hypertension'}
              </p>
            </div>

            <p className="indent-6">
              <strong>Recommendation:</strong> Patient is advised to observe <strong>3 days</strong> of strict medical rest and continuation of prescribed oral medications.
            </p>
          </div>

          <div className="pt-12 flex justify-end">
            <div className="text-center w-64 border-t border-border pt-2">
              <p className="font-bold text-text-main">Dr. Maria Santos, MD</p>
              <p className="text-[10px] text-text-muted">Attending Physician, Internal Medicine</p>
              <p className="text-[10px] font-mono text-text-muted">PRC License No.: 0149204</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
