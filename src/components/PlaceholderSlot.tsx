import styles from "./PlaceholderSlot.module.css";

type PlaceholderSlotProps = {
  label: string;
  text: string;
  variant?: "block" | "logo";
};

/**
 * A clearly marked empty slot for content that is not ready yet, such as a
 * client testimonial or logo. Dashed pixel border, mono label.
 * Shown only while site.showPlaceholderSlots is true.
 */
export function PlaceholderSlot({ label, text, variant = "block" }: PlaceholderSlotProps) {
  return (
    <div className={`${styles.slot} ${styles[variant]}`}>
      <p className={styles.label}>{label}</p>
      <p className={styles.text}>{text}</p>
    </div>
  );
}
