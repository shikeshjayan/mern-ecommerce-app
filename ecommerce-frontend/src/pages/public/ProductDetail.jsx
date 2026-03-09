import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "../../store/cartSlice";
import { toggleWishlist } from "../../store/wishlistSlice";
import {
  ShoppingCart,
  ChevronLeft,
  Star,
  Package,
  Shield,
  Truck,
  Heart,
  Share2,
  ArrowRight,
} from "lucide-react";
import apiClient from "../../services/apiClient";

/* ─── tiny utility ─────────────────────────────────────── */
const formatPrice = (p) => Number(p).toFixed(2);

/* ─── sub-components ────────────────────────────────────── */

const Badge = ({ children, variant = "default" }) => {
  const styles = {
    default:
      "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-400",
    success:
      "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400",
    muted: "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide uppercase ${styles[variant]}`}
    >
      {children}
    </span>
  );
};

const StarRating = ({ rating = 4.5, count = 0 }) => (
  <div className="flex items-center gap-2">
    <div className="flex">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          className={`w-4 h-4 ${s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 dark:text-slate-700 fill-gray-200 dark:fill-slate-700"}`}
        />
      ))}
    </div>
    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
      {rating.toFixed(1)}
    </span>
    {count > 0 && (
      <span className="text-sm text-gray-400 dark:text-gray-500">
        ({count} reviews)
      </span>
    )}
  </div>
);

const Perks = () => (
  <div className="grid grid-cols-3 gap-3 py-5 border-y border-gray-100 dark:border-slate-800">
    {[
      { icon: Truck, label: "Free Shipping", sub: "Orders over $50" },
      { icon: Shield, label: "2-Year Warranty", sub: "Full coverage" },
      { icon: Package, label: "Easy Returns", sub: "30-day policy" },
    ].map(({ icon: Icon, label, sub }) => (
      <div
        key={label}
        className="flex flex-col items-center text-center gap-1.5 p-3 rounded-xl bg-gray-50 dark:bg-slate-900/50 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors group"
      >
        <Icon className="w-5 h-5 text-orange-500 group-hover:scale-110 transition-transform" />
        <span className="text-xs font-semibold text-gray-800 dark:text-gray-200 leading-tight">
          {label}
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">{sub}</span>
      </div>
    ))}
  </div>
);

const SimilarCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [imgErr, setImgErr] = useState(false);
  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const inCart = cartItems.some((item) => item._id === product._id);

  const handleToggle = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) return navigate("/login");

    if (inCart) {
      dispatch(removeFromCart(product._id));
    } else {
      dispatch(addToCart(product));
    }
  };

  return (
    <div
      onClick={() => navigate(`/products/${product._id || product.id}`)}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-slate-800 hover:border-orange-200 dark:hover:border-orange-900 hover:-translate-y-1"
    >
      {/* image */}
      <div className="relative h-44 overflow-hidden bg-gray-50 dark:bg-slate-800">
        <img
          src={
            imgErr
              ? "https://placehold.co/400x400?text=No+Image"
              : product.image
          }
          alt={product.name}
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {/* quick-add overlay */}
        <button
          onClick={handleToggle}
          className={`absolute bottom-3 right-3 p-2 rounded-xl shadow-lg transition-all duration-200
            ${
              inCart
                ? "bg-emerald-500 scale-95"
                : "bg-white dark:bg-slate-800 hover:bg-orange-500 hover:text-white opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
            } ${inCart ? "text-white" : "text-gray-700 dark:text-gray-300"}`}
          title={inCart ? "Remove from cart" : "Add to cart"}
        >
          {inCart ? (
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* info */}
      <div className="p-4">
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1 font-medium">
          {product.category || "Product"}
        </p>
        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-2 group-hover:text-orange-600 transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-orange-600 font-black text-base">
            ${formatPrice(product.price)}
          </span>
          <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </div>
  );
};

/* ─── skeleton loaders ───────────────────────────────────── */
const Skeleton = ({ className }) => (
  <div
    className={`animate-pulse bg-gradient-to-r from-gray-100 dark:from-slate-800 via-gray-200 dark:via-slate-700 to-gray-100 dark:to-slate-800 bg-size-[200%_100%] rounded-xl ${className}`}
    style={{
      animation: "shimmer 1.5s infinite linear",
      backgroundPosition: "200% 0",
    }}
  />
);

/* ─── main component ─────────────────────────────────────── */
const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isWishlisted = product
    ? wishlistItems.some((item) => item._id === product._id)
    : false;

  /* fetch main product */
  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setImageError(false);
        setQty(1);
        setAddedToCart(false);
        const response = await apiClient.get(`/api/v1/products/${id}`);
        setProduct(response.data.data);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  /* fetch similar products once main product is known */
  useEffect(() => {
    if (!product) return;
    const fetchSimilar = async () => {
      try {
        setLoadingSimilar(true);
        // Try category-based filtering; fall back to generic list
        const params = product.category
          ? { category: product.category, limit: 4 }
          : { limit: 4 };
        const res = await apiClient.get("/api/v1/products", { params });
        const all = res.data.data ?? res.data ?? [];
        // Exclude current product
        setSimilar(
          all.filter((p) => String(p._id || p.id) !== String(id)).slice(0, 4),
        );
      } catch (err) {
        console.error("Error fetching similar products:", err);
      } finally {
        setLoadingSimilar(false);
      }
    };
    fetchSimilar();
  }, [product, id]);

  /* handlers */
  const handleAddToCart = () => {
    if (!product) return;
    if (!isAuthenticated) return navigate("/login");
    for (let i = 0; i < qty; i++) dispatch(addToCart(product));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2200);
  };

  /* ── loading skeleton ── */
  if (loading)
    return (
      <div className="min-h-screen bg-[#faf9f7] dark:bg-slate-950 py-10 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6">
          <Skeleton className="h-5 w-32 mb-10" />
          <div className="grid md:grid-cols-2 gap-14">
            <Skeleton className="h-[480px] w-full" />
            <div className="space-y-5">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>
    );

  /* ── not found ── */
  if (!product)
    return (
      <div className="min-h-screen bg-[#faf9f7] dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center space-y-4">
          <Package className="w-16 h-16 text-gray-300 dark:text-slate-700 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300">
            Product not found
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-orange-600 hover:underline font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back to Products
          </Link>
        </div>
      </div>
    );

  const stockLevel = product.stock ?? 99;
  const isLowStock = stockLevel > 0 && stockLevel <= 10;
  const isOutOfStock = stockLevel === 0;

  return (
    <div className="min-h-screen bg-[#faf9f7] dark:bg-slate-950 transition-colors duration-300">
      {/* shimmer keyframe */}
      <style>{`@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}`}</style>

      {/* ── breadcrumb ── */}
      <div className="max-w-6xl mx-auto px-6 pt-8 pb-2">
        <Link
          to="/products"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-orange-600 transition-colors font-medium group"
        >
          <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Products
        </Link>
      </div>

      {/* ── product section ── */}
      <section className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-14 items-start">
          {/* LEFT – image gallery */}
          <div className="space-y-4 md:sticky md:top-8">
            <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 shadow-xl border border-gray-100 dark:border-slate-800 group aspect-square">
              <img
                src={
                  imageError
                    ? "https://placehold.co/700x700?text=No+Image"
                    : product.image
                }
                alt={product.name}
                className="w-full h-full object-cover rounded-3xl group-hover:scale-105 transition-transform duration-500"
                onError={() => setImageError(true)}
              />

              {/* badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <Badge>New</Badge>}
                {isLowStock && (
                  <Badge variant="success">Only {stockLevel} left</Badge>
                )}
                {isOutOfStock && <Badge variant="muted">Out of stock</Badge>}
                {product.discount && (
                  <span className="bg-orange-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    -{product.discount}%
                  </span>
                )}
              </div>

              {/* wishlist */}
              <button
                onClick={() => {
                  if (!isAuthenticated) return navigate("/login");
                  dispatch(toggleWishlist(product));
                }}
                className={`absolute top-4 right-4 p-2.5 rounded-xl shadow-md backdrop-blur-sm transition-all
                  ${isWishlisted ? "bg-red-500 text-white" : "bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-gray-500 hover:text-red-400"}`}
                title={
                  isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                }
              >
                <Heart
                  className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`}
                />
              </button>
            </div>
          </div>

          {/* RIGHT – info */}
          <div className="space-y-6">
            {/* category + share */}
            <div className="flex items-center justify-between">
              {product.category && (
                <span className="text-xs font-bold text-orange-500 uppercase tracking-widest">
                  {product.category}
                </span>
              )}
              <button
                onClick={() =>
                  navigator.share?.({
                    title: product.name,
                    url: window.location.href,
                  })
                }
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black text-gray-900 dark:text-white leading-tight tracking-tight">
              {product.name}
            </h1>

            {/* rating */}
            <StarRating
              rating={product.rating ?? 4.5}
              count={product.reviewCount ?? 0}
            />

            {/* price */}
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-orange-600">
                ${formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-lg text-gray-400 line-through font-medium">
                  ${formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* description */}
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-[0.95rem]">
              {product.description}
            </p>

            {/* perks */}
            <Perks />

            {/* qty + CTA */}
            <div className="space-y-3">
              {/* qty selector */}
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Quantity
                </span>
                <div className="flex items-center border border-gray-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 shadow-sm">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-lg font-bold"
                    disabled={qty <= 1}
                  >
                    −
                  </button>
                  <span className="w-10 text-center font-bold text-gray-900 dark:text-white tabular-nums">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-lg font-bold"
                    disabled={isOutOfStock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full flex items-center justify-center gap-3 font-bold py-4 px-8 rounded-2xl text-white
                  shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 text-base
                  ${
                    isOutOfStock
                      ? "bg-gray-300 dark:bg-slate-800 text-gray-500 cursor-not-allowed"
                      : addedToCart
                        ? "bg-emerald-500 shadow-emerald-200 dark:shadow-emerald-950/40"
                        : "bg-orange-600 hover:bg-orange-700 shadow-orange-200 dark:shadow-orange-950/40"
                  }`}
              >
                {addedToCart ? (
                  <>
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    {isOutOfStock
                      ? "Out of Stock"
                      : `Add to Cart${qty > 1 ? ` (${qty})` : ""}`}
                  </>
                )}
              </button>
            </div>

            {/* stock warning */}
            {isLowStock && (
              <p className="text-sm text-amber-600 font-medium flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                Hurry! Only {stockLevel} units left in stock.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* ── similar products ── */}
      <section className="max-w-6xl mx-auto px-6 py-10 border-t border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white">
              You Might Also Like
            </h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
              More products you may enjoy
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-semibold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
          >
            View all
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {loadingSimilar ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-44 rounded-2xl" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : similar.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => (
              <SimilarCard key={p._id || p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Package className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No similar products found.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductDetail;
