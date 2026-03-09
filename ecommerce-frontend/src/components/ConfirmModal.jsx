import { X, AlertTriangle } from "lucide-react";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, itemImg, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl transform animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="mx-auto w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>

          <h3 className="text-2xl font-black text-gray-900 mb-2">{title || "Are you sure?"}</h3>
          <p className="text-gray-500 mb-8">{message || "This action cannot be undone."}</p>

          {itemName && (
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl mb-8 border border-gray-100">
              <img 
                src={itemImg || "https://placehold.co/100x100?text=No+Image"} 
                alt={itemName}
                className="w-16 h-16 rounded-xl object-cover shadow-sm bg-white"
              />
              <div className="text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Removing Item</p>
                <p className="text-lg font-bold text-gray-900 line-clamp-1">{itemName}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={onClose}
              className="py-4 px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-all active:scale-95"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="py-4 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-red-200 active:scale-95"
            >
              Yes, Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
