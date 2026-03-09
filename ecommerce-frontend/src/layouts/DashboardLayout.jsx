import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
// import { useSelector } from "react-redux";
// import { LayoutDashboard, ShoppingBag } from "lucide-react";

const DashboardLayout = () => {
  // const user = useSelector((state) => state.auth.user);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <Navbar />
      <main className="max-w-screen mx-auto px-4 py-24">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
