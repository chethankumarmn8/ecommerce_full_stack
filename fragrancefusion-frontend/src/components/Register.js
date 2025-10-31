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
import { FaUser, FaEnvelope, FaLock, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

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

  // Sophisticated Dark & Radiant Accent Theme constants
  const primaryDark = "#1A202C"; // A very dark almost-black for background and main text
  const secondaryDark = "#2D3748"; // Slightly lighter dark for card background
  const accentColor = "#667EEA"; // A vibrant, rich blue-violet for highlights (can be changed to #FC5D9E for a warm pink or #FFD166 for soft yellow)
  const successGreen = "#28A745"; // Standard success green
  const dangerRed = "#DC3545"; // Standard danger red
  const softGrey = "#A0AEC0"; // For muted text, placeholder
  const cardShadow = "0 20px 40px rgba(0, 0, 0, 0.3)"; // More pronounced shadow for depth
  const buttonGradient = `linear-gradient(45deg, ${accentColor} 0%, #805AD5 100%)`; // Blue-violet to deep purple
  const inputBorderFocus = `1px solid ${accentColor}`;

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
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{ background: primaryDark }} // Dark background
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap');
        body {
          font-family: 'Inter', sans-serif;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-elegant {
          animation: fadeIn 0.8s ease-out;
          box-shadow: ${cardShadow};
          border: none;
          background: ${secondaryDark}; /* Dark card background */
          color: white; /* Default text color for card */
        }
        .form-control-elegant {
          background-color: ${primaryDark}; /* Darker input background */
          color: white; /* White text in inputs */
          border: 1px solid ${softGrey} !important;
          padding-left: 3rem; /* More space for icon */
          height: 3.5rem; /* Taller inputs */
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .form-control-elegant::placeholder {
            color: ${softGrey}; /* Muted placeholder text */
            opacity: 0.7;
        }
        .form-control-elegant:focus {
          border: ${inputBorderFocus} !important;
          box-shadow: 0 0 0 0.25rem rgba(102, 126, 234, 0.25) !important; /* Accent color shadow */
          background-color: ${primaryDark}; /* Keep dark background on focus */
          color: white;
        }
        .input-icon {
          position: absolute;
          left: 1rem; /* Adjust icon position */
          top: 50%;
          transform: translateY(-50%);
          color: ${accentColor}; /* Accent color for icons */
          font-size: 1.2rem; /* Larger icons */
          z-index: 4;
        }
        .btn-accent {
          background: ${buttonGradient};
          border: none;
          border-radius: 0.75rem;
          padding: 1rem 2rem; /* More prominent button */
          font-weight: 700; /* Bolder text */
          font-size: 1.1rem; /* Larger text */
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          color: white;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3); /* Accent shadow */
          letter-spacing: 0.05em; /* Spaced out text */
        }
        .btn-accent:hover {
          transform: translateY(-5px); /* More pronounced lift */
          box-shadow: 0 15px 30px rgba(102, 126, 234, 0.4); /* Stronger shadow */
          background: linear-gradient(45deg, #805AD5 0%, ${accentColor} 100%); /* Reverse gradient on hover */
        }
        .btn-accent::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.15); /* Softer shine */
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1); /* Smoother transition */
          z-index: -1;
          transform: skewX(-30deg); /* More angled shine */
        }
        .btn-accent:hover::before {
          left: 100%;
        }
        .text-accent {
            color: ${accentColor} !important;
        }
        .text-soft-grey {
            color: ${softGrey} !important;
        }
        .bg-accent-gradient {
            background: ${buttonGradient};
        }
        .form-label-elegant {
            color: ${softGrey}; /* Labels are softer grey */
            font-weight: 600;
            margin-bottom: 0.5rem; /* Space below label */
        }
        .alert-error {
            background-color: ${dangerRed}20; /* Light tint of red */
            border-color: ${dangerRed};
            color: ${dangerRed};
            font-weight: 600;
        }
      `}</style>

      <Row className="w-100">
        <Col xs={12} md={8} lg={6} xl={5} className="mx-auto">
          <Card
            className="rounded-4 overflow-hidden card-elegant"
          >
            <div
              className="card-header py-5 text-center position-relative bg-accent-gradient"
              style={{
                clipPath: "polygon(0 0, 100% 0, 100% 85%, 0 100%)", // Sharper bottom edge
                paddingBottom: "4rem", // More space
              }}
            >
              <h1 className="text-white mb-3 fw-bold display-5"> {/* Larger, bolder heading */}
                <FaUser className="me-3" /> {/* Larger icon */}
                Sign Up
              </h1>
              <p className="text-white-75 mb-0 fs-5 opacity-75">
                Join our exclusive community
              </p>
            </div>

            <Card.Body className="p-4 p-md-5">
              {apiError && (
                <Alert
                  variant="danger"
                  dismissible
                  onClose={() => setApiError("")}
                  className="rounded-3 border-2 alert-error"
                >
                  <FaExclamationCircle className="me-2" />
                  {apiError}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Name Field */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="form-label-elegant">
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
                      className="form-control-elegant rounded-3"
                      placeholder="Your full name"
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center mt-2 text-danger" // Text red
                  >
                    <FaExclamationCircle className="me-2" />
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Email Field */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="form-label-elegant">
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
                      className="form-control-elegant rounded-3"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center mt-2 text-danger"
                  >
                    <FaExclamationCircle className="me-2" />
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Password Field */}
                <Form.Group className="mb-4 position-relative">
                  <Form.Label className="form-label-elegant">
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
                      className="form-control-elegant rounded-3"
                      placeholder="••••••••"
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center mt-2 text-danger"
                  >
                    <FaExclamationCircle className="me-2" />
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Confirm Password Field */}
                <Form.Group className="mb-5 position-relative"> {/* Increased margin bottom */}
                  <Form.Label className="form-label-elegant">
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
                      className="form-control-elegant rounded-3"
                      placeholder="••••••••"
                    />
                  </div>
                  <Form.Control.Feedback
                    type="invalid"
                    className="d-flex align-items-center mt-2 text-danger"
                  >
                    <FaExclamationCircle className="me-2" />
                    {errors.confirmPassword}
                  </Form.Control.Feedback>
                </Form.Group>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-100 btn-accent"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        className="me-2"
                      />
                      Registering...
                    </>
                  ) : (
                    <>
                      <span className="position-relative z-2">
                        Create My Account
                      </span>
                    </>
                  )}
                </Button>

                {/* Login Link */}
                <p className="text-center mt-4 mb-0 text-soft-grey">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-accent fw-semibold text-decoration-none"
                    style={{ transition: "color 0.3s ease" }}
                    onMouseEnter={(e) => (e.target.style.color = "#805AD5")} // Darker accent on hover
                    onMouseLeave={(e) => (e.target.style.color = accentColor)}
                  >
                    Sign In
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