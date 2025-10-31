import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { Carousel, Badge, Button, ProgressBar } from "react-bootstrap";

const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem("artisanToken");
        if (!token) {
          console.error("No authentication token found");
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/products/my-products",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        console.log("API Response:", response.data);
        console.log("Is array?", Array.isArray(response.data));

        if (Array.isArray(response.data)) {
          console.log("Product IDs:", response.data.map(p => p.id));
          setProducts(response.data);
        } else {
          console.error("Expected array but got:", typeof response.data);
          setError("Invalid data format received");
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setError(error.response?.data?.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("artisanToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      await axios.delete(
        `http://localhost:8080/api/products/delete/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProducts(products.filter((product) => product.id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      setError(error.response?.data?.message || "Failed to delete product");
    }
  };

  const getScoreColor = (score) => {
    if (score >= 8) return "success";
    if (score >= 5) return "warning";
    return "danger";
  };

  const getStockColor = (stock) => {
    if (stock === 0) return "danger"; // Added this condition for stock 0
    if (stock > 50) return "success";
    if (stock > 20) return "warning";
    return "danger";
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-primary">
          <i className="bi bi-brush me-2"></i>My Artisan Creations
        </h2>
        <Button
          as={Link}
          to="/artisan/dashboard/add-product"
          variant="primary"
          className="rounded-pill px-4 shadow-sm text-white"
        >
          <i className="bi bi-plus-lg me-2"></i>New Creation
        </Button>
      </div>

      {error && (
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center p-5 bg-light rounded-4 shadow">
          <div className="mb-4 text-primary">
            <i className="bi bi-palette display-3"></i>
          </div>
          <h3 className="mb-3 text-dark">Craft Your First Masterpiece</h3>
          <p className="text-muted mb-4">
            Transform your vision into a tangible creation
          </p>
          <Link
            to="/artisan/dashboard/add-product"
            className="btn btn-primary rounded-pill px-5 shadow-sm text-white"
          >
            <i className="bi bi-sparkles me-2"></i>Begin Crafting
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map((product) => (
            <div className="col" key={product.id}>
              <div className="card h-100 shadow hover-shadow-lg transition-all border-0 overflow-hidden">
                <div className="position-relative">
                  {product.imageData && product.imageData.length > 0 ? (
                    <Carousel indicators={false} interval={null} className="rounded-top">
                      {product.imageData.map((image, index) => (
                        <Carousel.Item key={index}>
                          <div className="ratio ratio-1x1">
                            <img
                              src={image}
                              className="d-block w-100 h-100 object-fit-cover rounded-top"
                              alt={`Product ${product.name} ${index + 1}`}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.parentElement.innerHTML = `
                                  <div class="w-100 h-100 d-flex align-items-center justify-content-center bg-light-subtle">
                                    <span>Image not available</span>
                                  </div>
                                `;
                              }}
                            />
                          </div>
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <div className="ratio ratio-1x1 bg-light-subtle d-flex align-items-center justify-content-center rounded-top">
                      <span className="text-muted">No Image Available</span>
                    </div>
                  )}

                  {/* Ethical Score Badge */}
                  <div className="position-absolute top-0 start-0 m-3">
                    <div className={`badge bg-${getScoreColor(product.ethicalScore)} bg-opacity-10 text-${getScoreColor(product.ethicalScore)} d-flex align-items-center p-2 shadow-sm rounded-3`}>
                      <i className={`bi bi-star-fill me-1 text-${getScoreColor(product.ethicalScore)}`}></i>
                      <span className="fs-5 fw-bold">{product.ethicalScore}</span>
                    </div>
                  </div>

                  {/* Out of Stock Badge */}
                  <div className="position-absolute top-0 end-0 m-3">
                    {product.stock === 0 && (
                      <div className="badge bg-danger bg-opacity-90 text-white d-flex align-items-center p-2 shadow-sm rounded-3">
                        <i className="bi bi-x-octagon-fill me-1"></i>
                        <span className="fw-bold">Sold Out</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h3 className="h5 fw-bold mb-0 text-dark truncate-text">
                      {product.name}
                    </h3>
                    <span className="h5 text-primary mb-0">
                      ${product.price.toLocaleString()}
                    </span>
                  </div>

                  <div className="mb-3">
                    <Badge pill bg="dark" className="me-1 shadow-sm text-white">
                      <i className="bi bi-tag-fill me-1"></i>
                      {product.category}
                    </Badge>
                  </div>

                  <p className="card-text text-muted mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mb-3">
                    <h6 className="text-uppercase small fw-bold text-muted mb-2">
                      <i className="bi bi-tools me-1"></i>Craft Materials
                    </h6>
                    <div className="d-flex flex-wrap gap-2">
                      {product.materials && product.materials.split(",").map((material, index) => (
                        <Badge
                          key={index}
                          pill
                          bg="info"
                          className="border-0 shadow-sm text-white"
                        >
                          {material.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Inventory Section */}
                  <div className="mb-3">
                    <div className="d-flex justify-content-between small text-muted mb-2">
                      <span>
                        <i className="bi bi-box-seam me-1"></i>Inventory
                      </span>
                      <span>
                        {product.stock === 0 ? (
                          <span className="text-danger">Out of Stock</span>
                        ) : (
                          `${product.stock} available`
                        )}
                      </span>
                    </div>
                    {product.stock > 0 ? (
                      <ProgressBar
                        variant={getStockColor(product.stock)}
                        now={product.stock}
                        max={100}
                        className="rounded-pill shadow-sm bg-opacity-25"
                        style={{ height: "8px" }}
                      />
                    ) : (
                      <div className="text-danger small">
                        <i className="bi bi-exclamation-circle-fill me-1"></i>
                        This product is currently unavailable
                      </div>
                    )}
                  </div>
                </div>

                <div className="card-footer bg-transparent border-top-0 pt-0">
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button
                      as={Link}
                      to={`/artisan/dashboard/edit-product/${product.id}`}
                      variant="outline-primary"
                      size="sm"
                      className="rounded-pill px-3 shadow-sm"
                    >
                      <i className="bi bi-pencil-fill me-2"></i>Edit
                    </Button>
                    <Button
                      onClick={() => handleDelete(product.id)}
                      variant="outline-danger"
                      size="sm"
                      className="rounded-pill px-3 shadow-sm"
                    >
                      <i className="bi bi-trash-fill me-2"></i>Delete
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;