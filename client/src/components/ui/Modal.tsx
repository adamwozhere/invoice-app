import { useRef } from 'react';
import Button from './Button';

type Props = {
  open: boolean;
  title: string;
  onConfirm: () => void;
  onClose: () => void;
  children: React.ReactNode;
};

export default function Modal({
  open,
  title,
  onClose,
  onConfirm,
  children,
}: Props) {
  const dialogRef = useRef<null | HTMLDialogElement>(null);

  const closeDialog = () => {
    dialogRef.current?.close();
    onClose();
  };

  const confirmDialog = () => {
    onConfirm();
    closeDialog();
  };

  if (open) {
    dialogRef.current?.showModal();
  }

  return (
    <dialog ref={dialogRef} className="rounded-xl">
      <div className="bg-white p-8">
        <h1 className="text-lg font-bold mb-4">{title}</h1>
        {children}
        <div className="flex gap-2 mt-8">
          <Button label="Cancel" onClick={closeDialog} />
          <Button label="Delete" onClick={confirmDialog} />
        </div>
      </div>
    </dialog>
  );
}

