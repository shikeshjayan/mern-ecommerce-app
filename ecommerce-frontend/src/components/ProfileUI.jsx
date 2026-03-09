// components/ProfileUI.jsx
import { Package } from "lucide-react";
import { ChevronRight } from "lucide-react";

/* ─── helpers ─────────────────────────────────────── */
export const fmt = (n) => Number(n || 0).toFixed(2);

export const statusColors = {
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  shipped:   { bg: "bg-sky-50",     text: "text-sky-700",     dot: "bg-sky-400"     },
  processing:{ bg: "bg-amber-50",   text: "text-amber-700",   dot: "bg-amber-400"   },
  pending:   { bg: "bg-gray-100",   text: "text-gray-600",    dot: "bg-gray-400"    },
  cancelled: { bg: "bg-red-50",     text: "text-red-600",     dot: "bg-red-400"     },
};

export const getStatus = (s = "pending") =>
  statusColors[s.toLowerCase()] || statusColors.pending;

/* ─── StatCard ────────────────────────────────────── */
export const StatCard = ({ label, value, icon: Icon, color, onClick, delay = 0 }) => {
  const palette = {
    orange:  { bg: "bg-orange-50",  icon: "text-orange-500",  border: "border-orange-100",  ring: "ring-orange-200"  },
    rose:    { bg: "bg-rose-50",    icon: "text-rose-500",    border: "border-rose-100",    ring: "ring-rose-200"    },
    emerald: { bg: "bg-emerald-50", icon: "text-emerald-500", border: "border-emerald-100", ring: "ring-emerald-200" },
    sky:     { bg: "bg-sky-50",     icon: "text-sky-500",     border: "border-sky-100",     ring: "ring-sky-200"     },
  };
  const p = palette[color] || palette.orange;
  return (
    <div
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`relative bg-white rounded-2xl p-6 border ${p.border} shadow-sm
        hover:shadow-lg hover:-translate-y-1 transition-all duration-300
        ${onClick ? "cursor-pointer hover:ring-2 " + p.ring : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{label}</p>
          <p className="text-4xl font-black text-gray-900 tabular-nums">{value}</p>
        </div>
        <div className={`${p.bg} p-3 rounded-xl`}>
          <Icon className={`w-6 h-6 ${p.icon}`} />
        </div>
      </div>
      {onClick && (
        <div className="flex items-center gap-1 mt-4 text-xs font-bold text-gray-400">
          View all <ChevronRight className="w-3 h-3" />
        </div>
      )}
    </div>
  );
};

/* ─── OrderRow ────────────────────────────────────── */
export const OrderRow = ({ order, compact = false }) => {
  const sc = getStatus(order.status);
  const items = order.orderItems || [];
  const itemCount = items.length;
  const total = order.totalPrice ?? order.total ?? 0;

  return (
    <div
      className={`flex flex-col ${compact ? "py-3 px-4 rounded-xl hover:bg-gray-50" : "p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md"} transition-all group`}
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="font-black text-gray-800 text-sm tracking-tight">
              #{String(order._id || order.id || "").slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-400 font-medium mt-0.5">
              {itemCount} item{itemCount !== 1 ? "s" : ""}
              {order.createdAt
                ? ` · ${new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-black text-gray-900">${fmt(total)}</span>
          <span className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${sc.bg} ${sc.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
            {order.status || "Pending"}
          </span>
        </div>
      </div>
      {!compact && itemCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-50 space-y-2">
          {items.map((item, idx) => {
            const product = item.product || item;
            const name = product?.name || "Product";
            const image = product?.image;
            const qty = item.quantity ?? 1;
            const price = item.price ?? product?.price ?? 0;
            return (
              <div key={item._id || product?._id || idx} className="flex items-center gap-3 text-sm">
                {image ? (
                  <img src={image} alt={name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Package className="w-4 h-4 text-gray-400" />
                  </div>
                )}
                <span className="font-medium text-gray-800 flex-1 truncate">{name}</span>
                <span className="text-gray-500">{qty} × ${fmt(price)}</span>
                <span className="font-bold text-gray-900">${fmt(qty * price)}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};