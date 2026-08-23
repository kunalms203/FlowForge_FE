import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { boardApi, CreateBoardPayload, UpdateBoardPayload } from '@/src/services/boardApi';

export const boardKeys = {
  all: (workspaceId: string, projectId: string) => ['boards', workspaceId, projectId] as const,
  detail: (workspaceId: string, projectId: string, boardId: string) =>
    ['boards', workspaceId, projectId, boardId] as const,
};

export function useBoards(workspaceId: string, projectId: string) {
  return useQuery({
    queryKey: boardKeys.all(workspaceId, projectId),
    queryFn: () => boardApi.getBoards(workspaceId, projectId),
    enabled: !!workspaceId && !!projectId,
  });
}

export function useBoard(workspaceId: string, projectId: string, boardId: string) {
  return useQuery({
    queryKey: boardKeys.detail(workspaceId, projectId, boardId),
    queryFn: () => boardApi.getBoardById(workspaceId, projectId, boardId),
    enabled: !!workspaceId && !!projectId && !!boardId,
  });
}

export function useCreateBoard(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBoardPayload) => boardApi.createBoard(workspaceId, projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId, projectId) });
    },
  });
}

export function useUpdateBoard(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, payload }: { boardId: string; payload: UpdateBoardPayload }) =>
      boardApi.updateBoard(workspaceId, projectId, boardId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId, projectId) });
    },
  });
}

export function useDeleteBoard(workspaceId: string, projectId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: string) => boardApi.deleteBoard(workspaceId, projectId, boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: boardKeys.all(workspaceId, projectId) });
    },
  });
}
