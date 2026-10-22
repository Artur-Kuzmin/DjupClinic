import type { TrackKey } from "@/i18n/dictionaries/en";
import { TrackIcon } from "@/components/pixel/TrackIcon";
import styles from "./TrackBlock.module.css";

type TrackBlockProps = {
  track: TrackKey;
  name: string;
  fit: string;
  summary: string;
  deliverablesLabel: string;
  deliverables: { title: string; text: string }[];
  className?: string;
};

/** One Startup Clinic track: who it fits, what it does, what it delivers. */
export function TrackBlock({ track, name, fit, summary, deliverablesLabel, deliverables, className }: TrackBlockProps) {
  return (
    <article className={[styles.track, className].filter(Boolean).join(" ")}>
      <TrackIcon track={track} className={styles.icon} />
      <h3 className={styles.name}>{name}</h3>
      <p className={styles.fit}>{fit}</p>
      <p className={styles.summary}>{summary}</p>
      <h4 className={styles.listLabel}>{deliverablesLabel}</h4>
      <dl className={styles.list}>
        {deliverables.map((item) => (
          <div key={item.title} className={styles.item}>
            <dt className={styles.term}>{item.title}</dt>
            <dd className={styles.detail}>{item.text}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
