import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingCart } from "lucide-react";
import apiClient from "../../services/apiClient";

const fmt = (n) => Number(n || 0).toFixed(2);

const statusColors = {
  delivered: { bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-400" },
  shipped: { bg: "bg-sky-50", text: "text-sky-700", dot: "bg-sky-400" },
  processing: { bg: "bg-amber-50", text: "text-amber-700", dot: "bg-amber-400" },
  pending: { bg: "bg-gray-100", text: "text-gray-600", dot: "bg-gray-400" },
  cancelled: { bg: "bg-red-50", text: "text-red-600", dot: "bg-red-400" },
};

const getStatusStyle = (status = "pending") =>
  statusColors[status.toLowerCase()] || statusColors.pending;

const OrderCard = ({ order }) => {
  const style = getStatusStyle(order.status);
  const items = order.orderItems || [];
  const total = order.totalPrice ?? order.total ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-5 border-b border-gray-50 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
            <Package className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <p className="font-black text-gray-800">
              Order #{String(order._id || order.id || "").slice(-8).toUpperCase()}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {order.createdAt
                ? new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xl font-black text-gray-900">${fmt(total)}</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full ${style.bg} ${style.text}`}
          >
            <span className={`w-2 h-2 rounded-full ${style.dot}`} />
            {order.status || "Pending"}
          </span>
        </div>
      </div>
      <div className="p-5 bg-gray-50/50">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
          Products
        </p>
        <div className="space-y-3">
          {items.length === 0 ? (
            <p className="text-sm text-gray-400">No items</p>
          ) : (
            items.map((item, idx) => {
              const product = item.product || item;
              const name = product?.name || "Product";
              const image = product?.image;
              const qty = item.quantity ?? 1;
              const price = item.price ?? product?.price ?? 0;
              return (
                <div
                  key={item._id || product?._id || idx}
                  className="flex items-center gap-4 bg-white rounded-xl p-3 border border-gray-100"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={name}
                      className="w-14 h-14 rounded-lg object-cover bg-gray-100 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{name}</p>
                    <p className="text-sm text-gray-500">
                      {qty} × ${fmt(price)} = ${fmt(qty * price)}
                    </p>
                  </div>
                  <span className="font-bold text-gray-900">${fmt(qty * price)}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await apiClient.get("/api/v1/orders/myorders");
        const data = res.data?.data ?? res.data ?? res;
        setOrders(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to fetch orders:", e);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
        <p className="mt-4 text-gray-500 font-medium">Loading orders…</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Order History</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {orders.length} order{orders.length !== 1 ? "s" : ""} placed
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-bold text-sm"
        >
          <ShoppingCart className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-lg font-black text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 text-sm mb-6">
            Your order history will appear here after you place an order.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors"
          >
            <ShoppingCart className="w-4 h-4" /> Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <OrderCard key={order._id || order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
