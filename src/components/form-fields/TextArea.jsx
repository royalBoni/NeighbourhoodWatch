import { useFormContext } from "react-hook-form";
import styles from "./textArea.module.css";

/**
 * NOTE: This component is ready to use when wrapped with FormProvider from RHF
 */
export const FormTextArea = ({ name, label, validateFn, ...textProps }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.container}>
      <label htmlFor={name} className="font-bold">
        {label}
      </label>

      <textarea
        {...register(name)}
        id={name}
        cols={10}
        rows={10}
        {...register(`${name}`, {
          /* required: `${name} is required`, */
          validate: validateFn,
        })}
      ></textarea>
      {errors[name] && <p style={{ color: "red" }}>{errors[name].message}</p>}
    </div>
  );
};
