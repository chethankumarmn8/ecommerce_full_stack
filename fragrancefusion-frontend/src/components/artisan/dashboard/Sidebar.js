// Sidebar.jsx
import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaPlus,
  FaBox,
  FaList,
  FaUser,
  FaEnvelope,
  FaChartLine,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";

const Sidebar = ({ isOpen, toggle }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("artisanToken");
    localStorage.removeItem("userToken");
    localStorage.removeItem("artisanId");
    navigate("/artisan/login");
  };

  return (
    <>
      <nav className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-content">
          <div className="sidebar-header">
            <h4>Artisan Dashboard</h4>
            <button className="close-btn d-md-none" onClick={toggle}>
              &times;
            </button>
          </div>

          <div className="sidebar-menu">
            <Link
              to="/artisan/dashboard"
              className={location.pathname === "/artisan/dashboard" ? "active" : ""}
            >
              <FaHome className="icon d-lg-none" />
              <span className="text">Dashboard</span>
            </Link>
            <Link
              to="/artisan/dashboard/add-product"
              className={location.pathname.includes("/add-product") ? "active" : ""}
            >
              <FaPlus className="icon d-lg-none" />
              <span className="text">Add Product</span>
            </Link>
            <Link
              to="/artisan/dashboard/products"
              className={location.pathname.includes("/products") ? "active" : ""}
            >
              <FaBox className="icon d-lg-none" />
              <span className="text">Products</span>
            </Link>
            <Link
              to="/artisan/dashboard/orders"
              className={location.pathname.includes("/orders") ? "active" : ""}
            >
              <FaList className="icon" />
              <span className="text">Orders</span>
            </Link>
            <Link
              to="/artisan/dashboard/profile"
              className={location.pathname.includes("/profile") ? "active" : ""}
            >
              <FaUser className="icon" />
              <span className="text">Profile</span>
            </Link>


            <Link
              to="/artisan/dashboard/analytics"
              className={location.pathname.includes("/analytics") ? "active" : ""}
            >
              <FaChartLine className="icon" />
              <span className="text">Analytics</span>
            </Link>
          </div>
        </div>

        <button className="btn btn-danger mx-3 mb-3" onClick={handleLogout}>
          Logout
        </button>
        <button
          className="btn btn-danger mobile-logout d-lg-none"
          onClick={handleLogout}
          style={{ display: 'block', margin: '10px auto', width: '90%' }}
        >
          <MdLogout className="icon" /> Logout
        </button>
      </nav>

      {/* Mobile backdrop */}
      {isOpen && <div className="sidebar-backdrop active" onClick={toggle} />}
    </>
  );
};

export default Sidebar;