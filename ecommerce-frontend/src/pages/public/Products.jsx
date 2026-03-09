import { useState, useEffect, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts";
import {
  ShoppingCart,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import ProductCard from "./ProductCard";

const PAGE_SIZE = 12;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // ── All filter/sort/page state lives in the URL ──────────────────────────
  // This avoids any setState-in-effect or ref-during-render issues entirely.
  const currentPage = Number(searchParams.get("page") || 1);
  const selectedCategory = searchParams.get("category") || "all";
  const sortBy = searchParams.get("sort") || "newest";
  const debouncedSearch = searchParams.get("keyword") || "";

  // Local state only for the raw (un-debounced) search input
  const [searchTerm, setSearchTerm] = useState(debouncedSearch);

  // Debounce: write keyword to URL after 300 ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== debouncedSearch) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          if (searchTerm) {
            next.set("keyword", searchTerm);
          } else {
            next.delete("keyword");
          }
          next.set("page", "1");
          return next;
        });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch, setSearchParams]);

  const handleCategoryChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === "all") {
          next.delete("category");
        } else {
          next.set("category", value);
        }
        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const handleSortChange = useCallback(
    (value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        if (value === "newest") {
          next.delete("sort");
        } else {
          next.set("sort", value);
        }
        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  const goToPage = useCallback(
    (page) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        next.set("page", String(page));
        return next;
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setSearchParams],
  );

  // ── Build API params from URL state ─────────────────────────────────────
  const apiParams = {
    page: currentPage,
    limit: PAGE_SIZE,
    ...(debouncedSearch && { keyword: debouncedSearch }),
    ...(selectedCategory !== "all" && { category: selectedCategory }),
    ...(sortBy === "price-low" && { sort: "price_low" }),
    ...(sortBy === "price-high" && { sort: "price_high" }),
  };

  const { products, pagination, loading, error } = useProducts(apiParams);

  // ── Derive category list purely from current products (no side-effects) ──
  const dynamicCategories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  // ── Pagination helpers ───────────────────────────────────────────────────
  const totalPages = pagination.pages || 1;
  const totalProducts = pagination.total || 0;

  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }
    if (currentPage >= totalPages - 3) {
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-center bg-white dark:bg-slate-900 p-10 rounded-2xl shadow-lg max-w-md mx-4 border border-gray-100 dark:border-slate-800">
          <div className="bg-red-100 text-red-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Oops! Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-800 p-4 rounded-xl text-left border border-gray-100 dark:border-slate-700">
            <p className="font-semibold text-gray-700 dark:text-gray-200 mb-1">
              How to fix this:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Make sure your backend server is running</li>
              <li>Check if it&apos;s listening on port 5000</li>
              <li>Wait a moment and try refreshing the page</li>
            </ul>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 w-full bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen py-0 transition-colors duration-300">
      <div className="max-w-screen mx-auto px-6">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4 mt-8">
          <Link
            to="/"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            All Products{" "}
            <span className="text-2xl text-gray-500 dark:text-gray-400 font-normal">
              ({totalProducts})
            </span>
          </h1>
        </div>

        {/* CONTROLS */}
        <div className="bg-white dark:bg-slate-900 shadow-lg rounded-2xl p-6 mb-8 border border-gray-200 dark:border-slate-800 transition-colors duration-300">
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
            {/* Search */}
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center flex-wrap">
              <div className="flex gap-2 items-center text-sm text-gray-700 dark:text-gray-300">
                <Filter className="w-4 h-4" />
                <select
                  value={selectedCategory}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white capitalize"
                >
                  {dynamicCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              </div>

              <span className="text-sm text-gray-500 hidden sm:inline">|</span>

              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="border border-gray-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Results info */}
          {totalProducts > 0 && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 transition-colors">
              Showing{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, totalProducts)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-gray-700 dark:text-gray-200">
                {totalProducts}
              </span>{" "}
              products
            </p>
          )}
        </div>

        {/* PRODUCTS GRID */}
        {products.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-12 mb-8 flex-wrap">
                {/* First page */}
                <button
                  onClick={() => goToPage(1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="First page"
                >
                  <ChevronsLeft className="w-4 h-4" />
                </button>

                {/* Previous page */}
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((page, idx) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${idx}`}
                      className="px-2 text-gray-400 select-none"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`w-10 h-10 rounded-lg border font-semibold text-sm transition-all ${
                        currentPage === page
                          ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-200 dark:shadow-orange-950/40"
                          : "border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-700 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 hover:text-orange-600"
                      }`}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next page */}
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Last page */}
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-600 dark:text-gray-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 hover:border-orange-300 hover:text-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  title="Last page"
                >
                  <ChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        ) : (
          /* EMPTY STATE */
          <div className="text-center py-20">
            <ShoppingCart className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto mb-8 opacity-50" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No products found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Try adjusting your search or filters
            </p>
            <Link
              to="/products"
              onClick={() => setSearchTerm("")}
              className="bg-orange-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-orange-700 transition-all"
            >
              Clear Filters
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
