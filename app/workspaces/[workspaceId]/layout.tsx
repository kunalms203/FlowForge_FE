import React from 'react';

export function generateStaticParams() {
  return [{ workspaceId: 'default' }];
}

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
