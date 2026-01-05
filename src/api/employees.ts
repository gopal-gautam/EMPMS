import api from './client';
import type { Employee } from '../types/employee';

export type GetEmployeesOptions = {
  fields?: string | string[];
};

export const getEmployees = async (options?: GetEmployeesOptions): Promise<Employee[]> => {
  const params = options?.fields
    ? { fields: Array.isArray(options.fields) ? options.fields.join(',') : options.fields }
    : undefined;

  const { data } = await api.get<Employee[]>('/employees', { params });
  return data;
};

export const createEmployee = async (payload: Partial<Employee>) => {
  const { data } = await api.post('/employees', payload);
  return data;
};


export const deleteEmployee = async (id: string) => {
  const { data } = await api.delete(`/employees/${id}`);
  return data;
}