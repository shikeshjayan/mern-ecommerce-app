// tabs/AddressesTab.jsx
import { Plus, Save, Home, Briefcase, Trash2, MapPin } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";

const AddressesTab = ({
  addresses,
  showAddressForm,
  setShowAddressForm,
  newAddress,
  setNewAddress,
  handleAddAddress,
  addressToDelete,
  setAddressToDelete,
  requestDeleteAddress,
  confirmDeleteAddress,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white transition-colors">
          My Addresses
        </h3>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-0.5 transition-colors">
          {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
        </p>
      </div>
      <button
        onClick={() => setShowAddressForm(!showAddressForm)}
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-orange-100 dark:shadow-none transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" /> Add Address
      </button>
    </div>

    {showAddressForm && (
      <form
        onSubmit={handleAddAddress}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-orange-100 dark:border-slate-800 shadow-xl p-8 space-y-5 transition-colors"
      >
        <h4 className="font-black text-gray-800 dark:text-white text-lg mb-6 transition-colors">
          New Address
        </h4>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            {
              label: "Type",
              field: "type",
              type: "select",
              options: ["Home", "Office", "Other"],
            },
            {
              label: "Street Address",
              field: "street",
              placeholder: "123 Main St",
            },
            {
              label: "City / State",
              field: "city",
              placeholder: "New York, NY",
            },
            { label: "Zip Code", field: "zip", placeholder: "10001" },
            { label: "Country", field: "country", placeholder: "USA" },
          ].map(({ label, field, type, options, placeholder }) => (
            <div key={field} className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest transition-colors">
                {label}
              </label>
              {type === "select" ? (
                <select
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 dark:text-white rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {options.map((o) => (
                    <option key={o} className="dark:bg-slate-800">
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  required
                  type="text"
                  placeholder={placeholder}
                  value={newAddress[field]}
                  onChange={(e) =>
                    setNewAddress({ ...newAddress, [field]: e.target.value })
                  }
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 dark:text-white rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all focus:bg-white dark:focus:bg-slate-700"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="flex-1 h-12 bg-gray-900 dark:bg-orange-600 hover:bg-black dark:hover:bg-orange-700 text-white font-black rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Address
          </button>
          <button
            type="button"
            onClick={() => setShowAddressForm(false)}
            className="px-6 h-12 border border-gray-200 dark:border-slate-700 text-gray-500 dark:text-gray-400 font-black rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    )}

    {addresses.length === 0 && !showAddressForm ? (
      <div className="flex flex-col items-center py-20 gap-3 bg-white dark:bg-slate-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-slate-800 transition-colors">
        <MapPin className="w-14 h-14 text-gray-200 dark:text-slate-800" />
        <p className="text-gray-400 dark:text-gray-500 font-medium text-sm transition-colors">
          No saved addresses yet
        </p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((a) => {
          const Icon = a.type === "Office" ? Briefcase : Home;
          return (
            <div
              key={a.id}
              className="group bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-50 dark:bg-orange-950/20 rounded-xl flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-xs font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest transition-colors">
                    {a.type}
                  </span>
                </div>
                <button
                  onClick={() => requestDeleteAddress(a)}
                  className="p-2 text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-black text-gray-800 dark:text-white text-base mb-1 transition-colors">
                {a.street}
              </p>
              <p className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors">
                {a.city}, {a.zip}
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs uppercase tracking-widest font-bold mt-2 transition-colors">
                {a.country}
              </p>
            </div>
          );
        })}
      </div>
    )}

    <ConfirmModal
      isOpen={!!addressToDelete}
      onClose={() => setAddressToDelete(null)}
      onConfirm={confirmDeleteAddress}
      title="Delete Address?"
      message="This address will be permanently removed from your saved addresses."
      itemName={
        addressToDelete
          ? `${addressToDelete.type} — ${addressToDelete.street}`
          : ""
      }
    />
  </div>
);

export default AddressesTab;
