import { useState } from "react";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import apiClient from "../services/apiClient";
import { Link, useNavigate } from "react-router-dom";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const Checkout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { cartItems, totalItems, totalAmount } = useSelector(
    (state) => state.cart,
  );
  const { user } = useSelector((state) => state.auth);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    if (totalItems === 0) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const orderData = {
        orderItems: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalPrice: totalAmount,
        paymentMethod: "stripe",
        status: "pending",
      };

      const orderRes = await apiClient.post("/api/v1/orders", orderData);
      const orderId = orderRes.data.data._id;

      const products = cartItems.map((item) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        description: item.description,
        image: item.image,
      }));

      const res = await apiClient.post("/api/v1/payment/makepayment", {
        products,
        orderId,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      } else if (res.data.sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
          sessionId: res.data.sessionId,
        });
        if (error) {
          setError(error.message);
        }
      } else {
        throw new Error("No session URL or ID received from Stripe");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      const errorData = err.response?.data;
      const errorMsg =
        errorData?.details ||
        errorData?.message ||
        errorData?.error ||
        err.message ||
        "Checkout failed";
      setError(`Checkout Error: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            Checkout
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 transition-colors">
            Secure checkout • {totalItems} item(s)
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Order Items */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Order Summary
            </h2>

            {cartItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg mb-4 transition-colors">
                  Your cart is empty
                </p>
                <Link
                  to="/products"
                  className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors"
                >
                  Shop Products
                </Link>
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                {cartItems.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center space-x-4 p-4 border-b border-gray-100 dark:border-slate-800 transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white truncate transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 transition-colors">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-lg text-gray-900 dark:text-white whitespace-nowrap transition-colors">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-slate-800 transition-colors">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">
              Total: ${totalAmount.toFixed(2)}
            </h2>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-900/30 text-red-800 dark:text-red-400 p-4 rounded-xl mb-6 transition-colors">
                {error}
              </div>
            )}

            <button
              onClick={handleCheckout}
              disabled={loading || totalItems === 0}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold py-5 px-6 rounded-xl shadow-xl hover:shadow-2xl dark:shadow-none transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin mr-3 h-6 w-6 inline"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : (
                "Pay Now with Stripe"
              )}
            </button>

            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl transition-colors">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center transition-colors">
                Secure payment powered by Stripe. Your information is encrypted.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/cart"
            className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-500 font-semibold text-lg transition-colors"
          >
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
