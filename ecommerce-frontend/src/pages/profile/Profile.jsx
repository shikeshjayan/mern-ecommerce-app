// Profile.jsx
import { Package, Heart, TrendingUp, MapPin, Settings } from "lucide-react";

import { useProfile } from "../../hooks/useProfile";
import { useAddresses } from "../../hooks/useAddresses";
import { useWishlistActions } from "../../hooks/useWishlistActions";

import ProfileHero from "../../components/ProfileHero";
import OverviewTab from "./tabs/OverviewTab";
import OrdersTab from "./tabs/OrdersTab";
import WishlistTab from "./tabs/WishlistTab";
import AddressesTab from "./tabs/AddressesTab";
import SettingsTab from "./tabs/SettingsTab";

import ConfirmModal from "../../components/ConfirmModal";
import LogoutConfirmationModal from "../../components/LogoutConfirmationModal";

const Profile = () => {
  const {
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
  } = useProfile();

  const addressHook = useAddresses(user);
  const wishlistHook = useWishlistActions();
  const isAdmin = user?.role === "admin";

  const tabs = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "orders", label: "Orders", count: orders.length, icon: Package },
    { id: "wishlist", label: "Wishlist", count: wishlistItems.length, icon: Heart },
    { id: "addresses", label: "Addresses", icon: MapPin },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderTab = () => {
    if (loading)
      return (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin" />
          <p className="text-gray-400 font-bold text-sm">Loading your data…</p>
        </div>
      );

    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            orders={orders}
            wishlistItems={wishlistItems}
            addresses={addressHook.addresses}
            totalSpent={totalSpent}
            setActiveTab={setActiveTab}
            onWishlistRemove={wishlistHook.handleWishlistDelete}
            onAddToCart={wishlistHook.handleAddToCart}
          />
        );
      case "orders":
        return <OrdersTab orders={orders} totalSpent={totalSpent} />;
      case "wishlist":
        return (
          <WishlistTab
            wishlistItems={wishlistItems}
            addedAllToCart={wishlistHook.addedAllToCart}
            onAddAll={() => wishlistHook.handleAddAllToCart(wishlistItems)}
            onRemove={wishlistHook.handleWishlistDelete}
            onAddToCart={wishlistHook.handleAddToCart}
          />
        );
      case "addresses":
        return <AddressesTab {...addressHook} />;
      case "settings":
        return (
          <SettingsTab
            user={user}
            isAdmin={isAdmin}
            profileData={profileData}
            setProfileData={setProfileData}
            updateLoading={updateLoading}
            msg={msg}
            handleUpdateProfile={handleUpdateProfile}
            onLogoutClick={() => setShowLogoutModal(true)}
          />
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <div className="bg-[#f8f7f5] min-h-screen">
      <ProfileHero
        user={user}
        orders={orders}
        wishlistItems={wishlistItems}
        totalSpent={totalSpent}
        isAdmin={isAdmin}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      <div className="max-w-6xl mx-auto px-6 -mt-20 pb-28">
        <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl shadow-xl shadow-gray-200/50 p-2 mb-8 flex flex-wrap gap-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-black transition-all duration-200
                ${activeTab === tab.id ? "bg-gray-900 text-white shadow-lg" : "text-gray-400 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-orange-400" : ""}`} />
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="min-h-[400px]">{renderTab()}</div>
      </div>

      <ConfirmModal
        isOpen={wishlistHook.wishlistModalOpen}
        onClose={() => wishlistHook.setWishlistModalOpen(false)}
        onConfirm={wishlistHook.confirmWishlistDelete}
        title="Remove from Wishlist?"
        message="This item will be removed from your saved items."
        itemName={wishlistHook.wishlistItemToDelete?.name}
        itemImg={wishlistHook.wishlistItemToDelete?.image}
      />

      <LogoutConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogoutConfirm}
        title="Sign out?"
        message="You'll be logged out of your account."
      />
    </div>
  );
};

export default Profile;