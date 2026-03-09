import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, CheckCircle, Lock, Eye, EyeOff } from "lucide-react";
import apiClient from "../../services/apiClient";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      // Sending direct reset info - using PATCH as requested
      const response = await apiClient.patch(
        "/api/v1/user/forgot-password",
        formData,
      );

      if (response.data.success) {
        setSubmitted(true);
      } else {
        setError(response.data.message || "Failed to reset password");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-500">
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">
            Password Reset!
          </h2>
          <p className="text-gray-600 mb-10 leading-relaxed font-medium">
            Your password has been changed successfully. You can now use your
            new password to sign in to your account.
          </p>
          <Link
            to="/login"
            className="w-full flex justify-center py-4 px-6 bg-orange-600 text-white font-black rounded-2xl hover:bg-orange-700 transition-all shadow-xl shadow-orange-100 transform hover:-translate-y-1 active:scale-95"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-slate-900 p-10 rounded-3xl shadow-2xl border border-gray-100 dark:border-slate-800 transform transition-all duration-300">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight transition-colors">
              Direct Reset
            </h2>
            <p className="mt-3 text-gray-500 dark:text-gray-400 font-medium transition-colors">
              Update your account password directly.
            </p>
          </div>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl mb-8 text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 transition-colors">
              <span className="w-1.5 h-1.5 bg-red-600 dark:bg-red-500 rounded-full"></span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 transition-colors"
              >
                Email Identity
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-slate-700 rounded-2xl leading-5 bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 focus:border-transparent sm:text-sm transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800/80"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 transition-colors"
              >
                New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-12 py-4 border border-gray-200 dark:border-slate-700 rounded-2xl leading-5 bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 focus:border-transparent sm:text-sm transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800/80"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-orange-500 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1 transition-colors"
              >
                Confirm New Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className="block w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-slate-700 rounded-2xl leading-5 bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white dark:focus:bg-slate-800 focus:border-transparent sm:text-sm transition-all shadow-sm group-hover:bg-white dark:group-hover:bg-slate-800/80"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 flex justify-center items-center px-4 border border-transparent rounded-2xl shadow-xl text-md font-black text-white bg-orange-600 hover:bg-orange-700 dark:shadow-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed transform hover:-translate-y-1 active:scale-95 shadow-orange-100 dark:shadow-none"
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                  Updating...
                </div>
              ) : (
                "Update Password"
              )}
            </button>
          </form>

          <div className="mt-10 text-center">
            <Link
              to="/login"
              className="inline-flex items-center text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-all group transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
