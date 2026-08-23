'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import {
  useNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
} from '@/src/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/src/utils/cn';
import Link from 'next/link';

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: notifications, isLoading } = useNotifications(1, 15);
  const markReadMutation = useMarkNotificationRead();
  const markAllReadMutation = useMarkAllNotificationsRead();
  const deleteMutation = useDeleteNotification();

  const notificationList = Array.isArray(notifications)
    ? notifications
    : (notifications as any)?.notifications && Array.isArray((notifications as any).notifications)
    ? (notifications as any).notifications
    : [];

  const unreadCount = notificationList.filter((n: any) => !n.isRead).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-black ring-2 ring-white" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-white border border-neutral-200 shadow-xl py-2 z-50 animate-in fade-in-80 zoom-in-95">
          <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <h4 className="text-xs font-semibold text-neutral-900">Notifications</h4>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-medium bg-neutral-100 text-neutral-800">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllReadMutation.mutate()}
                disabled={markAllReadMutation.isPending}
                className="text-[11px] text-neutral-500 hover:text-black flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark all read</span>
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-neutral-100">
            {isLoading ? (
              <div className="p-4 text-center text-xs text-neutral-400">Loading notifications...</div>
            ) : notificationList.length === 0 ? (
              <div className="p-8 text-center text-xs text-neutral-400">
                <Bell className="w-5 h-5 mx-auto mb-2 text-neutral-300 stroke-[1.5]" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notificationList.map((item: any) => (
                <div
                  key={item.id}
                  className={cn(
                    'p-3 hover:bg-neutral-50/80 transition-colors flex items-start justify-between gap-3 group',
                    !item.isRead && 'bg-neutral-50/50 font-medium'
                  )}
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      if (!item.isRead) {
                        markReadMutation.mutate(item.id);
                      }
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      {!item.isRead && <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />}
                      <h5 className="text-xs text-neutral-900 leading-tight">{item.title}</h5>
                    </div>
                    <p className="text-[11px] text-neutral-500 mt-1 leading-normal font-normal">
                      {item.body}
                    </p>
                    <span className="text-[10px] text-neutral-400 mt-1 block font-normal">
                      {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => deleteMutation.mutate(item.id)}
                      className="p-1 rounded text-neutral-400 hover:text-red-600 hover:bg-neutral-100 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-neutral-100 mt-1 pt-2 px-3 text-center">
            <Link
              href="/notifications"
              onClick={() => setIsOpen(false)}
              className="text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors block py-1"
            >
              View all notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
