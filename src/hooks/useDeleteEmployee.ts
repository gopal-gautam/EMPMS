import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteEmployee } from '../api/employees';
import type { Employee } from '../types/employee';

export const useDeleteEmployee = () => {
  const qc = useQueryClient();

  return useMutation<unknown, Error, string, { previous: Employee[] | undefined }>({
    onMutate: async (id: string) => {
      await qc.cancelQueries({ queryKey: ['employees'] });
      const previous = qc.getQueryData<Employee[]>(['employees']);
      qc.setQueryData<Employee[]>(
        ['employees'],
        prev => prev?.filter(e => e.id !== id) ?? []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(['employees'], context.previous);
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['employees'] }),
    mutationFn: (id: string) => deleteEmployee(id),
  });
};