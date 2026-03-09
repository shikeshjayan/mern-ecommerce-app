import { Link } from "react-router-dom";
import { XCircle, ShoppingCart, HelpCircle } from "lucide-react";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 text-center animate-fade-in transition-all">
        <div className="w-24 h-24 bg-red-100 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-8 transition-colors">
          <XCircle className="w-16 h-16 text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg transition-colors">
          Your payment was not processed. Don't worry, your cart items are still
          saved.
        </p>

        <div className="space-y-4">
          <Link
            to="/cart"
            className="flex items-center justify-center gap-3 w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingCart className="w-5 h-5" />
            Return to Cart
          </Link>

          <button
            onClick={() =>
              (window.location.href = "mailto:support@cartiqe.com")
            }
            className="flex items-center justify-center gap-3 w-full bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 py-4 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-slate-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <HelpCircle className="w-5 h-5" />
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCancel;
