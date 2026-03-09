// hooks/useProfile.js
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updateProfile } from "../store/authSlice";
import { unloadWishlist, toggleWishlist } from "../store/wishlistSlice";
import { addToCart, unloadCart } from "../store/cartSlice";
import apiClient from "../services/apiClient";

const addrKey = (id) => `user_addresses_${id}`;

export const useProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((s) => s.auth);
  const { wishlistItems } = useSelector((s) => s.wishlist);

  const [activeTab, setActiveTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (user)
      setProfileData((p) => ({ ...p, name: user.name, email: user.email }));
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await getUserOrders();
        const orderList = res?.data ?? res ?? [];
        setOrders(Array.isArray(orderList) ? orderList : []);
      } catch (e) {
        console.error("Orders fetch failed:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    setMsg({ type: "", text: "" });
    if (profileData.password && profileData.password !== profileData.confirmPassword) {
      setMsg({ type: "error", text: "Passwords do not match" });
      setUpdateLoading(false);
      return;
    }
    try {
      const payload = { name: profileData.name, email: profileData.email };
      if (profileData.password) payload.password = profileData.password;
      const res = await apiClient.put(`/api/v1/user/${user.id}`, payload);
      if (res.data.success) {
        dispatch(updateProfile(res.data.data));
        setMsg({ type: "success", text: "Profile updated successfully!" });
        setProfileData((p) => ({ ...p, password: "", confirmPassword: "" }));
      }
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.message || "Update failed" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleLogoutConfirm = async () => {
    try {
      await apiClient.post("/api/v1/user/logout");
    } catch {
      // Continue with local logout
    }
    dispatch(logout());
    dispatch(unloadCart());
    dispatch(unloadWishlist());
    setShowLogoutModal(false);
    navigate("/login");
  };

  const totalSpent = orders.reduce(
    (sum, o) => sum + Number(o.totalPrice ?? o.total ?? 0),
    0
  );

  return {
    user,
    isAuthenticated,
    wishlistItems,
    activeTab,
    setActiveTab,
    orders,
    loading,
    updateLoading,
    msg,
    profileData,
    setProfileData,
    showLogoutModal,
    setShowLogoutModal,
    totalSpent,
    handleUpdateProfile,
    handleLogoutConfirm,
    dispatch,
    addToCart,
    toggleWishlist,
  };
};