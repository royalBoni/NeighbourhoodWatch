import { forwardRef } from "react";
import styles from "./textInput.module.css";

export const TextInput = forwardRef((inputProps, ref) => (
  <input ref={ref} className={styles.input} {...inputProps} />
));

// Set the display name for the component
TextInput.displayName = "TextInput";
