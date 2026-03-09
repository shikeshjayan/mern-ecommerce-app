import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeFromCart, updateQuantity } from "../../store/cartSlice";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";
import { loadStripe } from "@stripe/stripe-js";
import { makePayment as makePaymentApi } from "../../services/axiosApi";

// ✅ FIXED: Stripe promise OUTSIDE component (no warnings!)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH_KEY);

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Auth selector for login check
  const { cartItems, totalItems, totalAmount } = useSelector(
    (state) => state.cart,
  );
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const handleOpenModal = (id, name, img) => {
    setItemToDelete({ id, name, img });
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(removeFromCart(itemToDelete.id));
      setModalOpen(false);
      setItemToDelete(null);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateQuantity({ productId: id, quantity }));
  };

  // ✅ PERFECT: Auth + Loading + Error handling
  const makePayment = async () => {
    if (!isAuthenticated || !user) {
      alert("Please login to checkout!");
      navigate("/login");
      return;
    }

    if (totalItems === 0) {
      alert("Your cart is empty!");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🛒 Checkout started for:", user.email);

      const body = { products: cartItems };
      const response = await makePaymentApi(body);

      console.log("✅ Full response:", response);

      // ✅ FIXED 2026 STRIPE API
      if (response.url) {
        // Backend returns session.url (NEW standard)
        window.location.href = response.url;
      } else if (response.sessionId) {
        // Fallback (deprecated but works)
        const stripe = await stripePromise;
        await stripe.redirectToCheckout({ sessionId: response.sessionId });
      } else {
        throw new Error("No session URL or ID received");
      }
    } catch (error) {
      console.error("❌ Payment error:", error);
      const errorMsg =
        error.response?.data?.error || error.message || "Payment failed";
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-orange-50 p-8 rounded-full mb-6 animate-pulse">
          <ShoppingCart className="w-20 h-20 text-orange-500" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Your cart feels a bit light...
        </h2>
        <p className="text-gray-500 max-w-md mb-8">
          Looks like you haven't added anything to your cart yet. Explore our
          latest products and find something you love!
        </p>
        <Link
          to="/products"
          className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200 transform hover:-translate-y-1"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const NO_IMAGE_SVG = "https://placehold.co/150x150?text=No+Image";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Column: Cart Items */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Your Cart
              <span className="ml-3 bg-orange-100 text-orange-600 text-sm py-1 px-3 rounded-full">
                {totalItems} items
              </span>
            </h1>
            <Link
              to="/products"
              className="text-orange-600 hover:text-orange-700 font-semibold flex items-center transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Keep Shopping
            </Link>
          </div>

          <div className="space-y-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-xl overflow-hidden shadow-inner">
                  <img
                    src={item.image || NO_IMAGE_SVG}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = NO_IMAGE_SVG;
                      e.target.onError = null;
                    }}
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-orange-600 transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-gray-500 text-sm mb-2">
                        {item.category}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        handleOpenModal(item._id, item.name, item.image)
                      }
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all shadow-transparent"
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-gray-800 px-3">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-white hover:text-orange-600 hover:shadow-sm transition-all shadow-transparent"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-xl font-extrabold text-gray-900 whitespace-nowrap">
                      ${(item.price * item.quantity).toFixed(2)}
                      <span className="text-xs text-gray-400 font-normal ml-2 block sm:inline">
                        (${item.price} each)
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:w-96 space-y-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 sticky top-24">
            <h3 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">
              Order Summary
            </h3>

            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span className="font-semibold text-gray-900">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-600 font-bold uppercase text-sm">
                  FREE
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-semibold text-gray-900">$0.00</span>
              </div>
              <div className="h-px bg-gray-200 my-4"></div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900">Total</span>
                <span className="text-3xl font-black text-orange-600">
                  ${totalAmount.toFixed(2)}
                </span>
              </div>
            </div>

            {/* ✅ PERFECT: Loading + Auth + Disabled states */}
            <button
              onClick={makePayment}
              disabled={isLoading || totalItems === 0 || !isAuthenticated}
              className="w-full bg-linear-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 text-white py-5 px-6 rounded-2xl font-black text-lg shadow-xl shadow-orange-100/50 hover:shadow-2xl hover:shadow-orange-200/60 active:scale-[0.98] transition-all duration-200 mb-6 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
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
              ) : !isAuthenticated ? (
                "Login to Checkout"
              ) : totalItems === 0 ? (
                "Cart Empty"
              ) : (
                "Proceed to Checkout"
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-medium bg-gray-50 p-3 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-green-500 flex shrink-0" />
              <span>Secure checkout powered by Stripe</span>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Confirm Delete Modal */}
      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove from Cart?"
        message="This item will be permanently removed from your cart."
        itemName={itemToDelete?.name}
        itemImg={itemToDelete?.img}
      />
    </div>
  );
};

export default Cart;
