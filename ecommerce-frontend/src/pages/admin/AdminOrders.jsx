import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import {
  Search,
  Package,
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  X,
  Check,
} from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [orderForDetail, setOrderForDetail] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await apiClient.get("/api/v1/orders");
      setOrders(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (newStatus) => {
    try {
      await apiClient.put(`/api/v1/orders/${selectedOrder._id}`, {
        status: newStatus,
      });
      setShowStatusModal(false);
      setSelectedOrder(null);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update order status");
    }
  };

  const handleCancelOrder = async () => {
    try {
      await apiClient.delete(`/api/v1/orders/${orderToCancel._id}`);
      setCancelModal(false);
      setOrderToCancel(null);
      fetchOrders();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to cancel order");
    }
  };

  const openCancelModal = (order) => {
    setOrderToCancel(order);
    setCancelModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800/50";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800/50";
      case "pending":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700/50";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/50";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400 border-gray-200 dark:border-gray-700/50";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered":
        return <CheckCircle className="h-4 w-4" />;
      case "shipped":
        return <Truck className="h-4 w-4" />;
      case "processing":
        return <Package className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const statusOptions = [
    "pending",
    "processing",
    "shipped",
    "delivered",
    "cancelled",
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
            Orders
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            Manage and track all customer orders
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 transition-colors">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search by order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400 transition-colors"
        >
          <option value="all" className="dark:bg-slate-800">
            All Status
          </option>
          <option value="pending" className="dark:bg-slate-800">
            Pending
          </option>
          <option value="processing" className="dark:bg-slate-800">
            Processing
          </option>
          <option value="shipped" className="dark:bg-slate-800">
            Shipped
          </option>
          <option value="delivered" className="dark:bg-slate-800">
            Delivered
          </option>
          <option value="cancelled" className="dark:bg-slate-800">
            Cancelled
          </option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase transition-colors">
              <tr>
                <th className="px-6 py-4 font-semibold">Order ID</th>
                <th className="px-6 py-4 font-semibold">Customer</th>
                <th className="px-6 py-4 font-semibold">Items</th>
                <th className="px-6 py-4 font-semibold">Total</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors">
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white transition-colors">
                      #{order._id?.slice(-6).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white transition-colors">
                        {order.user?.name || "Guest"}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">
                        {order.user?.email || "No email"}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex -space-x-2">
                      {order.orderItems?.slice(0, 3).map((item, i) => (
                        <div
                          key={i}
                          className="h-8 w-8 rounded-lg bg-gray-100 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors"
                        >
                          {item.quantity}
                        </div>
                      ))}
                      {order.orderItems?.length > 3 && (
                        <div className="h-8 w-8 rounded-lg bg-gray-200 dark:bg-slate-600 border-2 border-white dark:border-slate-800 flex items-center justify-center text-xs font-medium text-gray-500 dark:text-gray-400 transition-colors">
                          +{order.orderItems.length - 3}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 dark:text-white transition-colors">
                      ${Number(order.totalPrice ?? 0).toFixed(2)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowStatusModal(true);
                      }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)} hover:opacity-80 transition-opacity`}
                    >
                      {getStatusIcon(order.status)}
                      {order.status}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => {
                          setOrderForDetail(order);
                          setShowDetailModal(true);
                        }}
                        className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Clock className="h-4 w-4" />
                      </button>
                      {order.status !== "cancelled" &&
                        order.status !== "delivered" && (
                          <button
                            onClick={() => openCancelModal(order)}
                            className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors"
                            title="Cancel Order"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                    </div>
                  </td>
                </tr>
              ))}

              {filteredOrders.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500 dark:text-gray-400 transition-colors"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Change Modal */}
      {showStatusModal && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-slate-800 transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Update Order Status
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                Order #{selectedOrder._id?.slice(-6).toUpperCase()}
              </p>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 transition-colors">
                Select new status:
              </p>
              {statusOptions.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 transition-all ${
                    selectedOrder.status === status
                      ? "border-orange-500 dark:border-orange-600 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400"
                      : "border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700 dark:text-gray-400"
                  }`}
                >
                  <span className="flex items-center gap-2 font-medium capitalize">
                    {getStatusIcon(status)}
                    {status}
                  </span>
                  {selectedOrder.status === status && (
                    <Check className="h-5 w-5 text-orange-500 dark:text-orange-400" />
                  )}
                </button>
              ))}
            </div>
            <div className="p-6 pt-0">
              <button
                onClick={() => {
                  setShowStatusModal(false);
                  setSelectedOrder(null);
                }}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Modal */}
      <ConfirmModal
        isOpen={cancelModal}
        onClose={() => {
          setCancelModal(false);
          setOrderToCancel(null);
        }}
        onConfirm={handleCancelOrder}
        title="Cancel Order?"
        message={`Are you sure you want to cancel order #${orderToCancel?._id?.slice(-6).toUpperCase()}? This action cannot be undone.`}
      />

      {/* Order Detail Modal */}
      {showDetailModal && orderForDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl shadow-2xl border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">
                  Order Details
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
                  ID: {orderForDetail._id}
                </p>
              </div>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setOrderForDetail(null);
                }}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-sm">
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl transition-colors">
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Customer Info
                  </p>
                  <p className="font-bold text-gray-900 dark:text-white">
                    {orderForDetail.user?.name || "Guest"}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    {orderForDetail.user?.email || "No email"}
                  </p>
                </div>
                <div className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl transition-colors">
                  <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-3">
                    Order Summary
                  </p>
                  <p className="flex justify-between text-gray-600 dark:text-gray-400">
                    Status:{" "}
                    <span
                      className={`font-bold capitalize ${getStatusColor(orderForDetail.status).split(" ")[2]}`}
                    >
                      {orderForDetail.status}
                    </span>
                  </p>
                  <p className="flex justify-between mt-1 text-gray-600 dark:text-gray-400">
                    Date:{" "}
                    <span className="font-bold text-gray-900 dark:text-white">
                      {new Date(orderForDetail.createdAt).toLocaleString()}
                    </span>
                  </p>
                  <p className="flex justify-between mt-1 text-gray-600 dark:text-gray-400">
                    Total:{" "}
                    <span className="font-bold text-gray-900 dark:text-white text-lg">
                      ${Number(orderForDetail.totalPrice).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4">
                  Order Items ({orderForDetail.orderItems?.length || 0})
                </p>
                <div className="space-y-3">
                  {orderForDetail.orderItems?.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-white dark:bg-slate-800 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-100 dark:bg-slate-700 rounded-xl overflow-hidden flex-shrink-0">
                        <img
                          src={
                            item.product?.image || "https://placehold.co/100"
                          }
                          alt={item.product?.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-900 dark:text-white truncate">
                          {item.product?.name || "Unknown Product"}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                          {item.quantity} × ${Number(item.price).toFixed(2)}
                        </p>
                      </div>
                      <p className="font-black text-gray-900 dark:text-white">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 dark:bg-slate-800/50 transition-colors">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setOrderForDetail(null);
                }}
                className="w-full bg-gray-900 dark:bg-slate-700 text-white py-4 rounded-2xl font-black hover:bg-black dark:hover:bg-slate-600 transition-all transform active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
