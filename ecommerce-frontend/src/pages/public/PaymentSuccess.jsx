import { Link } from "react-router-dom";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";

const PaymentSuccess = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-10 text-center animate-fade-in">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          Payment Success!
        </h1>
        <p className="text-gray-600 mb-10 text-lg">
          Thank you for your purchase. Your order has been placed successfully
          and is being processed.
        </p>

        <div className="space-y-4">
          <Link
            to="/profile"
            className="flex items-center justify-center gap-3 w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-3 w-full bg-orange-100 text-orange-600 py-4 rounded-xl font-bold hover:bg-orange-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
