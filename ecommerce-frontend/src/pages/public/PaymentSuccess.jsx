import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { clearCart } from "../../store/cartSlice";

const PaymentSuccess = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl p-10 text-center animate-fade-in transition-all">
        <div className="w-24 h-24 bg-green-100 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce transition-colors">
          <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400" />
        </div>

        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 transition-colors">
          Payment Success!
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-10 text-lg transition-colors">
          Thank you for your purchase. Your order has been placed successfully
          and is being processed.
        </p>

        <div className="space-y-4">
          <Link
            to="/profile"
            className="flex items-center justify-center gap-3 w-full bg-gray-900 dark:bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-black dark:hover:bg-orange-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
          >
            <ShoppingBag className="w-5 h-5" />
            View My Orders
          </Link>

          <Link
            to="/"
            className="flex items-center justify-center gap-3 w-full bg-orange-100 dark:bg-slate-800 text-orange-600 dark:text-orange-400 py-4 rounded-xl font-bold hover:bg-orange-200 dark:hover:bg-slate-700 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
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
