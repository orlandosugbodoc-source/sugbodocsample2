import React, { useState, useEffect, useRef } from 'react';
import { EMRProvider, useEMR } from './context/EMRContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toast } from './components/ui/Toast';
import { CommandPalette } from './components/ui/CommandPalette';
import { LoginScreen } from './components/auth/LoginScreen';

// Modules
import { DashboardModule } from './components/dashboard/DashboardModule';
import { PatientsModule } from './components/patients/PatientsModule';
import { QueueModule } from './components/queue/QueueModule';
import { ConsultationModule } from './components/consultation/ConsultationModule';
import { SOAPModule } from './components/soap/SOAPModule';
import { PrescriptionsModule } from './components/prescriptions/PrescriptionsModule';
import { LaboratoryModule } from './components/laboratory/LaboratoryModule';
import { CertificatesModule } from './components/certificates/CertificatesModule';
import { BillingModule } from './components/billing/BillingModule';
import { ReportsModule } from './components/reports/ReportsModule';
import { AdminModule } from './components/admin/AdminModule';
import { SettingsModule } from './components/settings/SettingsModule';

const MainLayout: React.FC = () => {
  const { activeModule, toast } = useEMR();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Smooth scroll reset on module switch
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [activeModule]);

  const renderModuleContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'patients':
        return <PatientsModule />;
      case 'appointments':
      case 'queue':
        return <QueueModule />;
      case 'consultation':
        return <ConsultationModule />;
      case 'soap':
        return <SOAPModule />;
      case 'prescriptions':
        return <PrescriptionsModule />;
      case 'laboratory':
        return <LaboratoryModule />;
      case 'certificates':
        return <CertificatesModule />;
      case 'billing':
        return <BillingModule />;
      case 'reports':
        return <ReportsModule />;
      case 'admin':
        return <AdminModule />;
      case 'settings':
        return <SettingsModule />;
      default:
        return <DashboardModule />;
    }
  };

  return (
    <div className="flex h-screen bg-[#f4f6f9] overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isMobileOpen={isMobileOpen}
        closeMobile={() => setIsMobileOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onOpenMobileMenu={() => setIsMobileOpen(true)} />
        
        <main ref={mainRef} className="flex-1 overflow-y-auto p-3 sm:p-6 scroll-smooth">
          <div key={activeModule} className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-1 duration-150 ease-out">
            {renderModuleContent()}
          </div>
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette />

      {/* Toast Notifications */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

const AppContent: React.FC = () => {
  const { isAuthenticated, toast } = useEMR();

  if (!isAuthenticated) {
    return (
      <>
        <LoginScreen />
        {toast && <Toast message={toast.message} type={toast.type} />}
      </>
    );
  }

  return <MainLayout />;
};

export function App() {
  return (
    <EMRProvider>
      <AppContent />
    </EMRProvider>
  );
}

export default App;
