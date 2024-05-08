import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}

export default function Button({ label, variant = 'primary', ...rest }: Props) {
  // const variants = {
  //   primary: 'bg-green-400 text-black hover:bg-opacity-70',
  //   secondary: 'bg-zinc-300 text-black hover:bg-opacity-70',
  //   tertiary:
  //     'border-2 border-zinc-300 bg-transparent text-black hover:text-zinc-400',
  // };
  const variants = {
    primary: 'bg-emerald-700 text-white hover:bg-green-400',
    secondary: 'bg-zinc-300 text-black hover:bg-opacity-70',
    tertiary:
      'border-2 border-zinc-300 bg-transparent text-black hover:text-zinc-400',
  };
  return (
    <button
      // className="flex h-10 px-4 py-2 rounded-lg items-center justify-center whitespace-nowrap bg-green-400 text-black font-bold text-sm cursor-hover focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
      className={`inline-flex h-10 px-4 py-2 items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${variants[variant]}`}
      {...rest}
    >
      {label}
    </button>
  );
}

