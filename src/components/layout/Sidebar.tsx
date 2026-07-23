import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  CalendarDays, 
  Clock, 
  Stethoscope, 
  FileText, 
  Pill, 
  FlaskConical, 
  FileBadge, 
  BarChart3, 
  ShieldAlert, 
  Settings,
  ChevronLeft,
  ChevronRight,
  Activity,
  X
} from 'lucide-react';
import { useEMR } from '../../context/EMRContext';
import { cn } from '../../utils/cn';
import { Avatar } from '../ui/Avatar';
import { PesoReceiptIcon } from '../ui/PesoIcon';

interface SidebarProps {
  isCollapsed: boolean;
  toggleCollapse: () => void;
  isMobileOpen: boolean;
  closeMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  isCollapsed, 
  toggleCollapse, 
  isMobileOpen, 
  closeMobile 
}) => {
  const { activeModule, setActiveModule, currentUser } = useEMR();
  const [logoError, setLogoError] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patient Registry', icon: Users },
    { id: 'appointments', label: 'Appointments Calendar', icon: CalendarDays },
    { id: 'queue', label: 'OPD Waiting Queue', icon: Clock },
    { id: 'consultation', label: 'Consultation Hub', icon: Stethoscope },
    { id: 'soap', label: 'SOAP Clinical Notes', icon: FileText },
    { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
    { id: 'laboratory', label: 'Laboratory Orders', icon: FlaskConical },
    { id: 'certificates', label: 'Medical Documents', icon: FileBadge },
    { id: 'billing', label: 'Billing & Cashier', icon: PesoReceiptIcon },
    { id: 'reports', label: 'Reports & Census', icon: BarChart3 },
    { id: 'admin', label: 'System Admin', icon: ShieldAlert },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-30 md:hidden backdrop-blur-2xs animate-in fade-in duration-150"
          onClick={closeMobile}
        />
      )}

      <aside className={cn(
        'fixed md:sticky top-0 left-0 h-screen bg-white border-r border-slate-200 flex flex-col transition-all duration-200 z-40 shrink-0 select-none shadow-2xs md:shadow-none',
        // Mobile visibility
        isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0',
        // Desktop collapse width
        !isMobileOpen && (isCollapsed ? 'md:w-16' : 'md:w-60')
      )}>
        {/* Brand Header with Official SugboDoc Logo */}
        <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200 bg-slate-50/50">
          {(!isCollapsed || isMobileOpen) && (
            <div className="flex items-center gap-2.5">
              {!logoError ? (
                <img 
                  src="https://sugbodoc.com/public/assets/images/brand/logo.png" 
                  alt="SugboDoc Logo" 
                  onError={() => setLogoError(true)}
                  className="h-7 w-auto object-contain shrink-0" 
                />
              ) : (
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-full bg-[#4454c3] flex items-center justify-center text-white shadow-2xs shrink-0 font-bold text-sm font-sans">
                    S
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight text-slate-900">SUGBODOC</span>
                    <span className="text-[10px] uppercase font-bold text-[#4454c3] bg-[#eef2ff] px-1.5 py-0.5 rounded ml-1.5 border border-[#c7d2fe]">EMR</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Minimized / Collapsed Brand Header: Strictly Stethoscope "S" Mark ONLY (17px tight crop) */}
          {isCollapsed && !isMobileOpen && (
            <div 
              className="h-8 w-8 mx-auto flex items-center justify-center shrink-0 cursor-pointer overflow-hidden rounded-md hover:bg-slate-100 transition-colors" 
              onClick={toggleCollapse}
              title="Expand Sidebar"
            >
              {!logoError ? (
                <div className="h-7 w-[17px] overflow-hidden flex items-center justify-start relative shrink-0">
                  <img 
                    src="https://sugbodoc.com/public/assets/images/brand/logo.png" 
                    alt="SugboDoc Brand Mark" 
                    onError={() => setLogoError(true)}
                    className="h-7 max-w-none object-contain object-left shrink-0" 
                    style={{ width: '85px', minWidth: '85px' }}
                  />
                </div>
              ) : (
                <div className="h-7 w-7 rounded-full bg-[#4454c3] flex items-center justify-center text-white font-bold text-xs font-sans shadow-2xs">
                  S
                </div>
              )}
            </div>
          )}

          {/* Desktop Collapse Toggle */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobile}
            className="flex md:hidden p-1 rounded-full text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id);
                  closeMobile();
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-3 py-2 text-xs font-medium rounded-full transition-colors text-left cursor-pointer group',
                  isActive 
                    ? 'bg-[#4454c3] text-white font-semibold shadow-2xs' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                )}
                title={(isCollapsed && !isMobileOpen) ? item.label : undefined}
              >
                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-white' : 'text-slate-500 group-hover:text-slate-900')} />
                {(!isCollapsed || isMobileOpen) && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* Active User Footer Card */}
        {(!isCollapsed || isMobileOpen) && (
          <div className="p-3 border-t border-slate-200 bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold text-slate-900 truncate">{currentUser.name}</div>
                <div className="text-[10px] text-slate-500 capitalize truncate">{currentUser.title}</div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
