import axios from "axios";

// const API_URL = "http://localhost:8080/api/artisan/products";
const API_URL = "http://localhost:8080/api";




const getMyProducts = async () => {
  const token = localStorage.getItem("artisanToken");
  return axios.get(`${API_URL}/products/my-products`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateProduct = async (productId, data) => {
  const token = localStorage.getItem("artisanToken");
  return axios.put(`${API_URL}/update/${productId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", // Add this line
    },
  });
};

const deleteProduct = async (productId) => {
  const token = localStorage.getItem("artisanToken");
  return axios.delete(`${API_URL}/delete/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getMyOrders = async () => {
  const token = localStorage.getItem("artisanToken");
  const artisanId = localStorage.getItem("artisanId");

  return axios.get(`${API_URL}/orders/artisan/${artisanId}/orders`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

const getOrderDetails = async (orderId) => {
  const token = localStorage.getItem("artisanToken");
  const artisanId = localStorage.getItem("artisanId");

  return axios.get(`${API_URL}/orders/artisan/${artisanId}/orders/${orderId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  });
};
// In artisanDashboardService.js, ensure correct endpoints:
const getProfile = async () => {
  const token = localStorage.getItem("artisanToken");
  return axios.get(`${API_URL}/artisan/auth/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const updateProfile = async (formData) => {
  const token = localStorage.getItem("artisanToken");
  return axios.put(`${API_URL}/artisan/auth/update-profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

const getAnalyticsData = async () => {
  const token = localStorage.getItem("artisanToken");

  const [totalSales, monthlyRevenue, topProducts] = await Promise.all([
    axios.get(`${API_URL}/orders/artisan/analytics/total-sales`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    axios.get(`${API_URL}/orders/artisan/analytics/monthly-revenue`, {
      headers: { Authorization: `Bearer ${token}` }
    }),
    axios.get(`${API_URL}/orders/artisan/analytics/top-products`, {
      headers: { Authorization: `Bearer ${token}` }
    })
  ]);

  return {
    totalSales: totalSales.data || 0,
    monthlyRevenue: monthlyRevenue.data || [],
    topProducts: topProducts.data || []
  };
};
const artisanDashboardService = {
  
  getMyProducts,
  updateProduct,
  deleteProduct,
  getMyOrders,
  getOrderDetails,
  getProfile,
  updateProfile,
  getAnalyticsData,
};

export default artisanDashboardService;
