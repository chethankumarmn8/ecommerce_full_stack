import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Spinner,
  Card,
  Row,
  Col,
} from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaCheckCircle } from "react-icons/fa";

const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");
  const navigate = useNavigate();

  // Gold theme constants
  const goldGradient = "linear-gradient(135deg, #d4af37 0%, #b8860b 100%)";
  const goldShadow = "0 4px 20px rgba(212, 175, 55, 0.3)";

  useEffect(() => {
    setErrors({});
    setApiError("");
  }, [formData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!validateEmail(formData.email))
      newErrors.email = "Invalid email address";
    if (formData.password.length < 8)
      newErrors.password = "Minimum 8 characters required";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords must match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/", { state: { registrationSuccess: true } });
    } catch (err) {
      setApiError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container
      fluid
      className="d-flex justify-content-center align-items-center min-vh-100 bg-lightgolden"
    >
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .gold-border {
          border: 2px solid transparent;
          background-image: linear-gradient(white, white), ${goldGradient};
          background-origin: border-box;
          background-clip: padding-box, border-box;
        }
        .input-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #d4af37;
          z-index: 4;
        }
      `}</style>

      <Row className="w-100">
        <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
          <Card
            className="shadow-lg border-0 rounded-4 overflow-hidden"
            style={{
              animation: "fadeIn 0.8s ease-out",
              background: "linear-gradient(145deg, #fffcf5, #ffffff)",
            }}
          >
            <div
              className="card-header py-4 text-center position-relative"
              style={{
                background: goldGradient,
                clipPath: "polygon(0 0, 100% 0, 100% 90%, 0 100%)",
                paddingBottom: "3rem",
              }}
            >
              <h1 className="text-white mb-3 fw-bold">
                <FaUser className="me-2" />
                Create Account
              </h1>
              <p className="text-light mb-0">Join Our Golden Community</p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {apiError && (
                <Alert
                  variant="warning"
                  dismissible
                  onClose={() => setApiError("")}
                  className="rounded-3 border-2 border-gold bg-lightgolden"
                >
                  <FaCheckCircle className="me-2" />
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="fw-semibold text-darkgold">
                    Full Name
                  </Form.Label>
                  <div className="position-relative">
                    <FaUser className="input-icon" />
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      isInvalid={!!errors.name}
                      className="ps-5 rounded-3"
                      placeholder="Enter your full name"
                      style={{ borderColor: "#d4af37" }}
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center"
                  >
                    <FaCheckCircle className="me-2" />
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="fw-semibold text-darkgold">
                    Email Address
                  </Form.Label>
                  <div className="position-relative">
                    <FaEnvelope className="input-icon" />
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      isInvalid={!!errors.email}
                      className="ps-5 rounded-3"
                      placeholder="Enter your email"
                      style={{ borderColor: "#d4af37" }}
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center"
                  >
                    <FaCheckCircle className="me-2" />
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="fw-semibold text-darkgold">
                    Password
                  </Form.Label>
                  <div className="position-relative">
                    <FaLock className="input-icon" />
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      isInvalid={!!errors.password}
                      className="ps-5 rounded-3"
                      placeholder="Create password"
                      style={{ borderColor: "#d4af37" }}
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center"
                  >
                    <FaCheckCircle className="me-2" />
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirm Password Field */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="fw-semibold text-darkgold">
                    Confirm Password
                  </Form.Label>
                  <div className="position-relative">
                    <FaLock className="input-icon" />
                    <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      isInvalid={!!errors.confirmPassword}
                      className="ps-5 rounded-3"
                      placeholder="Confirm password"
                      style={{ borderColor: "#d4af37" }}
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center"
                  >
                    <FaCheckCircle className="me-2" />
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-100 py-3 fw-bold position-relative overflow-hidden"
                  disabled={isSubmitting}
                  style={{
                    background: goldGradient,
                    border: "none",
                    borderRadius: "15px",
                    boxShadow: goldShadow,
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.target.style.transform = "translateY(-2px)")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.transform = "translateY(0)")
                  }
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span className="position-relative z-2">
                        Become Member
                      </span>
                      <div
                        className="position-absolute top-0 start-0 w-100 h-100"
                        style={{
                          background:
                            "linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.2) 50%, transparent 75%)",
                          animation: "shine 2s infinite linear",
                          opacity: 0.3,
                        }}
                      />
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <p className="text-center mt-4 mb-0 text-muted">
                  Already golden?{" "}
                  <a
                    href="/login"
                    className="text-gold fw-semibold text-decoration-none"
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => (e.target.style.color = "#b8860b")}
                    onMouseLeave={(e) => (e.target.style.color = "#d4af37")}
                  >
                    Sign In Here
                  </a>
                </p>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Register;