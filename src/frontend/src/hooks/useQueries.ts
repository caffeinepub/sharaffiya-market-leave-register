import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Employee, LeaveEntry, UserProfile } from '../backend';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

// Employee Queries
export function useGetAllEmployees() {
  const { actor, isFetching } = useActor();

  return useQuery<Employee[]>({
    queryKey: ['employees'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllEmployees();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: Employee) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addEmployee(employee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useUpdateEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employee: Employee) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateEmployee(employee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}

export function useDeleteEmployee() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (employeeId: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteEmployee(employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
}

// Leave Queries
export function useGetEmployeeLeaves(employeeId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<LeaveEntry[]>({
    queryKey: ['leaves', employeeId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getEmployeeLeaves(employeeId);
    },
    enabled: !!actor && !isFetching && !!employeeId,
  });
}

export function useAddLeave() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (leave: LeaveEntry) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLeave(leave);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaves', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
}

export function useUpdateLeave() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, date, newLeave }: { employeeId: string; date: bigint; newLeave: LeaveEntry }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLeave(employeeId, date, newLeave);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaves', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
}

export function useDeleteLeave() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, date }: { employeeId: string; date: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteLeave(employeeId, date);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leaves', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['leaves'] });
    },
  });
}

export function useSearchLeaves() {
  const { actor, isFetching } = useActor();

  return useMutation({
    mutationFn: async ({ employeeId, from, to }: { employeeId: string; from: bigint; to: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.searchLeavesByRange(employeeId, from, to);
    },
  });
}
