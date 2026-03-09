import { createBrowserRouter } from "react-router-dom";
import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";
import AdminLayout from "./layouts/AdminLayout";
import Home from "./pages/public/Home";
import Products from "./pages/public/Products";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Orders from "./pages/user/Orders";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminHome from "./pages/admin/AdminHome";
import AdminOrders from "./pages/admin/AdminOrders";
import Analytics from "./pages/admin/Analytics";
import Cart from "./pages/public/Cart";
import ProtectedRoute from "./components/ProtectedRoute";
import ProductDetail from "./pages/public/ProductDetail";
import Profile from "./pages/profile/Profile";
import Users from "./pages/admin/Users";
import Wishlist from "./pages/public/Wishlist";
import PaymentSuccess from "./pages/public/PaymentSuccess";
import PaymentCancel from "./pages/public/PaymentCancel";
import Checkout from "./components/Checkout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "products", element: <Products /> },
      {
        path: "products/:id",
        element: <ProductDetail />,
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      {
        path: "cart",
        element: (
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        ),
      },
      {
        path: "checkout",
        element: (
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        ),
      },
      {
        path: "wishlist",
        element: (
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        ),
      },
      { path: "payment/success", element: <PaymentSuccess /> },
      { path: "payment/cancel", element: <PaymentCancel /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "orders", element: <Orders /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute adminOnly>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminHome /> },
      { path: "products", element: <AdminProducts /> },
      { path: "orders", element: <AdminOrders /> },
      { path: "analytics", element: <Analytics /> },
      { path: "users", element: <Users /> },
    ],
  },
  {
    path: "*",
    element: <div className="text-center py-20">404 - Not Found</div>,
  },
]);
