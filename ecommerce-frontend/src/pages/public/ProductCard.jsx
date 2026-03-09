import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../../store/cartSlice";
import { toggleWishlist } from "../../store/wishlistSlice";
import { Heart } from "lucide-react";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const isWishlisted = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(addToCart(product));
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    dispatch(toggleWishlist(product));
  };

  // ✅ STATIC IMAGE - NO STATE, NO LOOP
  const getImageSrc = () => {
    return product.image || "https://placehold.co/300x300?text=No+Image";
  };

  return (
    <Link
      to={`/products/${product._id}`}
      className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden">
      <div className="relative h-56 mb-6 rounded-xl overflow-hidden bg-gray-100">
        <img
          src={getImageSrc()}
          alt={product.name}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://placehold.co/300x300?text=No+Image";
          }}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <button
          onClick={handleToggleWishlist}
          className={`absolute top-3 left-3 p-2 rounded-full shadow-lg transition-all duration-300 z-10 ${
            isWishlisted 
              ? "bg-red-500 text-white" 
              : "bg-white/80 text-gray-400 hover:text-red-500 hover:bg-white"
          }`}>
          <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
        </button>

        {product.stock === 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10">
            Out of Stock
          </div>
        )}
      </div>

      <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-orange-600">
        {product.name}
      </h3>

      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-orange-600">
          ${product.price}
        </span>
        <span className="text-sm text-gray-500">
          {product.stock || 0} in stock
        </span>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={product.stock === 0}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
        {product.stock === 0 ? "Out of Stock" : (!isAuthenticated ? "Login to Add" : "Add to Cart")}
      </button>
    </Link>
  );
};

export default ProductCard;
