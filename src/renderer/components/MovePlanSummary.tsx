import type { MovePlan } from '../../shared/types';
import styles from './MovePlanSummary.module.css';

interface MovePlanSummaryProps {
  movePlan?: MovePlan;
}

export function MovePlanSummary({ movePlan }: MovePlanSummaryProps) {
  if (!movePlan) {
    return null;
  }

  const conflictedItems = movePlan.items.filter((item) => item.conflict).length;

  return (
    <section aria-label="Move plan summary" className={styles.summary}>
      <div>
        <strong>{movePlan.items.length}</strong>
        <span> marked assets ready for final move planning</span>
      </div>
      <div>
        <strong>{conflictedItems}</strong>
        <span> conflicts flagged</span>
      </div>
    </section>
  );
}
