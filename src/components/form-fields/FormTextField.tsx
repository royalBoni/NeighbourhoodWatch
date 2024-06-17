import { type HTMLProps } from "react";
import { useFormContext } from "react-hook-form";
import { TextInput } from "../TextInput";
import styles from "./formtextfiel.module.css";

type FormTextFieldProps = HTMLProps<HTMLInputElement> & {
  name: string;
  label: string;
};

export const FormTextField = ({
  name,
  label,
  ...inputProps
}: FormTextFieldProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className={styles.container}>
      <label htmlFor={name} className="font-bold">
        {label}
      </label>

      <TextInput {...inputProps} {...register(name)} />
      {/* {errors[name] && typeof errors[name] === 'string' && (
        <p>{errors[name]}</p> */}
    </div>
  );
};
