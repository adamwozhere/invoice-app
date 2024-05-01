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
    <dialog ref={dialogRef}>
      <div>
        <h1>{title}</h1>
        {children}
        <div>
          <Button label="Cancel" onClick={closeDialog} />
          <Button label="Confirm" onClick={confirmDialog} />
        </div>
      </div>
    </dialog>
  );
}

