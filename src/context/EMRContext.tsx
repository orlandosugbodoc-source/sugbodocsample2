import React, { createContext, useContext, useState } from 'react';
import { 
  UserRole, 
  User, 
  Patient, 
  Encounter, 
  Appointment, 
  QueueItem, 
  Invoice, 
  LabOrder,
  Vitals,
  SOAPNote,
  ICD10Diagnosis,
  MedicationOrder,
  MedicalCertificate
} from '../types';
import { 
  MOCK_CURRENT_USER, 
  MOCK_STAFF, 
  MOCK_PATIENTS, 
  MOCK_QUEUE, 
  MOCK_APPOINTMENTS, 
  MOCK_LAB_ORDERS, 
  MOCK_ENCOUNTERS, 
  MOCK_INVOICES 
} from '../mock/initialData';

interface EMRContextType {
  // Current user & Role Management
  currentUser: User;
  setCurrentUserRole: (role: UserRole) => void;
  staffList: User[];

  // Navigation & Active View State
  activeModule: string;
  setActiveModule: (module: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;

  // Patients
  patients: Patient[];
  activePatient: Patient | null;
  setActivePatientId: (id: string | null) => void;
  addPatient: (patientData: Omit<Patient, 'id' | 'mrn' | 'createdAt'>) => Patient;
  updatePatient: (id: string, updates: Partial<Patient>) => void;

  // Encounters & Consultation
  encounters: Encounter[];
  activeEncounter: Encounter | null;
  startEncounterForPatient: (patientId: string, doctorId?: string) => Encounter;
  updateActiveEncounterSOAP: (soap: SOAPNote) => void;
  updateActiveEncounterVitals: (vitals: Vitals) => void;
  addDiagnosisToEncounter: (diagnosis: ICD10Diagnosis) => void;
  removeDiagnosisFromEncounter: (code: string) => void;
  addPrescriptionToEncounter: (rx: MedicationOrder) => void;
  removePrescriptionFromEncounter: (id: string) => void;
  addLabOrderToEncounter: (testName: string, category: string) => void;
  generateCertificateForEncounter: (recommendation: string, days: number) => MedicalCertificate;
  completeActiveEncounter: () => void;

  // Appointments & Queue
  appointments: Appointment[];
  queueItems: QueueItem[];
  addAppointment: (apt: Omit<Appointment, 'id' | 'status'>) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  advanceQueueItemStatus: (id: string, nextStatus: QueueItem['status']) => void;
  callNextPatientInQueue: () => QueueItem | null;
  addWalkInToQueue: (patientId: string, complaint: string, category: QueueItem['category']) => void;

  // Laboratory
  labOrders: LabOrder[];
  updateLabResult: (id: string, resultText: string) => void;

  // Invoices & Billing
  invoices: Invoice[];
  createInvoiceForEncounter: (encounterId: string) => Invoice;
  payInvoice: (invoiceId: string, method: Invoice['paymentMethod'], amount: number) => void;

  // System Notifications / Toast
  toast: { message: string; type: 'success' | 'info' | 'warning' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
}

const EMRContext = createContext<EMRContextType | undefined>(undefined);

export const EMRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(MOCK_CURRENT_USER);
  const [staffList] = useState<User[]>(MOCK_STAFF);
  const [activeModule, setActiveModule] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  const [patients, setPatients] = useState<Patient[]>(MOCK_PATIENTS);
  const [activePatientId, setActivePatientIdState] = useState<string | null>('pat-101');

  const [encounters, setEncounters] = useState<Encounter[]>(MOCK_ENCOUNTERS);
  const [activeEncounterId, setActiveEncounterId] = useState<string | null>('enc-101');

  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [queueItems, setQueueItems] = useState<QueueItem[]>(MOCK_QUEUE);
  const [labOrders, setLabOrders] = useState<LabOrder[]>(MOCK_LAB_ORDERS);
  const [invoices, setInvoices] = useState<Invoice[]>(MOCK_INVOICES);

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'warning' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const setCurrentUserRole = (role: UserRole) => {
    const matchingStaff = staffList.find(s => s.role === role) || {
      ...currentUser,
      role: role,
      title: `${role.toUpperCase()} User`,
    };
    setCurrentUser(matchingStaff);
    showToast(`Switched active role to ${role.toUpperCase()} (${matchingStaff.name})`, 'info');
  };

  const activePatient = patients.find(p => p.id === activePatientId) || null;
  const activeEncounter = encounters.find(e => e.id === activeEncounterId) || null;

  const setActivePatientId = (id: string | null) => {
    setActivePatientIdState(id);
    if (id) {
      const existingEnc = encounters.find(e => e.patientId === id && e.status === 'in_consultation');
      if (existingEnc) {
        setActiveEncounterId(existingEnc.id);
      }
    }
  };

  const addPatient = (patientData: Omit<Patient, 'id' | 'mrn' | 'createdAt'>): Patient => {
    const nextNum = (patients.length + 101).toString().padStart(4, '0');
    const newPatient: Patient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      mrn: `MRN-2026-${nextNum}`,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setPatients(prev => [newPatient, ...prev]);
    showToast(`New patient record registered: ${newPatient.firstName} ${newPatient.lastName} (${newPatient.mrn})`, 'success');
    return newPatient;
  };

  const updatePatient = (id: string, updates: Partial<Patient>) => {
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    showToast('Patient record updated successfully', 'success');
  };

  const startEncounterForPatient = (patientId: string, doctorId?: string): Encounter => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) throw new Error('Patient not found');

    const newEncounter: Encounter = {
      id: `enc-${Date.now()}`,
      patientId: patient.id,
      patientMrn: patient.mrn,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientDob: patient.dob,
      patientGender: patient.gender,
      doctorId: doctorId || currentUser.id,
      doctorName: currentUser.name,
      date: new Date().toISOString().split('T')[0],
      timeSlot: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'walk_in',
      status: 'in_consultation',
      chiefComplaint: 'Patient present for consultation',
      diagnoses: [],
      prescriptions: [],
      labOrders: [],
    };

    setEncounters(prev => [newEncounter, ...prev]);
    setActiveEncounterId(newEncounter.id);
    setActivePatientIdState(patient.id);
    showToast(`Started consultation for ${newEncounter.patientName}`, 'success');
    return newEncounter;
  };

  const updateActiveEncounterSOAP = (soap: SOAPNote) => {
    if (!activeEncounterId) return;
    setEncounters(prev => prev.map(e => e.id === activeEncounterId ? { ...e, soap } : e));
    showToast('SOAP notes saved', 'success');
  };

  const updateActiveEncounterVitals = (vitals: Vitals) => {
    if (!activeEncounterId) return;
    setEncounters(prev => prev.map(e => e.id === activeEncounterId ? { ...e, vitals } : e));
    showToast('Patient vitals recorded', 'success');
  };

  const addDiagnosisToEncounter = (diagnosis: ICD10Diagnosis) => {
    if (!activeEncounterId) return;
    setEncounters(prev => prev.map(e => {
      if (e.id === activeEncounterId) {
        const exists = e.diagnoses.some(d => d.code === diagnosis.code);
        if (exists) return e;
        return { ...e, diagnoses: [...e.diagnoses, diagnosis] };
      }
      return e;
    }));
    showToast(`Added diagnosis ${diagnosis.code}`, 'success');
  };

  const removeDiagnosisFromEncounter = (code: string) => {
    if (!activeEncounterId) return;
    setEncounters(prev => prev.map(e => e.id === activeEncounterId ? {
      ...e,
      diagnoses: e.diagnoses.filter(d => d.code !== code)
    } : e));
  };

  const addPrescriptionToEncounter = (rx: MedicationOrder) => {
    if (!activeEncounterId) return;
    setEncounters(prev => prev.map(e => e.id === activeEncounterId ? {
      ...e,
      prescriptions: [...e.prescriptions, rx]
    } : e));
    showToast(`Prescribed ${rx.medicineName}`, 'success');
  };

  const removePrescriptionFromEncounter = (id: string) => {
    if (!activeEncounterId) return;
    setEncounters(prev => prev.map(e => e.id === activeEncounterId ? {
      ...e,
      prescriptions: e.prescriptions.filter(r => r.id !== id)
    } : e));
  };

  const addLabOrderToEncounter = (testName: string, category: string) => {
    if (!activeEncounter) return;
    const newOrder: LabOrder = {
      id: `lab-${Date.now()}`,
      encounterId: activeEncounter.id,
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      testCode: `LOINC-${Math.floor(1000 + Math.random() * 9000)}-1`,
      testName,
      category,
      status: 'pending',
      orderedBy: currentUser.name,
      orderedAt: new Date().toLocaleString(),
    };
    setLabOrders(prev => [newOrder, ...prev]);
    setEncounters(prev => prev.map(e => e.id === activeEncounter.id ? {
      ...e,
      labOrders: [...e.labOrders, newOrder]
    } : e));
    showToast(`Ordered lab test: ${testName}`, 'success');
  };

  const generateCertificateForEncounter = (recommendation: string, days: number): MedicalCertificate => {
    if (!activeEncounter) throw new Error('No active encounter');
    const cert: MedicalCertificate = {
      id: `cert-${Date.now()}`,
      encounterId: activeEncounter.id,
      patientId: activeEncounter.patientId,
      patientName: activeEncounter.patientName,
      patientAge: activePatient ? new Date().getFullYear() - new Date(activePatient.dob).getFullYear() : 35,
      patientGender: activeEncounter.patientGender,
      dateIssued: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      diagnosis: activeEncounter.diagnoses.map(d => `${d.code} - ${d.description}`).join('; ') || 'Under Clinical Evaluation',
      recommendation,
      validDays: days,
      doctorName: currentUser.name,
      doctorLicenseNo: currentUser.licenseNo || 'PRC-0149204',
    };

    setEncounters(prev => prev.map(e => e.id === activeEncounter.id ? {
      ...e,
      medicalCertificates: [...(e.medicalCertificates || []), cert]
    } : e));

    showToast('Generated printable Medical Certificate', 'success');
    return cert;
  };

  const completeActiveEncounter = () => {
    if (!activeEncounterId) return;
    setEncounters(prev => prev.map(e => e.id === activeEncounterId ? { ...e, status: 'completed' } : e));
    
    // Auto generate invoice
    createInvoiceForEncounter(activeEncounterId);
    
    // Advance queue item
    setQueueItems(prev => prev.map(q => q.patientId === activeEncounter?.patientId ? { ...q, status: 'completed' } : q));

    showToast('Encounter marked as Completed. Invoice routed to Cashier.', 'success');
  };

  const addAppointment = (apt: Omit<Appointment, 'id' | 'status'>) => {
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      status: 'Scheduled',
    };
    setAppointments(prev => [newApt, ...prev]);
    showToast(`Appointment scheduled for ${newApt.patientName}`, 'success');
  };

  const updateAppointmentStatus = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    showToast(`Appointment status updated to ${status}`, 'info');
  };

  const advanceQueueItemStatus = (id: string, nextStatus: QueueItem['status']) => {
    setQueueItems(prev => prev.map(q => q.id === id ? { ...q, status: nextStatus } : q));
    showToast(`Queue item status changed to ${nextStatus}`, 'info');
  };

  const callNextPatientInQueue = (): QueueItem | null => {
    const nextWaiting = queueItems.find(q => q.status === 'waiting');
    if (!nextWaiting) {
      showToast('No patients currently waiting in queue', 'warning');
      return null;
    }
    setQueueItems(prev => prev.map(q => q.id === nextWaiting.id ? { ...q, status: 'called' } : q));
    showToast(`Called queue ticket ${nextWaiting.queueNumber}: ${nextWaiting.patientName}`, 'info');
    return nextWaiting;
  };

  const addWalkInToQueue = (patientId: string, complaint: string, category: QueueItem['category']) => {
    const patient = patients.find(p => p.id === patientId);
    if (!patient) return;
    const num = (queueItems.length + 1).toString().padStart(3, '0');
    const newQueue: QueueItem = {
      id: `q-${Date.now()}`,
      queueNumber: `Q-${num}`,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`,
      patientMrn: patient.mrn,
      patientAge: new Date().getFullYear() - new Date(patient.dob).getFullYear(),
      patientGender: patient.gender,
      category,
      status: 'waiting',
      checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      estimatedWaitMins: (queueItems.filter(q => q.status === 'waiting').length + 1) * 15,
      assignedDoctorId: currentUser.id,
      assignedDoctorName: currentUser.name,
      chiefComplaint: complaint,
    };
    setQueueItems(prev => [...prev, newQueue]);
    showToast(`Issued queue ticket ${newQueue.queueNumber} to ${newQueue.patientName}`, 'success');
  };

  const updateLabResult = (id: string, resultText: string) => {
    setLabOrders(prev => prev.map(l => l.id === id ? {
      ...l,
      resultText,
      status: 'completed',
      completedAt: new Date().toLocaleString()
    } : l));
    showToast('Lab result uploaded and published to patient record', 'success');
  };

  const createInvoiceForEncounter = (encounterId: string): Invoice => {
    const enc = encounters.find(e => e.id === encounterId);
    if (!enc) throw new Error('Encounter not found');

    const items = [
      { id: 'i-1', description: 'Outpatient Medical Consultation Fee', category: 'consultation' as const, quantity: 1, unitPrice: 800, amount: 800 },
      ...enc.labOrders.map((l, idx) => ({ id: `i-lab-${idx}`, description: l.testName, category: 'lab' as const, quantity: 1, unitPrice: 350, amount: 350 })),
      ...enc.prescriptions.map((r, idx) => ({ id: `i-rx-${idx}`, description: `${r.medicineName} (${r.quantity} pcs)`, category: 'pharmacy' as const, quantity: r.quantity, unitPrice: 10, amount: r.quantity * 10 })),
    ];

    const subtotal = items.reduce((acc, item) => acc + item.amount, 0);
    const discount = subtotal * 0.10; // 10% Senior/HMO
    const total = subtotal - discount;

    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      encounterId: enc.id,
      patientId: enc.patientId,
      patientName: enc.patientName,
      patientMrn: enc.patientMrn,
      date: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discount,
      tax: 0,
      total,
      paidAmount: 0,
      status: 'unpaid',
    };

    setInvoices(prev => [invoice, ...prev]);
    return invoice;
  };

  const payInvoice = (invoiceId: string, method: Invoice['paymentMethod'], amount: number) => {
    setInvoices(prev => prev.map(inv => {
      if (inv.id === invoiceId) {
        const newPaid = inv.paidAmount + amount;
        const newStatus = newPaid >= inv.total ? 'paid' : 'partially_paid';
        return {
          ...inv,
          paidAmount: newPaid,
          status: newStatus,
          paymentMethod: method,
          processedBy: currentUser.name,
        };
      }
      return inv;
    }));
    showToast(`Payment of ₱${amount.toLocaleString()} received via ${method}`, 'success');
  };

  return (
    <EMRContext.Provider value={{
      currentUser,
      setCurrentUserRole,
      staffList,
      activeModule,
      setActiveModule,
      searchQuery,
      setSearchQuery,
      isCommandPaletteOpen,
      setIsCommandPaletteOpen,
      patients,
      activePatient,
      setActivePatientId,
      addPatient,
      updatePatient,
      encounters,
      activeEncounter,
      startEncounterForPatient,
      updateActiveEncounterSOAP,
      updateActiveEncounterVitals,
      addDiagnosisToEncounter,
      removeDiagnosisFromEncounter,
      addPrescriptionToEncounter,
      removePrescriptionFromEncounter,
      addLabOrderToEncounter,
      generateCertificateForEncounter,
      completeActiveEncounter,
      appointments,
      queueItems,
      addAppointment,
      updateAppointmentStatus,
      advanceQueueItemStatus,
      callNextPatientInQueue,
      addWalkInToQueue,
      labOrders,
      updateLabResult,
      invoices,
      createInvoiceForEncounter,
      payInvoice,
      toast,
      showToast,
    }}>
      {children}
    </EMRContext.Provider>
  );
};

export const useEMR = () => {
  const context = useContext(EMRContext);
  if (!context) {
    throw new Error('useEMR must be used within an EMRProvider');
  }
  return context;
};
