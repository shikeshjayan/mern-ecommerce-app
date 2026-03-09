import { createSlice } from "@reduxjs/toolkit";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Build the localStorage key for a specific user */
export const cartKey = (userId) => `cart_${userId}`;

/** Load cart from localStorage for a given user. Falls back to empty cart. */
export const loadCartForUser = (userId) => {
  if (!userId) return { cartItems: [], totalItems: 0, totalAmount: 0 };
  try {
    const saved = localStorage.getItem(cartKey(userId));
    if (!saved) return { cartItems: [], totalItems: 0, totalAmount: 0 };
    const cartItems = JSON.parse(saved);
    return {
      cartItems,
      totalItems: cartItems.reduce((s, i) => s + i.quantity, 0),
      totalAmount: cartItems.reduce((s, i) => s + i.price * i.quantity, 0),
    };
  } catch {
    return { cartItems: [], totalItems: 0, totalAmount: 0 };
  }
};

/** Persist cart items to localStorage for a specific user */
const saveCart = (userId, cartItems) => {
  if (!userId) return;
  localStorage.setItem(cartKey(userId), JSON.stringify(cartItems));
};

/** Recalculate totals in-place */
const recalc = (state) => {
  state.totalItems = state.cartItems.reduce((s, i) => s + i.quantity, 0);
  state.totalAmount = state.cartItems.reduce(
    (s, i) => s + i.price * i.quantity,
    0,
  );
};

// ─── Slice ────────────────────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState: { cartItems: [], totalItems: 0, totalAmount: 0, userId: null },
  reducers: {
    /** Called after login/verifyAuth — loads the user's saved cart */
    loadCart: (state, action) => {
      const userId = action.payload;
      state.userId = userId;
      const saved = loadCartForUser(userId);
      state.cartItems = saved.cartItems;
      state.totalItems = saved.totalItems;
      state.totalAmount = saved.totalAmount;
    },

    /** Called on logout — clear Redux state; cart/wishlist stay in localStorage. */
    unloadCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalAmount = 0;
      state.userId = null;
    },

    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.cartItems.find((i) => i._id === product._id);
      if (existing) {
        existing.quantity += 1;
      } else {
        state.cartItems.push({ ...product, quantity: 1 });
      }
      recalc(state);
      if (state.userId) {
        saveCart(state.userId, state.cartItems);
      }
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((i) => i._id !== action.payload);
      recalc(state);
      saveCart(state.userId, state.cartItems);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.cartItems.find((i) => i._id === productId);
      if (item) {
        item.quantity = quantity;
        if (item.quantity <= 0) {
          state.cartItems = state.cartItems.filter((i) => i._id !== productId);
        }
      }
      recalc(state);
      saveCart(state.userId, state.cartItems);
    },

    /** Hard-clear after checkout; also removes from localStorage. */
    clearCart: (state) => {
      if (state.userId) localStorage.removeItem(cartKey(state.userId));
      state.cartItems = [];
      state.totalItems = 0;
      state.totalAmount = 0;
    },
  },
});

export const {
  loadCart,
  unloadCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
