// tabs/OrdersTab.jsx
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { OrderRow, fmt } from "../../../components/ProfileUI";

const OrdersTab = ({ orders, totalSpent }) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">
          Order History
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
          {orders.length} order{orders.length !== 1 ? "s" : ""} placed
        </p>
      </div>
      {orders.length > 0 && (
        <div className="text-right">
          <p className="text-xs text-gray-400 dark:text-gray-500 font-medium transition-colors">
            Total spent
          </p>
          <p className="text-xl font-black text-orange-600 dark:text-orange-400 transition-colors">
            ${fmt(totalSpent)}
          </p>
        </div>
      )}
    </div>

    {orders.length === 0 ? (
      <div className="flex flex-col items-center py-24 gap-4 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
        <ShoppingCart className="w-16 h-16 text-gray-200 dark:text-slate-800" />
        <h4 className="text-lg font-black text-gray-800 dark:text-white transition-colors">
          No orders yet
        </h4>
        <p className="text-gray-400 dark:text-gray-500 text-sm transition-colors">
          Your order history will appear here.
        </p>
        <Link
          to="/products"
          className="mt-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg hover:shadow-orange-900/40"
        >
          Start Shopping
        </Link>
      </div>
    ) : (
      <div className="space-y-3">
        {orders.map((o) => (
          <OrderRow key={o._id} order={o} />
        ))}
      </div>
    )}
  </div>
);

export default OrdersTab;
