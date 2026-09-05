'use client';

import React, { Suspense } from 'react';
import { AppLayout } from '@/src/components/layout/AppLayout';
import { useWorkspace } from '@/src/hooks/useWorkspaces';
import { useWorkspaceParams } from '@/src/hooks/useWorkspaceParams';
import { Avatar } from '@/src/components/ui/Avatar';
import { Badge } from '@/src/components/ui/Badge';
import { Skeleton } from '@/src/components/ui/Skeleton';
import { Users, Mail, Calendar } from 'lucide-react';
import { format } from 'date-fns';

function WorkspaceMembersContent() {
  const { workspaceId } = useWorkspaceParams();
  const { data: workspace, isLoading } = useWorkspace(workspaceId);

  return (
    <AppLayout
      breadcrumbs={[
        {
          label: workspace?.name || 'Workspace',
          href: workspaceId ? `/workspaces?workspaceId=${workspaceId}` : '/workspaces',
        },
        { label: 'Members' },
      ]}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Workspace Members</h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              People with access to this workspace and their assigned roles.
            </p>
          </div>
        </div>

        {/* Members Table Card */}
        <div className="bg-white rounded-xl border border-neutral-200 shadow-2xs overflow-hidden">
          {isLoading ? (
            <div className="p-6 space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          ) : !workspace?.members || workspace.members.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400">
              <Users className="w-8 h-8 mx-auto mb-2 text-neutral-300 stroke-[1.5]" />
              <p>No members found in this workspace</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-neutral-200/80 bg-neutral-50/60 text-neutral-500 text-[11px] font-semibold uppercase tracking-wider">
                    <th className="py-3 px-4">Member</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {workspace.members.map((member: any, index: number) => {
                    const user = member.user || { fullName: 'Member', email: 'N/A' };
                    return (
                      <tr
                        key={member.id || index}
                        className="hover:bg-neutral-50/50 transition-colors"
                      >
                        <td className="py-3 px-4 flex items-center gap-2.5">
                          <Avatar name={user.fullName} size="sm" />
                          <span className="font-semibold text-neutral-900">{user.fullName}</span>
                        </td>
                        <td className="py-3 px-4 text-neutral-500">
                          <span className="flex items-center gap-1.5">
                            <Mail className="w-3 h-3 text-neutral-400" />
                            <span>{user.email}</span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <Badge role={member.role} />
                        </td>
                        <td className="py-3 px-4 text-neutral-400">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-neutral-300" />
                            <span>
                              {member.joinedAt
                                ? format(new Date(member.joinedAt), 'MMM d, yyyy')
                                : 'Initial'}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

export default function WorkspaceMembersPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <Skeleton className="h-64 w-full" />
        </div>
      }
    >
      <WorkspaceMembersContent />
    </Suspense>
  );
}
