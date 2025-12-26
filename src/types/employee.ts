// src/types/employee.ts

export interface EmergencyContact {
  name: string;
  relation?: string;
  phone?: string;
  address?: string;
}

export interface EmployeeDocuments {
  citizenShipNumber?: string;
  panNumber?: string;
  passportNumber?: string;
  drivingLicense?: string;
}

export type Gender = 'male' | 'female' | 'other' | string;
export type EmployeeStatus = 'active' | 'inactive' | 'terminated' | string;

export interface Employee {
  id?: string;
  employeeId?: string;

  // Personal
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName?: string;
  dateOfBirth?: string; // ISO date
  gender?: Gender;
  maritalStatus?: string;
  nationality?: string;

  // Contact
  email?: string;
  phone?: string;
  alternatePhone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  profileImage?: string;

  // Employment
  department?: string;
  position?: string;
  jobTitle?: string;
  employmentType?: string;
  dateOfJoining?: string; // ISO date
  workLocation?: string;
  reportingManager?: string;

  // Compensation / Bank
  bankName?: string;
  accountNumber?: string;
  ifscCode?: string;

  // Emergency
  emergencyContact?: EmergencyContact;

  // Documents
  documents?: EmployeeDocuments;

  // Additional
  bloodGroup?: string;
  allergies?: string;
  notes?: string;

  // Meta
  status?: EmployeeStatus;
  createdAt?: string;
  updatedAt?: string;
}

/** Payload used when creating/updating from client */
export type CreateEmployeePayload = Partial<Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>> & {
  firstName: string;
  lastName: string;
};