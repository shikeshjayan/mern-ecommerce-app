import apiClient from "./apiClient";

export const getProducts = async (params = {}) => {
  const response = await apiClient.get("/api/v1/products", { params });
  return response.data;
};

export const getOrders = async () => {
  const response = await apiClient.get("/api/v1/orders");
  return response.data;
};

export const getUserOrders = async () => {
  const response = await apiClient.get("/api/v1/orders/myorders");
  return response.data;
};

export const makePayment = async (body) => {
  // body should contain: { products: Array, orderId: String }
  const response = await apiClient.post("/api/v1/payment/makepayment", body);
  return response.data;
};
