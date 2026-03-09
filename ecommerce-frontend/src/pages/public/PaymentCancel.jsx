import { Link } from "react-router-dom";
import { XCircle, ShoppingCart, HelpCircle } from "lucide-react";

const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-fade-in">
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <XCircle className="w-16 h-16 text-red-500" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Payment Cancelled
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
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
            className="flex items-center justify-center gap-3 w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-bold hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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
