import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { unloadCart } from "../store/cartSlice";
import { unloadWishlist } from "../store/wishlistSlice";
import { ShoppingCart, Heart, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import apiClient from "../services/apiClient";
import LogoutConfirmationModal from "./LogoutConfirmationModal";

/* ─── Navbar ─────────────────────────────────────────────── */
const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const handleLogoutConfirm = async () => {
    try {
      await apiClient.post("/api/v1/user/logout");
      dispatch(logout());
      dispatch(unloadCart());
      dispatch(unloadWishlist());
      setShowLogout(false);
      navigate("/login");
    } catch {
      dispatch(logout());
      dispatch(unloadCart());
      dispatch(unloadWishlist());
      navigate("/login");
    }
  };

  return (
    <>
      {showLogout && (
        <LogoutConfirmationModal
          isOpen={showLogout}
          onClose={() => setShowLogout(false)}
          onConfirm={handleLogoutConfirm}
        />
      )}

      <nav className="bg-white dark:bg-slate-900 shadow-lg border-b dark:border-slate-800 sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <NavLink
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              CartiQE
            </NavLink>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-600 bg-orange-50 dark:bg-orange-950/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  }`
                }
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-orange-600 bg-orange-50 dark:bg-orange-950/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  }`
                }
              >
                Products
              </NavLink>

              {isAuthenticated && (
                <div className="flex items-center space-x-2">
                  {/* Wishlist Icon */}
                  <NavLink
                    to="/wishlist"
                    className="relative p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-950/20 transition-all group"
                  >
                    <Heart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-red-500 transition-colors" />
                    {wishlistItems.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white dark:border-slate-900">
                        {wishlistItems.length}
                      </span>
                    )}
                  </NavLink>

                  {/* Cart Icon */}
                  <NavLink
                    to="/cart"
                    className="relative p-2 rounded-full hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all group"
                  >
                    <ShoppingCart className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-orange-600 transition-colors" />
                    {totalItems > 0 && (
                      <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white dark:border-slate-900">
                        {totalItems}
                      </span>
                    )}
                  </NavLink>
                </div>
              )}

              {/* Auth Links */}
              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                  >
                    Hi, {user?.name?.split(" ")[0]}
                  </NavLink>
                  <button
                    onClick={() => setShowLogout(true)}
                    className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-orange-600 rounded-md transition-colors"
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="px-4 py-2 text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors"
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="p-1 rounded-md text-gray-700 dark:text-gray-300 hover:text-orange-600 focus:outline-none"
              >
                {mobileOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800 pb-4 transition-colors duration-300">
            <div className="px-4 pt-2 pb-3 space-y-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "text-orange-600 bg-orange-50 dark:bg-orange-950/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                Home
              </NavLink>

              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive
                      ? "text-orange-600 bg-orange-50 dark:bg-orange-950/20"
                      : "text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                  }`
                }
                onClick={() => setMobileOpen(false)}
              >
                Products
              </NavLink>

              {isAuthenticated && (
                <>
                  <NavLink
                    to="/wishlist"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="relative">
                      <Heart className="w-5 h-5" />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                          {wishlistItems.length}
                        </span>
                      )}
                    </div>
                    <span>My Wishlist</span>
                  </NavLink>

                  <NavLink
                    to="/cart"
                    className="flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {totalItems > 0 && (
                        <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                          {totalItems}
                        </span>
                      )}
                    </div>
                    <span>My Cart</span>
                  </NavLink>
                </>
              )}

              {isAuthenticated ? (
                <>
                  <NavLink
                    to="/profile"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Profile
                  </NavLink>
                  <button
                    onClick={() => setShowLogout(true)}
                    className="w-full text-left px-3 py-2 text-base font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 hover:text-orange-600 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    className="block px-3 py-2 rounded-md text-base font-semibold text-white bg-orange-600 hover:bg-orange-700 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    Sign Up
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
