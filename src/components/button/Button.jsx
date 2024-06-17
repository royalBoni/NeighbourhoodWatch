import styles from "./button.module.css";

export const Button = ({ ...buttonProps }) => (
  <button className={styles.button} {...buttonProps} />
);
