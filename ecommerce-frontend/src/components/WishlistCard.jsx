// components/WishlistCard.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, CheckCircle } from "lucide-react";
import { fmt } from "./ProfileUI";

const WishlistCard = ({ item, onRemove, onAddToCart }) => {
  const [imgErr, setImgErr] = useState(false);
  const [added, setAdded] = useState(false);

  const handleCart = (e) => {
    e.preventDefault();
    onAddToCart(item);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl group transition-all duration-300 hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={imgErr ? "https://placehold.co/400x400?text=No+Image" : item.image}
          alt={item.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={() => onRemove(item)}
          className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-xl text-red-400 hover:text-red-600 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-all"
          title="Remove from wishlist"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-4">
        <p className="font-bold text-gray-800 text-sm line-clamp-1 mb-1">{item.name}</p>
        <p className="text-orange-600 font-black text-xl mb-4">${fmt(item.price)}</p>
        <div className="flex gap-2">
          <Link
            to={`/products/${item._id || item.id}`}
            className="flex-1 h-10 flex items-center justify-center text-xs font-black text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            View
          </Link>
          <button
            onClick={handleCart}
            className={`flex-1 h-10 flex items-center justify-center gap-1.5 text-xs font-black rounded-xl transition-all
              ${added ? "bg-emerald-500 text-white" : "bg-gray-900 hover:bg-black text-white"}`}
          >
            {added ? (
              <><CheckCircle className="w-3.5 h-3.5" /> Added</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;