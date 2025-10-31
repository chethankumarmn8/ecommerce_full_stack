import React from "react";
import { Container, Row, Col, Card, Button, Carousel } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./Careers.css"; // Create this CSS file for custom styles

const Careers = () => {
    const openPositions = [
        { id: 1, title: "Artisan Craftsperson", location: "Mumbai Studio", department: "Production", type: "Full-time", salary: "₹25K - ₹35K" },
        { id: 2, title: "Quality Control Specialist", location: "Remote", department: "Operations", type: "Contract", salary: "₹30K - ₹40K" },
        { id: 3, title: "E-commerce Manager", location: "Delhi Office", department: "Marketing", type: "Full-time", salary: "₹45K - ₹60K" }
    ];

    const benefits = [
        { icon: "bi-globe", title: "Global Impact", desc: "Your work reaches international markets" },
        { icon: "bi-mortarboard", title: "Skill Development", desc: "Monthly workshops & training sessions" },
        { icon: "bi-heart-pulse", title: "Health First", desc: "Comprehensive health insurance" },
        { icon: "bi-cash-coin", title: "Fair Wages", desc: "Ethical compensation structures" },
        { icon: "bi-clock-history", title: "Flexible Hours", desc: "Work-life balance support" },
        { icon: "bi-trophy", title: "Recognition", desc: "Monthly appreciation programs" }
    ];

    const values = [
        { title: "Heritage Preservation", desc: "Maintaining century-old crafting techniques" },
        { title: "Community First", desc: "40% profits reinvested in artisan villages" },
        { title: "Eco Innovation", desc: "Carbon-negative since 2020" }
    ];

    const processSteps = [
        { title: "Application Review", duration: "1-3 Days" },
        { title: "Skill Assessment", duration: "1 Week" },
        { title: "Culture Interview", duration: "2 Days" },
        { title: "Onboarding", duration: "1 Week" }
    ];

    return (
        <div className="careers-page">
            {/* Hero Section with Parallax */}
            <section className="hero-section bg-dark text-white position-relative overflow-hidden">
                <div className="parallax-overlay"></div>
                <Container className="position-relative py-5 min-vh-100 d-flex align-items-center">
                    <Row className="justify-content-center text-center">
                        <Col lg={8}>
                            <h1 className="display-4 fw-bold mb-4 animate-slideup">
                                Shape Futures Through <span className="text-warning">Traditional Craft</span>
                            </h1>
                            <p className="lead mb-5 animate-slideup delay-1">
                                Join 200+ artisans creating meaningful work at the intersection of heritage and innovation
                            </p>
                            <Button variant="warning" size="lg" className="animate-scale">
                                Watch Our Story <i className="bi bi-play-circle ms-2"></i>
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section>

            {/* Values Carousel */}
            <section className="values-section py-5 bg-light">
                <Container>
                    <h3 className="text-center mb-5 section-title">Our Core Values</h3>
                    <Carousel indicators={false} className="values-carousel">
                        {values.map((value, index) => (
                            <Carousel.Item key={index}>
                                <Card className="text-center border-0 bg-transparent">
                                    <Card.Body>
                                        <div className="value-icon mb-4">
                                            <div className="hexagon"></div>
                                            <i className="bi bi-star-fill"></i>
                                        </div>
                                        <h4>{value.title}</h4>
                                        <p className="text-muted">{value.desc}</p>
                                    </Card.Body>
                                </Card>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                </Container>
            </section>

            {/* Open Positions with Filter */}
            <section className="positions-section py-5">
                <Container>
                    <Row className="mb-5">
                        <Col md={8}>
                            <h3 className="section-title">Current Opportunities</h3>
                            <div className="search-bar input-group mb-3">
                                <input type="text" className="form-control" placeholder="Search roles..." />
                                <Button variant="warning">
                                    <i className="bi bi-search"></i>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        {openPositions.map(position => (
                            <Col md={6} lg={4} key={position.id} className="mb-4">
                                <Card className="h-100 position-card hover-shadow">
                                    <Card.Body>
                                        <div className="d-flex justify-content-between mb-3">
                                            <span className="badge bg-warning">{position.type}</span>
                                            <span className="text-muted">{position.salary}</span>
                                        </div>
                                        <Card.Title>{position.title}</Card.Title>
                                        <Card.Subtitle className="mb-3 text-muted">
                                            <i className="bi bi-geo-alt me-2"></i>{position.location}
                                        </Card.Subtitle>
                                        <div className="department-tag mb-3">
                                            {position.department}
                                        </div>
                                        <Button variant="outline-dark" className="w-100">
                                            Apply Now <i className="bi bi-arrow-right ms-2"></i>
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Benefits Grid */}
            <section className="benefits-section py-5 bg-dark text-white">
                <Container>
                    <h3 className="text-center mb-5 section-title">Why Choose VividHands?</h3>
                    <Row className="g-4">
                        {benefits.map((benefit, index) => (
                            <Col md={6} lg={4} key={index}>
                                <div className="benefit-card p-4 h-100">
                                    <i className={`bi ${benefit.icon} display-4 text-warning mb-3`}></i>
                                    <h5>{benefit.title}</h5>
                                    <p className="text-light">{benefit.desc}</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </section>

            {/* Recruitment Process */}
            <section className="process-section py-5">
                <Container>
                    <h3 className="text-center mb-5 section-title">Our Hiring Journey</h3>
                    <div className="timeline">
                        {processSteps.map((step, index) => (
                            <div className="timeline-step" key={index}>
                                <div className="timeline-marker"></div>
                                <div className="timeline-content">
                                    <h5>{step.title}</h5>
                                    <p className="text-muted">{step.duration}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Container>
            </section>

            {/* Enhanced CTA with Stats */}
            <section className="cta-section py-5 bg-warning">
                <Container>
                    <Row className="g-4 align-items-center">
                        <Col md={6}>
                            <div className="stats-card p-4 text-dark">
                                <h3 className="mb-4">Making Impact</h3>
                                <Row>
                                    <Col xs={6} className="stat-item">
                                        <div className="display-5">85%</div>
                                        <small>Artisan Retention Rate</small>
                                    </Col>
                                    <Col xs={6} className="stat-item">
                                        <div className="display-5">12K+</div>
                                        <small>Products Shipped Monthly</small>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                        <Col md={6}>
                            <div className="cta-content text-center">
                                <h3 className="mb-4">Ready to Create with Us?</h3>
                                <p className="mb-4">Even if you don't see your perfect role, let's chat!</p>
                                <Button variant="dark" className="me-3">
                                    Submit Resume
                                </Button>
                                <Button variant="outline-dark">
                                    Contact HR <i className="bi bi-arrow-up-right"></i>
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </div>
    );
};

export default Careers;