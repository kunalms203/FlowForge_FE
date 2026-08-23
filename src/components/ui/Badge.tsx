'use client';

import React from 'react';
import { cn } from '@/src/utils/cn';
import { TaskPriority, TaskStatus, WorkspaceRole } from '@/src/types';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'outline' | 'neutral' | 'status' | 'priority' | 'role';
  status?: TaskStatus;
  priority?: TaskPriority;
  role?: WorkspaceRole;
}

export function Badge({
  className,
  variant = 'default',
  status,
  priority,
  role,
  children,
  ...props
}: BadgeProps) {
  if (status) {
    const statusStyles: Record<TaskStatus, string> = {
      TODO: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      IN_PROGRESS: 'bg-blue-50 text-blue-700 border-blue-200',
      REVIEW: 'bg-amber-50 text-amber-700 border-amber-200',
      DONE: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    };

    const statusLabels: Record<TaskStatus, string> = {
      TODO: 'To Do',
      IN_PROGRESS: 'In Progress',
      REVIEW: 'In Review',
      DONE: 'Done',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider',
          statusStyles[status],
          className
        )}
        {...props}
      >
        {children || statusLabels[status]}
      </span>
    );
  }

  if (priority) {
    const priorityStyles: Record<TaskPriority, string> = {
      LOW: 'bg-neutral-100 text-neutral-600 border-neutral-200',
      MEDIUM: 'bg-blue-50 text-blue-700 border-blue-200',
      HIGH: 'bg-orange-50 text-orange-700 border-orange-200',
      CRITICAL: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border uppercase tracking-wider',
          priorityStyles[priority],
          className
        )}
        {...props}
      >
        {children || priority}
      </span>
    );
  }

  if (role) {
    const roleStyles: Record<WorkspaceRole, string> = {
      OWNER: 'bg-black text-white border-black',
      ADMIN: 'bg-neutral-800 text-white border-neutral-800',
      MANAGER: 'bg-neutral-200 text-neutral-800 border-neutral-300',
      MEMBER: 'bg-neutral-100 text-neutral-700 border-neutral-200',
      VIEWER: 'bg-neutral-50 text-neutral-500 border-neutral-200',
    };

    return (
      <span
        className={cn(
          'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border tracking-wider uppercase',
          roleStyles[role],
          className
        )}
        {...props}
      >
        {children || role}
      </span>
    );
  }

  const variants = {
    default: 'bg-black text-white border-transparent',
    outline: 'bg-transparent text-neutral-800 border-neutral-300',
    neutral: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    status: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    priority: 'bg-neutral-100 text-neutral-700 border-neutral-200',
    role: 'bg-neutral-100 text-neutral-700 border-neutral-200',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
