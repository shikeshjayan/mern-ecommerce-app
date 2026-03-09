import { useEffect, useState, useCallback } from "react";
import { getProducts } from "../services/axiosApi";

export const useProducts = (params = {}) => {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Serialize params so useCallback/useEffect can detect changes
  const paramKey = JSON.stringify(params);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getProducts(params);
      if (response && response.data) {
        setProducts(response.data);
        if (response.pagination) {
          setPagination(response.pagination);
        }
      }
    } catch {
      setError("Failed to fetch products.");
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramKey]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, pagination, loading, error, refetch: fetchProducts };
};
