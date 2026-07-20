import type { ReactNode } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  contentClassName?: string;
  overlayClassName?: string;
}

export function Modal({
  open,
  onClose,
  children,
  contentClassName = '',
  overlayClassName = '',
}: ModalProps) {
  return (
    <div
      className={`fixed inset-0 flex items-center justify-center p-4 overflow-y-auto z-50 transition-all duration-500 ${
        open ? '' : 'opacity-0 pointer-events-none'
      } ${overlayClassName}`}
      onClick={onClose}
      role="presentation"
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`relative transform transition-all duration-500 ${
          open ? 'scale-100' : 'scale-95'
        } ${contentClassName} my-auto`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
