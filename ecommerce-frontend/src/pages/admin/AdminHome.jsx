import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiClient from "../../services/apiClient";
import {
  Package,
  Users,
  ShoppingCart,
  DollarSign,
  ArrowRight,
  TrendingUp,
  Clock,
} from "lucide-react";

const AdminHome = () => {
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
    revenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes, usersRes] = await Promise.all([
          apiClient.get("/api/v1/orders"),
          apiClient.get("/api/v1/products?limit=0"),
          apiClient.get("/api/v1/user"),
        ]);

        const orders = ordersRes.data.data || [];
        const products = productsRes.data.data || [];
        const users = usersRes.data.data || [];

        const totalRevenue = orders
          .filter((o) => o.status !== "cancelled")
          .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

        setStats({
          products: products.length,
          users: users.length,
          orders: orders.length,
          revenue: totalRevenue,
        });

        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statCards = [
    {
      title: "Total Sales",
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-orange-50 dark:bg-orange-950/20 text-orange-500",
      shadow: "shadow-orange-900/10",
      link: "/admin/orders",
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingCart,
      color: "bg-purple-50 dark:bg-purple-950/20 text-purple-500",
      shadow: "shadow-purple-900/10",
      link: "/admin/orders",
    },
    {
      title: "Users",
      value: stats.users,
      icon: Users,
      color: "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500",
      shadow: "shadow-emerald-900/10",
      link: "/admin/users",
    },
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      color: "bg-blue-50 dark:bg-blue-950/20 text-blue-500",
      shadow: "shadow-blue-900/10",
      link: "/admin/products",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400";
      case "shipped":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400";
      case "processing":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400";
      case "pending":
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
      case "cancelled":
        return "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">
          Welcome back! Here's what's happening with your store.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Link
            key={index}
            to={stat.link}
            className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm hover:shadow-md border border-gray-100 dark:border-slate-800 transition-all group ${stat.shadow}`}
          >
            <div className="flex items-center justify-between">
              <div
                className={`h-12 w-12 rounded-xl ${stat.color} flex items-center justify-center transition-colors`}
              >
                <stat.icon className="h-6 w-6" />
              </div>
              <ArrowRight className="h-5 w-5 text-gray-300 dark:text-gray-600 group-hover:text-orange-500 dark:group-hover:text-orange-400 group-hover:translate-x-1 transition-all" />
            </div>
            <div className="mt-4">
              <p className="text-3xl font-bold text-gray-900 dark:text-white transition-colors">
                {stat.value}
              </p>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1 transition-colors">
                {stat.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-gray-400 dark:text-gray-500" />
            <h2 className="text-lg font-bold text-gray-900 dark:text-white transition-colors">
              Recent Orders
            </h2>
          </div>
          <Link
            to="/admin/orders"
            className="text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
          >
            View All →
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-slate-800/50 text-gray-500 dark:text-gray-400 text-xs uppercase transition-colors">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order ID</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Items</th>
                  <th className="px-6 py-3 font-semibold">Total</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-800 transition-colors">
                {recentOrders.map((order) => (
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
                          {order.user?.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 dark:text-gray-400">
                        {order.orderItems?.length || 0} items
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-bold text-gray-900 dark:text-white transition-colors">
                        ${order.totalPrice?.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${getStatusColor(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-500 dark:text-gray-400 text-sm transition-colors">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-gray-500 dark:text-gray-400">
            <ShoppingCart className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-slate-800 transition-colors" />
            <p>No orders yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
