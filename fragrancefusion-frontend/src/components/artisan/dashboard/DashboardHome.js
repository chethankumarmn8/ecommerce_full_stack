// DashboardHome.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Card, Row, Col, Alert, Button } from "react-bootstrap";
import {
  BsBoxSeam,
  BsGraphUp,
  BsCartPlus,
  BsPerson,
  BsClipboardData,
  BsCurrencyDollar
} from "react-icons/bs";

const DashboardHome = () => {
  const quickStats = [
    {
      title: "Total Products",
      value: "24",
      icon: <BsBoxSeam size={28} />,
      link: "/artisan/dashboard/products",
      variant: "primary"
    },
    {
      title: "Pending Orders",
      value: "5",
      icon: <BsClipboardData size={28} />,
      link: "/artisan/dashboard/orders",
      variant: "warning"
    },
    {
      title: "Monthly Revenue",
      value: "₹42.8k",
      icon: <BsCurrencyDollar size={28} />,
      link: "/artisan/dashboard/analytics",
      variant: "success"
    }
  ];

  const features = [
    {
      title: "Add New Product",
      description: "Showcase your latest creation to the world",
      icon: <BsCartPlus size={24} />,
      link: "/artisan/dashboard/add-product",
      btnText: "Start Crafting"
    },
    {
      title: "Manage Profile",
      description: "Update your artisan profile and certification",
      icon: <BsPerson size={24} />,
      link: "/artisan/dashboard/profile",
      btnText: "Edit Profile"
    },
    {
      title: "Sales Analytics",
      description: "Track your business performance and growth",
      icon: <BsGraphUp size={24} />,
      link: "/artisan/dashboard/analytics",
      btnText: "View Insights"
    }
  ];

  return (
    <div className="container-fluid py-4">
      <div className="mb-4">
        <h2 className="mb-0">Artisan Dashboard</h2>
        <p className="text-muted">Manage your artisan business efficiently</p>
      </div>

      <Alert variant="info" className="mb-4">
        Welcome back! You have 3 new orders and 2 product reviews pending.
      </Alert>

      {/* Quick Stats */}
      <Row className="g-4 mb-5">
        {quickStats.map((stat, index) => (
          <Col key={index} md={4}>
            <Card className="h-100 shadow-sm border-0">
              <Card.Body className="d-flex align-items-center">
                <div className={`icon-square bg-${stat.variant}-subtle text-${stat.variant} rounded-3 me-3 p-3`}>
                  {stat.icon}
                </div>
                <div>
                  <Card.Title className="mb-1">{stat.title}</Card.Title>
                  <h3 className="mb-0">{stat.value}</h3>
                  <Button
                    as={Link}
                    to={stat.link}
                    variant="link"
                    className="p-0 text-decoration-none"
                  >
                    View Details →
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Key Features */}
      <h4 className="mb-4">Quick Actions</h4>
      <Row className="g-4">
        {features.map((feature, index) => (
          <Col key={index} md={6} lg={4}>
            <Card className="h-100 shadow-sm hover-shadow-lg transition-all">
              <Card.Body className="d-flex flex-column">
                <div className={`icon-square bg-primary-subtle text-primary rounded-3 mb-3 p-3`}
                  style={{ width: 'fit-content' }}>
                  {feature.icon}
                </div>
                <h5 className="mb-2">{feature.title}</h5>
                <p className="text-muted mb-3 flex-grow-1">{feature.description}</p>
                <Button
                  as={Link}
                  to={feature.link}
                  variant="outline-primary"
                  className="align-self-start"
                >
                  {feature.btnText}
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Activity Section */}
      <div className="mt-5">
        <h4 className="mb-4">Recent Activity</h4>
        <Card className="shadow-sm">
          <Card.Body>
            <div className="list-group list-group-flush">
              <div className="list-group-item d-flex align-items-center">
                <span className="badge bg-success me-3">New Order</span>
                <span>Order #1234 received from John Doe</span>
                <small className="text-muted ms-auto">2h ago</small>
              </div>
              <div className="list-group-item d-flex align-items-center">
                <span className="badge bg-warning me-3">Review</span>
                <span>New review received for "Handcrafted Vase"</span>
                <small className="text-muted ms-auto">5h ago</small>
              </div>
              <div className="list-group-item d-flex align-items-center">
                <span className="badge bg-info me-3">Update</span>
                <span>Your product "Wooden Sculpture" is low in stock</span>
                <small className="text-muted ms-auto">1d ago</small>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DashboardHome;