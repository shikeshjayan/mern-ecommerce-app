// hooks/useAddresses.js
import { useState, useEffect } from "react";

const addrKey = (id) => `user_addresses_${id}`;

export const useAddresses = (user) => {
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);
  const [newAddress, setNewAddress] = useState({
    type: "Home",
    street: "",
    city: "",
    country: "",
    zip: "",
  });

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(addrKey(user.id || user._id));
      setAddresses(
        saved
          ? JSON.parse(saved)
          : [
              {
                id: 1,
                type: "Home",
                street: "123 Main St",
                city: "New York",
                country: "USA",
                zip: "10001",
              },
            ]
      );
    } else {
      setAddresses([]);
    }
  }, [user]);

  const handleAddAddress = (e) => {
    e.preventDefault();
    const updated = [...addresses, { ...newAddress, id: Date.now() }];
    setAddresses(updated);
    if (user) {
      localStorage.setItem(addrKey(user.id || user._id), JSON.stringify(updated));
    }
    setNewAddress({ type: "Home", street: "", city: "", country: "", zip: "" });
    setShowAddressForm(false);
  };

  const requestDeleteAddress = (address) => setAddressToDelete(address);

  const confirmDeleteAddress = () => {
    if (!addressToDelete) return;
    const updated = addresses.filter((a) => a.id !== addressToDelete.id);
    setAddresses(updated);
    if (user) {
      localStorage.setItem(addrKey(user.id || user._id), JSON.stringify(updated));
    }
    setAddressToDelete(null);
  };

  return {
    addresses,
    showAddressForm,
    setShowAddressForm,
    addressToDelete,
    setAddressToDelete,
    newAddress,
    setNewAddress,
    handleAddAddress,
    requestDeleteAddress,
    confirmDeleteAddress,
  };
};