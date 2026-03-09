// hooks/useWishlistActions.js
import { useState } from "react";
import { useDispatch } from "react-redux";
import { toggleWishlist } from "../store/wishlistSlice";
import { addToCart } from "../store/cartSlice";

export const useWishlistActions = () => {
  const dispatch = useDispatch();
  const [wishlistModalOpen, setWishlistModalOpen] = useState(false);
  const [wishlistItemToDelete, setWishlistItemToDelete] = useState(null);
  const [addedAllToCart, setAddedAllToCart] = useState(false);

  const handleWishlistDelete = (item) => {
    setWishlistItemToDelete(item);
    setWishlistModalOpen(true);
  };

  const confirmWishlistDelete = () => {
    if (wishlistItemToDelete) {
      dispatch(toggleWishlist(wishlistItemToDelete));
      setWishlistModalOpen(false);
      setWishlistItemToDelete(null);
    }
  };

  const handleAddAllToCart = (wishlistItems) => {
    wishlistItems.forEach((i) => {
      if (i.stock > 0) dispatch(addToCart(i));
    });
    setAddedAllToCart(true);
    setTimeout(() => setAddedAllToCart(false), 2000);
  };

  const handleAddToCart = (item) => dispatch(addToCart(item));

  return {
    wishlistModalOpen,
    setWishlistModalOpen,
    wishlistItemToDelete,
    setWishlistItemToDelete,
    addedAllToCart,
    handleWishlistDelete,
    confirmWishlistDelete,
    handleAddAllToCart,
    handleAddToCart,
  };
};