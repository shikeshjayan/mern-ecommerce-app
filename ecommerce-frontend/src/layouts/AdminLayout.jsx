import { useState, useEffect, useRef } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { unloadCart } from "../store/cartSlice";
import { unloadWishlist } from "../store/wishlistSlice";
import apiClient from "../services/apiClient";
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, LogOut, Search, Bell, Settings, Menu, X, User } from "lucide-react";
import LogoutConfirmationModal from "../components/LogoutConfirmationModal";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const searchRef = useRef(null);

  const navLinks = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Products", path: "/admin/products", icon: <Package className="h-5 w-5" /> },
    { name: "Orders", path: "/admin/orders", icon: <ShoppingCart className="h-5 w-5" /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Users", path: "/admin/users", icon: <Users className="h-5 w-5" /> },
  ];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const searchProducts = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([]);
        return;
      }
      try {
        const res = await apiClient.get(`/api/v1/products?keyword=${searchQuery}&limit=5`);
        setSearchResults(res.data.data || []);
      } catch (error) {
        console.error("Search error:", error);
      }
    };
    const timeout = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const handleLogout = async () => {
    try {
      await apiClient.post("/api/v1/user/logout");
    } catch {
      // Continue with local logout even if API fails
    }
    dispatch(logout());
    dispatch(unloadCart());
    dispatch(unloadWishlist());
    setLogoutModal(false);
    navigate("/login");
  };

  const handleSearchClick = (productId) => {
    setSearchQuery("");
    setShowSearch(false);
    navigate(`/admin/products?search=${productId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#0a0a0a] text-gray-300 flex flex-col shadow-2xl transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 pb-4 flex items-center justify-between border-b border-gray-800/50">
          <div className="flex items-center">
            <div className="bg-gradient-to-tr from-orange-500 to-yellow-400 text-white p-2 rounded-xl mr-3 shadow-lg shadow-orange-500/30">
              <LayoutDashboard className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-black text-white">
              Admin
            </h2>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || 
              (link.path !== "/admin" && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-orange-500 text-white"
                    : "hover:bg-white/5 hover:text-white text-gray-400"
                }`}
              >
                <span className={isActive ? "text-white" : ""}>
                  {link.icon}
                </span>
                <span className="ml-3">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom - User & Logout */}
        <div className="p-4 border-t border-gray-800/50 m-4 bg-gray-900/50 rounded-2xl">
          <div className="flex items-center mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white font-bold">
              {user?.name?.charAt(0) || "A"}
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="font-medium text-white truncate">{user?.name || "Admin"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setLogoutModal(true)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors font-medium"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-10 shadow-sm">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          {/* Search with dropdown */}
          <div className="relative flex-1 max-w-md mx-4 lg:mx-0 lg:ml-0" ref={searchRef}>
            <div className="flex items-center bg-gray-100 px-4 py-2 rounded-full">
              <Search className="h-5 w-5 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearch(true);
                }}
                onFocus={() => setShowSearch(true)}
                className="bg-transparent border-none outline-none w-full text-sm text-gray-700 placeholder-gray-400"
              />
            </div>
            
            {/* Search Results Dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                {searchResults.map((product) => (
                  <button
                    key={product._id}
                    onClick={() => handleSearchClick(product._id)}
                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <img 
                      src={product.image || "https://placehold.co/40x40?text=P"} 
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{product.name}</p>
                      <p className="text-sm text-gray-500">${product.price}</p>
                    </div>
                  </button>
                ))}
                <Link
                  to={`/admin/products?search=${searchQuery}`}
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                  className="block p-3 text-center text-sm text-orange-600 hover:bg-gray-50 border-t"
                >
                  View all results
                </Link>
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-orange-500 transition-colors relative">
              <Bell className="h-6 w-6" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            <Link to="/profile" className="text-gray-400 hover:text-gray-700 transition-colors">
              <Settings className="h-6 w-6" />
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-[#f8fafc]">
          <Outlet />
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={logoutModal}
        onClose={() => setLogoutModal(false)}
        onConfirm={handleLogout}
        title="Logout?"
        message="Are you sure you want to logout from the admin panel?"
      />
    </div>
  );
};

export default AdminLayout;
