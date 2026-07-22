export type UserRole = 
  | 'admin' 
  | 'doctor' 
  | 'receptionist' 
  | 'nurse' 
  | 'lab_staff' 
  | 'cashier';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string;
  title: string;
  department: string;
  licenseNo?: string;
}

export type Gender = 'Male' | 'Female' | 'Other';
export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Allergy {
  id: string;
  allergen: string;
  severity: 'mild' | 'moderate' | 'severe';
  reaction: string;
}

export interface InsuranceInfo {
  provider: string;
  policyNumber: string;
  groupNumber?: string;
  coverageType: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number (e.g. MRN-2026-0891)
  firstName: string;
  lastName: string;
  middleName?: string;
  dob: string;
  gender: Gender;
  bloodType?: BloodType;
  phone: string;
  email: string;
  address: string;
  avatar?: string;
  emergencyContact: EmergencyContact;
  insurance?: InsuranceInfo;
  allergies: Allergy[];
  chronicConditions: string[];
  status: 'active' | 'archived';
  createdAt: string;
}

export interface Vitals {
  id: string;
  patientId: string;
  encounterId?: string;
  bpSystolic: number;
  bpDiastolic: number;
  heartRate: number;     // bpm
  respRate: number;      // breaths/min
  tempCelsius: number;   // °C
  spo2: number;          // %
  heightCm: number;
  weightKg: number;
  bmi: number;
  recordedAt: string;
  recordedBy: string;
}

export interface SOAPNote {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface ICD10Diagnosis {
  code: string;
  description: string;
  category: string;
  type: 'primary' | 'secondary';
  status: 'active' | 'resolved';
}

export interface MedicationOrder {
  id: string;
  medicineName: string;
  dosage: string;        // e.g. 500mg
  frequency: string;     // e.g. Every 8 hours
  duration: string;      // e.g. 7 days
  quantity: number;
  instructions: string;  // e.g. Take after meals
  route: string;         // e.g. Oral
}

export interface LabOrder {
  id: string;
  encounterId: string;
  patientId: string;
  patientName: string;
  testCode: string;
  testName: string;
  category: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  resultText?: string;
  normalRange?: string;
  orderedBy: string;
  orderedAt: string;
  completedAt?: string;
}

export interface MedicalCertificate {
  id: string;
  encounterId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  dateIssued: string;
  diagnosis: string;
  recommendation: string;
  validDays: number;
  doctorName: string;
  doctorLicenseNo: string;
}

export type EncounterStatus = 
  | 'scheduled' 
  | 'waiting' 
  | 'in_triage' 
  | 'in_consultation' 
  | 'completed' 
  | 'cancelled';

export interface Encounter {
  id: string;
  patientId: string;
  patientMrn: string;
  patientName: string;
  patientDob: string;
  patientGender: Gender;
  doctorId: string;
  doctorName: string;
  date: string;
  timeSlot: string;
  type: 'walk_in' | 'appointment' | 'teleconsult';
  status: EncounterStatus;
  chiefComplaint: string;
  vitals?: Vitals;
  soap?: SOAPNote;
  diagnoses: ICD10Diagnosis[];
  prescriptions: MedicationOrder[];
  labOrders: LabOrder[];
  medicalCertificates?: MedicalCertificate[];
  billingId?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  department: string;
  date: string;
  timeSlot: string;
  type: 'New Visit' | 'Follow-up' | 'Routine Checkup' | 'Consultation';
  status: 'Scheduled' | 'Checked-in' | 'In Consultation' | 'Completed' | 'Cancelled' | 'No-show';
  reason: string;
}

export interface QueueItem {
  id: string;
  queueNumber: string; // e.g. Q-014
  patientId: string;
  patientName: string;
  patientMrn: string;
  patientAge: number;
  patientGender: Gender;
  patientAvatar?: string;
  category: 'Regular' | 'Senior/PWD' | 'Urgent';
  status: 'waiting' | 'called' | 'in_triage' | 'in_consultation' | 'completed' | 'skipped';
  checkInTime: string;
  estimatedWaitMins: number;
  assignedDoctorId: string;
  assignedDoctorName: string;
  chiefComplaint: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  category: 'consultation' | 'lab' | 'pharmacy' | 'procedure';
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  encounterId: string;
  patientId: string;
  patientName: string;
  patientMrn: string;
  date: string;
  items: InvoiceItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  status: 'unpaid' | 'partially_paid' | 'paid' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'e_wallet';
  processedBy?: string;
}
