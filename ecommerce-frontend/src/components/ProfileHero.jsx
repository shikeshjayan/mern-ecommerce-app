// components/ProfileHero.jsx
import { Link } from "react-router-dom";
import { Mail, ShoppingCart, LogOut } from "lucide-react";
import { fmt } from "./ProfileUI";

const ProfileHero = ({ user, orders, wishlistItems, totalSpent, isAdmin, onLogoutClick }) => (
  <div className="bg-[#0f172a] text-white pt-28 pb-44 relative overflow-hidden">
    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_60%_-20%,rgba(249,115,22,0.18),transparent)]" />
    <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

    <div className="max-w-6xl mx-auto px-6 relative z-10">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10">
        {/* avatar */}
        <div className="relative flex-shrink-0">
          <div className="w-32 h-32 bg-gradient-to-br from-orange-500 to-orange-700 rounded-[2rem] flex items-center justify-center text-5xl font-black text-white shadow-2xl shadow-orange-900/30 border-2 border-white/10">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          <div className="absolute -bottom-1.5 -right-1.5 w-8 h-8 bg-emerald-400 rounded-xl border-4 border-[#0f172a] shadow-lg" />
        </div>

        {/* info */}
        <div className="flex-1 text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
            <span className="px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-lg text-[10px] font-black text-orange-400 uppercase tracking-widest">
              Member
            </span>
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black text-gray-500 uppercase tracking-widest">
              Joined {new Date().getFullYear()}
            </span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-black tracking-tighter mb-2">
            {user?.name || "User"}
          </h1>
          <p className="text-gray-400 font-medium flex items-center justify-center lg:justify-start gap-2 mb-8">
            <Mail className="w-4 h-4 text-orange-500" /> {user?.email}
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <Link
              to="/products"
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-black text-sm shadow-xl shadow-orange-900/30 transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" /> Shop Now
            </Link>
            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-400 px-6 py-3 rounded-xl font-black text-sm border border-white/10 hover:border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Exit to Admin
              </Link>
            ) : (
              <button
                type="button"
                onClick={onLogoutClick}
                className="flex items-center gap-2 bg-white/5 hover:bg-red-500/10 text-gray-300 hover:text-red-400 px-6 py-3 rounded-xl font-black text-sm border border-white/10 hover:border-red-500/20 transition-all"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            )}
          </div>
        </div>

        {/* quick stats */}
        <div className="hidden lg:flex flex-col gap-3 text-right flex-shrink-0">
          {[
            { label: "Orders", value: orders.length },
            { label: "Wishlist", value: wishlistItems.length },
            { label: "Spent", value: `$${fmt(totalSpent)}` },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white/5 border border-white/10 rounded-xl px-5 py-3">
              <p className="text-2xl font-black text-white">{value}</p>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHero;