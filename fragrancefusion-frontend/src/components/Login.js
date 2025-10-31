import React, { useState, useCallback, memo } from "react";
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";
import { Envelope, Lock, Person } from "react-bootstrap-icons";
import { useAuth } from '../context/AuthContext';

const LUXURY_PALETTE = {
  primary: "#2A1E2E",    // Deep aubergine
  accent: "#B76E79",    // Rose gold
  background: "#F8F4F0", // Ivory
  text: "#3C2B3A",      // Dark plum
  gradient: "linear-gradient(135deg, #2A1E2E 0%, #4A334D 100%)",
  lightAccent: "#D8C4C8" // Muted rose
};

const INPUT_STYLE = {
  borderColor: LUXURY_PALETTE.accent,
  boxShadow: `0 0 8px ${LUXURY_PALETTE.lightAccent}`,
  borderRadius: "0.5rem",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};

const Login = memo(() => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const success = await login({ email, password });
      if (!success) {
        throw new Error("Authentication failed. Please verify your credentials");
      }
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message || "Authentication error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [email, password, login]);

  return (
    <div className="d-flex min-vh-100" style={{ backgroundColor: LUXURY_PALETTE.background }}>
      <Container className="d-flex align-items-center justify-content-center">
        <Card
          className="shadow-lg border-0 overflow-hidden"
          style={{
            maxWidth: "500px",
            backgroundColor: "rgba(255, 255, 255, 0.97)",
            backdropFilter: "blur(12px)",
            border: `2px solid ${LUXURY_PALETTE.lightAccent}`,
            borderRadius: "1.5rem",
            boxShadow: "0 12px 40px rgba(42, 30, 46, 0.1)"
          }}
        >
          <Card.Body className="p-4 p-md-5">
            <div className="text-center mb-4">
              <div
                className="rounded-circle d-inline-flex p-3 mb-3"
                style={{
                  background: LUXURY_PALETTE.gradient,
                  boxShadow: `0 6px 24px ${LUXURY_PALETTE.lightAccent}`,
                  animation: "float 3s ease-in-out infinite"
                }}
              >
                <Person
                  className="text-white"
                  size={28}
                  style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.1))" }}
                />
              </div>
              <h3 className="mb-2 fw-bold" style={{
                color: LUXURY_PALETTE.primary,
                fontFamily: "'Playfair Display', serif",
                letterSpacing: "0.05em"
              }}>
                Fragrance Fusion
              </h3>
              <p className="mb-0" style={{
                color: LUXURY_PALETTE.text,
                fontSize: "0.9rem",
                letterSpacing: "0.1em"
              }}>
                Master Perfumer Portal
              </p>
            </div>

            {error && (
              <Alert
                variant="warning"
                className="d-flex align-items-center py-2 mb-4"
                style={{
                  background: "#FFF5F7",
                  border: `2px solid ${LUXURY_PALETTE.accent}`,
                  borderRadius: "0.75rem",
                  color: LUXURY_PALETTE.primary
                }}
              >
                <i className="bi bi-exclamation-circle-fill me-2" style={{ color: LUXURY_PALETTE.accent }}></i>
                <span className="small">{error}</span>
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-semibold" style={{ color: LUXURY_PALETTE.primary }}>
                  Alchemist Email
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    className="bg-light border-end-0"
                    style={{
                      borderColor: LUXURY_PALETTE.accent,
                      backgroundColor: "rgba(183, 110, 121, 0.05)",
                      borderTopLeftRadius: "0.5rem",
                      borderBottomLeftRadius: "0.5rem"
                    }}
                  >
                    <Envelope style={{ color: LUXURY_PALETTE.accent }} size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="email"
                    placeholder="alchimiste@parfum.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={INPUT_STYLE}
                  />
                </InputGroup>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="small fw-semibold" style={{ color: LUXURY_PALETTE.primary }}>
                  Secret Formula
                </Form.Label>
                <InputGroup>
                  <InputGroup.Text
                    className="bg-light border-end-0"
                    style={{
                      borderColor: LUXURY_PALETTE.accent,
                      backgroundColor: "rgba(183, 110, 121, 0.05)",
                      borderTopLeftRadius: "0.5rem",
                      borderBottomLeftRadius: "0.5rem"
                    }}
                  >
                    <Lock style={{ color: LUXURY_PALETTE.accent }} size={18} />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={INPUT_STYLE}
                  />
                </InputGroup>
              </Form.Group>

              <Button
                className="w-100 fw-bold py-2"
                type="submit"
                disabled={isLoading}
                style={{
                  background: LUXURY_PALETTE.gradient,
                  border: "none",
                  borderRadius: "0.75rem",
                  transition: "all 0.3s ease",
                  position: "relative",
                  overflow: "hidden",
                  padding: "0.75rem",
                  fontSize: "1rem",
                  letterSpacing: "0.05em"
                }}
              >
                {isLoading ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    <span>Entering Atelier...</span>
                  </>
                ) : (
                  "Unveil Scents"
                )}
              </Button>

              <div className="text-center small mt-4" style={{ color: LUXURY_PALETTE.text }}>
                New Perfumer?{" "}
                <a
                  href="/register"
                  className="text-decoration-none hover-underline"
                  style={{
                    color: LUXURY_PALETTE.primary,
                    transition: "all 0.3s ease",
                    borderBottom: "1px dashed currentColor"
                  }}
                >
                  Craft Your Legacy
                </a>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <style global jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        .hover-underline:hover {
          border-bottom-style: solid;
          text-decoration: none;
        }

        .spinner-border {
          vertical-align: -0.125em;
        }
      `}</style>
    </div>
  );
});

export default Login;