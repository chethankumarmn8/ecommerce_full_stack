import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Component Imports
import CustomNavbar from "./components/Navbar";

import ProductList from './components/homepage/ProductList';
import ProductDetails from './components/homepage/ProductDetails';
import Footer from "./components/Footer";
import CheckoutPage from './components/CheckoutPage';
import HomePage from "./pages/HomePage";
import InspirationPage from "./pages/InspirationPage";
import ArtisanResponsibilities from "./pages/ArtisanResponsibilities";
import HelpCenter from "./pages/footer/HelpCenter";
import Careers from "./pages/footer/Careers";
import ContactUs from "./pages/footer/ContactUs";
import AboutUs from "./pages/footer/aboutUs";
import ShareTheLook from "./pages/footer/ShareTheLook";
import ArtisanLogin from "./components/artisan/ArtisanLogin";
import ArtisanRegister from "./components/artisan/ArtisanRegister";
import Cart from "./components/CartPage";
import OrdersPage from "./components/OrdersPage";
import Login from './components/Login';
import Register from './components/Register';
import Profile from "./components/Profile";

// Artisan Dashboard Components
import ArtisanDashboard from "./components/artisan/dashboard/ArtisanDashboard";
import DashboardHome from "./components/artisan/dashboard/DashboardHome";
import AddProductForm from "./components/artisan/dashboard/AddProductForm";
import MyProducts from "./components/artisan/dashboard/MyProducts";
import EditProductForm from "./components/artisan/dashboard/EditProductModal";
import ArtisanOrders from './components/artisan/dashboard/ArtisanOrders';
import ProfilePage from './components/artisan/dashboard/ProfilePage'
import Analytics from "./components/artisan/dashboard/Analytics";

// Route Guard and Context
import ArtisanRouteGuard from "./components/ArtisanRouteGuard";
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';





function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("artisanToken"));

  // Set vh unit for mobile browser compatibility
  const setVhUnit = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  useEffect(() => {
    setVhUnit();
    window.addEventListener('resize', setVhUnit);
    return () => window.removeEventListener('resize', setVhUnit);
  }, []);

  // Auto-logout when token expires
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem("artisanToken");
      if (!token) {
        setIsAuthenticated(false);
        return;
      }

      try {
        const { exp } = jwtDecode(token);
        if (Date.now() >= exp * 1000) {
          localStorage.removeItem("artisanToken");
          setIsAuthenticated(false);
          navigate("/artisan-login", { replace: true });
        }
      } catch (error) {
        localStorage.removeItem("artisanToken");
        setIsAuthenticated(false);
        navigate("/artisan-login", { replace: true });
      }
    };

    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <AuthProvider>
      <div className="d-flex flex-column min-vh-100">
        <CustomNavbar isAuthenticated={isAuthenticated} />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/marketplace" element={<ProductList />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
          <Route path="/artisan-responsibilities" element={<ArtisanResponsibilities />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/artisan-login" element={<ArtisanLogin setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/artisan-register" element={<ArtisanRegister />} />
          <Route path="/help-center" element={<HelpCenter />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/share" element={<ShareTheLook />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/profiles" element={<Profile />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/orders" element={<OrdersPage />} />


          {/* Protected Artisan Dashboard */}
          <Route
            path="/artisan/dashboard"
            element={
              <ArtisanRouteGuard isAuthenticated={isAuthenticated}>
                <ArtisanDashboard />
              </ArtisanRouteGuard>
            }
          >
            <Route index element={<DashboardHome />} />
            <Route path="add-product" element={<AddProductForm />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="edit-product/:productId" element={<EditProductForm />} />
            <Route path="orders" element={<ArtisanOrders />} />
            <Route path="orders/:id" element={<ArtisanOrders />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Catch-All Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Show footer only on homepage */}
        {location.pathname === "/" && <Footer />}
      </div>
    </AuthProvider>
  );
}

export default App;