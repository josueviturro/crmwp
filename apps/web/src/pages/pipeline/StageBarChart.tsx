import styles from './StageBarChart.module.css';

type Datum = {
  stageId: string;
  stageName: string;
  count: number;
};

export function StageBarChart({ data }: { data: Datum[] }) {
  const total = data.reduce((sum, d) => sum + d.count, 0);
  const maxCount = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className={styles.chart}>
      {data.map((d) => {
        const heightPct = (d.count / maxCount) * 100;
        const pctOfTotal = total > 0 ? Math.round((d.count / total) * 100) : 0;
        return (
          <div key={d.stageId} className={styles.column}>
            <div className={styles.barTrack}>
              <div className={styles.bar} style={{ height: `${heightPct}%` }}>
                <span className={styles.count}>{d.count}</span>
                <div className={styles.tooltip}>
                  {d.count} contacto{d.count === 1 ? '' : 's'} ({pctOfTotal}%)
                </div>
              </div>
            </div>
            <span className={styles.stageName} title={d.stageName}>
              {d.stageName}
            </span>
          </div>
        );
      })}
    </div>
  );
}
