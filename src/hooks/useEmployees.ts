import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../api/employees';

export const useEmployees = () => useQuery({
    queryKey: ['employees'],
    queryFn: () => getEmployees(),
    staleTime: 5 * 60 * 1000,
});