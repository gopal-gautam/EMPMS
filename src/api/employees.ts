import api from './client';
import type { Employee } from '../types/employee';

export const getEmployees = async (): Promise<Employee[]> => {
  const { data } = await api.get<Employee[]>('/employees');
  return data;
};

export const createEmployee = async (payload: Partial<Employee>) => {
  const { data } = await api.post('/employees', payload);
  return data;
};