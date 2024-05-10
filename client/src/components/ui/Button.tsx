import clsx from 'clsx';
import { ButtonHTMLAttributes } from 'react';
import { Link, LinkProps } from 'react-router-dom';

// polymorphic link/button components in react and typescript
// https://www.totaltypescript.com/polymorphic-link-button-components-in-react-and-typescript

type ButtonOrLinkProps = {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'danger' | 'ghost';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
} & (
  | (ButtonHTMLAttributes<HTMLButtonElement> & { as?: 'button' })
  | (LinkProps & { as: 'link' })
);

const variants = {
  primary: 'text-sm text-white bg-emerald-600 hover:bg-emerald-600/70',
  secondary: 'text-sm text-white bg-gray-500 hover:bg-gray-500/70',
  tertiary:
    'text-sm border-2 border-gray-600 bg-transparent text-gray-600 hover:text-zinc-400 hover:border-gray-400',
  danger: 'text-sm text-white bg-red-500 hover:bg-red-500/70',
  ghost: 'text-md bg-transparent text-gray-500 hover:text-black px-0',
};

export default function Button({
  label,
  variant = 'primary',
  iconLeft,
  iconRight,
  ...props
}: ButtonOrLinkProps) {
  if (props.as === 'link') {
    return (
      <Link
        {...props}
        className={clsx(
          'inline-flex items-center justify-center gap-2 h-10 px-4 py-2 whitespace-nowrap rounded-lg font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible ring-gray-400',
          variants[variant]
        )}
      >
        {iconLeft && (
          <span className={variant !== 'ghost' ? '-ml-2' : ''}>{iconLeft}</span>
        )}
        {label}
        {iconRight && (
          <span className={variant !== 'ghost' ? '-mr-2' : ''}>
            {iconRight}
          </span>
        )}
      </Link>
    );
  }

  return (
    <button
      {...props}
      className={clsx(
        'inline-flex items-center justify-center gap-2 h-10 px-4 py-2 whitespace-nowrap rounded-lg text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible ring-gray-400',
        variants[variant]
      )}
    >
      {iconLeft && <span className="-ml-2">{iconLeft}</span>}
      {label}
      {iconRight && <span className="-mr-2">{iconRight}</span>}
    </button>
  );
}

