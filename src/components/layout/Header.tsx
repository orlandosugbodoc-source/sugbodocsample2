import React from 'react';
import { Search, ChevronRight, Bell, Shield, Stethoscope, UserCheck, HeartPulse, TestTube, CreditCard, Menu, ChevronDown } from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import type { UserRole } from '../../types';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileMenu }) => {
  const { activeModule, currentUser, setCurrentUserRole, setIsCommandPaletteOpen } = useEMR();

  const roles: { role: UserRole; label: string; icon: React.ReactNode }[] = [
    { role: 'doctor', label: 'Doctor', icon: <Stethoscope className="h-3.5 w-3.5 shrink-0" /> },
    { role: 'receptionist', label: 'Receptionist', icon: <UserCheck className="h-3.5 w-3.5 shrink-0" /> },
    { role: 'nurse', label: 'Nurse', icon: <HeartPulse className="h-3.5 w-3.5 shrink-0" /> },
    { role: 'lab_staff', label: 'Lab Tech', icon: <TestTube className="h-3.5 w-3.5 shrink-0" /> },
    { role: 'cashier', label: 'Cashier', icon: <CreditCard className="h-3.5 w-3.5 shrink-0" /> },
    { role: 'admin', label: 'Admin', icon: <Shield className="h-3.5 w-3.5 shrink-0" /> },
  ];

  const moduleTitles: Record<string, string> = {
    dashboard: 'Dashboard Overview',
    patients: 'Patient Registry',
    appointments: 'Appointment Calendar',
    queue: 'OPD Live Waiting Queue',
    consultation: 'Doctor Consultation Hub',
    soap: 'SOAP Clinical Notes',
    prescriptions: 'Medication Orders & Prescriptions',
    laboratory: 'Laboratory Requests & Diagnostic Results',
    certificates: 'Medical Certificates & Referral Letters',
    billing: 'Billing, Receipts & Cashier',
    reports: 'Clinical Census & Financial Reports',
    admin: 'System Administration',
    settings: 'Clinic Settings & Master Data',
  };

  return (
    <header className="h-14 px-4 md:px-6 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10 select-none gap-4">
      {/* Mobile Hamburger & Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs font-medium text-slate-500 shrink-0 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-full text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
          title="Open Menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <span className="text-slate-900 font-semibold whitespace-nowrap hidden sm:inline">SugboDoc</span>
        <ChevronRight className="h-3.5 w-3.5 text-slate-400 shrink-0 hidden sm:inline" />
        <span className="text-blue-600 font-semibold whitespace-nowrap truncate max-w-[140px] sm:max-w-none">
          {moduleTitles[activeModule] || 'EMR System'}
        </span>
      </div>

      {/* Center Command Palette Search Bar (Pill Shape) */}
      <div className="flex-1 max-w-sm min-w-0 mx-2">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-9 px-4 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs text-slate-500 flex items-center justify-between transition-colors whitespace-nowrap overflow-hidden cursor-pointer"
        >
          <div className="flex items-center gap-2 min-w-0 truncate">
            <Search className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            <span className="truncate text-xs">Search patient or command...</span>
          </div>
          <kbd className="shrink-0 ml-2 px-2 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded-full text-slate-500 whitespace-nowrap hidden sm:inline">
            Ctrl + K
          </kbd>
        </button>
      </div>

      {/* Right Controls: Single Compact Role Pill Dropdown & Notifications */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Compact Single Role Dropdown Pill */}
        <div className="relative flex items-center">
          <select
            className="h-8 pl-3 pr-7 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-full cursor-pointer appearance-none transition-colors focus:outline-none"
            value={currentUser.role}
            onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
          >
            {roles.map(r => (
              <option key={r.role} value={r.role}>
                Role: {r.label}
              </option>
            ))}
          </select>
          <ChevronDown className="h-3.5 w-3.5 text-slate-500 absolute right-2.5 pointer-events-none shrink-0" />
        </div>

        {/* Notifications Pill Button */}
        <Button variant="outline" size="icon" className="h-8 w-8 relative shrink-0 rounded-full">
          <Bell className="h-3.5 w-3.5 text-slate-500" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600" />
        </Button>
      </div>
    </header>
  );
};
