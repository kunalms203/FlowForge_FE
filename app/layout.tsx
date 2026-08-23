import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/src/providers/QueryProvider';
import { AuthProvider } from '@/src/context/AuthContext';

export const metadata: Metadata = {
  title: 'FlowForge — Production SaaS Project Management',
  description: 'Minimal, high-performance project and task management dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="antialiased font-sans bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white"
        suppressHydrationWarning
      >
        <QueryProvider>
          <AuthProvider>{children}</AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
