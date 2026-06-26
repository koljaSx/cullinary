import type { Decision } from '../../shared/types';
import { DECISION_PRESENTATION } from '../lib/decisions';
import styles from './DecisionBadge.module.css';

interface DecisionBadgeProps {
  decision?: Decision;
  size?: 'small' | 'large';
}

export function DecisionBadge({
  decision,
  size = 'large',
}: DecisionBadgeProps) {
  if (!decision) {
    return null;
  }

  const presentation = DECISION_PRESENTATION[decision];
  const Icon = presentation.Icon;

  return (
    <div
      className={`${styles.badge} ${styles[presentation.tone]} ${styles[size]}`}
    >
      <Icon size={size === 'large' ? 28 : 16} strokeWidth={2.5} />
      <span className={styles.label}>{presentation.label}</span>
    </div>
  );
}
