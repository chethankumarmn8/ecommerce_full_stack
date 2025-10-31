import React from "react";
import { Container, Row, Col, Accordion, Button, Form } from "react-bootstrap";

const HelpCenter = () => {
    return (
        <Container className="py-5 min-vh-100 bg-light">
            {/* Header and Search */}
            <Row className="mb-5 text-center">
                <Col>
                    <h1 className="display-4 fw-bold text-warning">How can we help you?</h1>
                    <Form className="w-75 mx-auto mt-4">
                        <Form.Control
                            type="search"
                            placeholder="Search our help articles..."
                            className="rounded-pill border border-warning shadow-sm py-3 px-4"
                        />
                    </Form>
                </Col>
            </Row>

            {/* Accordion Section */}
            <Row>
                <Col lg={10} className="mx-auto">
                    <Accordion defaultActiveKey="0" className="bg-white shadow rounded-4 overflow-hidden">
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>📦 Order Tracking</Accordion.Header>
                            <Accordion.Body>
                                <p>Track your order through these steps:</p>
                                <ol>
                                    <li>Visit your account dashboard</li>
                                    <li>Click 'Order History'</li>
                                    <li>Press 'Track Package' next to your order</li>
                                </ol>
                                <p className="text-muted small">
                                    ⏱ Tracking may take 24-48 hours to appear after shipment.
                                </p>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="1">
                            <Accordion.Header>🔁 Returns & Exchanges</Accordion.Header>
                            <Accordion.Body>
                                <div className="alert alert-info">
                                    Custom-made items may not be eligible for return. Check our{" "}
                                    <a href="/return-policy" className="alert-link">return policy</a>.
                                </div>
                                <div className="d-flex gap-2 flex-wrap">
                                    <Button variant="outline-primary">Start Return</Button>
                                    <Button variant="outline-success">Request Exchange</Button>
                                </div>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey="2">
                            <Accordion.Header>🎨 Custom Orders</Accordion.Header>
                            <Accordion.Body>
                                <p>When making a custom order, please include:</p>
                                <ul>
                                    <li>Detailed specifications</li>
                                    <li>Preferred materials</li>
                                    <li>Expected timeline</li>
                                    <li>Reference images (optional)</li>
                                </ul>
                                <Button variant="primary" className="mt-3">
                                    ✉️ Email Our Crafts Team
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>

            {/* Contact Section */}
            <Row className="mt-5">
                <Col md={10} className="mx-auto text-center bg-white p-5 rounded-4 shadow">
                    <h3 className="mb-4 text-dark">Need more help?</h3>
                    <Row className="justify-content-center gy-4">
                        <Col md={4}>
                            <div className="p-4 border rounded-3 h-100">
                                <h5>📧 Email Support</h5>
                                <p>crafts@vividhands.com</p>
                                <small className="text-muted">Responds within 24 hours</small>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="p-4 border rounded-3 h-100">
                                <h5>📞 Phone Support</h5>
                                <p>+1 (800) 555-0192</p>
                                <small className="text-muted">Mon–Fri: 9AM–7PM EST</small>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="p-4 border rounded-3 h-100">
                                <h5>💬 Live Chat</h5>
                                <Button variant="success" size="sm" className="mt-2">Start Chat</Button>
                                <p className="mt-2"><small className="text-muted">Available Now</small></p>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default HelpCenter;
