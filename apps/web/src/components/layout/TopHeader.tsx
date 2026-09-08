import styles from './TopHeader.module.css';

export function TopHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <span className={styles.title}>Pulse CRM</span>
        <span className={styles.badge}>DEV</span>
      </div>
      <div className={styles.right}>
        <div className={styles.avatar}>
          <span className="material-symbols-outlined icon-sm">person</span>
        </div>
      </div>
    </header>
  );
}
