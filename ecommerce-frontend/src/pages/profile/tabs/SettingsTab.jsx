// tabs/SettingsTab.jsx
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  Lock,
  Save,
  Shield,
  Camera,
  LogOut,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const SettingsTab = ({
  user,
  isAdmin,
  profileData,
  setProfileData,
  updateLoading,
  msg,
  handleUpdateProfile,
  onLogoutClick,
}) => (
  <div className="max-w-2xl space-y-6">
    <div>
      <h3 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">
        Account Settings
      </h3>
      <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
        Manage your profile and security preferences
      </p>
    </div>

    <form onSubmit={handleUpdateProfile} className="space-y-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 transition-colors">
        <div className="flex items-center gap-5">
          <div className="relative group cursor-pointer">
            <div className="w-20 h-20 bg-linear-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-3xl font-black text-white shadow-lg border-2 border-white dark:border-slate-800">
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-white dark:bg-slate-800 rounded-lg shadow-md border border-gray-100 dark:border-slate-700 flex items-center justify-center group-hover:bg-orange-500 group-hover:border-orange-500 group-hover:text-white transition-all text-gray-500 dark:text-gray-400">
              <Camera className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <p className="font-black text-gray-900 dark:text-white text-lg transition-colors">
              {user?.name}
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 transition-colors">
              {user?.email}
            </p>
            <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest rounded-full transition-colors">
              Active
            </span>
          </div>
        </div>
      </div>

      {msg.text && (
        <div
          className={`flex items-center gap-3 p-4 rounded-xl text-sm font-bold border transition-colors ${
            msg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30"
              : "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30"
          }`}
        >
          {msg.type === "success" ? (
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
          )}
          {msg.text}
        </div>
      )}

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-colors">
        <h4 className="font-black text-gray-800 dark:text-white flex items-center gap-2 text-base transition-colors">
          <User className="w-4 h-4 text-orange-500" /> Personal Info
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            { label: "Full Name", field: "name", type: "text", icon: User },
            {
              label: "Email Address",
              field: "email",
              type: "email",
              icon: Mail,
            },
          ].map(({ label, field, type, icon: Icon }) => (
            <div key={field} className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                <Icon className="w-3 h-3" /> {label}
              </label>
              <input
                type={type}
                value={profileData[field]}
                onChange={(e) =>
                  setProfileData({ ...profileData, [field]: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 dark:text-white rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all focus:bg-white dark:focus:bg-slate-700"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm p-6 space-y-5 transition-colors">
        <h4 className="font-black text-gray-800 dark:text-white flex items-center gap-2 text-base transition-colors">
          <Shield className="w-4 h-4 text-orange-500" /> Security
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              label: "New Password",
              field: "password",
              placeholder: "Leave blank to keep current",
            },
            {
              label: "Confirm Password",
              field: "confirmPassword",
              placeholder: "Confirm new password",
            },
          ].map(({ label, field, placeholder }) => (
            <div key={field} className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-1.5 transition-colors">
                <Lock className="w-3 h-3" /> {label}
              </label>
              <input
                type="password"
                placeholder={placeholder}
                value={profileData[field]}
                onChange={(e) =>
                  setProfileData({ ...profileData, [field]: e.target.value })
                }
                className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 dark:text-white rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all focus:bg-white dark:focus:bg-slate-700 placeholder-gray-300 dark:placeholder-gray-600"
              />
            </div>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={updateLoading}
        className="w-full py-3.5 bg-gray-900 dark:bg-orange-600 hover:bg-black dark:hover:bg-orange-700 text-white font-black rounded-xl shadow-xl dark:shadow-none transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
      >
        {updateLoading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />{" "}
            Saving…
          </>
        ) : (
          <>
            <Save className="w-4 h-4" /> Save Changes
          </>
        )}
      </button>
    </form>

    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-red-100 dark:border-red-900/30 shadow-sm p-6 transition-colors">
      {isAdmin ? (
        <>
          <h4 className="font-black text-gray-800 dark:text-white mb-1 flex items-center gap-2 text-base transition-colors">
            <LogOut className="w-4 h-4 text-red-500" /> Exit to Admin
          </h4>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 transition-colors">
            Go back to admin dashboard.
          </p>
          <Link
            to="/admin"
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-black text-sm rounded-xl transition-all border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="w-4 h-4" /> Exit
          </Link>
        </>
      ) : (
        <>
          <h4 className="font-black text-gray-800 dark:text-white mb-1 flex items-center gap-2 text-base transition-colors">
            <LogOut className="w-4 h-4 text-red-500" /> Logout
          </h4>
          <p className="text-sm text-gray-400 dark:text-gray-500 mb-4 transition-colors">
            Sign out of your account on this device.
          </p>
          <button
            type="button"
            onClick={onLogoutClick}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 font-black text-sm rounded-xl transition-all border border-red-100 dark:border-red-900/30"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </>
      )}
    </div>
  </div>
);

export default SettingsTab;
