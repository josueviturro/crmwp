import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import styles from './AppShell.module.css';

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.content}>
        <TopHeader />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}
