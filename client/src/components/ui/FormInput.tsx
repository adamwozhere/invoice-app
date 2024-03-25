import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { FieldError } from 'react-hook-form';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error: FieldError | undefined;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, name, className, error, ...props }, ref) => {
    const id = useId();

    return (
      <div className={`mb-4 max-w-sm ${className ?? ''}`}>
        {label ? (
          <label className="font-bold text-sm" htmlFor={id}>
            {label}
          </label>
        ) : null}
        <input
          className="flex h-9 w-full bg-slate-300 px-3 py-1 text-sm shadow-sm placeholder:text-red focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          id={id}
          ref={ref}
          name={name}
          type="text"
          aria-invalid={!!error}
          {...props}
        />
        {error ? (
          <span role="alert" className="text-red-600 text-xs font-bold">
            {error.message}
          </span>
        ) : null}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

