// src/types/attendance.ts

export interface ClockInOut {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  date: string; // ISO date
  clockInTime: string; // HH:mm format
  clockOutTime?: string; // HH:mm format (optional if not clocked out yet)
  notes?: string;
}
