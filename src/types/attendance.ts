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

// Payload when creating a clock-in for the current employee. Only clockInTime is required by the backend.
export interface CreateMyClockInPayload {
  clockInTime: string;
  // optional date if client wants to override (ISO date string) - backend may set it automatically
  date?: string;
}

// Payload when updating a clock-in/out for the current employee. Backend generally accepts clockOutTime and notes.
export interface UpdateMyClockInPayload {
  clockOutTime?: string;
  notes?: string;
}
