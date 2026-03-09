// tabs/AddressesTab.jsx
import { Plus, Save, Home, Briefcase, Trash2, MapPin } from "lucide-react";
import ConfirmModal from "../../../components/ConfirmModal";

const AddressesTab = ({
  addresses,
  showAddressForm, setShowAddressForm,
  newAddress, setNewAddress,
  handleAddAddress,
  addressToDelete, setAddressToDelete,
  requestDeleteAddress,
  confirmDeleteAddress,
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-2xl font-black text-gray-900">My Addresses</h3>
        <p className="text-sm text-gray-400 mt-0.5">
          {addresses.length} saved address{addresses.length !== 1 ? "es" : ""}
        </p>
      </div>
      <button
        onClick={() => setShowAddressForm(!showAddressForm)}
        className="flex items-center gap-2 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl font-black text-sm shadow-lg shadow-orange-100 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" /> Add Address
      </button>
    </div>

    {showAddressForm && (
      <form onSubmit={handleAddAddress} className="bg-white rounded-2xl border border-orange-100 shadow-xl p-8 space-y-5">
        <h4 className="font-black text-gray-800 text-lg mb-6">New Address</h4>
        <div className="grid md:grid-cols-2 gap-5">
          {[
            { label: "Type", field: "type", type: "select", options: ["Home", "Office", "Other"] },
            { label: "Street Address", field: "street", placeholder: "123 Main St" },
            { label: "City / State", field: "city", placeholder: "New York, NY" },
            { label: "Zip Code", field: "zip", placeholder: "10001" },
            { label: "Country", field: "country", placeholder: "USA" },
          ].map(({ label, field, type, options, placeholder }) => (
            <div key={field} className="space-y-1.5">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest">{label}</label>
              {type === "select" ? (
                <select
                  value={newAddress[field]}
                  onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-400"
                >
                  {options.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  required
                  type="text"
                  placeholder={placeholder}
                  value={newAddress[field]}
                  onChange={(e) => setNewAddress({ ...newAddress, [field]: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-orange-400 transition-all focus:bg-white"
                />
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 pt-2">
          <button type="submit" className="flex-1 h-12 bg-gray-900 hover:bg-black text-white font-black rounded-xl transition-all flex items-center justify-center gap-2">
            <Save className="w-4 h-4" /> Save Address
          </button>
          <button type="button" onClick={() => setShowAddressForm(false)} className="px-6 h-12 border border-gray-200 text-gray-500 font-black rounded-xl hover:bg-gray-50 transition-all">
            Cancel
          </button>
        </div>
      </form>
    )}

    {addresses.length === 0 && !showAddressForm ? (
      <div className="flex flex-col items-center py-20 gap-3 bg-white rounded-2xl border-2 border-dashed border-gray-200">
        <MapPin className="w-14 h-14 text-gray-200" />
        <p className="text-gray-400 font-medium text-sm">No saved addresses yet</p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-4">
        {addresses.map((a) => {
          const Icon = a.type === "Office" ? Briefcase : Home;
          return (
            <div key={a.id} className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Icon className="w-4 h-4 text-orange-500" />
                  </div>
                  <span className="text-xs font-black text-orange-600 uppercase tracking-widest">{a.type}</span>
                </div>
                <button
                  onClick={() => requestDeleteAddress(a)}
                  className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="font-black text-gray-800 text-base mb-1">{a.street}</p>
              <p className="text-gray-500 font-medium text-sm">{a.city}, {a.zip}</p>
              <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mt-2">{a.country}</p>
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
      itemName={addressToDelete ? `${addressToDelete.type} — ${addressToDelete.street}` : ""}
    />
  </div>
);

export default AddressesTab;