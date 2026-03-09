import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toggleWishlist } from "../../store/wishlistSlice";
import { addToCart } from "../../store/cartSlice";
import { Heart, ShoppingCart, Trash2, ArrowLeft, HeartOff } from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state) => state.wishlist);

  const [modalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [addedAll, setAddedAll] = useState(false);

  const handleMoveToCart = (product) => {
    dispatch(addToCart(product));
  };

  const handleAddAllToCart = () => {
    let addedCount = 0;
    wishlistItems.forEach((item) => {
      if (item.stock > 0) {
        dispatch(addToCart(item));
        addedCount++;
      }
    });
    if (addedCount > 0) {
      setAddedAll(true);
      setTimeout(() => setAddedAll(false), 2000);
    }
  };

  const handleOpenModal = (product) => {
    setItemToDelete(product);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      dispatch(toggleWishlist(itemToDelete));
      setModalOpen(false);
      setItemToDelete(null);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-red-50 p-8 rounded-full mb-6">
          <HeartOff className="w-20 h-20 text-red-400" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
          Your wishlist is empty
        </h2>
        <p className="text-gray-500 max-w-md mb-8">
          Save your favorite items here to keep an eye on them. They'll be
          waiting for you!
        </p>
        <Link
          to="/products"
          className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all shadow-lg hover:shadow-orange-200"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-4xl font-black text-gray-900 flex items-center">
          My Wishlist
          <span className="ml-4 bg-red-100 text-red-600 text-sm py-1.5 px-4 rounded-full font-bold">
            {wishlistItems.length} items
          </span>
        </h1>
        <div className="flex items-center gap-4">
          {wishlistItems.length > 0 && (
            <button
              onClick={handleAddAllToCart}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm transition-all ${
                addedAll
                  ? "bg-green-600 text-white"
                  : "bg-gray-900 text-white hover:bg-orange-600"
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedAll ? "Added to Cart!" : "Add All to Cart"}
            </button>
          )}
          <Link
            to="/products"
            className="text-gray-500 hover:text-orange-600 font-bold flex items-center transition-all group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Continue Shopping
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {wishlistItems.map((item) => (
          <div
            key={item._id}
            className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl transition-all duration-500 flex flex-col"
          >
            {/* Image Section */}
            <div className="relative h-64 overflow-hidden bg-gray-50">
              <img
                src={item.image || "https://placehold.co/400x400?text=No+Image"}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/400x400?text=No+Image";
                }}
              />
              <button
                onClick={() => handleOpenModal(item)}
                className="absolute top-4 right-4 p-2.5 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all z-10"
                title="Remove from wishlist"
              >
                <Trash2 className="w-5 h-5" />
              </button>

              <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300"></div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex-1 flex flex-col">
              <div className="mb-4">
                <p className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-1">
                  {item.category}
                </p>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-1">
                  {item.name}
                </h3>
              </div>

              <div className="mt-auto">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-black text-gray-900">
                    ${item.price}
                  </span>
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-md ${item.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                  >
                    {item.stock > 0 ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                <button
                  onClick={() => handleMoveToCart(item)}
                  disabled={item.stock === 0}
                  className="w-full flex items-center justify-center gap-3 bg-gray-900 text-white py-4 rounded-2xl font-black hover:bg-orange-600 disabled:bg-gray-200 disabled:text-gray-400 transition-all shadow-xl shadow-gray-100 hover:shadow-orange-200 transform hover:-translate-y-1"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ConfirmModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Remove from Wishlist?"
        message="This item will be removed from your saved items."
        itemName={itemToDelete?.name}
        itemImg={itemToDelete?.image}
      />
    </div>
  );
};

export default Wishlist;
