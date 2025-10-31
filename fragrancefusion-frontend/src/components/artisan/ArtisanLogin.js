import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FiLock, FiMail, FiFeather, FiLoader } from "react-icons/fi";

const ArtisanLogin = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("artisanToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (Date.now() < decoded.exp * 1000 && decoded.role === "ROLE_ARTISAN") {
          navigate("/artisan/dashboard", { replace: true });
        }
      } catch (err) {
        localStorage.removeItem("artisanToken");
        localStorage.removeItem("artisanId");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/artisan/auth/login",
        credentials
      );

      if (response.data.token) {
        const decoded = jwtDecode(response.data.token);
        localStorage.setItem("artisanToken", response.data.token);
        localStorage.setItem("artisanId", decoded.artisanId);
        navigate("/artisan/dashboard", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center luxury-bg">
      <div className="card fragrance-card">
        <div className="card-header luxury-header">
          <div className="header-overlay" />
          <FiFeather className="perfume-icon" />
          <h1 className="brand-title">Fragrance Fusion</h1>
          <p className="brand-subtitle">Master Perfumer Portal</p>
        </div>

        <div className="card-body luxury-body">
          {error && (
            <div className="alert fragrance-alert">
              <FiLoader className="alert-icon" />
              <div className="alert-text">{error}</div>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <div className="input-container">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="Perfumer Email"
                  value={credentials.email}
                  onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-container">
                <FiLock className="input-icon" />
                <input
                  type="password"
                  placeholder="Secret Formula"
                  value={credentials.password}
                  onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading} className="luxury-btn">
              {isLoading ? (
                <>
                  <FiLoader className="spinner" />
                  <span>Unlocking Studio...</span>
                </>
              ) : (
                "Enter Perfume Atelier"
              )}
            </button>
          </form>

          <div className="auth-links">
            <p>
              New Perfumer?{" "}
              <Link to="/artisan-register" className="luxury-link">
                Craft Your Legacy
              </Link>
            </p>
            <Link to="/forgot-password" className="luxury-link">
              Forgot Secret Blend?
            </Link>
          </div>
        </div>
      </div>

      <style jsx global>{`
        :root {
          --onyx: #393D3F;
          --gold: #C6A15A;
          --mauve: #7A4E58;
          --ivory: #F5F1E3;
          --sage: #A4B494;
        }

        .luxury-bg {
          background: linear-gradient(135deg, var(--ivory) 0%, #FEFCF6 100%);
          background-image:
            radial-gradient(circle at 90% 10%, rgba(198, 161, 90, 0.1) 0%, transparent 30%),
            radial-gradient(circle at 10% 90%, rgba(122, 78, 88, 0.1) 0%, transparent 30%);
        }

        .fragrance-card {
          width: 100%;
          max-width: 440px;
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(57, 61, 63, 0.15);
          border: 1px solid rgba(198, 161, 90, 0.2);
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          transition: transform 0.3s ease;
        }

        .fragrance-card:hover {
          transform: translateY(-5px);
        }

        .luxury-header {
          position: relative;
          padding: 2.5rem;
          background: linear-gradient(135deg, var(--mauve), var(--onyx));
          text-align: center;
          overflow: hidden;
        }

        .header-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z' fill='%23C6A15A' fill-opacity='0.08' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        .perfume-icon {
          font-size: 2.5rem;
          color: var(--gold);
          margin-bottom: 1rem;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
          animation: float 3s ease-in-out infinite;
        }

        .brand-title {
          color: var(--ivory);
          font-size: 1.75rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          margin-bottom: 0.5rem;
          text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .brand-subtitle {
          color: rgba(245, 241, 227, 0.9);
          font-size: 0.9rem;
          letter-spacing: 0.1em;
          margin: 0;
        }

        .luxury-body {
          padding: 2rem;
        }

        .fragrance-alert {
          background: rgba(245, 241, 227, 0.95);
          border: 1px solid var(--gold);
          border-left: 4px solid var(--mauve);
          border-radius: 0.75rem;
          padding: 1rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .alert-icon {
          color: var(--mauve);
          flex-shrink: 0;
        }

        .alert-text {
          color: var(--onyx);
          font-size: 0.9rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .input-container {
          position: relative;
          background: rgba(245, 241, 227, 0.8);
          border-radius: 0.75rem;
          border: 2px solid var(--ivory);
          transition: all 0.3s ease;
        }

        .input-container:hover {
          border-color: var(--gold);
        }

        .input-container input {
          width: 100%;
          padding: 1rem 1rem 1rem 2.75rem;
          border: none;
          background: transparent;
          color: var(--onyx);
          font-size: 0.95rem;
        }

        .input-container input:focus {
          outline: none;
          box-shadow: 0 0 0 3px rgba(198, 161, 90, 0.2);
        }

        .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--sage);
          font-size: 1.1rem;
        }

        .luxury-btn {
          width: 100%;
          padding: 1rem;
          background: linear-gradient(135deg, var(--mauve), var(--onyx));
          border: none;
          border-radius: 0.75rem;
          color: var(--ivory);
          font-weight: 600;
          letter-spacing: 0.05em;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .luxury-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(122, 78, 88, 0.2);
        }

        .luxury-btn::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: rotate(45deg);
          animation: shine 3s infinite;
        }

        .auth-links {
          text-align: center;
          margin-top: 1.5rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(198, 161, 90, 0.1);
        }

        .luxury-link {
          color: var(--mauve);
          text-decoration: none;
          font-size: 0.9rem;
          transition: all 0.3s ease;
        }

        .luxury-link:hover {
          color: var(--onyx);
          text-decoration: underline;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @keyframes shine {
          0% { left: -50%; }
          100% { left: 150%; }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .spinner {
          animation: spin 1s linear infinite;
          margin-right: 0.5rem;
        }

        @media (max-width: 576px) {
          .fragrance-card {
            margin: 1rem;
            border-radius: 1rem;
          }

          .luxury-header {
            padding: 1.5rem;
          }

          .brand-title {
            font-size: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ArtisanLogin;