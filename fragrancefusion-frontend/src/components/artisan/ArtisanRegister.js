import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiAlertCircle, FiCheckCircle, FiUpload } from "react-icons/fi";

const ArtisanRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "",
    experience: "",
    certificate: null,
    mobile: "",
    location: "",
    materialsUsed: "",
    password: "",
    confirmPassword: "",
  });

  const categories = [
    "Aesop",
    "Amouage",
    "Byredo",
    "Creed",
    "Diptyque",
    "Etat Libre d'Orange",
    "Frederic Malle",
    "Initio Parfums Prives",
    "Jo Malone London",
    "Le Labo",
    "Maison Francis Kurkdjian",
    "Memo Paris",
    "Nishane",
    "Parfums de Marly",
    "Penhaligons",
    "Tom Ford"
  ];

  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (alert.show && alert.type === "success") {
      const timer = setTimeout(() => navigate("/artisan-login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [alert, navigate]);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobileRegex = /^[0-9]{10}$/;

    if (!formData.name.trim()) newErrors.name = "Full name is required";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Invalid email address";
    if (!formData.category) newErrors.category = "Associated Brand is required";
    if (!formData.experience) newErrors.experience = "Experience is required";
    if (!mobileRegex.test(formData.mobile))
      newErrors.mobile = "Invalid mobile number";
    if (!formData.location.trim()) newErrors.location = "Location is required";
    if (!formData.certificate)
      newErrors.certificate = "Certification document is required";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.materialsUsed.trim())
      newErrors.materialsUsed = "Specialization details are required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) formDataToSend.append(key, value);
      });

      await axios.post(
        "http://localhost:8080/api/artisan/auth/register",
        formDataToSend,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setAlert({
        show: true,
        message: "Registration Successful! Redirecting to login...",
        type: "success",
      });
    } catch (error) {
      setAlert({
        show: true,
        message:
          error.response?.data?.message ||
          "Registration failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center p-4 gradient-background">
      <div className="row justify-content-center w-100">
        <div className="col-12 col-lg-9 col-xl-7 col-xxl-6">
          <div className="card artisan-card shadow-lg" style={{ maxWidth: '1000px', margin: '0 auto' }}>

            {/* Alert Notification */}
            {alert.show && (
              <div
                className={`alert alert-${alert.type} alert-dismissible fade show`}
              >
                <div className="d-flex align-items-center gap-3">
                  {alert.type === "success" ? (
                    <FiCheckCircle className="fs-4" />
                  ) : (
                    <FiAlertCircle className="fs-4" />
                  )}
                  <div>
                    <h5 className="mb-1 text-uppercase letter-spacing-1">
                      {alert.type === "success" ? "Success" : "Attention"}
                    </h5>
                    <p className="mb-0 small">{alert.message}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="card-header text-center py-4 luxury-header">
              <h2 className="mb-3">
                <span className="d-block h2 mb-2">Luxury Perfumery Registry</span>
                <span className="h6 fw-light">
                  Curating Excellence in Olfactory Artistry
                </span>
              </h2>
            </div>

            <div className="card-body p-4">
              <form onSubmit={handleSubmit}>
                <div className="row g-4">
                  {/* Full Name */}
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        className={`form-control ${errors.name && "is-invalid"
                          }`}
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.name}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Email & Brand Selection */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className={`form-control ${errors.email && "is-invalid"}`}
                        value={formData.email}
                        onChange={handleChange}
                      />
                      {errors.email && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.email}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label className="form-label">Associated Brand</label>
                      <select
                        name="category"
                        className={`form-select luxury-select ${errors.category && "is-invalid"}`}
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="">Select Luxury Brand</option>
                        {categories.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.category}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Experience, Mobile, Location */}
                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Experience (Years)</label>
                      <input
                        type="number"
                        name="experience"
                        className={`form-control ${errors.experience && "is-invalid"
                          }`}
                        value={formData.experience}
                        onChange={handleChange}
                        min="0"
                      />
                      {errors.experience && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.experience}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Mobile Number</label>
                      <input
                        type="tel"
                        name="mobile"
                        className={`form-control ${errors.mobile && "is-invalid"
                          }`}
                        value={formData.mobile}
                        onChange={handleChange}
                      />
                      {errors.mobile && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.mobile}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-4">
                    <div className="form-group">
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        name="location"
                        className={`form-control ${errors.location && "is-invalid"
                          }`}
                        value={formData.location}
                        onChange={handleChange}
                      />
                      {errors.location && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Passwords */}
                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input
                        type="password"
                        name="password"
                        className={`form-control ${errors.password && "is-invalid"
                          }`}
                        value={formData.password}
                        onChange={handleChange}
                      />
                      {errors.password && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="col-12 col-md-6">
                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        className={`form-control ${errors.confirmPassword && "is-invalid"
                          }`}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.confirmPassword}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Materials & Techniques (now Specialization Details) */}
                  <div className="col-12">
                    <div className="form-group">
                      <label className="form-label">
                        Specialization Details (e.g., perfumer, bottle designer, raw material sourcing)
                      </label>
                      <textarea
                        name="materialsUsed"
                        className={`form-control ${errors.materialsUsed && "is-invalid"
                          }`}
                        value={formData.materialsUsed}
                        onChange={handleChange}
                        rows="4"
                      />
                      {errors.materialsUsed && (
                        <div className="invalid-feedback d-flex align-items-center gap-2">
                          <FiAlertCircle /> {errors.materialsUsed}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Certificate Upload */}
                  <div className="col-12">
                    <div
                      className={`file-upload-card ${errors.certificate ? "border-danger" : "border-purple"
                        }`}
                    >
                      <label className="d-block text-center p-4 cursor-pointer">
                        <div className="mb-3">
                          <FiUpload className="h3 text-muted" />
                        </div>
                        <div className="mb-2">
                          <strong>Upload Certification Document</strong>
                        </div>
                        <small className="text-muted d-block">
                          PDF format (max 5MB)
                        </small>
                        {formData.certificate && (
                          <div className="mt-2 text-purple">
                            {formData.certificate.name}
                          </div>
                        )}
                        <input
                          type="file"
                          name="certificate"
                          className="d-none"
                          accept="application/pdf"
                          onChange={handleChange}
                        />
                      </label>
                    </div>
                    {errors.certificate && (
                      <div className="text-danger small mt-2 d-flex align-items-center gap-2">
                        <FiAlertCircle /> {errors.certificate}
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="col-12 mt-4">
                    <button
                      type="submit"
                      className="btn btn-primary w-100 py-3"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" />
                          Registering...
                        </>
                      ) : (
                        "Enroll as Olfactory Artist"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --primary-purple: #6A057F; /* A rich, deep purple */
          --accent-lavender: #8B5FBF; /* A lighter, more vibrant purple */
          --soft-grey: #F0F0F0;
          --dark-text: #333333;
          --light-text: #FFFFFF;
          --error-red: #DC3545;
        }

        .gradient-background {
          background: linear-gradient(135deg, #6A057F 0%, #3C096F 100%); /* Deep purple gradient */
        }

        .artisan-card {
          background: var(--soft-grey);
          border: 1px solid rgba(106, 5, 127, 0.15);
          border-radius: 12px; /* Slightly more rounded corners */
          overflow: hidden; /* Ensures header gradient corners are smooth */
        }

        .luxury-header {
          background: linear-gradient(45deg, var(--primary-purple) 0%, var(--accent-lavender) 100%) !important;
          border-bottom: 2px solid rgba(255, 255, 255, 0.3) !important; /* Subtle light border */
          color: var(--light-text);
          padding: 2.5rem 1.5rem !important;
        }

        .luxury-header h2 {
          font-family: 'Playfair Display', serif;
          letter-spacing: 1px;
          text-shadow: 1px 1px 3px rgba(0,0,0,0.2);
        }

        .luxury-header h2 span:first-child {
          font-size: 2.5rem;
          font-weight: 700;
        }

        .luxury-header h6 {
          font-family: 'Open Sans', sans-serif;
          font-weight: 300;
          font-size: 1rem;
          opacity: 0.9;
        }

        .form-label {
          color: var(--dark-text);
          font-weight: 600;
          letter-spacing: 0.5px;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }

        .form-control, .form-select {
          background: var(--light-text);
          border: 1px solid rgba(106, 5, 127, 0.2);
          border-radius: 8px; /* More rounded inputs */
          padding: 0.85rem 1.4rem;
          transition: all 0.3s ease;
          color: var(--dark-text);
        }

        .luxury-select {
          -webkit-appearance: none; /* Remove default arrow on WebKit */
          -moz-appearance: none; /* Remove default arrow on Firefox */
          appearance: none; /* Remove default arrow */
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='%236A057F' d='M2 5l6 6 6-6'/%3e%3c/svg%3e"); /* Custom purple arrow */
          background-repeat: no-repeat;
          background-position: right 1.25rem center;
          background-size: 0.8rem 0.8rem;
        }

        .form-control:focus, .form-select:focus {
          border-color: var(--primary-purple);
          box-shadow: 0 0 0 0.25rem rgba(106, 5, 127, 0.2);
          background: var(--light-text);
        }

        .btn-primary {
          background: linear-gradient(90deg, var(--primary-purple) 0%, var(--accent-lavender) 100%);
          border: none;
          padding: 1.1rem 2.5rem;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          border-radius: 8px;
          transition: all 0.3s ease;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }

        .btn-primary:hover {
          background: linear-gradient(90deg, var(--accent-lavender) 0%, var(--primary-purple) 100%);
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .btn-primary:disabled {
          background: #cccccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }

        .invalid-feedback {
          color: var(--error-red);
          font-size: 0.875rem;
          margin-top: 0.25rem;
        }

        .is-invalid {
          border-color: var(--error-red) !important;
        }

        .file-upload-card {
          border: 2px dashed rgba(106, 5, 127, 0.4);
          background: rgba(255, 255, 255, 0.95);
          border-radius: 8px;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .file-upload-card:hover {
          border-color: var(--primary-purple);
          background: rgba(255, 255, 255, 1);
        }

        .file-upload-card .text-muted {
          color: var(--dark-text) !important;
        }

        .text-purple {
          color: var(--primary-purple) !important;
          font-weight: 500;
        }

        .alert {
          border-radius: 8px;
          margin-bottom: 1.5rem;
          padding: 1rem 1.5rem;
        }

        .alert-success {
          background: rgba(106, 5, 127, 0.1);
          border: 1px solid var(--primary-purple);
          color: var(--primary-purple);
        }

        .alert-error {
          background: rgba(220, 53, 69, 0.1);
          border: 1px solid var(--error-red);
          color: var(--error-red);
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .luxury-header h2 span:first-child {
            font-size: 2rem;
          }
          .luxury-header h6 {
            font-size: 0.9rem;
          }
          .form-control, .form-select {
            padding: 0.75rem 1rem;
          }
          .btn-primary {
            padding: 0.9rem 2rem;
          }
        }
      `}</style>
    </div>
  );
};

export default ArtisanRegister;