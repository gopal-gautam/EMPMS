import api from './client';
import type { ClockInOut } from '../types/attendance';

const formatDateOnly = (isoOrDateStr: string): string => {
  const date = new Date(isoOrDateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};
// import { getEmployees } from './employees';

export const getClockInOuts = async (): Promise<ClockInOut[]> => {
    const { data } = await api.get<ClockInOut[]>('/clock-in-outs');
  return data.map(item => {
    const date = new Date(item.date);
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    return {
        ...item,
        date: formattedDate,
    };
  });

  
  // const { data } = await api.get<ClockInOutApiResponse[]>('/clock-in-outs');

  // // Fetch all employees to get names
  // const employees = await getEmployees({ fields: ['id', 'employeeId', 'firstName', 'lastName'] });
  // const employeeMap = new Map(employees.map(emp => [emp.id, emp]));

  // // Transform API response to include employee names and format dates
  // return data.map(item => {
  //   const employee = employeeMap.get(item.employeeId);
  //   const date = new Date(item.date);
  //   const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  //   return {
  //     id: item.id,
  //     employeeId: employee?.employeeId || item.employeeId,
  //     firstName: employee?.firstName || 'Unknown',
  //     lastName: employee?.lastName || 'Employee',
  //     date: formattedDate,
  //     clockInTime: item.clockInTime,
  //     clockOutTime: item.clockOutTime || undefined,
  //     notes: item.notes || '',
  //   };
  // });
};

export const createClockInOut = async (payload: Omit<ClockInOut, 'id'>): Promise<ClockInOut> => {
  const { data } = await api.post<ClockInOut>('/clock-in-outs', payload);
  return { ...data, date: formatDateOnly(data.date) };
};

export const updateClockInOut = async (id: string, payload: Partial<ClockInOut>): Promise<ClockInOut> => {
  const { data } = await api.put<ClockInOut>(`/clock-in-outs/${id}`, payload);
  return { ...data, date: formatDateOnly(data.date) };
};

export const deleteClockInOut = async (id: string): Promise<void> => {
  await api.delete(`/clock-in-outs/${id}`);
};
