import React, { useState } from 'react';
import { EMRProvider, useEMR } from './context/EMRContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Toast } from './components/ui/Toast';
import { CommandPalette } from './components/ui/CommandPalette';

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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
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
        
        <main className="flex-1 overflow-y-auto p-3 sm:p-6">
          <div className="max-w-7xl mx-auto">
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

export function App() {
  return (
    <EMRProvider>
      <MainLayout />
    </EMRProvider>
  );
}

export default App;
