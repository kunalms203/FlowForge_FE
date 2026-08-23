'use client';

import React from 'react';
import { ActivityLog } from '@/src/types';
import { Avatar } from '../ui/Avatar';
import { formatDistanceToNow, format } from 'date-fns';
import { Activity, CheckCircle, PlusCircle, Trash2, Edit, Move } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';

export interface ActivityTimelineProps {
  activities?: ActivityLog[];
  isLoading?: boolean;
  emptyMessage?: string;
}

export function ActivityTimeline({
  activities,
  isLoading,
  emptyMessage = 'No activity recorded yet',
}: ActivityTimelineProps) {
  const activityList = Array.isArray(activities)
    ? activities
    : (activities as any)?.activities && Array.isArray((activities as any).activities)
    ? (activities as any).activities
    : [];

  if (isLoading) {
    return (
      <div className="space-y-4 py-2">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (activityList.length === 0) {
    return (
      <div className="py-12 text-center text-xs text-neutral-400">
        <Activity className="w-6 h-6 mx-auto mb-2 text-neutral-300 stroke-[1.5]" />
        <p>{emptyMessage}</p>
      </div>
    );
  }

  const getActionIcon = (action: string) => {
    if (action.includes('CREATE')) return PlusCircle;
    if (action.includes('UPDATE')) return Edit;
    if (action.includes('DELETE')) return Trash2;
    if (action.includes('MOVE')) return Move;
    if (action.includes('COMPLETE')) return CheckCircle;
    return Activity;
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-200">
      {activityList.map((log: any) => {
        const Icon = getActionIcon(log.action);
        return (
          <div key={log.id} className="relative flex items-start gap-3 text-xs group">
            {/* Timeline bullet / icon */}
            <div className="absolute -left-6 mt-0.5 w-5 h-5 rounded-full bg-white border border-neutral-300 flex items-center justify-center text-neutral-500 group-hover:border-black group-hover:text-black transition-colors">
              <Icon className="w-2.5 h-2.5" />
            </div>

            <Avatar name={log.actor?.fullName || 'User'} size="xs" />

            <div className="flex-1 min-w-0">
              <p className="text-neutral-900">
                <span className="font-semibold">{log.actor?.fullName || 'User'}</span>{' '}
                <span className="text-neutral-600 font-mono text-[11px] bg-neutral-100 px-1 py-0.5 rounded">
                  {log.action}
                </span>
              </p>

              {log.newValues && (
                <div className="mt-1 p-2 rounded bg-neutral-50 border border-neutral-200/60 font-mono text-[11px] text-neutral-600 truncate">
                  {JSON.stringify(log.newValues)}
                </div>
              )}

              <span
                className="text-[10px] text-neutral-400 mt-1 block"
                title={format(new Date(log.createdAt), 'PPP p')}
              >
                {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
