import type { ReactNode } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

const Modal = ({ open, onClose, children }: Props) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-[420px]">
        {children}

        <button
          onClick={onClose}
          className="mt-4 w-full bg-white/10 py-2 rounded-xl hover:bg-white/20"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;