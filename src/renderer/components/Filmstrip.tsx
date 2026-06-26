import type { ImageAsset } from '../../shared/types';
import { DecisionBadge } from './DecisionBadge';
import styles from './Filmstrip.module.css';

interface FilmstripProps {
  assets: ImageAsset[];
  currentAssetId?: string;
  onSelectAsset: (assetId: string) => void;
}

export function Filmstrip({
  assets,
  currentAssetId,
  onSelectAsset,
}: FilmstripProps) {
  return (
    <section aria-label="Photo filmstrip" className={styles.filmstrip}>
      {assets.map((asset) => {
        const isCurrent = asset.id === currentAssetId;

        return (
          <button
            aria-label={`Show ${asset.displayName}`}
            className={`${styles.item} ${isCurrent ? styles.current : ''}`}
            key={asset.id}
            onClick={() => onSelectAsset(asset.id)}
            type="button"
          >
            {asset.preview.url ? (
              <img
                alt=""
                className={styles.image}
                decoding="async"
                loading={isCurrent ? 'eager' : 'lazy'}
                src={asset.preview.url}
              />
            ) : (
              <div className={styles.placeholder}>
                {asset.type.toUpperCase()}
              </div>
            )}
            <DecisionBadge decision={asset.decision} size="small" />
          </button>
        );
      })}
    </section>
  );
}
