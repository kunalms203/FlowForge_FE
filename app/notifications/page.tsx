'use client';

import React, { useState } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/src/hooks/useNotifications';
import { Button } from '@/src/components/ui/Button';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Bell, CheckCheck, Trash2, Check } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/src/utils/cn';

export default function NotificationsPage() {
  const [page, setPage] = useState(1);
  const { data: notifications, isLoading } = useNotifications(page, 30);

  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const notificationList = Array.isArray(notifications)
    ? notifications
    : (notifications as any)?.notifications && Array.isArray((notifications as any).notifications)
    ? (notifications as any).notifications
    : [];

  const unreadCount = notificationList.filter((n: any) => !n.isRead).length;

  return (
    <AppLayout breadcrumbs={[{ label: 'Notifications' }]}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Notifications</h1>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-neutral-900 text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-xs text-neutral-500 mt-0.5">
              System alerts, task assignments, and activity updates.
            </p>
          </div>

          {unreadCount > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => markAllReadMutation.mutate()}
              isLoading={markAllReadMutation.isPending}
            >
              <CheckCheck className="w-3.5 h-3.5 mr-1" /> Mark all read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs divide-y divide-neutral-100 overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : notificationList.length === 0 ? (
            <div className="p-16 text-center text-xs text-neutral-400">
              <Bell className="w-8 h-8 mx-auto mb-2 text-neutral-300 stroke-[1.5]" />
              <h3 className="font-semibold text-neutral-900 text-sm">No notifications</h3>
              <p className="text-neutral-500 mt-1">You are all caught up!</p>
            </div>
          ) : (
            notificationList.map((item: any) => (
              <div
                key={item.id}
                className={cn(
                  'p-4 flex items-start justify-between gap-4 hover:bg-neutral-50/60 transition-colors group',
                  !item.isRead && 'bg-neutral-50/40'
                )}
              >
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="mt-1">
                    {!item.isRead ? (
                      <span className="w-2 h-2 rounded-full bg-black block" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-neutral-200 block" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-neutral-900">{item.title}</h3>
                    <p className="text-xs text-neutral-600 mt-0.5 leading-relaxed">{item.body}</p>
                    <span
                      className="text-[10px] text-neutral-400 mt-1.5 block"
                      title={format(new Date(item.createdAt), 'PPP p')}
                    >
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!item.isRead && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => markReadMutation.mutate(item.id)}
                      className="h-7 px-2 text-[11px]"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Read
                    </Button>
                  )}
                  <button
                    onClick={() => deleteMutation.mutate(item.id)}
                    className="p-1.5 rounded text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-colors"
                    title="Delete notification"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppLayout>
  );
}
