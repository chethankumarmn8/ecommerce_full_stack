import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Form, Button, Alert, Spinner, Row, Col, Card, FloatingLabel
} from 'react-bootstrap';
import {
    BsCreditCard, BsCheckCircle, BsTruck, BsExclamationTriangle,
    BsHouseDoor, BsGlobe, BsPostcard, BsPhone, BsBuilding, BsGeoAlt
} from 'react-icons/bs';
import { loadRazorpayScript } from '../utils/razorpay';
import { formatCurrency } from '../utils/currency';

const CheckoutPage = () => {
    const [formData, setFormData] = useState({
        deliveryAddress: '',
        city: '',
        state: '',
        zipCode: '',
        phoneNumber: ''
    });
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [paymentError, setPaymentError] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('userToken');

    const initializeRazorpay = async () => {
        if (!window.Razorpay) {
            await loadRazorpayScript(process.env.REACT_APP_RAZORPAY_KEY_ID);
        }
    };

    useEffect(() => {
        const initializeCheckout = async () => {
            try {
                await initializeRazorpay();
                const response = await fetch('http://localhost:8080/api/cart', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!response.ok) throw new Error('Failed to load cart');
                const data = await response.json();
                setCart(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        token ? initializeCheckout() : navigate('/cart');
    }, [token, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError('');

        try {
            const checkoutResponse = await fetch('http://localhost:8080/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (!checkoutResponse.ok) {
                const errorBody = await checkoutResponse.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(`Checkout failed: ${errorBody.error || 'Unknown error'}`);
            }
            const order = await checkoutResponse.json();

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: Math.round(order.totalAmount * 100),
                currency: "INR",
                name: "Your Store Name",
                order_id: order.razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verifyResponse = await fetch('http://localhost:8080/api/checkout/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                paymentId: response.razorpay_payment_id,
                                orderId: response.razorpay_order_id,
                                signature: response.razorpay_signature,
                                email: localStorage.getItem('userEmail')
                            })
                        });

                        const responseData = await verifyResponse.json();

                        if (!verifyResponse.ok) {
                            throw new Error(responseData.message || 'Payment verification failed');
                        }

                        localStorage.removeItem('cart');
                        setSuccess(true);
                        setTimeout(() => navigate('/orders'), 2000);
                    } catch (err) {
                        setPaymentError({
                            code: response.razorpay_payment_id,
                            message: err.message,
                            timestamp: new Date().toISOString()
                        });
                        setError(`${err.message} Your payment ID: ${response.razorpay_payment_id}`);

                        // Enhanced cart refresh with error handling
                        try {
                            const cartRes = await fetch('http://localhost:8080/api/cart', {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const cartData = await cartRes.json();
                            setCart(cartData);
                        } catch (fetchErr) {
                            setError('Failed to refresh cart after payment error');
                        }
                    } finally {
                        setProcessing(false);
                    }
                },
                prefill: { contact: formData.phoneNumber },
                theme: { color: "#3399cc" },
                modal: {
                    ondismiss: async () => {
                        setProcessing(false);
                        try {
                            const cartResponse = await fetch('http://localhost:8080/api/cart', {
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const cartData = await cartResponse.json();
                            setCart(cartData);
                            setError('Payment cancelled. You can try again with the same cart items.');
                        } catch (err) {
                            setError('Payment cancelled. Failed to refresh cart status.');
                        }
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            setError(`${err.message} Please check your cart items below.`);
            setProcessing(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const calculatedTotal = cart?.items?.reduce((sum, item) =>
        sum + (item.product.price * item.quantity), 0
    ) || 0;

    if (loading) return (
        <Container className="my-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 text-muted">Loading your shopping cart...</p>
        </Container>
    );

    if (success) return (
        <Container className="my-5 text-center">
            <Card className="border-success shadow-lg mx-auto" style={{ maxWidth: '500px' }}>
                <Card.Body className="py-5">
                    <BsCheckCircle size={80} className="text-success mb-4 animate__animated animate__bounceIn" />
                    <h2 className="mb-3 fw-bold text-success">Order Confirmed!</h2>
                    <p className="lead">Your payment was processed successfully</p>
                    <div className="mt-4">
                        <Spinner animation="border" size="sm" className="me-2" />
                        <span>Redirecting to orders...</span>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );

    if (paymentError) {
        return (
            <Container className="my-5">
                <Alert variant="danger">
                    <h4><BsExclamationTriangle /> Payment Error</h4>
                    <p>Code: {paymentError.code}</p>
                    <p>Message: {paymentError.message}</p>
                    <p>Time: {new Date(paymentError.timestamp).toLocaleString()}</p>
                    <Button variant="primary" onClick={() => setPaymentError(null)}>
                        Try Again
                    </Button>
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="py-5">
            <h2 className="mb-4"><BsGeoAlt className="me-2" />Checkout</h2>
            <Row className="g-5">
                <Col lg={7}>
                    <Card className="border-primary shadow-sm">
                        <Card.Header className="bg-primary text-white py-3">
                            <div className="d-flex align-items-center">
                                <BsTruck size={24} className="me-2" />
                                <h4 className="mb-0">Delivery Information</h4>
                            </div>
                        </Card.Header>
                        <Card.Body className="p-4">
                            {error && (
                                <Alert variant="danger" dismissible onClose={() => setError('')}>
                                    <div className="d-flex align-items-center">
                                        <BsExclamationTriangle className="me-2" />
                                        <div>
                                            {error}
                                            <div className="mt-2 small">
                                                You can safely retry your payment
                                            </div>
                                        </div>
                                    </div>
                                </Alert>
                            )}

                            <Form onSubmit={handleSubmit}>
                                <FloatingLabel controlId="address" label="Delivery Address" className="mb-4">
                                    <Form.Control
                                        name="deliveryAddress"
                                        value={formData.deliveryAddress}
                                        onChange={handleChange}
                                        required
                                        minLength="10"
                                        maxLength="200"
                                        pattern="[A-Za-z0-9\s,.-]{10,200}"
                                        placeholder="Delivery Address"
                                        style={{ height: '56px' }}
                                    />
                                    <BsHouseDoor className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                                </FloatingLabel>

                                <Row className="g-4 mb-4">
                                    <Col md={6}>
                                        <FloatingLabel controlId="city" label="City">
                                            <Form.Control
                                                name="city"
                                                value={formData.city}
                                                onChange={handleChange}
                                                required
                                                placeholder="City"
                                            />
                                            <BsBuilding className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={6}>
                                        <FloatingLabel controlId="state" label="State">
                                            <Form.Control
                                                name="state"
                                                value={formData.state}
                                                onChange={handleChange}
                                                required
                                                placeholder="State"
                                            />
                                            <BsGlobe className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <Row className="g-4 mb-4">
                                    <Col md={6}>
                                        <FloatingLabel controlId="zipCode" label="ZIP Code">
                                            <Form.Control
                                                name="zipCode"
                                                value={formData.zipCode}
                                                onChange={handleChange}
                                                required
                                                placeholder="ZIP Code"
                                            />
                                            <BsPostcard className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                                        </FloatingLabel>
                                    </Col>
                                    <Col md={6}>
                                        <FloatingLabel controlId="phone" label="Phone Number">
                                            <Form.Control
                                                name="phoneNumber"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                required
                                                pattern="[0-9]{10}"
                                                title="10 digit phone number"
                                                placeholder="Phone Number"
                                            />
                                            <BsPhone className="text-muted position-absolute top-50 end-0 translate-middle-y me-3" />
                                        </FloatingLabel>
                                    </Col>
                                </Row>

                                <div className="d-grid mt-4">
                                    <Button
                                        variant="success"
                                        size="lg"
                                        type="submit"
                                        disabled={processing || !cart?.items?.length}
                                        className="fw-bold py-3"
                                    >
                                        {processing ? (
                                            <>
                                                <Spinner animation="border" size="sm" className="me-2" />
                                                Processing Payment...
                                            </>
                                        ) : (
                                            <>
                                                <BsCreditCard className="me-2" />
                                                Pay {formatCurrency(cart?.total ?? calculatedTotal)}
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={5}>
                    <Card className="sticky-top shadow-sm" style={{ top: '20px', borderColor: '#e0e0e0' }}>
                        <Card.Header className="bg-light py-3">
                            <h4 className="mb-0">Order Summary</h4>
                        </Card.Header>
                        <Card.Body className="p-4">
                            <div className="mb-4">
                                {cart?.items?.map(item => (
                                    <div key={item.id} className="d-flex mb-4 align-items-start">
                                        <img
                                            src={item.product.imageData?.[0]}
                                            alt={item.product.name}
                                            className="rounded-3 me-3"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                objectFit: 'cover',
                                                border: '1px solid #dee2e6'
                                            }}
                                        />
                                        <div className="flex-grow-1">
                                            <h6 className="mb-1">{item.product.name}</h6>
                                            <div className="text-muted small">
                                                Qty: {item.quantity}
                                            </div>
                                            <div className="text-primary fw-bold">
                                                {formatCurrency(item.product.price)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-top pt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Subtotal:</span>
                                    <span className="fw-bold">{formatCurrency(cart?.total ?? calculatedTotal)}</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="text-muted">Shipping:</span>
                                    <span className="fw-bold text-success">FREE</span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center mt-3 pt-2">
                                    <h5 className="mb-0">Total:</h5>
                                    <h4 className="mb-0 text-primary">
                                        {formatCurrency(cart?.total ?? calculatedTotal)}
                                    </h4>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CheckoutPage;