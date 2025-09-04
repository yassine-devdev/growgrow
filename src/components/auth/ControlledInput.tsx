import React from "react";
import {
  Control,
  Controller,
  FieldError,
  FieldErrorsImpl,
  Merge,
} from "react-hook-form";

interface ControlledInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  control: Control<any>;
  name: string;
  label: string;
  error?: FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

const ControlledInput: React.FC<ControlledInputProps> = ({
  control,
  name,
  label,
  type = "text",
  error,
  ...props
}) => {
  return (
    <div className="relative">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <input
            {...field}
            {...props}
            type={type}
            id={name}
            className={`w-full px-4 py-3 text-sm border rounded-lg focus:outline-none focus:ring-2 transition-all peer ${error ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-brand-primary focus:border-brand-primary"} bg-transparent`}
            placeholder=" "
          />
        )}
      />
      <label
        htmlFor={name}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1
                ${error ? "text-red-600" : "text-gray-500 peer-focus:text-brand-primary"}`}
      >
        {label}
      </label>
      {error && (
        <p className="text-red-600 text-xs mt-1">
          {typeof (error as any).message === "string"
            ? (error as any).message
            : ""}
        </p>
      )}
    </div>
  );
};

export default ControlledInput;
