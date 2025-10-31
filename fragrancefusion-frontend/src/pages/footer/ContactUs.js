// ContactUs.js
import React from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { GeoAltFill, EnvelopeFill, TelephoneFill, ClockFill, SendFill } from "react-bootstrap-icons";

const ContactUs = () => {
    return (
        <Container fluid className="contact-container px-0">
            {/* Hero Section */}
            <div className="contact-hero bg-gradient-primary py-6">
                <Row className="justify-content-center">
                    <Col xl={8} lg={10} className="text-center">
                        <h1 className="display-3 text-white mb-3 fw-bold">Get in Touch</h1>
                        <p className="lead text-light opacity-75">We're here to help and answer any questions you might have</p>
                    </Col>
                </Row>
            </div>

            <Container className="py-6">
                <Row className="g-5">
                    {/* Contact Form */}
                    <Col lg={6} className="pe-lg-5">
                        <div className="contact-form-card p-5 rounded-4 shadow-lg">
                            <h3 className="mb-4 fw-semibold text-primary">Send us a message</h3>
                            <Form>
                                <Form.Group className="mb-4" controlId="formName">
                                    <Form.Label className="fw-medium">Full Name</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-primary text-white">
                                            <i className="bi bi-person-fill"></i>
                                        </span>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter your name"
                                            className="form-control-lg"
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formEmail">
                                    <Form.Label className="fw-medium">Email address</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-primary text-white">
                                            <EnvelopeFill />
                                        </span>
                                        <Form.Control
                                            type="email"
                                            placeholder="Enter your email"
                                            className="form-control-lg"
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formSubject">
                                    <Form.Label className="fw-medium">Subject</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-primary text-white">
                                            <i className="bi bi-chat-square-text-fill"></i>
                                        </span>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter subject"
                                            className="form-control-lg"
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Form.Group className="mb-4" controlId="formMessage">
                                    <Form.Label className="fw-medium">Message</Form.Label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-primary text-white align-items-start">
                                            <i className="bi bi-pencil-fill"></i>
                                        </span>
                                        <Form.Control
                                            as="textarea"
                                            rows={5}
                                            placeholder="Enter your message"
                                            className="form-control-lg"
                                            required
                                        />
                                    </div>
                                </Form.Group>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="w-100 py-3 fw-bold rounded-pill gradient-btn"
                                >
                                    <SendFill className="me-2" />
                                    Send Message
                                </Button>
                            </Form>
                        </div>
                    </Col>

                    {/* Contact Info */}
                    <Col lg={6} className="ps-lg-5">
                        <div className="contact-info-card p-5 rounded-4 shadow-lg">
                            <h3 className="mb-4 fw-semibold text-primary">Contact Information</h3>

                            <div className="d-flex align-items-start mb-5">
                                <div className="icon-wrapper bg-primary text-white rounded-circle me-4">
                                    <GeoAltFill size={24} />
                                </div>
                                <div>
                                    <h5 className="fw-medium mb-2">Our Studio</h5>
                                    <p className="mb-1">VividHands Crafts Studio</p>
                                    <p className="mb-1">13927 South Gessner Road</p>
                                    <p>Mumbai 400001, India</p>
                                    <div className="map-placeholder mt-3 rounded-3 overflow-hidden">
                                        <iframe
                                            title="studio-location"
                                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.755837470961!2d72.82821431537725!3d19.07572225747793!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c627a20bcaa9%3A0x2fdcfcc91b73d4cd!2sMumbai%20Central%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1659874222149!5m2!1sen!2sin"
                                            width="100%"
                                            height="200"
                                            style={{ border: 0 }}
                                            allowFullScreen=""
                                            loading="lazy"
                                        ></iframe>
                                    </div>
                                </div>
                            </div>

                            <div className="d-flex align-items-start mb-5">
                                <div className="icon-wrapper bg-primary text-white rounded-circle me-4">
                                    <TelephoneFill size={24} />
                                </div>
                                <div>
                                    <h5 className="fw-medium mb-2">Direct Contacts</h5>
                                    <p className="mb-1">📞 +91 22 1234 5678</p>
                                    <p>✉️ hello@vividhands.com</p>
                                </div>
                            </div>

                            <div className="d-flex align-items-start mb-4">
                                <div className="icon-wrapper bg-primary text-white rounded-circle me-4">
                                    <ClockFill size={24} />
                                </div>
                                <div>
                                    <h5 className="fw-medium mb-2">Working Hours</h5>
                                    <p className="mb-1">Mon-Fri: 9AM - 6PM</p>
                                    <p>Sat: 10AM - 4PM</p>
                                </div>
                            </div>

                            <div className="social-links mt-5 pt-4 border-top">
                                <h5 className="fw-medium mb-3">Follow Us</h5>
                                <div className="d-flex gap-3">
                                    <Button variant="outline-primary" className="rounded-circle p-2">
                                        <i className="bi bi-facebook"></i>
                                    </Button>
                                    <Button variant="outline-primary" className="rounded-circle p-2">
                                        <i className="bi bi-instagram"></i>
                                    </Button>
                                    <Button variant="outline-primary" className="rounded-circle p-2">
                                        <i className="bi bi-linkedin"></i>
                                    </Button>
                                    <Button variant="outline-primary" className="rounded-circle p-2">
                                        <i className="bi bi-pinterest"></i>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default ContactUs;