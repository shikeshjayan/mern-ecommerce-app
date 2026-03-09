// tabs/WishlistTab.jsx
import { Link } from "react-router-dom";
import { Heart, ShoppingCart } from "lucide-react";
import WishlistCard from "../../../components/WishlistCard";

const WishlistTab = ({
  wishlistItems,
  addedAllToCart,
  onAddAll,
  onRemove,
  onAddToCart,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">
          My Wishlist
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
          {wishlistItems.length} saved item
          {wishlistItems.length !== 1 ? "s" : ""}
        </p>
      </div>
      {wishlistItems.length > 0 && (
        <button
          onClick={onAddAll}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all active:scale-95 ${
            addedAllToCart
              ? "bg-green-600 dark:bg-green-700 text-white"
              : "bg-gray-900 dark:bg-slate-800 hover:bg-black dark:hover:bg-slate-700 text-white"
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          {addedAllToCart ? "Added to Cart!" : "Add All to Cart"}
        </button>
      )}
    </div>

    {wishlistItems.length === 0 ? (
      <div className="flex flex-col items-center py-24 gap-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
        <Heart className="w-16 h-16 text-gray-200 dark:text-slate-800" />
        <h4 className="text-lg font-black text-gray-800 dark:text-white transition-colors">
          Your wishlist is empty
        </h4>
        <p className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
          Save items you love and find them here.
        </p>
        <Link
          to="/products"
          className="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-orange-900/40"
        >
          Discover Products
        </Link>
      </div>
    ) : (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistItems.map((item) => (
          <WishlistCard
            key={item._id || item.id}
            item={item}
            onRemove={onRemove}
            onAddToCart={onAddToCart}
          />
        ))}
      </div>
    )}
  </div>
);

export default WishlistTab;
