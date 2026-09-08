import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="pl-16">
        <TopHeader />
        <main className="pt-14 w-full min-h-screen bg-background">{children}</main>
      </div>
    </div>
  );
}
