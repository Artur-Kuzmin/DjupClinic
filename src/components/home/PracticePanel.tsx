import { ButtonLink } from "@/components/ButtonLink";
import { SectionLabel } from "@/components/SectionLabel";
import styles from "./PracticePanel.module.css";

type PracticePanelProps = {
  index: number;
  practice: string;
  title: string;
  text: string;
  items: string[];
  cta: string;
  href: string;
  className?: string;
};

/**
 * One of the two doors on the welcome page. The heading names the audience;
 * the button's hit area stretches over the whole panel.
 */
export function PracticePanel({
  index,
  practice,
  title,
  text,
  items,
  cta,
  href,
  className,
}: PracticePanelProps) {
  return (
    <article className={[styles.panel, "card-hover", className].filter(Boolean).join(" ")}>
      <SectionLabel index={index}>{practice}</SectionLabel>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.text}>{text}</p>
      <ul role="list" className={styles.items}>
        {items.map((item) => (
          <li key={item} className={styles.item}>
            {item}
          </li>
        ))}
      </ul>
      <div className={styles.action}>
        <ButtonLink href={href} variant="secondary" stretched>
          {cta}
        </ButtonLink>
      </div>
    </article>
  );
}
