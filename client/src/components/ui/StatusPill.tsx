type Props = {
  status: 'pending' | 'draft' | 'paid';
};

export default function StatusPill({ status }: Props) {
  const colors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-400',
    draft: 'bg-slate-200 text-slate-400',
    paid: 'bg-lime-300 text-lime-600',
  };

  return (
    <span
      className={`inline-flex min-w-20 text-xs justify-center capitalize font-bold px-4 py-1 rounded-full ${colors[status]}`}
    >
      {status}
    </span>
  );
}

