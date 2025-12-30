// src/types/attendance.ts

export interface ClockInOut {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  date: string; // ISO date
  clockInTime: string; // HH:mm format
  clockOutTime?: string | null; // HH:mm format (optional if not clocked out yet)
  notes?: string;
}

// Backend API response type
export interface ClockInOutApiResponse {
  id: string;
  employeeId: string;
  date: string; // ISO timestamp
  clockInTime: string;
  clockOutTime?: string | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}
