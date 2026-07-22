import React from 'react';
import { FileText, Printer, Stethoscope } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { Button } from '../ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';

export const SOAPModule: React.FC = () => {
  const { activeEncounter, activePatient, setActiveModule } = useEMR();

  if (!activeEncounter || !activePatient) {
    return (
      <div className="p-12 text-center bg-white border border-border rounded-lg space-y-4">
        <FileText className="h-10 w-10 text-text-muted mx-auto" />
        <h2 className="text-base font-bold text-text-main">No Active Patient Chart Selected</h2>
        <p className="text-xs text-text-muted">Select an active consultation from the OPD Queue to view or edit SOAP notes.</p>
        <Button variant="primary" onClick={() => setActiveModule('queue')}>Open OPD Queue</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-text-main flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" /> Structured SOAP Note Viewer
          </h1>
          <p className="text-xs text-text-muted">Single-page comprehensive clinical documentation for encounter {activeEncounter.id}</p>
        </div>
        <Button variant="outline" size="sm" icon={<Printer className="h-4 w-4" />} onClick={() => window.print()}>
          Print SOAP Record
        </Button>
      </div>

      <Card>
        <CardHeader className="bg-surface border-b border-border">
          <div className="flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-text-main text-sm">{activePatient.firstName} {activePatient.lastName}</span>
              <span className="font-mono text-primary ml-2">({activePatient.mrn})</span>
            </div>
            <div className="text-text-muted font-mono">
              Date: {activeEncounter.date} • Attending: {activeEncounter.doctorName}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* 4 Quadrants */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border border-border rounded-lg bg-surface-muted/30 space-y-2">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Subjective</h3>
              <p className="text-xs text-text-main leading-relaxed whitespace-pre-line">{activeEncounter.soap?.subjective || 'No subjective note recorded.'}</p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-surface-muted/30 space-y-2">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Objective</h3>
              <p className="text-xs text-text-main leading-relaxed whitespace-pre-line">{activeEncounter.soap?.objective || 'No objective exam recorded.'}</p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-surface-muted/30 space-y-2">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Assessment</h3>
              <p className="text-xs text-text-main leading-relaxed whitespace-pre-line">{activeEncounter.soap?.assessment || 'No assessment recorded.'}</p>
            </div>

            <div className="p-4 border border-border rounded-lg bg-surface-muted/30 space-y-2">
              <h3 className="text-xs font-bold text-primary uppercase tracking-wider">Plan</h3>
              <p className="text-xs text-text-main leading-relaxed whitespace-pre-line">{activeEncounter.soap?.plan || 'No plan recorded.'}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="primary" icon={<Stethoscope className="h-4 w-4" />} onClick={() => setActiveModule('consultation')}>
              Return to Consultation Workbench
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
