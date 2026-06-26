import { ImageOff } from 'lucide-react';

import type { ImageAsset } from '../../shared/types';
import { DecisionBadge } from './DecisionBadge';
import styles from './ReviewSurface.module.css';

interface ReviewSurfaceProps {
  asset?: ImageAsset;
  loupeEnabled: boolean;
}

export function ReviewSurface({ asset, loupeEnabled }: ReviewSurfaceProps) {
  if (!asset) {
    return (
      <main className={`${styles.surface} ${styles.empty}`}>
        <ImageOff size={40} />
        <p>Choose a folder to begin sorting.</p>
      </main>
    );
  }

  return (
    <main className={`${styles.surface} ${loupeEnabled ? styles.loupe : ''}`}>
      <div className={styles.stage}>
        {asset.preview.url ? (
          <img
            alt={asset.displayName}
            className={styles.image}
            src={asset.preview.url}
          />
        ) : (
          <div className={styles.placeholder}>
            <ImageOff size={44} />
            <span>RAW preview pending</span>
          </div>
        )}
        <DecisionBadge decision={asset.decision} />
      </div>
    </main>
  );
}
