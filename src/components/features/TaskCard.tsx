'use client';

import React from 'react';
import { Task } from '@/src/types';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';
import { MessageSquare, Paperclip, Calendar, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/src/utils/cn';

export interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  isDragging?: boolean;
}

export function TaskCard({ task, onClick, isDragging }: TaskCardProps) {
  const commentCount = task.comments?.length || 0;
  const attachmentCount = task.attachments?.length || 0;

  return (
    <div
      onClick={onClick}
      className={cn(
        'group relative bg-white p-3.5 rounded-lg border border-neutral-200/90 shadow-2xs hover:border-neutral-400 hover:shadow-xs transition-all cursor-pointer select-none space-y-2.5',
        isDragging && 'shadow-lg border-black rotate-1 ring-1 ring-black/10'
      )}
    >
      {/* Top row: Priority & Story Points */}
      <div className="flex items-center justify-between gap-2">
        <Badge priority={task.priority} />

        {task.storyPoints !== null && task.storyPoints !== undefined && (
          <span className="flex items-center gap-0.5 text-[10px] font-mono text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
            <Hash className="w-2.5 h-2.5" />
            <span>{task.storyPoints}</span>
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-xs font-semibold text-neutral-900 leading-snug group-hover:text-black transition-colors line-clamp-2">
        {task.title}
      </h4>

      {/* Description preview if present */}
      {task.description && (
        <p className="text-[11px] text-neutral-500 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer info: Due Date, Comments, Attachments & Assignee */}
      <div className="flex items-center justify-between pt-1 border-t border-neutral-100/80 text-[11px] text-neutral-400">
        <div className="flex items-center gap-3">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-neutral-500">
              <Calendar className="w-3 h-3" />
              <span>{format(new Date(task.dueDate), 'MMM d')}</span>
            </span>
          )}

          {commentCount > 0 && (
            <span className="flex items-center gap-1 hover:text-neutral-700">
              <MessageSquare className="w-3 h-3" />
              <span>{commentCount}</span>
            </span>
          )}

          {attachmentCount > 0 && (
            <span className="flex items-center gap-1 hover:text-neutral-700">
              <Paperclip className="w-3 h-3" />
              <span>{attachmentCount}</span>
            </span>
          )}
        </div>

        {task.assignee ? (
          <Avatar name={task.assignee.fullName} size="xs" />
        ) : (
          <span className="w-5 h-5 rounded-full border border-dashed border-neutral-300 text-neutral-300 flex items-center justify-center text-[9px]">
            ?
          </span>
        )}
      </div>
    </div>
  );
}
