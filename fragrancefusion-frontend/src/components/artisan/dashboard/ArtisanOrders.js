import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Badge, Card, ListGroup, Button, Container,
    Spinner, Alert, Row, Col, ProgressBar, Collapse
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
    BsBoxSeam, BsPerson, BsGeoAlt,
    BsCurrencyDollar, BsClockHistory, BsReceipt,
    BsChevronDown,
    BsCurrencyRupee
} from "react-icons/bs";
import { TbTruckDelivery, TbPackage } from "react-icons/tb";
import "./orders.css";

const ArtisanOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeOrder, setActiveOrder] = useState(null);
    const [expandedItems, setExpandedItems] = useState({});

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("artisanToken");
                if (!token) throw new Error("Authentication required");

                const response = await axios.get(
                    "http://localhost:8080/api/orders/artisan/orders",
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setOrders(response.data);
            } catch (err) {
                setError(err.message || "Failed to fetch orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const toggleItemDetails = (orderId, itemId) => {
        setExpandedItems(prev => ({
            ...prev,
            [`${orderId}-${itemId}`]: !prev[`${orderId}-${itemId}`]
        }));
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'PAID': return 'success';
            case 'PENDING': return 'warning';
            case 'CANCELLED': return 'danger';
            default: return 'secondary';
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR'
        }).format(amount);
    };

    if (loading) {
        return (
            <Container className="text-center py-5">
                <div className="loading-overlay">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                    <h4 className="mt-3 text-primary">Crafting Your Order View</h4>
                    <ProgressBar animated now={75} className="mt-2" style={{ maxWidth: '200px', margin: '0 auto' }} />
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="py-5">
                <Alert variant="danger" className="alert-luxe">
                    <div className="d-flex align-items-center gap-2">
                        <BsClockHistory className="flex-shrink-0" />
                        <div>{error}</div>
                    </div>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5 artisan-orders-container">
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="display-6 fw-bold text-gradient">
                    <TbPackage className="me-2" />
                    Order Management
                </h1>
                <Badge pill bg="light" text="dark" className="fs-6">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                </Badge>
            </div>

            {orders.length === 0 ? (
                <div className="empty-state text-center py-5">
                    <div className="empty-state-icon mb-4">
                        <BsBoxSeam size={48} className="text-muted" />
                    </div>
                    <h3 className="mb-3">No Orders Found</h3>
                    <p className="text-muted mb-4">Your beautiful creations are waiting to be discovered!</p>
                    <Button variant="outline-primary" as={Link} to="/artisan/dashboard">
                        Back to Dashboard
                    </Button>
                </div>
            ) : (
                <Row className="g-4">
                    {orders.map((order) => (
                        <Col key={order.id} lg={6} xl={4}>
                            <Card
                                className="h-100 shadow-hover"
                                onMouseEnter={() => setActiveOrder(order.id)}
                                onMouseLeave={() => setActiveOrder(null)}
                            >
                                <Card.Header className="d-flex justify-content-between align-items-center bg-gradient-primary text-white">
                                    <div className="d-flex align-items-center gap-2">
                                        <BsReceipt className="flex-shrink-0" />
                                        <div>
                                            <div className="small">ORDER ID</div>
                                            <div className="fw-bold">#{order.id}</div>
                                        </div>
                                    </div>
                                    <Badge
                                        pill
                                        bg={getStatusVariant(order.paymentStatus)}
                                        className="text-uppercase"
                                    >
                                        {order.paymentStatus}
                                    </Badge>
                                </Card.Header>

                                <Card.Body className="position-relative">
                                    <div className="order-timeline">
                                        <div className="timeline-progress" />
                                        <div className="timeline-item placed active">
                                            <TbPackage className="timeline-icon" />
                                        </div>
                                        <div className={`timeline-item ${order.shippingDate ? 'active' : ''}`}>
                                            <TbTruckDelivery className="timeline-icon" />
                                        </div>
                                    </div>

                                    <ListGroup variant="flush" className="border-0">
                                        <ListGroup.Item className="d-flex align-items-center px-0">
                                            <BsPerson className="me-2 text-muted" />
                                            <div>
                                                <div className="small text-muted">Customer</div>
                                                <div className="fw-bold">{order.user?.email}</div>
                                            </div>
                                        </ListGroup.Item>

                                        <ListGroup.Item className="d-flex align-items-center px-0">
                                            <BsGeoAlt className="me-2 text-muted" />
                                            <div>
                                                <div className="small text-muted">Delivery To</div>
                                                <div className="fw-bold">
                                                    {order.city}, {order.state}
                                                </div>
                                                <div className="small text-muted">
                                                    {order.deliveryAddress}
                                                </div>
                                            </div>
                                        </ListGroup.Item>

                                        <ListGroup.Item className="px-0">
                                            <div className="mb-3">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <div className="text-muted">Items</div>
                                                    <div className="fw-bold">{order.items.length}</div>
                                                </div>
                                                <div className="d-flex justify-content-between">
                                                    <div className="text-muted">Order Date</div>
                                                    <div className="fw-bold">
                                                        {new Date(order.orderDate).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="order-items-details">
                                                {order.items.map((item) => (
                                                    <div key={item.id} className="mb-3">
                                                        <div className="d-flex justify-content-between align-items-start">
                                                            <div>
                                                                <div className="fw-bold mb-1">
                                                                    {item.product.name}
                                                                </div>
                                                                <div className="small text-muted">
                                                                    Desc: {item.product.sku}
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="link"
                                                                size="sm"
                                                                className="p-0"
                                                                onClick={() => toggleItemDetails(order.id, item.id)}
                                                            >
                                                                <BsChevronDown className={`transition-all ${expandedItems[`${order.id}-${item.id}`] ? 'rotate-180' : ''}`} />
                                                            </Button>
                                                        </div>

                                                        <Collapse in={expandedItems[`${order.id}-${item.id}`]}>
                                                            <div className="mt-2">
                                                                <div className="small text-muted mb-2">
                                                                    {item.product.description}
                                                                </div>
                                                                <div className="d-flex justify-content-between small">
                                                                    <span>Quantity:</span>
                                                                    <span>{item.quantity}</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between small">
                                                                    <span>Unit Price:</span>
                                                                    <span>{formatCurrency(item.price)}</span>
                                                                </div>
                                                                <div className="d-flex justify-content-between small">
                                                                    <span>Total:</span>
                                                                    <span className="fw-bold">
                                                                        {formatCurrency(item.quantity * item.price)}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </Collapse>
                                                    </div>
                                                ))}
                                            </div>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card.Body>

                                <Card.Footer className="bg-transparent border-top-0">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center gap-2">
                                            {/* <BsCurrencyRupee className="text-success" /> */}
                                            <span className="fw-bold fs-5">
                                                {formatCurrency(order.totalAmount)}
                                            </span>
                                        </div>
                                        <Button
                                            variant={activeOrder === order.id ? 'primary' : 'outline-primary'}
                                            size="sm"
                                            as={Link}
                                            to={`/artisan/dashboard/orders/${order.id}`}
                                            className="transition-all"
                                        >
                                            Full Details
                                        </Button>
                                    </div>
                                </Card.Footer>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </Container>
    );
};

export default ArtisanOrders;