import React, { useEffect } from 'react';
import { Search, User, Calendar, FileText, Stethoscope, Clock, Receipt, CreditCard, ChevronRight } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    searchQuery, 
    setSearchQuery, 
    patients, 
    setActivePatientId, 
    setActiveModule 
  } = useEMR();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(true);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredPatients = patients.filter(p => 
    `${p.firstName} ${p.lastName} ${p.mrn} ${p.phone}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const modules = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <FileText className="h-4 w-4 shrink-0" /> },
    { id: 'patients', label: 'Patient Registry', icon: <User className="h-4 w-4 shrink-0" /> },
    { id: 'appointments', label: 'Appointment Schedule', icon: <Calendar className="h-4 w-4 shrink-0" /> },
    { id: 'queue', label: 'OPD Waiting Queue', icon: <Clock className="h-4 w-4 shrink-0" /> },
    { id: 'consultation', label: 'Doctor Consultation Hub', icon: <Stethoscope className="h-4 w-4 shrink-0" /> },
    { id: 'billing', label: 'Billing & Payments', icon: <Receipt className="h-4 w-4 shrink-0" /> },
    { id: 'reports', label: 'Reports & Census', icon: <CreditCard className="h-4 w-4 shrink-0" /> },
  ].filter(m => m.label.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-slate-900/50 backdrop-blur-2xs p-4 select-none animate-in fade-in duration-150">
      <div 
        className="fixed inset-0"
        onClick={() => setIsCommandPaletteOpen(false)}
      />
      <div className="relative w-full max-w-xl bg-white rounded-lg border border-slate-200 shadow-xl z-10 overflow-hidden flex flex-col max-h-[70vh]">
        {/* Modal Search Header (Clean, Zero Blue Box Outline) */}
        <div className="flex items-center px-4 border-b border-slate-200 bg-slate-50/50">
          <Search className="h-4 w-4 text-slate-400 shrink-0 mr-3" />
          <input
            type="text"
            placeholder="Type a command or search patient MRN, name..."
            className="w-full h-12 text-sm bg-transparent border-0 outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 shadow-none placeholder:text-slate-400 text-slate-900"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
          />
          <kbd className="shrink-0 px-2 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-200 rounded-full whitespace-nowrap">ESC</kbd>
        </div>

        <div className="p-2 overflow-y-auto space-y-4 divide-y divide-slate-200/60">
          {/* Modules Navigation */}
          <div>
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Navigation Commands</div>
            <div className="space-y-0.5">
              {modules.map(mod => (
                <button
                  key={mod.id}
                  onClick={() => {
                    setActiveModule(mod.id);
                    setIsCommandPaletteOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-900 rounded-md hover:bg-slate-100 transition-colors text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-slate-500">{mod.icon}</span>
                    <span className="font-medium">{mod.label}</span>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Patients Search Results */}
          <div className="pt-2">
            <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Patient Records</div>
            {filteredPatients.length === 0 ? (
              <div className="px-3 py-3 text-xs text-slate-500 italic">No matching patients found.</div>
            ) : (
              <div className="space-y-0.5">
                {filteredPatients.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => {
                      setActivePatientId(patient.id);
                      setActiveModule('consultation');
                      setIsCommandPaletteOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs text-slate-900 rounded-md hover:bg-slate-100 transition-colors text-left cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{patient.lastName}, {patient.firstName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{patient.mrn} • {patient.phone}</div>
                    </div>
                    <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
