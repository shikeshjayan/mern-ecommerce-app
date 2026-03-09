import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getProducts } from "../../services/axiosApi";
import { addToCart } from "../../store/cartSlice";
import apiClient from "../../services/apiClient";

const categories = [
  { name: "Electronics", icon: "⚡", slug: "electronics" },
  { name: "Fashion", icon: "👕", slug: "fashion" },
  { name: "Home", icon: "🏠", slug: "home" },
  { name: "Sports", icon: "🏃", slug: "sports" },
];

const Home = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  // ✅ RAPIDMINER RECOMMENDATIONS - Fixed useEffect
  useEffect(() => {
    const fetchRecs = async () => {
      try {
        const res = await apiClient.get(
          "/api/v1/analytics/public-recommendations",
        );
        setRecommendations(res.data.data || []);
      } catch (error) {
        console.error("RapidMiner recs failed:", error);
        setRecommendations([]); // Graceful fallback
      }
    };
    fetchRecs();
  }, []);

  // ✅ PRODUCTS - Your existing logic
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await getProducts();
        setProducts(response.data || response.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to load products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  if (loading && recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HERO SECTION - UNCHANGED */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Shop Smarter.
            <span className="block text-orange-400">Live Better.</span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Discover thousands of quality products at unbeatable prices. Fast
            delivery. Secure checkout.
          </p>
          <Link
            to="/products"
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
          >
            Start Shopping Now
          </Link>
        </div>
      </section>

      {/* CATEGORIES - UNCHANGED */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold mb-16 text-center text-gray-900">
          Shop by Category
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {categories.map((cat) => (
            <Link
              key={cat.name}
              to={`/products?category=${cat.slug}`}
              className="group bg-white/70 backdrop-blur-sm shadow-lg rounded-2xl p-8 text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 hover:border-orange-200 hover:bg-orange-50"
            >
              <div className="text-5xl mb-6 group-hover:scale-110 transition-transform duration-300">
                {cat.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-600">
                {cat.name}
              </h3>
              <p className="text-gray-500 text-sm">Popular items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ✅ RAPIDMINER RECOMMENDATIONS - NEW & SEAMLESS */}
      {recommendations.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex items-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mr-4">
                🔮 RapidMiner Picks
              </h2>
              <span className="px-4 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-semibold">
                AI Recommended
              </span>
            </div>
            <div className="grid md:grid-cols-4 gap-8">
              {recommendations.slice(0, 8).map((product) => (
                <Link
                  key={product._id}
                  to={`/products/${product._id}`}
                  className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden"
                >
                  <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={
                        product.image ||
                        "https://placehold.co/300x300?text=AI+Pick"
                      }
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://placehold.co/300x300?text=AI+Pick";
                      }}
                    />
                    <div className="absolute top-3 left-3 bg-indigo-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                      AI Pick
                    </div>
                  </div>
                  <h3 className="font-bold text-lg mb-2 line-clamp-2 text-gray-900 group-hover:text-orange-600">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-orange-600">
                      ${product.price || 0}
                    </span>
                    <span className="text-sm text-gray-500">
                      {product.stock || 99} in stock
                    </span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Add to Cart
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRENDING PRODUCTS - UNCHANGED */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trending Products
            </h2>
            <p className="text-xl text-gray-600">Don't miss these hot deals</p>
          </div>

          {error ? (
            <div className="text-center py-16">
              <p className="text-red-600 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-4 gap-8 mb-12">
                {products.slice(0, 8).map((p) => (
                  <Link
                    key={p._id}
                    to={`/products/${p._id}`}
                    className="group bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:-translate-y-2 transition-all overflow-hidden"
                  >
                    <div className="relative h-56 mb-6 rounded-xl overflow-hidden bg-gray-100">
                      <img
                        src={
                          p.image ||
                          "https://placehold.co/300x300?text=No+Image"
                        }
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src =
                            "https://placehold.co/300x300?text=No+Image";
                        }}
                      />
                      {p.stock === 0 && (
                        <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                          Out of Stock
                        </div>
                      )}
                    </div>
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 text-gray-900 group-hover:text-orange-600">
                      {p.name}
                    </h3>
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-2xl font-bold text-orange-600">
                        ${p.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        {p.stock} in stock
                      </span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleAddToCart(p);
                      }}
                      disabled={p.stock === 0}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
                    </button>
                  </Link>
                ))}
              </div>

              <div className="text-center">
                <Link
                  to="/products"
                  className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  View All Products →
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* FEATURES - UNCHANGED */}
      <section className="bg-gray-100 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">
            Why Shop With Us?
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-orange-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-orange-200">
                🚚
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Free Shipping
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                Free delivery on orders over $50. Arrives in 2-3 days.
              </p>
            </div>
            <div className="text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-green-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-green-200">
                🔒
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Secure Payment
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                256-bit SSL encryption. Trusted by 1M+ customers worldwide.
              </p>
            </div>
            <div className="text-center group hover:-translate-y-2 transition-all duration-300">
              <div className="w-20 h-20 bg-blue-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-blue-200">
                ↩️
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">
                Easy Returns
              </h3>
              <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
                30-day hassle-free returns. Full refund guaranteed.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
