// AddProductForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    stock: "",
    materials: "",
    ethicalScore: "",
    images: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = localStorage.getItem("artisanToken");
  const navigate = useNavigate();

  const categoryOptions = [
    "Jewelry",
    "Home Decor",
    "Art",
    "Apparel",
    "Accessories",
    "Toys",
    "Wellness",
    "Stationery",
    "Bags & Accessories",
    "Kitchen & Dining",
  ];

  useEffect(() => {
    if (!token) {
      alert("Please login first!");
      navigate("/login");
    }
  }, [token, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.price || formData.price <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.stock || formData.stock <= 0)
      newErrors.stock = "Valid stock quantity is required";
    if (!formData.materials.trim())
      newErrors.materials = "Materials are required";
    if (
      !formData.ethicalScore ||
      formData.ethicalScore < 1 ||
      formData.ethicalScore > 5
    )
      newErrors.ethicalScore = "Ethical score must be between 1-5";
    if (formData.images.length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const MAX_IMAGES = 4;
    const imageErrors = {};

    if (files.length > MAX_IMAGES) {
      imageErrors.images = `Maximum ${MAX_IMAGES} images allowed`;
    }

    const oversizedFiles = files.filter((file) => file.size > MAX_FILE_SIZE);
    if (oversizedFiles.length > 0) {
      imageErrors.images = "Each image must be smaller than 5MB";
    }

    if (Object.keys(imageErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...imageErrors }));
      return;
    }

    setFormData((prev) => ({ ...prev, images: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images" && value !== "") data.append(key, value);
    });

    formData.images.forEach((image) => data.append("images", image));

    try {
      await axios.post("http://localhost:8080/api/products/add", data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Product added successfully!");
      navigate("/artisan/dashboard/products");
    } catch (error) {
      setErrors({
        server:
          error.response?.data?.message ||
          "Failed to add product. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="card luxury-card shadow-lg border-0 rounded-4">
        <div className="card-header bg-white border-bottom py-4">
          <h2 className="h3 fw-semibold mb-0 text-center text-gradient">
            Craft Your Masterpiece
          </h2>
          <p className="text-muted text-center mb-0 mt-2">
            Showcase your artisanal creation to the world
          </p>
        </div>

        <div className="card-body px-sm-5 py-5">
          {errors.server && (
            <div
              className="alert alert-elegant d-flex align-items-center"
              role="alert"
            >
              <i className="fas fa-exclamation-circle me-2"></i>
              {errors.server}
            </div>
          )}

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="row mb-4 g-4">
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className={`form-control luxury-input ${errors.name && "is-invalid"
                      }`}
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder=" "
                  />
                  <label className="text-muted">Product Name</label>
                  {errors.name && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      {errors.name}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-floating">
                  <select
                    className={`form-select luxury-select ${errors.category && "is-invalid"
                      }`}
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  >
                    <option value=""> </option>
                    {categoryOptions.map((cat, index) => (
                      <option key={index} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <label className="text-muted">Category</label>
                  {errors.category && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      {errors.category}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row mb-4 g-4">
              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="number"
                    className={`form-control luxury-input ${errors.price && "is-invalid"
                      }`}
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0.01"
                    step="0.01"
                    placeholder=" "
                  />
                  <label className="text-muted">Price ($)</label>
                  {errors.price && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      {errors.price}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="number"
                    className={`form-control luxury-input ${errors.stock && "is-invalid"
                      }`}
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="1"
                    placeholder=" "
                  />
                  <label className="text-muted">Stock</label>
                  {errors.stock && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      {errors.stock}
                    </div>
                  )}
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-floating">
                  <input
                    type="number"
                    className={`form-control luxury-input ${errors.ethicalScore && "is-invalid"
                      }`}
                    name="ethicalScore"
                    value={formData.ethicalScore}
                    onChange={handleInputChange}
                    min="1"
                    max="5"
                    step="0.1"
                    placeholder=" "
                  />
                  <label className="text-muted">Ethical Score</label>
                  {errors.ethicalScore && (
                    <div className="invalid-feedback d-flex align-items-center">
                      <i className="fas fa-info-circle me-2"></i>
                      {errors.ethicalScore}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="form-floating">
                <textarea
                  className={`form-control luxury-textarea ${errors.description && "is-invalid"
                    }`}
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder=" "
                />
                <label className="text-muted">Product Story</label>
                {errors.description && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <i className="fas fa-info-circle me-2"></i>
                    {errors.description}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-4">
              <div className="form-floating">
                <input
                  type="text"
                  className={`form-control luxury-input ${errors.materials && "is-invalid"
                    }`}
                  name="materials"
                  placeholder=" "
                  value={formData.materials}
                  onChange={handleInputChange}
                />
                <label className="text-muted">Materials Used</label>
                {errors.materials && (
                  <div className="invalid-feedback d-flex align-items-center">
                    <i className="fas fa-info-circle me-2"></i>
                    {errors.materials}
                  </div>
                )}
              </div>
            </div>

            <div className="mb-5">
              <label className="form-label text-muted mb-3">
                <i className="fas fa-camera me-2"></i>
                Gallery Images
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  className={`form-control luxury-file-input ${errors.images && "is-invalid"
                    }`}
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                />
                <div className="file-upload-label">
                  <i className="fas fa-cloud-upload-alt me-2"></i>
                  Drag & Drop or Browse Files
                </div>
                {errors.images && (
                  <div className="invalid-feedback d-flex align-items-center mt-2">
                    <i className="fas fa-info-circle me-2"></i>
                    {errors.images}
                  </div>
                )}
                <div className="form-text text-end mt-2">
                  Max 4 images • 5MB each
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="row row-cols-2 row-cols-md-4 g-3 mt-4">
                  {imagePreviews.map((src, index) => (
                    <div className="col" key={index}>
                      <div className="preview-container rounded-3 overflow-hidden">
                        <img
                          src={src}
                          alt={`Preview ${index + 1}`}
                          className="preview-image"
                        />
                        <div className="preview-overlay">
                          <button
                            type="button"
                            className="btn btn-dark btn-sm rounded-circle"
                            onClick={() => {
                              const newPreviews = [...imagePreviews];
                              newPreviews.splice(index, 1);
                              setImagePreviews(newPreviews);
                              setFormData((prev) => ({
                                ...prev,
                                images: prev.images.filter(
                                  (_, i) => i !== index
                                ),
                              }));
                            }}
                          >
                            <i className="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="d-grid mt-4">
              <button
                type="submit"
                className="btn btn-luxury-gradient py-3"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Creating Masterpiece...
                  </>
                ) : (
                  <>
                    <i className="fas fa-sparkles me-2"></i>
                    Publish Creation
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Luxurious Custom Styles */}
      <style jsx>{`
        .luxury-card {
          background: #f8f9fa;
          border: 1px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .text-gradient {
          background: linear-gradient(45deg, #2d3436, #6c5ce7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .luxury-input,
        .luxury-select,
        .luxury-textarea {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid #e0e0e0;
          transition: all 0.3s ease;
        }

        .luxury-input:focus,
        .luxury-select:focus,
        .luxury-textarea:focus {
          background: white;
          border-color: #a8a4ce;
          box-shadow: 0 0 0 3px rgba(108, 92, 231, 0.1);
        }

        .luxury-file-input {
          opacity: 0;
          position: absolute;
          z-index: 2;
        }

        .file-upload-wrapper {
          position: relative;
          border: 2px dashed #dee2e6;
          border-radius: 1rem;
          padding: 2rem;
          text-align: center;
          transition: all 0.3s ease;
        }

        .file-upload-wrapper:hover {
          border-color: #6c5ce7;
          background: rgba(108, 92, 231, 0.05);
        }

        .file-upload-label {
          color: #6c5ce7;
          font-weight: 500;
        }

        .preview-container {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          transition: transform 0.3s ease;
        }

        .preview-container:hover {
          transform: translateY(-2px);
        }

        .preview-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
        }

        .preview-overlay {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .preview-container:hover .preview-overlay {
          opacity: 1;
        }

        .btn-luxury-gradient {
          background: linear-gradient(45deg, #6c5ce7, #2d3436);
          color: white;
          border: none;
          font-weight: 500;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
        }

        .btn-luxury-gradient:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 20px rgba(108, 92, 231, 0.2);
        }

        .alert-elegant {
          background: #fff3cd;
          border-color: #ffeeba;
          color: #856404;
          border-radius: 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default AddProductForm;