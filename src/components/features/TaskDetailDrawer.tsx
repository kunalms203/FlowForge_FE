'use client';

import React, { useState, useEffect } from 'react';
import { Drawer } from '../ui/Drawer';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { Tabs } from '../ui/Tabs';
import { Skeleton } from '../ui/Skeleton';
import { ErrorAlert } from '../ui/ErrorAlert';
import {
  useTask,
  useUpdateTask,
  useDeleteTask,
  useMoveTask,
} from '@/src/hooks/useTasks';
import {
  useTaskComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from '@/src/hooks/useComments';
import {
  useUploadAttachment,
  useDeleteAttachment,
} from '@/src/hooks/useAttachments';
import { useTaskActivities } from '@/src/hooks/useActivities';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import { Board, TaskPriority, TaskStatus } from '@/src/types';
import {
  Calendar,
  MessageSquare,
  Paperclip,
  Activity as ActivityIcon,
  Trash2,
  Send,
  Upload,
  FileText,
  Clock,
  User as UserIcon,
  Check,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';

export interface TaskDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  projectId: string;
  boardId: string;
  taskId: string | null;
  boards?: Board[];
}

export function TaskDetailDrawer({
  isOpen,
  onClose,
  workspaceId,
  projectId,
  boardId,
  taskId,
  boards,
}: TaskDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<'comments' | 'attachments' | 'activity'>('comments');
  const [commentInput, setCommentInput] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');

  // Editable task state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [storyPoints, setStoryPoints] = useState<string>('');
  const [dueDate, setDueDate] = useState<string>('');
  const [assigneeId, setAssigneeId] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const { data: task, isLoading, error } = useTask(
    workspaceId,
    projectId,
    boardId,
    taskId || ''
  );
  const { data: workspace } = useWorkspace(workspaceId);
  const { data: comments, isLoading: isCommentsLoading } = useTaskComments(taskId || '');
  const { data: activities, isLoading: isActivitiesLoading } = useTaskActivities(taskId || '');

  const updateTaskMutation = useUpdateTask(workspaceId, projectId, boardId, taskId || '');
  const deleteTaskMutation = useDeleteTask(workspaceId, projectId, boardId);
  const moveTaskMutation = useMoveTask(workspaceId, projectId);

  const createCommentMutation = useCreateComment(taskId || '');
  const updateCommentMutation = useUpdateComment(taskId || '');
  const deleteCommentMutation = useDeleteComment(taskId || '');

  const uploadAttachmentMutation = useUploadAttachment(taskId || '');
  const deleteAttachmentMutation = useDeleteAttachment(taskId || '');

  // Populate local form fields when task data arrives
  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'TODO');
      setPriority(task.priority || 'MEDIUM');
      setStoryPoints(task.storyPoints !== null && task.storyPoints !== undefined ? String(task.storyPoints) : '');
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '');
      setAssigneeId(task.assigneeId || '');
    }
  }, [task]);

  if (!taskId) return null;

  const handleSaveDetails = async () => {
    try {
      await updateTaskMutation.mutateAsync({
        title,
        description,
        status,
        priority,
        storyPoints: storyPoints ? parseInt(storyPoints, 10) : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        assigneeId: assigneeId || null,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch {
      // error handled by mutation
    }
  };

  const handleMoveBoard = async (newBoardId: string) => {
    if (newBoardId !== boardId) {
      await moveTaskMutation.mutateAsync({
        currentBoardId: boardId,
        taskId: taskId,
        newBoardId,
      });
      onClose();
    }
  };

  const handleDeleteTask = async () => {
    if (confirm('Are you sure you want to delete this task?')) {
      await deleteTaskMutation.mutateAsync(taskId);
      onClose();
    }
  };

  const handleCreateComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    await createCommentMutation.mutateAsync(commentInput.trim());
    setCommentInput('');
  };

  const handleUpdateComment = async (commentId: string) => {
    if (!editingCommentContent.trim()) return;
    await updateCommentMutation.mutateAsync({ commentId, content: editingCommentContent.trim() });
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      await uploadAttachmentMutation.mutateAsync(files[0]);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      width="2xl"
      title={
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Badge status={status} />
            <Badge priority={priority} />
          </div>

          <div className="flex items-center gap-2">
            {saveSuccess && (
              <span className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Saved
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={handleSaveDetails}
              isLoading={updateTaskMutation.isPending}
            >
              Save Changes
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={handleDeleteTask}
              isLoading={deleteTaskMutation.isPending}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      }
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : error ? (
        <ErrorAlert message="Failed to load task details" />
      ) : (
        <div className="space-y-6">
          {/* Title Input */}
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              className="w-full text-base font-semibold text-neutral-900 border-none outline-none focus:ring-0 p-0 bg-transparent placeholder:text-neutral-400"
            />
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-neutral-50/80 border border-neutral-200/80 text-xs">
            {/* Status */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">Status</label>
              <Select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                options={[
                  { value: 'TODO', label: 'To Do' },
                  { value: 'IN_PROGRESS', label: 'In Progress' },
                  { value: 'REVIEW', label: 'In Review' },
                  { value: 'DONE', label: 'Done' },
                ]}
              />
            </div>

            {/* Priority */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">Priority</label>
              <Select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                options={[
                  { value: 'LOW', label: 'Low' },
                  { value: 'MEDIUM', label: 'Medium' },
                  { value: 'HIGH', label: 'High' },
                  { value: 'CRITICAL', label: 'Critical' },
                ]}
              />
            </div>

            {/* Column / Board */}
            {boards && boards.length > 0 && (
              <div>
                <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                  Column / Board
                </label>
                <Select
                  value={boardId}
                  onChange={(e) => handleMoveBoard(e.target.value)}
                  options={boards.map((b) => ({ value: b.id, label: b.name }))}
                />
              </div>
            )}

            {/* Assignee */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">Assignee</label>
              <Select
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
              >
                <option value="">Unassigned</option>
                {workspace?.members && Array.isArray(workspace.members) &&
                  workspace.members.map((m: any) => {
                    if (!m.user) return null;
                    return (
                      <option key={m.user.id} value={m.user.id}>
                        {m.user.fullName || m.user.email}
                      </option>
                    );
                  })}
              </Select>
            </div>

            {/* Story Points */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">
                Story Points
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                placeholder="e.g. 1, 3, 5, 8"
                value={storyPoints}
                onChange={(e) => setStoryPoints(e.target.value)}
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-[11px] font-medium text-neutral-500 mb-1">Due Date</label>
              <Input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">Description</label>
            <Textarea
              rows={4}
              placeholder="Add more details about this task..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Tabs for Activity / Comments / Attachments */}
          <div className="pt-2">
            <Tabs
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id as any)}
              tabs={[
                { id: 'comments', label: 'Comments', count: comments?.length || 0, icon: MessageSquare },
                { id: 'attachments', label: 'Attachments', count: task?.attachments?.length || 0, icon: Paperclip },
                { id: 'activity', label: 'History', count: activities?.length || 0, icon: ActivityIcon },
              ]}
            />

            {/* Comments Tab */}
            {activeTab === 'comments' && (
              <div className="py-4 space-y-4">
                {/* Add Comment Form */}
                <form onSubmit={handleCreateComment} className="flex gap-2">
                  <Input
                    placeholder="Write a comment..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!commentInput.trim()}
                    isLoading={createCommentMutation.isPending}
                  >
                    <Send className="w-3.5 h-3.5 mr-1" /> Send
                  </Button>
                </form>

                {/* Comment List */}
                <div className="space-y-3 divide-y divide-neutral-100">
                  {isCommentsLoading ? (
                    <Skeleton className="h-16 w-full" />
                  ) : !comments || comments.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-6">No comments yet</p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.id} className="pt-3 first:pt-0 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Avatar name={c.user?.fullName || 'User'} size="xs" />
                            <span className="text-xs font-semibold text-neutral-900">
                              {c.user?.fullName || 'User'}
                            </span>
                            <span className="text-[10px] text-neutral-400">
                              {formatDistanceToNow(new Date(c.createdAt), { addSuffix: true })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => {
                                setEditingCommentId(c.id);
                                setEditingCommentContent(c.content);
                              }}
                              className="text-[10px] text-neutral-400 hover:text-neutral-900 px-1 py-0.5 rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCommentMutation.mutate(c.id)}
                              className="text-[10px] text-neutral-400 hover:text-red-600 px-1 py-0.5 rounded"
                            >
                              Delete
                            </button>
                          </div>
                        </div>

                        {editingCommentId === c.id ? (
                          <div className="space-y-2 pt-1">
                            <Input
                              value={editingCommentContent}
                              onChange={(e) => setEditingCommentContent(e.target.value)}
                              autoFocus
                            />
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingCommentId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateComment(c.id)}
                                isLoading={updateCommentMutation.isPending}
                              >
                                Save
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-xs text-neutral-700 leading-relaxed pl-7 whitespace-pre-wrap">
                            {c.content}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Attachments Tab */}
            {activeTab === 'attachments' && (
              <div className="py-4 space-y-4">
                {/* Upload Action */}
                <label className="flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-neutral-300 hover:border-neutral-500 bg-neutral-50/50 hover:bg-neutral-50 transition-colors cursor-pointer text-xs text-neutral-600">
                  <Upload className="w-4 h-4 text-neutral-500" />
                  <span>Upload File / Document</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" />
                </label>

                {/* Attachments List */}
                <div className="space-y-2">
                  {!task?.attachments || task.attachments.length === 0 ? (
                    <p className="text-xs text-neutral-400 text-center py-6">No attachments uploaded</p>
                  ) : (
                    task.attachments.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-neutral-200 bg-white hover:border-neutral-300 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <FileText className="w-4 h-4 text-neutral-500 shrink-0" />
                          <div className="truncate">
                            <p className="text-xs font-medium text-neutral-900 truncate">
                              {att.fileName}
                            </p>
                            <p className="text-[10px] text-neutral-400">
                              {format(new Date(att.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={`http://localhost:5000${att.fileUrl}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs text-neutral-600 hover:text-black font-medium"
                          >
                            View
                          </a>
                          <button
                            onClick={() => deleteAttachmentMutation.mutate(att.id)}
                            className="text-neutral-400 hover:text-red-600 p-1 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Activity History Tab */}
            {activeTab === 'activity' && (
              <div className="py-4 space-y-3">
                {isActivitiesLoading ? (
                  <Skeleton className="h-16 w-full" />
                ) : !activities || activities.length === 0 ? (
                  <p className="text-xs text-neutral-400 text-center py-6">No activity history yet</p>
                ) : (
                  activities.map((act) => (
                    <div key={act.id} className="flex items-start gap-2.5 text-xs text-neutral-600">
                      <Clock className="w-3.5 h-3.5 text-neutral-400 mt-0.5 shrink-0" />
                      <div>
                        <p>
                          <span className="font-semibold text-neutral-900">
                            {act.actor?.fullName || 'User'}
                          </span>{' '}
                          {act.action.toLowerCase().replace(/_/g, ' ')}
                        </p>
                        <span className="text-[10px] text-neutral-400">
                          {formatDistanceToNow(new Date(act.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </Drawer>
  );
}
