export type DemoDoctorAccount = {
  email: string;
  name: string;
  specialty: string;
  licenseNumber: string;
  bio: string;
};

export const DEMO_DOCTOR_ACCOUNTS: DemoDoctorAccount[] = [
  {
    email: "doctor.general@mediva.ai",
    name: "Dr. Aarav Mehta",
    specialty: "General Physician",
    licenseNumber: "MED-GP-1001",
    bio: "General medicine specialist focused on first-line triage and safe care handoffs.",
  },
  {
    email: "doctor.mind@mediva.ai",
    name: "Dr. Ananya Kapoor",
    specialty: "Psychologist",
    licenseNumber: "MED-PSY-2102",
    bio: "Mental health specialist reviewing high-empathy and risk-sensitive AI consultations.",
  },
  {
    email: "doctor.skin@mediva.ai",
    name: "Dr. Rohan Iyer",
    specialty: "Dermatologist",
    licenseNumber: "MED-DER-3203",
    bio: "Dermatology reviewer for image-supported and symptom-led skin consultations.",
  },
];

export function findDemoDoctorByEmail(email: string) {
  return DEMO_DOCTOR_ACCOUNTS.find(
    (doctor) => doctor.email.toLowerCase() === email.toLowerCase()
  );
}
