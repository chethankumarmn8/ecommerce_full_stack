import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Row, Col, Card, Alert, Spinner, Badge,
    ListGroup, Button, Modal, Form
} from 'react-bootstrap';
import {
    BsBoxSeam, BsTruck, BsCheckCircle, BsCreditCard,
    BsClockHistory, BsStar, BsStarFill, BsTag, BsGeoAltFill,
    BsCalendarCheck, BsShop, BsPhone, BsEnvelope
} from 'react-icons/bs';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const theme = {
    primaryGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondaryGradient: 'linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%)',
    accentColor: '#4f46e5',
    lightBg: '#f8f9fe',
    darkText: '#1a1a1a'
};

const RatingStars = ({ rating, maxStars = 5, onRatingChange = null, size = '1.5rem' }) => (
    <div className="d-flex align-items-center">
        {[...Array(maxStars)].map((_, i) => {
            const starValue = i + 1;
            return (
                <BsStarFill
                    key={i}
                    className={`me-2 ${starValue <= rating ? 'text-warning' : 'text-light'} ${onRatingChange ? 'cursor-pointer hover-scale-110' : ''}`}
                    onClick={() => onRatingChange && onRatingChange(starValue)}
                    style={{
                        fontSize: size,
                        filter: starValue <= rating ? 'drop-shadow(0 2px 4px rgba(255, 193, 7, 0.4))' : 'none'
                    }}
                />
            );
        })}
    </div>
);

const DeliveryTimeline = ({ statusText, progress }) => {
    const stages = [
        { name: 'Processing', icon: <BsShop /> },
        { name: 'Shipped', icon: <BsTruck /> },
        { name: 'In Transit', icon: <BsClockHistory /> },
        { name: 'Delivered', icon: <BsCheckCircle /> }
    ];

    return (
        <div className="position-relative mt-4">
            <div className="progress" style={{ height: '8px', backgroundColor: 'rgba(79, 70, 229, 0.1)' }}>
                <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                ></div>
            </div>

            <div className="d-flex justify-content-between position-absolute w-100 top-0 mt-n3">
                {stages.map((stage, index) => {
                    const stageProgress = index * (100 / (stages.length - 1));
                    const isActive = progress >= stageProgress;

                    return (
                        <div
                            key={index}
                            className="d-flex flex-column align-items-center"
                            // Apply percentage-based left for even distribution
                            style={{ left: `${stageProgress}%`, position: 'absolute', transform: 'translateX(-50%)' }}
                        >
                            <div
                                className={`d-flex align-items-center justify-content-center rounded-circle ${isActive ? 'bg-primary text-white' : 'bg-light text-muted'}`}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    border: '3px solid #fff',
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                }}
                            >
                                {stage.icon}
                            </div>
                            <span className={`mt-1 small fw-medium text-nowrap ${isActive ? 'text-primary' : 'text-muted'}`}>
                                {stage.name}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const OrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, authChecked } = useAuth();
    const navigate = useNavigate();
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [review, setReview] = useState({ rating: 0, comment: '' });

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                if (!user?.userId) return;

                const response = await fetch(
                    `http://localhost:8080/api/orders/user/${user.userId}`,
                    { headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` } }
                );

                if (!response.ok) throw new Error('Failed to fetch orders');

                const data = await response.json();
                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (authChecked && user) fetchOrders();
        else if (authChecked && !user) navigate('/login');
    }, [user, authChecked, navigate]);

    const calculateDeliveryStatus = (orderDateString) => {
        if (!orderDateString) return { date: 'N/A', daysRemaining: 0, progress: 0, isDelivered: false, statusText: 'Pending' };

        const orderDate = new Date(orderDateString);
        const estimatedDeliveryDate = new Date(orderDate);
        estimatedDeliveryDate.setDate(orderDate.getDate() + 5);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const timeElapsed = today.getTime() - orderDate.getTime();
        const totalDeliveryTime = estimatedDeliveryDate.getTime() - orderDate.getTime();
        const daysRemaining = Math.ceil((estimatedDeliveryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

        let progress = 0;
        let isDelivered = false;
        let statusText = 'Processing';

        if (timeElapsed >= totalDeliveryTime) {
            progress = 100;
            isDelivered = true;
            statusText = 'Delivered';
        } else if (timeElapsed > 0) {
            progress = Math.min(100, (timeElapsed / totalDeliveryTime) * 100);
            statusText = 'In Transit';
        }

        return {
            date: estimatedDeliveryDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            progress,
            isDelivered,
            statusText
        };
    };

    const handleReviewSubmit = async () => {
        if (!selectedProduct || review.rating === 0) {
            alert('Please select a rating for your review.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('userToken')}`
                },
                body: JSON.stringify({
                    productId: selectedProduct.id,
                    rating: review.rating,
                    comment: review.comment,
                    userId: user.userId
                })
            });

            if (!response.ok) throw new Error('Review submission failed');

            setShowReviewModal(false);
            setReview({ rating: 0, comment: '' });
            alert('Review submitted successfully!');
        } catch (error) {
            setError(`Failed to submit review: ${error.message}`);
        }
    };

    if (!authChecked) return (
        <Container className="my-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Authenticating...</p>
        </Container>
    );

    if (!user) return null;

    if (loading) return (
        <Container className="my-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading your orders...</p>
        </Container>
    );

    if (error) return (
        <Container className="my-5">
            <Alert variant="danger" className="text-center">
                <h4 className="alert-heading">Oops! Something went wrong.</h4>
                <p>{error}</p>
                <hr />
                <p className="mb-0">Please try again later or contact support if the issue persists.</p>
            </Alert>
        </Container>
    );

    if (orders.length === 0) return (
        <Container className="my-5 text-center">
            <Card className="border-0 shadow-lg mx-auto" style={{ maxWidth: '700px', borderRadius: '15px' }}>
                <Card.Body className="p-5">
                    <BsBoxSeam size={60} className="text-primary mb-4 animate-bounce" />
                    <h3 className="mb-3 text-dark">No Orders Yet!</h3>
                    <p className="text-muted lead">It looks like you haven't placed any orders with us. Let's change that!</p>
                    <Button
                        variant="primary"
                        size="lg"
                        className="mt-4 shadow-sm"
                        onClick={() => navigate('/')}
                    >
                        <BsTag className="me-2" /> Start Shopping Now
                    </Button>
                </Card.Body>
            </Card>
        </Container>
    );

    return (
        <Container className="py-5" style={{ maxWidth: '1400px' }}>
            <h2 className="mb-5 text-center display-5 fw-black" style={{ color: theme.darkText }}>
                <span className="gradient-text" style={{ backgroundImage: theme.primaryGradient }}>
                    Order History
                </span>
            </h2>

            <Row className="g-4">
                {orders.map((order) => {
                    const delivery = calculateDeliveryStatus(order?.orderDate);
                    const orderDate = order?.orderDate ? new Date(order.orderDate) : null;

                    return (
                        <Col key={order?.id} xs={12}>
                            <Card className="border-0 rounded-4 overflow-hidden shadow-lg hover-shadow-xl transition-all">
                                <Card.Header
                                    className="p-0 border-0"
                                    style={{ background: theme.primaryGradient, color: 'white' }}
                                >
                                    <div className="d-flex justify-content-between align-items-center p-4">
                                        <div className="d-flex align-items-center gap-3">
                                            <BsBoxSeam size={24} />
                                            <div>
                                                <h5 className="mb-0">Order #{order?.id}</h5>
                                                <small className="opacity-90">Placed on {orderDate?.toLocaleDateString('en-US', { dateStyle: 'long' })}</small>
                                            </div>
                                        </div>
                                        <Badge pill bg="light" text="dark" className="fs-6 px-3 py-2">
                                            Total: {formatCurrency(order?.totalAmount)}
                                        </Badge>
                                    </div>
                                </Card.Header>

                                <Card.Body className="p-4" style={{ backgroundColor: theme.lightBg }}>
                                    <Row className="g-4">
                                        <Col md={6}>
                                            <h6 className="d-flex align-items-center gap-2 mb-3">
                                                <BsGeoAltFill className="text-primary" />
                                                Delivery Address
                                            </h6>
                                            <div className="bg-white p-3 rounded-3 shadow-sm">
                                                <p className="mb-0">
                                                    {order?.deliveryAddress},<br />
                                                    {order?.city}, {order?.state}<br />
                                                    {order?.zipCode}<br />

                                                </p>

                                                <p className="flex items-center gap-2">
                                                    <BsEnvelope className="text-slate-500" />
                                                    <span className="font-medium"> : </span>
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <h6 className="d-flex align-items-center gap-2 mb-3">
                                                <BsCreditCard className="text-primary" />
                                                Payment Information
                                            </h6>
                                            <div className="bg-white p-3 rounded-3 shadow-sm">
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span>Payment Method:</span>
                                                    <strong>Razorpay</strong>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <span>Payment Status:</span>
                                                    <Badge pill bg="success">
                                                        PAID
                                                    </Badge>
                                                </div>
                                                <div className="d-flex justify-content-between align-items-center mt-2">
                                                    <span>Payment ID:</span>
                                                    <small className="text-muted">
                                                        #{order?.razorpayPaymentId?.slice(-8) || 'N/A'}
                                                    </small>
                                                </div>
                                            </div>
                                        </Col>

                                        <Col xs={12}>
                                            <h6 className="d-flex align-items-center gap-2 mb-3">
                                                <BsTruck className="text-primary" />
                                                Delivery Progress
                                            </h6>
                                            <DeliveryTimeline
                                                statusText={delivery.statusText}
                                                progress={delivery.progress}
                                            />
                                            <div className="d-flex justify-content-between mt-5 pt-2"> {/* Increased top margin for spacing */}
                                                <div className="text-muted">
                                                    <BsCalendarCheck className="me-2" />
                                                    Estimated delivery: {delivery.date}
                                                </div>
                                                {!delivery.isDelivered && (
                                                    <Badge pill bg="warning" text="dark">
                                                        {delivery.daysRemaining} days remaining
                                                    </Badge>
                                                )}
                                            </div>
                                        </Col>

                                        <Col xs={12}>
                                            <h6 className="d-flex align-items-center gap-2 mb-3">
                                                <BsShop className="text-primary" />
                                                Ordered Items
                                            </h6>
                                            <ListGroup variant="flush">
                                                {order?.items?.map((item) => (
                                                    <ListGroup.Item key={item.id} className="bg-transparent">
                                                        <div className="d-flex align-items-center justify-content-between">
                                                            <div className="d-flex align-items-center gap-3">
                                                                <img
                                                                    src={item?.product?.imageData?.[0] || 'https://via.placeholder.com/100?text=No+Image'}
                                                                    alt={item?.product?.name}
                                                                    className="rounded-3"
                                                                    style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                                                                />
                                                                <div>
                                                                    <h6 className="mb-1">{item?.product?.name}</h6>
                                                                    <small className="text-muted">
                                                                        Qty: {item?.quantity} × {formatCurrency(item?.price)}
                                                                    </small>
                                                                    <div className="mt-1 small">
                                                                        <RatingStars rating={item?.product?.averageRating || 0} />
                                                                        <span className="ms-2 text-muted">
                                                                            ({item?.product?.reviewCount || 0} reviews)
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="text-end">
                                                                <div className="text-dark">
                                                                    {formatCurrency(item?.price * item?.quantity)}
                                                                </div>
                                                                {delivery.isDelivered && (
                                                                    <Button
                                                                        variant="link"
                                                                        className="text-decoration-none p-0"
                                                                        onClick={() => {
                                                                            setSelectedProduct(item.product);
                                                                            setShowReviewModal(true);
                                                                        }}
                                                                    >
                                                                        <BsStar className="me-1" />
                                                                        Write Review
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </ListGroup.Item>
                                                ))}
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Col>
                    );
                })}
            </Row>

            <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Review {selectedProduct?.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="p-4">
                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Your Rating</Form.Label>
                            <RatingStars
                                rating={review.rating}
                                onRatingChange={(newRating) => setReview({ ...review, rating: newRating })}
                            />
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label className="fw-bold">Your Comment</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={4}
                                placeholder="Share your thoughts about this product..."
                                value={review.comment}
                                onChange={(e) => setReview({ ...review, comment: e.target.value })}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer className="justify-content-between">
                    <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleReviewSubmit}
                        disabled={review.rating === 0 || review.comment.trim() === ''}
                    >
                        Submit Review
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrdersPage;