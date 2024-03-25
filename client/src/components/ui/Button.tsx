import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
}

export default function Button({ label, ...rest }: Props) {
  return (
    <button
      className="h-9 px-4 py-2 rounded-tl-lg rounded-br-lg inline-flex items-center justify-center whitespace-nowrap bg-green-600 text-white font-bold text-sm uppercase cursor-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      {...rest}
    >
      {label}
    </button>
  );
}

