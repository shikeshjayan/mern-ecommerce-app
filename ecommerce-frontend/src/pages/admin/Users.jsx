import { useState, useEffect } from "react";
import apiClient from "../../services/apiClient";
import {
  Users as UsersIcon,
  UserCheck,
  Shield,
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
} from "lucide-react";
import ConfirmModal from "../../components/ConfirmModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [deleteModal, setDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchUsers = async () => {
    try {
      const res = await apiClient.get("/api/v1/user");
      setUsers(res.data.data || []);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = async () => {
    try {
      await apiClient.delete(`/api/v1/user/${userToDelete._id}`);
      setDeleteModal(false);
      fetchUsers();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete user");
    }
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModal(true);
  };

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive !== false).length;
  const admins = users.filter((u) => u.role === "admin").length;

  const getAvatar = (name) => {
    if (!name) return "??";
    const parts = name.split(" ");
    return parts.length > 1
      ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const getAvatarColor = (role) => {
    switch (role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-blue-100 text-blue-700";
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500 mt-1">
            Manage customers, admins, and permissions across your platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <UsersIcon className="h-24 w-24" />
          </div>
          <div className="h-14 w-14 rounded-full bg-blue-50 flex items-center justify-center mr-4 relative z-10">
            <UsersIcon className="h-7 w-7 text-blue-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Total Users
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{totalUsers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <UserCheck className="h-24 w-24" />
          </div>
          <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mr-4 relative z-10">
            <UserCheck className="h-7 w-7 text-emerald-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Active Users
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{activeUsers}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <Shield className="h-24 w-24" />
          </div>
          <div className="h-14 w-14 rounded-full bg-purple-50 flex items-center justify-center mr-4 relative z-10">
            <Shield className="h-7 w-7 text-purple-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Admins
            </p>
            <h3 className="text-3xl font-bold text-gray-900 mt-1">{admins}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center bg-white gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="flex items-center text-sm font-medium text-gray-600 border border-gray-200 bg-white px-3 py-2 rounded-lg hover:bg-gray-50 w-full sm:w-auto"
          >
            <option value="all">All Roles</option>
            <option value="user">Customers</option>
            <option value="admin">Admins</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Contact</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm mr-3 ${getAvatarColor(
                          user.role
                        )} shadow-sm border border-white`}
                      >
                        {getAvatar(user.name)}
                      </div>
                      <span className="font-semibold text-gray-900">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      {user.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 border border-purple-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Customer"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isActive !== false ? (
                      <span className="inline-flex items-center text-sm text-emerald-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-sm text-red-600 font-medium">
                        <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openDeleteModal(user)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete User"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    {searchQuery || filterRole !== "all"
                      ? "No users found matching your criteria."
                      : "No users found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between text-sm text-gray-500">
          <div>
            Showing {filteredUsers.length} of {totalUsers} users
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={deleteModal}
        onClose={() => setDeleteModal(false)}
        onConfirm={handleDeleteUser}
        title="Delete User?"
        message="This user will be permanently removed from the system."
        itemName={userToDelete?.name}
      />
    </div>
  );
};

export default Users;
