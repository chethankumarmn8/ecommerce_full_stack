import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";

const EditProductForm = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    materials: "",
    ethicalScore: 0,
    images: [],
  });

  const [existingImages, setExistingImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const token = localStorage.getItem("artisanToken");

  const categoryOptions = [
    "Jewelry",
    "Home Decor",
    "Art",
    "Apparel",
    "Toys",
    "Wellness",
    "Stationery",
    "Bags & Accessories",
    "Kitchen & Dining",
  ];

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/products/${productId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const product = response.data;
        setFormData({
          name: product.name,
          description: product.description,
          price: product.price,
          category: product.category,
          stock: product.stock,
          materials: product.materials,
          ethicalScore: product.ethicalScore,
          images: [],
        });
        setExistingImages(product.imageData || []);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [productId, token]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const MAX_FILE_SIZE = 5 * 1024 * 1024;

    if (files.some((file) => file.size > MAX_FILE_SIZE)) {
      alert("Each file must be smaller than 5MB");
      return;
    }

    if (files.length > 4) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    setFormData((prev) => ({ ...prev, images: files }));
    setImagePreviews(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") {
        data.append(key, value);
      }
    });

    formData.images.forEach((image) => {
      data.append("images", image);
    });

    try {
      await axios.put(
        `http://localhost:8080/api/products/update/${productId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Product updated successfully!");
      navigate("/artisan/dashboard/products");
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Error updating product");
    }
  };

  return (
    <Container fluid className="py-5 bg-light">
      <Container className="py-5">
        <Card className="border-0 rounded-4 shadow-lg overflow-hidden">
          <Card.Header className="bg-dark text-white py-4">
            <h2 className="mb-0 text-center fw-bold text-uppercase letter-spacing-2">
              <i className="fas fa-gem me-2"></i>Edit Product
            </h2>
          </Card.Header>
          <Card.Body className="p-5 bg-white">
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              {/* Form Groups - Updated Styling */}
              <Row className="mb-4">
                <Col>
                  <Form.Group controlId="productName">
                    <Form.Label className="text-dark-600 fw-medium mb-2">
                      Product Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4">
                <Col>
                  <Form.Group controlId="productDescription">
                    <Form.Label className="text-dark-600 fw-medium mb-2">
                      Description
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-4 g-4">
                <Col md={6}>
                  <Form.Group controlId="productCategory">
                    <Form.Label className="text-dark-600 fw-medium mb-2">
                      Category
                    </Form.Label>
                    <Form.Select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                      required
                    >
                      <option value="">-- Select Category --</option>
                      {categoryOptions.map((cat, index) => (
                        <option key={index} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="productPrice">
                    <Form.Label className="text-dark-600 fw-medium mb-2">
                      Price (₹)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={3}>
                  <Form.Group controlId="productStock">
                    <Form.Label className="text-dark-600 fw-medium mb-2">
                      Stock
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              {/* Materials and Ethical Score */}
              <Row className="mb-4 g-4">
                <Col md={6}>
                  <Form.Group controlId="productMaterials">
                    <Form.Label className="text-dark-600 fw-medium mb-2">
                      Materials Used
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="materials"
                      value={formData.materials}
                      onChange={handleInputChange}
                      className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group controlId="ethicalScore">
                    <Form.Label className="text-dark-600 fw-medium mb-2">
                      Ethical Score
                    </Form.Label>
                    <div className="position-relative">
                      <Form.Control
                        type="number"
                        name="ethicalScore"
                        value={formData.ethicalScore}
                        onChange={handleInputChange}
                        className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                        min={1}
                        max={10}
                        required
                      />
                      <small className="position-absolute end-0 top-50 translate-middle-y me-3 text-dark-500">
                        1-10 Scale
                      </small>
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Image Upload Section */}
              <Form.Group className="mb-5">
                <Form.Label className="text-dark-600 fw-medium mb-3">
                  Product Images
                  <small className="text-muted ms-2">(Max 4 images)</small>
                </Form.Label>
                <div className="custom-file-upload">
                  <Form.Control
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control-lg border-dark-200 focus-ring focus-ring-dark-200"
                  />
                </div>
              </Form.Group>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="mb-5">
                  <h6 className="text-dark-600 fw-medium mb-3">New Previews</h6>
                  <Row className="g-4">
                    {imagePreviews.map((preview, index) => (
                      <Col key={index} xs={6} md={3}>
                        <div className="ratio ratio-1x1">
                          <img
                            src={preview}
                            className="img-fluid rounded-3 object-fit-cover shadow-sm"
                            alt={`preview-${index}`}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {existingImages.length > 0 && (
                <div className="mb-5">
                  <h6 className="text-dark-600 fw-medium mb-3">
                    Existing Images
                  </h6>
                  <Row className="g-4">
                    {existingImages.map((image, index) => (
                      <Col key={index} xs={6} md={3}>
                        <div className="ratio ratio-1x1">
                          <img
                            src={image}
                            className="img-fluid rounded-3 object-fit-cover shadow-sm"
                            alt={`existing-${index}`}
                          />
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {/* Submit Button */}
              <div className="text-center mt-5">
                <Button
                  variant="dark"
                  type="submit"
                  size="lg"
                  className="px-5 py-3 rounded-3 fw-bold text-uppercase letter-spacing-1 bg-gradient-dark-hover"
                >
                  Update Luxury Product
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Container>
  );
};

export default EditProductForm;
