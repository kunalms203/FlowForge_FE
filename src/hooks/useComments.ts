import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentApi } from '@/src/services/commentApi';

export const commentKeys = {
  all: (taskId: string) => ['comments', taskId] as const,
};

export function useTaskComments(taskId: string) {
  return useQuery({
    queryKey: commentKeys.all(taskId),
    queryFn: () => commentApi.getComments(taskId),
    enabled: !!taskId,
  });
}

export function useCreateComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => commentApi.createComment(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(taskId) });
      queryClient.invalidateQueries({ queryKey: ['activities', 'task', taskId] });
    },
  });
}

export function useUpdateComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: string; content: string }) =>
      commentApi.updateComment(taskId, commentId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(taskId) });
    },
  });
}

export function useDeleteComment(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => commentApi.deleteComment(taskId, commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: commentKeys.all(taskId) });
    },
  });
}
