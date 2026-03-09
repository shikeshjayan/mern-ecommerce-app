/* eslint-disable react-refresh/only-export-components */
import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./styles/globalStyle.css";

import { router } from "./App.jsx";
import { store } from "./store/store.js";
import { Provider, useDispatch } from "react-redux";
import { verifyAuth, setLoading } from "./store/authSlice";
import { loadCart } from "./store/cartSlice";
import { loadWishlist } from "./store/wishlistSlice";
import apiClient from "./services/apiClient";

const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiClient.get("/api/v1/user/profile");
        if (res.data.success) {
          const user = res.data.data;
          dispatch(verifyAuth({ user }));
          const userId = user.id || user._id;
          dispatch(loadCart(userId));
          dispatch(loadWishlist(userId));
        }
      } catch {
        // Not logged in or invalid session
      } finally {
        dispatch(setLoading(false));
      }
    };
    checkAuth();
  }, [dispatch]);

  return children;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthInitializer>
        <RouterProvider router={router} />
      </AuthInitializer>
    </Provider>
  </StrictMode>,
);
