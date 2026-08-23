'use client';

import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { useCreateTask } from '@/src/hooks/useTasks';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import { Board, TaskPriority, TaskStatus } from '@/src/types';

export interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaceId: string;
  projectId: string;
  defaultBoardId: string;
  boards?: Board[];
}

export function CreateTaskModal({
  isOpen,
  onClose,
  workspaceId,
  projectId,
  defaultBoardId,
  boards,
}: CreateTaskModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('TODO');
  const [priority, setPriority] = useState<TaskPriority>('MEDIUM');
  const [boardId, setBoardId] = useState(defaultBoardId);
  const [storyPoints, setStoryPoints] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState('');
  const [error, setError] = useState('');

  const { data: workspace } = useWorkspace(workspaceId);
  const createTaskMutation = useCreateTask(workspaceId, projectId, boardId || defaultBoardId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }
    setError('');

    try {
      await createTaskMutation.mutateAsync({
        title: title.trim(),
        description: description.trim() || undefined,
        status,
        priority,
        storyPoints: storyPoints ? parseInt(storyPoints, 10) : undefined,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        assigneeId: assigneeId || undefined,
      });
      // reset form
      setTitle('');
      setDescription('');
      setStatus('TODO');
      setPriority('MEDIUM');
      setStoryPoints('');
      setDueDate('');
      setAssigneeId('');
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Task"
      description="Add a new task to your board with priority, assignee, and estimates."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Title"
          placeholder="e.g. Implement API authentication flow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          autoFocus
        />

        <Textarea
          label="Description"
          placeholder="Add details, acceptance criteria, or links..."
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {boards && boards.length > 0 && (
            <Select
              label="Column / Board"
              value={boardId}
              onChange={(e) => setBoardId(e.target.value)}
              options={boards.map((b) => ({ value: b.id, label: b.name }))}
            />
          )}

          <Select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'MEDIUM', label: 'Medium' },
              { value: 'HIGH', label: 'High' },
              { value: 'CRITICAL', label: 'Critical' },
            ]}
          />

          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            options={[
              { value: 'TODO', label: 'To Do' },
              { value: 'IN_PROGRESS', label: 'In Progress' },
              { value: 'REVIEW', label: 'In Review' },
              { value: 'DONE', label: 'Done' },
            ]}
          />

          <Select
            label="Assignee"
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

          <Input
            label="Story Points"
            type="number"
            min="0"
            max="100"
            placeholder="e.g. 3"
            value={storyPoints}
            onChange={(e) => setStoryPoints(e.target.value)}
          />

          <Input
            label="Due Date"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-100">
          <Button type="button" variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" size="sm" isLoading={createTaskMutation.isPending}>
            Create Task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
