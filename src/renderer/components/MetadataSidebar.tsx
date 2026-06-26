import type { ImageAsset } from '../../shared/types';
import styles from './MetadataSidebar.module.css';

interface MetadataSidebarProps {
  asset?: ImageAsset;
  visible: boolean;
}

export function MetadataSidebar({ asset, visible }: MetadataSidebarProps) {
  if (!visible) {
    return null;
  }

  return (
    <aside aria-label="Image metadata" className={styles.sidebar}>
      <h2 className={styles.title}>Metadata</h2>
      {asset ? (
        <dl className={styles.definitionList}>
          <div>
            <dt className={styles.label}>Filename</dt>
            <dd className={styles.description}>{asset.displayName}</dd>
          </div>
          <div>
            <dt className={styles.label}>Asset type</dt>
            <dd className={styles.description}>{asset.type.toUpperCase()}</dd>
          </div>
          <div>
            <dt className={styles.label}>Decision</dt>
            <dd className={styles.description}>
              {asset.decision ?? 'Unmarked'}
            </dd>
          </div>
          <div>
            <dt className={styles.label}>Files</dt>
            <dd className={styles.description}>
              <ul className={styles.fileList}>
                {asset.files.map((file) => (
                  <li className={styles.fileListItem} key={file.path}>
                    {file.name}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        </dl>
      ) : (
        <p>No asset selected.</p>
      )}
    </aside>
  );
}
