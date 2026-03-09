import { X, LogOut } from "lucide-react";

const LogoutConfirmationModal = ({ isOpen, onClose, onConfirm, title = "Sign out?", message = "You'll be logged out of your account." }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl p-7 w-full max-w-sm">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-4">
          <LogOut className="w-6 h-6 text-red-500" />
        </div>

        <h2 className="text-lg font-black text-gray-900 text-center mb-1">{title}</h2>
        <p className="text-sm text-gray-400 text-center mb-6">{message}</p>

        <div className="flex gap-2.5">
          <button onClick={onClose} className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 h-11 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm shadow-md shadow-red-100 transition-all active:scale-95">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationModal;
