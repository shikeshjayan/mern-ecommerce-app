import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import {
  Network,
  TrendingUp,
  Users,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Package,
  DollarSign,
  ShoppingCart,
} from "lucide-react";

const Analytics = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [rmLoading, setRmLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          apiClient.get("/api/v1/orders"),
          apiClient.get("/api/v1/products"),
        ]);
        setOrders(ordersRes.data.data || []);
        setProducts(productsRes.data.data || []);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRecommendations = async () => {
    try {
      setRmLoading(true);
      const res = await apiClient.get("/api/v1/analytics/recommendations");
      const data = res.data.data || {};
      setRecommendations(
        Array.isArray(data.recommendations) ? data.recommendations : [],
      );
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setRecommendations([]);
    } finally {
      setRmLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  const totalOrders = orders.length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const pendingOrders = orders.filter(
    (o) => o.status === "pending" || o.status === "processing",
  ).length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  const revenueByDay = orders.reduce((acc, order) => {
    if (order.status !== "cancelled") {
      const date = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + order.totalPrice;
    }
    return acc;
  }, {});

  const chartData = Object.entries(revenueByDay)
    .map(([date, revenue]) => ({ date, revenue }))
    .slice(-12);

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1);

  const stats = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}`,
      trend: "+12.5%",
      up: true,
      icon: DollarSign,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      trend: "+8.2%",
      up: true,
      icon: ShoppingCart,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Products",
      value: totalProducts.toString(),
      trend: lowStockProducts > 0 ? `${lowStockProducts} low` : "Good",
      up: lowStockProducts === 0,
      icon: Package,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Delivery Rate",
      value:
        totalOrders > 0
          ? `${Math.round((deliveredOrders / totalOrders) * 100)}%`
          : "0%",
      trend: "+5.3%",
      up: true,
      icon: Activity,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  const insights = [
    {
      type: "stock",
      title: "Stock Alert",
      message:
        lowStockProducts > 0
          ? `${lowStockProducts} products are running low on stock. Consider restocking soon.`
          : "All products are well stocked.",
      color:
        lowStockProducts > 0
          ? "bg-red-50 border-red-200"
          : "bg-green-50 border-green-200",
    },
    {
      type: "orders",
      title: "Order Summary",
      message: `${pendingOrders} orders awaiting processing. ${deliveredOrders} orders delivered successfully.`,
      color: "bg-blue-50 border-blue-200",
    },
    {
      type: "revenue",
      title: "Revenue Insight",
      message:
        totalRevenue > 0
          ? `You've earned $${totalRevenue.toLocaleString()} from ${totalOrders} orders.`
          : "No revenue yet. Start selling to see analytics.",
      color: "bg-emerald-50 border-emerald-200",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center transition-colors">
            Analytics
            <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 dark:bg-indigo-950/40 text-indigo-800 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50 transition-colors transition-colors">
              Live Data
            </span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 transition-colors">
            Real-time insights and statistics for your store.
          </p>
        </div>
        <button className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 px-6 py-2.5 rounded-xl font-medium shadow-sm flex items-center transition-all">
          <Zap className="h-4 w-4 mr-2 text-indigo-500 dark:text-indigo-400" />
          Generate Report
        </button>
      </div>

      {/* Recommendations section */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/30 transition-colors">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">
            RapidMiner Recommendations
          </h3>
          <span className="text-sm text-indigo-600 dark:text-indigo-400 font-medium transition-colors">
            AI-Powered
          </span>
        </div>
        <button
          onClick={getRecommendations}
          disabled={rmLoading}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl hover:shadow-2xl transition-all font-semibold disabled:opacity-50 w-full md:w-auto"
        >
          {rmLoading ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              Analyzing...
            </>
          ) : (
            <>
              <TrendingUp className="h-5 w-5" />
              Generate Recommendations
            </>
          )}
        </button>

        {recommendations.length > 0 && (
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {recommendations.slice(0, 8).map((rec, i) => (
              <div
                key={i}
                className="bg-white dark:bg-slate-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all group transition-colors"
              >
                <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 truncate transition-colors">
                  {rec.name || rec.title}
                </h4>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold transition-colors">
                  ${rec.price || rec.totalPrice}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 transition-colors">
                  Recommended
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 hover:shadow-md transition-all relative overflow-hidden group"
          >
            <div
              className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} dark:bg-slate-800 opacity-50 group-hover:scale-150 transition-transform duration-500 ease-out`}
            ></div>
            <div className="relative">
              <div className="flex justify-between items-start mb-4">
                <div
                  className={`h-10 w-10 rounded-xl ${stat.bg} dark:bg-slate-800/50 flex items-center justify-center transition-colors`}
                >
                  <stat.icon
                    className={`h-5 w-5 ${stat.color} dark:text-indigo-400`}
                  />
                </div>
                <div
                  className={`flex items-center text-sm font-semibold transition-colors ${stat.up ? "text-emerald-600 dark:text-emerald-400" : "text-orange-600 dark:text-orange-400"}`}
                >
                  {stat.trend}
                  {stat.up ? (
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 ml-1" />
                  )}
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 transition-colors transition-colors">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 transition-colors transition-colors">
                {stat.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue chart and insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-800 p-6 flex flex-col transition-colors transition-colors">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white transition-colors transition-colors">
              Revenue Overview
            </h2>
            <select className="bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-sm dark:text-white rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-colors transition-colors">
              <option className="dark:bg-slate-800">Last 30 Days</option>
              <option className="dark:bg-slate-800">Last Quarter</option>
              <option className="dark:bg-slate-800">Last Year</option>
            </select>
          </div>
          {chartData.length > 0 ? (
            <div className="flex-1 flex items-end justify-between space-x-2 pt-10 mt-auto border-b border-gray-100 dark:border-slate-800 pb-2 h-64 transition-colors">
              {chartData.map((item, i) => (
                <div
                  key={i}
                  className="w-full flex flex-col items-center group"
                >
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold text-gray-600 dark:text-gray-400 mb-2 transform translate-y-2 group-hover:translate-y-0 duration-200 transition-colors">
                    ${item.revenue.toLocaleString()}
                  </span>
                  <div
                    className="w-full rounded-t-sm transition-all duration-500 group-hover:opacity-80 bg-gradient-to-t from-indigo-500 to-purple-600"
                    style={{
                      height: `${(item.revenue / maxRevenue) * 100}%`,
                      minHeight: item.revenue > 0 ? "4px" : "0",
                    }}
                  ></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 dark:text-gray-500 transition-colors transition-colors">
              <p>No order data available yet</p>
            </div>
          )}
          <div className="flex justify-between text-xs font-medium text-gray-400 dark:text-gray-500 mt-3 px-2 transition-colors transition-colors">
            <span>Orders placed</span>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></span>
              <span>Revenue</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 rounded-2xl shadow-xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center mb-6">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm mr-3">
                <Network className="h-6 w-6 text-indigo-300" />
              </div>
              <h2 className="text-xl font-bold">Store Insights</h2>
            </div>

            <div className="space-y-4 flex-1">
              {insights.map((insight, i) => (
                <div
                  key={i}
                  className={`${insight.color} dark:bg-slate-800/40 dark:border-slate-800/50 backdrop-blur-md rounded-xl p-4 border transition-all cursor-pointer hover:scale-[1.02] active:scale-95`}
                >
                  <div className="flex items-center mb-2">
                    <span
                      className={`h-2 w-2 rounded-full mr-2 ${insight.type === "stock" ? (lowStockProducts > 0 ? "bg-red-400" : "bg-green-400") : insight.type === "orders" ? "bg-blue-400" : "bg-emerald-400"}`}
                    ></span>
                    <h4 className="font-semibold text-sm text-gray-900 dark:text-white transition-colors">
                      {insight.title}
                    </h4>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed transition-colors">
                    {insight.message}
                  </p>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full py-3 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 font-medium text-sm transition-all focus:ring-2 focus:ring-white/30">
              View Full Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
