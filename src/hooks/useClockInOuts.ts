import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyClockInOuts, createMyClockInOut, updateMyClockInOut } from '../api/clock-in-outs';
import type { CreateMyClockInPayload, UpdateMyClockInPayload, ClockInOut } from '../types/attendance';

export const useMyClockInOuts = () => useQuery<ClockInOut[]>({
  queryKey: ['myClockInOuts'],
  queryFn: () => getMyClockInOuts(),
  staleTime: 60_000,
});

export const useCreateMyClockIn = () => {
  const qc = useQueryClient();
  const m = useMutation<ClockInOut, Error, CreateMyClockInPayload, unknown>({
    mutationFn: (payload: CreateMyClockInPayload) => createMyClockInOut(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myClockInOuts'] }),
  });

  return {
    mutate: m.mutate,
    isLoading: Boolean((m as any).isLoading),
    result: m,
  } as {
    mutate: (payload: CreateMyClockInPayload, options?: any) => void;
    isLoading: boolean;
    result: typeof m;
  };
};

export const useUpdateMyClockIn = () => {
  const qc = useQueryClient();
  const m = useMutation<ClockInOut, Error, { id: string; payload: UpdateMyClockInPayload }, unknown>({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMyClockInPayload }) => updateMyClockInOut(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['myClockInOuts'] }),
  });

  return {
    mutate: m.mutate,
    isLoading: Boolean((m as any).isLoading),
    result: m,
  } as {
    mutate: (vars: { id: string; payload: UpdateMyClockInPayload }, options?: any) => void;
    isLoading: boolean;
    result: typeof m;
  };
};
