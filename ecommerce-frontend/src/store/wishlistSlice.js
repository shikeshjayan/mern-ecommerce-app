import { createSlice } from "@reduxjs/toolkit";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build the localStorage key for a specific user's wishlist */
export const wishlistKey = (userId) => `wishlist_${userId}`;

/** Load wishlist from localStorage for a given user. Falls back to empty. */
export const loadWishlistForUser = (userId) => {
  if (!userId) return { wishlistItems: [] };
  try {
    const saved = localStorage.getItem(wishlistKey(userId));
    if (!saved) return { wishlistItems: [] };
    return { wishlistItems: JSON.parse(saved) };
  } catch {
    return { wishlistItems: [] };
  }
};

/** Persist wishlist items to localStorage for a specific user */
const saveWishlist = (userId, items) => {
  if (!userId) return;
  localStorage.setItem(wishlistKey(userId), JSON.stringify(items));
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const initialState = {
  wishlistItems: [],
  userId: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    /** Called after login/verifyAuth — loads the user's saved wishlist */
    loadWishlist: (state, action) => {
      const userId = action.payload;
      state.userId = userId;
      const saved = loadWishlistForUser(userId);
      state.wishlistItems = saved.wishlistItems;
    },

    /** Called on logout — clear Redux state; wishlist stays in localStorage. */
    unloadWishlist: (state) => {
      state.wishlistItems = [];
      state.userId = null;
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;
      const index = state.wishlistItems.findIndex(
        (item) => item._id === product._id,
      );

      if (index >= 0) {
        state.wishlistItems.splice(index, 1);
      } else {
        state.wishlistItems.push(product);
      }

      saveWishlist(state.userId, state.wishlistItems);
    },

    /** Hard-clear; also removes from localStorage. */
    clearWishlist: (state) => {
      if (state.userId) localStorage.removeItem(wishlistKey(state.userId));
      state.wishlistItems = [];
    },
  },
});

export const { loadWishlist, unloadWishlist, toggleWishlist, clearWishlist } =
  wishlistSlice.actions;

export default wishlistSlice.reducer;
