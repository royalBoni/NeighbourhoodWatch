import { type DetailedHTMLProps, type SelectHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type SelectProps = DetailedHTMLProps<
  SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
> & {
  options?: string[] | undefined;
  name: string;
  label: string;
};

export const Select = ({
  label,
  name,
  defaultValue,
  options,
  ...selectProps
}: SelectProps) => {
  const { register } = useFormContext();
  const isLoading = options === undefined;

  return (
    <div className="flex flex-col gap-2 w-full">
      <label htmlFor={name} className="font-bold">
        {label}
      </label>
      <select
        className="w-full cursor-pointer appearance-none rounded-lg bg-slate-50 px-3 py-1.5 shadow"
        id={name}
        disabled={isLoading}
        {...register(name)}
        {...selectProps}
      >
        {defaultValue && options && <option>{defaultValue}</option>}
        {options?.map((movieType) => (
          <option key={movieType} value={movieType}>
            {movieType}
          </option>
        ))}
      </select>
    </div>
  );
};
