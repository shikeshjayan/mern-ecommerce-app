// tabs/OverviewTab.jsx
import { Link } from "react-router-dom";
import {
  Package,
  Heart,
  TrendingUp,
  MapPin,
  ShoppingCart,
  ArrowRight,
} from "lucide-react";
import { StatCard, OrderRow, fmt } from "../../../components/ProfileUI";
import WishlistCard from "../../../components/WishlistCard";

const OverviewTab = ({
  orders,
  wishlistItems,
  addresses,
  totalSpent,
  setActiveTab,
  onWishlistRemove,
  onAddToCart,
}) => (
  <div className="space-y-8">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Total Orders"
        value={orders.length}
        icon={Package}
        color="orange"
        onClick={() => setActiveTab("orders")}
      />
      <StatCard
        label="Wishlist"
        value={wishlistItems.length}
        icon={Heart}
        color="rose"
        onClick={() => setActiveTab("wishlist")}
        delay={60}
      />
      <StatCard
        label="Total Spent"
        value={`$${fmt(totalSpent)}`}
        icon={TrendingUp}
        color="emerald"
        delay={120}
      />
      <StatCard
        label="Addresses"
        value={addresses.length}
        icon={MapPin}
        color="sky"
        onClick={() => setActiveTab("addresses")}
        delay={180}
      />
    </div>

    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
      <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-slate-800">
        <h3 className="font-black text-gray-900 dark:text-white text-lg transition-colors">
          Recent Orders
        </h3>
        {orders.length > 0 && (
          <button
            onClick={() => setActiveTab("orders")}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-50 dark:divide-slate-800">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center py-14 gap-3">
            <ShoppingCart className="w-12 h-12 text-gray-200 dark:text-slate-800" />
            <p className="text-gray-400 dark:text-gray-500 font-medium text-sm transition-colors">
              No orders yet
            </p>
            <Link
              to="/products"
              className="text-orange-600 dark:text-orange-400 font-bold text-sm hover:underline"
            >
              Browse store →
            </Link>
          </div>
        ) : (
          orders.slice(0, 5).map((o) => (
            <div key={o._id} className="px-6">
              <OrderRow order={o} compact />
            </div>
          ))
        )}
      </div>
    </div>

    {wishlistItems.length > 0 && (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-50 dark:border-slate-800">
          <h3 className="font-black text-gray-900 dark:text-white text-lg transition-colors">
            Wishlist Preview
          </h3>
          <button
            onClick={() => setActiveTab("wishlist")}
            className="text-xs font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 hover:gap-2 transition-all"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          {wishlistItems.slice(0, 4).map((item) => (
            <WishlistCard
              key={item._id || item.id}
              item={item}
              onRemove={onWishlistRemove}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      </div>
    )}
  </div>
);

export default OverviewTab;
