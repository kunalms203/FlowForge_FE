import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskApi, CreateTaskPayload, UpdateTaskPayload } from '@/src/services/taskApi';
import { boardKeys } from './useBoards';

export const taskKeys = {
  all: (workspaceId: string, projectId: string, boardId: string) =>
    ['tasks', workspaceId, projectId, boardId] as const,
  detail: (workspaceId: string, projectId: string, boardId: string, taskId: string) =>
    ['tasks', workspaceId, projectId, boardId, taskId] as const,
};

export function useTasks(workspaceId: string, projectId: string, boardId: string) {
  return useQuery({
    queryKey: taskKeys.all(workspaceId, projectId, boardId),
    queryFn: () => taskApi.getTasks(workspaceId, projectId, boardId),
    enabled: !!workspaceId && !!projectId && !!boardId,
  });
}

export function useTask(workspaceId: string, projectId: string, boardId: string, taskId: string) {
  return useQuery({
    queryKey: taskKeys.detail(workspaceId, projectId, boardId, taskId),
    queryFn: () => taskApi.getTaskById(workspaceId, projectId, boardId, taskId),
    enabled: !!workspaceId && !!projectId && !!boardId && !!taskId,
  });
}

export function useCreateTask(workspaceId: string, projectId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      taskApi.createTask(workspaceId, projectId, boardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(workspaceId, projectId, boardId) });
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId, projectId) });
    },
  });
}

export function useUpdateTask(workspaceId: string, projectId: string, boardId: string, taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTaskPayload) =>
      taskApi.updateTask(workspaceId, projectId, boardId, taskId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(workspaceId, projectId, boardId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(workspaceId, projectId, boardId, taskId) });
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId, projectId) });
    },
  });
}

export function useMoveTask(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      currentBoardId,
      taskId,
      newBoardId,
    }: {
      currentBoardId: string;
      taskId: string;
      newBoardId: string;
    }) => taskApi.moveTask(workspaceId, projectId, currentBoardId, taskId, newBoardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', workspaceId, projectId] });
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId, projectId) });
    },
  });
}

export function useDeleteTask(workspaceId: string, projectId: string, boardId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) => taskApi.deleteTask(workspaceId, projectId, boardId, taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.all(workspaceId, projectId, boardId) });
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId, projectId) });
    },
  });
}
