import React, { useEffect, useState, useCallback } from 'react';
import {
    Container, Row, Col, Card, Button, Alert, Spinner,
    Form, InputGroup, ListGroup, Badge
} from 'react-bootstrap';
import { BsTrash, BsArrowLeft, BsBoxSeam } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user, isAuthenticated, authChecked } = useAuth();
    const token = localStorage.getItem('userToken');

    const fetchCart = useCallback(async () => {
        let response;
        try {
            response = await fetch('http://localhost:8080/api/cart', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMsg = errorData.message || 'Failed to fetch cart';
                if (response.status === 401) {
                    sessionStorage.setItem('redirectPath', '/cart');
                    navigate('/login');
                }
                throw new Error(errorMsg);
            }

            const data = await response.json();
            setCart(data);
            setError('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [token, navigate]);

    const debouncedQuantityChange = useCallback(
        (itemId, newQuantity) => {
            const handler = async () => {
                try {
                    const response = await fetch(`http://localhost:8080/api/cart/update/${itemId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({ quantity: newQuantity })
                    });

                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        throw new Error(errorData.message || 'Failed to update quantity');
                    }

                    setCart(prevCart => ({
                        ...prevCart,
                        items: prevCart.items.map(item =>
                            item.id === itemId ? { ...item, quantity: newQuantity } : item
                        )
                    }));
                } catch (err) {
                    setError(err.message);
                    fetchCart();
                }
            };
            return debounce(handler, 500)();
        },
        [token, fetchCart]
    );

    const handleQuantityChange = (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        setProcessing(true);
        debouncedQuantityChange(itemId, newQuantity);
        setProcessing(false);
    };

    const handleRemoveItem = async (itemId) => {
        setProcessing(true);
        try {
            const response = await fetch(`http://localhost:8080/api/cart/remove/${itemId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to remove item');
            }

            await fetchCart();
        } catch (err) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const handleImageError = (e) => {
        e.target.src = '/images/placeholder-product.jpg';
    };

    useEffect(() => {
        if (!authChecked) return; // Wait for auth check to complete

        if (!isAuthenticated) {
            sessionStorage.setItem('redirectPath', '/cart');
            navigate('/login');
            return;
        }

        fetchCart();
    }, [authChecked, isAuthenticated, navigate, fetchCart]);

    if (loading) return (
        <Container className="my-5 text-center">
            <Spinner animation="border" variant="primary" />
        </Container>
    );

    return (
        <Container className="my-3 my-lg-5">
            <Button variant="outline-primary" className="mb-4 w-100 w-lg-auto" onClick={() => navigate('/marketplace')}>
                <BsArrowLeft className="me-2" /> Continue Shopping
            </Button>

            <h2 className="mb-4 px-3 px-lg-0">Your Shopping Cart</h2>

            {error && (
                <Alert variant="danger" className="mb-4 mx-3 mx-lg-0" dismissible onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {cart?.items?.length === 0 ? (
                <div className="text-center py-5">
                    <BsBoxSeam size={64} className="text-muted mb-3" />
                    <h4 className="mb-3">Your cart is empty</h4>
                    <Button variant="primary" onClick={() => navigate('/marketplace')}>
                        Browse Products
                    </Button>
                </div>
            ) : (
                <Row className="g-4">
                    <Col lg={8}>
                        <ListGroup className="mx-lg-0 mx-2">
                            {cart?.items?.map(item => (
                                <ListGroup.Item key={item.id} className="mb-3 border-top-0 border-end-0 border-start-0">
                                    <div className="d-flex flex-column flex-md-row align-items-center">
                                        <img
                                            src={item.product.imageData?.[0] || '/images/placeholder-product.jpg'}
                                            alt={item.product.name}
                                            className="rounded me-md-4 mb-3 mb-md-0"
                                            style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                                            onError={handleImageError}
                                        />
                                        <div className="flex-grow-1 w-100">
                                            <div className="d-flex flex-column flex-lg-row justify-content-between">
                                                <div className="me-lg-4 mb-2 mb-lg-0">
                                                    <h5 className="mb-2">{item.product.name}</h5>
                                                    {item.product.stock < 10 && (
                                                        <Badge bg="warning" text="dark" className="mb-2">
                                                            Only {item.product.stock} left
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="text-lg-end mb-2 mb-lg-0">
                                                    <div className="h5 mb-0">
                                                        {formatCurrency(item.product.price * item.quantity)}
                                                    </div>
                                                    <small className="text-muted">
                                                        {formatCurrency(item.product.price)} each
                                                    </small>
                                                </div>
                                            </div>

                                            <div className="d-flex align-items-center justify-content-between">
                                                <InputGroup style={{ maxWidth: '160px' }} className="me-3">
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        disabled={processing}
                                                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <Form.Control
                                                        type="number"
                                                        value={item.quantity}
                                                        min="1"
                                                        max={item.product.stock}
                                                        className="text-center px-2"
                                                        style={{ height: '38px' }}
                                                        onChange={(e) =>
                                                            handleQuantityChange(item.id, parseInt(e.target.value))
                                                        }
                                                    />
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        disabled={processing || item.quantity >= item.product.stock}
                                                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </InputGroup>

                                                <Button
                                                    variant="outline-danger"
                                                    size="sm"
                                                    disabled={processing}
                                                    onClick={() => handleRemoveItem(item.id)}
                                                    className="ms-auto ms-md-0"
                                                >
                                                    {processing ? (
                                                        <Spinner animation="border" size="sm" />
                                                    ) : (
                                                        <><BsTrash className="me-2" /> Remove</>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>

                    <Col lg={4} className="mt-4 mt-lg-0">
                        <OrderSummary
                            items={cart?.items}
                            processing={processing}
                            onCheckout={() => navigate('/checkout')}
                        />
                    </Col>
                </Row>
            )}
        </Container>
    );
};

const OrderSummary = ({ items, processing, onCheckout }) => {
    const subtotal = items?.reduce((sum, item) => sum + (item.product.price * item.quantity), 0) || 0;
    const shippingEstimate = subtotal > 100 ? 0 : 15;
    const taxEstimate = subtotal * 0.08;

    return (
        <Card className="shadow-sm border-0">
            <Card.Body className="p-lg-3 p-2">
                <h4 className="mb-3">Order Summary</h4>

                <ListGroup variant="flush" className="mb-3">
                    <ListGroup.Item className="d-flex justify-content-between px-0 py-2">
                        <span>Subtotal:</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 py-2">
                        <span>Shipping:</span>
                        <span>{formatCurrency(shippingEstimate)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 py-2">
                        <span>Tax (estimated):</span>
                        <span>{formatCurrency(taxEstimate)}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between px-0 py-2 fw-bold">
                        <span>Total:</span>
                        <span>{formatCurrency(subtotal + shippingEstimate + taxEstimate)}</span>
                    </ListGroup.Item>
                </ListGroup>

                <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mt-2"
                    onClick={onCheckout}
                    disabled={processing || items?.length === 0}
                >
                    {processing ? (
                        <Spinner animation="border" size="sm" />
                    ) : (
                        'Proceed to Checkout'
                    )}
                </Button>
            </Card.Body>
        </Card>
    );
};

export default CartPage;