import { InputHTMLAttributes, forwardRef, useId } from 'react';
import { FieldError } from 'react-hook-form';

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: FieldError | undefined;
}

export const FormInput = forwardRef<HTMLInputElement, Props>(
  ({ label, name, className, error, ...props }, ref) => {
    const id = useId();

    return (
      <div className={`mb-4 min-w-sm ${className ?? ''}`}>
        {label ? (
          <label className="flex font-bold text-sm mb-1" htmlFor={id}>
            {label}
          </label>
        ) : null}
        <input
          // className="flex h-9 w-full bg-slate-300 px-3 py-1 text-sm shadow-sm placeholder:text-red focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          // className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          className="flex w-full border-2 h-10 px-4 py-2 rounded-md text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible ring-gray-400"
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

