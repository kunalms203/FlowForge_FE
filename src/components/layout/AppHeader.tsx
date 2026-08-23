'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { Avatar } from '../ui/Avatar';
import { NotificationPopover } from './NotificationPopover';
import { LogOut, User as UserIcon, Menu, Activity } from 'lucide-react';
import Link from 'next/link';

export interface AppHeaderProps {
  onToggleMobileSidebar?: () => void;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AppHeader({ onToggleMobileSidebar, breadcrumbs }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-14 border-b border-neutral-200 bg-white/80 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left section: Mobile menu + Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        {onToggleMobileSidebar && (
          <button
            onClick={onToggleMobileSidebar}
            className="md:hidden p-1.5 rounded-lg text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        {/* Breadcrumbs */}
        <nav className="flex items-center gap-1.5 text-xs text-neutral-500 truncate">
          <Link href="/dashboard" className="hover:text-black transition-colors font-medium">
            FlowForge
          </Link>
          {breadcrumbs && breadcrumbs.length > 0 && (
            <>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <span className="text-neutral-300">/</span>
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:text-black transition-colors truncate max-w-[150px]"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-neutral-900 font-medium truncate max-w-[200px]">
                      {crumb.label}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </nav>
      </div>

      {/* Right section: System Status + Notifications + User Menu */}
      <div className="flex items-center gap-2">
        {/* System online indicator */}
        <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-full bg-neutral-100 text-neutral-600 text-[11px] border border-neutral-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>API Connected</span>
        </div>

        {/* Notification Bell */}
        <NotificationPopover />

        {/* User Dropdown */}
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-neutral-100 transition-colors focus:outline-none focus:ring-2 focus:ring-black"
          >
            <Avatar name={user?.fullName || 'User'} size="sm" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-neutral-200 shadow-xl py-1.5 z-50 animate-in fade-in-80 zoom-in-95">
              <div className="px-3.5 py-2 border-b border-neutral-100">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {user?.fullName || 'FlowForge User'}
                </p>
                <p className="text-[11px] text-neutral-500 truncate mt-0.5">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  href="/dashboard"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <Activity className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Dashboard Overview</span>
                </Link>
                <Link
                  href="/notifications"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
                >
                  <UserIcon className="w-3.5 h-3.5 text-neutral-400" />
                  <span>All Notifications</span>
                </Link>
              </div>

              <div className="border-t border-neutral-100 pt-1">
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
