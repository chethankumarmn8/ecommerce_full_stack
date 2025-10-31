import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Modal, Stack, InputGroup, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsStarFill, BsChevronLeft, BsChevronRight, BsHandbag, BsGeoAlt, BsRecycle, BsX, BsDashLg, BsPlusLg } from 'react-icons/bs';
import { useAuth } from '../../context/AuthContext';

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const { setShowAuthModal, setAuthMode } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const touchStartX = useRef(0);
    const imageRef = useRef(null);
    const modalBodyRef = useRef(null);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`/api/products/${productId}`);
                if (!response.ok) throw new Error('Product not found or API error');
                const data = await response.json();
                setProduct(data);
                // Set quantity to 1 if stock available, else 0
                setQuantity(data.stock > 0 ? 1 : 0);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    useEffect(() => {
        if (!showModal || !modalBodyRef.current) return;

        const handleWheel = (e) => {
            if (e.ctrlKey) return;
            if (zoomLevel > 1 && e.cancelable) e.preventDefault();

            setZoomLevel(prev => {
                const newZoom = prev + (e.deltaY > 0 ? -0.2 : 0.2);
                const clampedZoom = Math.min(Math.max(newZoom, 1), 5);
                if (clampedZoom === 1) setMousePosition({ x: 0, y: 0 });
                return clampedZoom;
            });
        };

        const element = modalBodyRef.current;
        element.addEventListener('wheel', handleWheel, { passive: false });

        return () => element.removeEventListener('wheel', handleWheel);
    }, [showModal, zoomLevel]);

    const handleQuantityChange = (newQuantity) => {
        if (!product) return;
        const qty = Math.max(0, Math.min(product.stock, newQuantity));
        setQuantity(qty);
    };

    const handleAddToCart = async () => {
        if (!product || quantity < 1 || quantity > product.stock) return;


        const token = localStorage.getItem('userToken');
        if (!token) {
            sessionStorage.setItem('redirectPath', `/products/${productId}`);
            navigate('/login');  // Changed from modal to navigation
            return;
        }

        try {
            const response = await fetch(
                `/api/cart/add?productId=${product.id}&quantity=${quantity}`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add to cart');
            }
            navigate('/cart');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleModalNavigation = (direction) => {
        if (!product) return;
        const newIndex = direction === 'next'
            ? (selectedImageIndex + 1) % product.imageData.length
            : (selectedImageIndex - 1 + product.imageData.length) % product.imageData.length;
        setSelectedImageIndex(newIndex);
        setZoomLevel(1);
        setMousePosition({ x: 0, y: 0 });
    };

    const handleTouchStart = (e) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e) => {
        if (!product) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX;
        const threshold = 50;

        if (diff > threshold) {
            handleModalNavigation('next');
        } else if (diff < -threshold) {
            handleModalNavigation('prev');
        }
    };

    const handleMouseMove = (e) => {
        if (zoomLevel > 1 && imageRef.current) {
            const container = imageRef.current.parentElement;
            const rect = container.getBoundingClientRect();
            let x = (e.clientX - rect.left) / rect.width;
            let y = (e.clientY - rect.top) / rect.height;

            const overflowX = imageRef.current.offsetWidth * zoomLevel - rect.width;
            const overflowY = imageRef.current.offsetHeight * zoomLevel - rect.height;

            setMousePosition({
                x: Math.max(0, Math.min(overflowX * x, overflowX)),
                y: Math.max(0, Math.min(overflowY * y, overflowY))
            });
        }
    };

    const handleImageClickToZoom = (e) => {
        if (zoomLevel === 1) {
            setZoomLevel(2);
            if (imageRef.current) {
                const container = imageRef.current.parentElement;
                const rect = container.getBoundingClientRect();
                let x = (e.clientX - rect.left) / rect.width;
                let y = (e.clientY - rect.top) / rect.height;
                const overflowX = imageRef.current.offsetWidth * 2 - rect.width;
                const overflowY = imageRef.current.offsetHeight * 2 - rect.height;
                setMousePosition({
                    x: Math.max(0, Math.min(overflowX * x, overflowX)),
                    y: Math.max(0, Math.min(overflowY * y, overflowY))
                });
            }
        } else {
            setZoomLevel(1);
            setMousePosition({ x: 0, y: 0 });
        }
    };

    if (loading) return <Container className="my-5 text-center product-detail-page"><p className="loading-text">Loading Product Details...</p></Container>;
    if (error) return <Container className="my-5 text-center product-detail-page text-danger"><p>Error: {error}</p></Container>;
    if (!product) return <Container className="my-5 text-center product-detail-page"><p>Product not found.</p></Container>;

    return (
        <Container className="my-lg-5 my-3 px-3 px-md-4 product-detail-page" fluid style={{ maxWidth: '1920px' }}>
            <Row className="g-4 g-lg-5">
                {/* Main Image Section */}
                <Col xl={7} className="order-xl-1">
                    <div className="sticky-xl-top" style={{ top: '2rem' }}>
                        <div
                            className="main-image-container bg-light-custom rounded-custom mb-4 cursor-pointer hover-scale-main"
                            onClick={() => {
                                setSelectedImageIndex(0);
                                setShowModal(true);
                                setZoomLevel(1);
                                setMousePosition({ x: 0, y: 0 });
                            }}
                        >
                            <img
                                src={product.imageData?.[0] || '/placeholder.jpg'}
                                alt={product.name}
                                className="w-100 h-100 object-fit-contain p-3 p-lg-4"
                                loading="eager"
                            />
                        </div>
                        <div className="thumbnail-gallery d-flex gap-3 pb-2">
                            {product.imageData?.slice(0, 5).map((img, index) => (
                                <div
                                    key={index}
                                    className="thumbnail-item flex-shrink-0 bg-light-custom rounded-custom-small cursor-pointer hover-scale-thumb"
                                    onClick={() => {
                                        setSelectedImageIndex(index);
                                        setShowModal(true);
                                        setZoomLevel(1);
                                        setMousePosition({ x: 0, y: 0 });
                                    }}
                                >
                                    <img
                                        src={img || '/placeholder.jpg'}
                                        alt={`Thumbnail ${product.name} ${index + 1}`}
                                        className="w-100 h-100 object-fit-cover"
                                        loading="lazy"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>

                {/* Product Details Section */}
                <Col xl={5} className="order-xl-2">
                    <div className="product-info-card">
                        <Stack gap={4} className="mb-5 mb-xl-0">
                            <div>
                                <div className="d-flex flex-wrap gap-2 justify-content-between align-items-center mb-3">
                                    <span className="badge-custom badge-artisan">
                                        <BsRecycle className="me-2" />
                                        {product.artisanCategory}
                                    </span>
                                    <div className="d-flex align-items-center gap-2 ethical-score-badge">
                                        <BsStarFill className="icon-accent fs-5" />
                                        <span className="text-value">
                                            Ethical Score: {product.ethicalScore}/10
                                        </span>
                                    </div>
                                </div>
                                <h1 className="product-name mb-3">
                                    {product.name}
                                </h1>
                                <div className="d-flex align-items-center gap-3 mb-4">
                                    <h2 className="product-price mb-0">${product.price.toLocaleString()}</h2>
                                    {product.stock <= 5 && product.stock > 0 ? (
                                        <span className="badge-custom badge-stock-low">
                                            Only {product.stock} left
                                        </span>
                                    ) : product.stock === 0 ? (
                                        <span className="badge-custom badge-stock-out">
                                            Out of Stock
                                        </span>
                                    ) : null}
                                </div>
                            </div>

                            <div>
                                <h4 className="section-title-primary">Product Story</h4>
                                <p className="product-description">
                                    {product.description}
                                </p>
                            </div>

                            <div className="info-box">
                                <h5 className="section-title-box">Eco Features</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge-custom badge-eco">
                                        <BsGeoAlt className="me-2" />
                                        Local Materials
                                    </span>
                                    {product.materials.split(', ').map((material, index) => (
                                        <span key={index} className="badge-custom badge-eco">
                                            🌱 {material}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="info-box">
                                <h4 className="section-title-box">Crafted With Care</h4>
                                <div className="d-flex align-items-center gap-3">
                                    <div className="artisan-avatar">
                                        <span className="artisan-initial">
                                            {product.artisanName.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <h5 className="artisan-name">{product.artisanName}</h5>
                                        <p className="artisan-category-location mb-0">{product.artisanCategory} Artisan</p>
                                        <small className="artisan-location">Based in {product.artisanLocation}</small>
                                    </div>
                                </div>
                            </div>

                            {product.stock > 0 && (
                                <div className="mb-4">
                                    <h5 className="section-title-primary mb-3">Quantity</h5>
                                    <InputGroup className="quantity-selector">
                                        <Button
                                            variant="outline-custom"
                                            onClick={() => handleQuantityChange(quantity - 1)}
                                            disabled={quantity <= 1}
                                            aria-label="Decrease quantity"
                                        >
                                            <BsDashLg />
                                        </Button>
                                        <Form.Control
                                            type="number"
                                            value={quantity}
                                            min="1"
                                            max={product.stock}
                                            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                            className="text-center quantity-input"
                                            aria-label="Quantity"
                                        />
                                        <Button
                                            variant="outline-custom"
                                            onClick={() => handleQuantityChange(quantity + 1)}
                                            disabled={quantity >= product.stock}
                                            aria-label="Increase quantity"
                                        >
                                            <BsPlusLg />
                                        </Button>
                                    </InputGroup>
                                    {quantity === product.stock && product.stock > 0 && (
                                        <div className="text-muted-custom mt-2 fs-small">
                                            Maximum quantity available ({product.stock})
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Desktop Add to Cart */}
                            <div className="d-none d-xl-block mt-auto">
                                <Button
                                    variant="primary-custom"
                                    size="lg"
                                    className="w-100 py-3 add-to-cart-button"
                                    onClick={handleAddToCart}
                                    disabled={product.stock === 0 || quantity < 1}
                                >
                                    <BsHandbag className="fs-5 me-2" />
                                    {product.stock > 0 ?
                                        `Add to Cart (${quantity}) — $${(product.price * quantity).toLocaleString()}` :
                                        'Out of Stock'}
                                </Button>
                            </div>
                        </Stack>
                    </div>
                </Col>
            </Row>

            {/* Mobile Add to Cart - Fixed Bottom */}
            <div className="d-xl-none fixed-bottom bg-white-custom border-top-custom p-3 shadow-lg-custom">
                <Button
                    variant="primary-custom"
                    size="lg"
                    className="w-100 py-3 add-to-cart-button"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0 || quantity < 1}
                >
                    <BsHandbag className="fs-5 me-2" />
                    {product.stock > 0 ? `Add to Cart (${quantity})` : 'Out of Stock'}
                </Button>
            </div>

            {/* Image Modal */}
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                    setZoomLevel(1);
                    setMousePosition({ x: 0, y: 0 });
                }}
                centered
                size="xl"
                className="image-modal"
                onKeyDown={(e) => {
                    if (e.key === 'ArrowLeft') handleModalNavigation('prev');
                    if (e.key === 'ArrowRight') handleModalNavigation('next');
                    if (e.key === 'Escape') setShowModal(false);
                }}
                fullscreen="lg-down"
            >
                <Modal.Header className="border-0 position-absolute top-0 end-0 z-3 p-3">
                    <Button
                        variant="light-modal"
                        onClick={() => setShowModal(false)}
                        className="rounded-circle p-2"
                        aria-label="Close"
                    >
                        <BsX size={28} />
                    </Button>
                </Modal.Header>
                <Modal.Body
                    ref={modalBodyRef}
                    className="p-0 position-relative bg-modal-dark"
                >
                    <div
                        className="h-100 d-flex align-items-center justify-content-center position-relative modal-image-zoom-area"
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onMouseMove={handleMouseMove}
                        onClick={handleImageClickToZoom}
                        style={{ cursor: zoomLevel > 1 ? 'grab' : 'zoom-in' }}
                    >
                        <img
                            ref={imageRef}
                            src={product.imageData?.[selectedImageIndex] || '/placeholder.jpg'}
                            alt={`Zoom view ${selectedImageIndex + 1} - ${product.name}`}
                            className="img-fluid modal-image-content"
                            style={{
                                transform: `scale(${zoomLevel})`,
                                objectFit: 'contain',
                                maxWidth: '100%',
                                maxHeight: '100%',
                                position: zoomLevel > 1 ? 'absolute' : 'relative',
                                left: zoomLevel > 1 ? `-${mousePosition.x}px` : '0',
                                top: zoomLevel > 1 ? `-${mousePosition.y}px` : '0',
                            }}
                        />
                    </div>

                    {/* Navigation Arrows */}
                    {product.imageData?.length > 1 && (
                        <>
                            <Button
                                variant="light-modal"
                                onClick={(e) => { e.stopPropagation(); handleModalNavigation('prev'); }}
                                className="rounded-circle p-2 modal-nav modal-nav-prev"
                                aria-label="Previous"
                            >
                                <BsChevronLeft size={28} />
                            </Button>
                            <Button
                                variant="light-modal"
                                onClick={(e) => { e.stopPropagation(); handleModalNavigation('next'); }}
                                className="rounded-circle p-2 modal-nav modal-nav-next"
                                aria-label="Next"
                            >
                                <BsChevronRight size={28} />
                            </Button>
                        </>
                    )}

                    {/* Thumbnail Strip */}
                    {product.imageData?.length > 1 && (
                        <div className="modal-thumbnail-strip">
                            <div className="d-flex gap-2 justify-content-center">
                                {product.imageData.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`modal-thumbnail-item ${index === selectedImageIndex ? 'active' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setSelectedImageIndex(index);
                                            setZoomLevel(1);
                                            setMousePosition({ x: 0, y: 0 });
                                        }}
                                    >
                                        <img
                                            src={img || '/placeholder.jpg'}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-100 h-100 object-fit-cover"
                                            loading="lazy"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <style>{`
                /* CSS Variables for Luxury Theme */
                :root {
                    --font-heading: 'Playfair Display', serif;
                    --font-body: 'Roboto', sans-serif;
                    --color-primary-brand: #2C3E50;
                    --color-accent-brand: #D4AF37;
                    --color-text-main: #34495E;
                    --color-text-muted-custom: #7F8C8D;
                    --color-bg-main: #F8F9FA;
                    --color-bg-subtle: #FFFFFF;
                    --color-border-custom: #DEE2E6;
                    --color-success-custom: #2ECC71;
                    --color-danger-custom: #E74C3C;
                    --color-modal-overlay: rgba(0, 0, 0, 0.92);
                    --border-radius-main: 0.375rem;
                    --border-radius-large: 0.5rem;
                    --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                .product-detail-page {
                    background-color: var(--color-bg-main);
                    font-family: var(--font-body);
                    color: var(--color-text-main);
                }
                .loading-text {
                    font-family: var(--font-heading);
                    font-size: 1.5rem;
                    color: var(--color-primary-brand);
                }

                /* Images */
                .main-image-container {
                    aspect-ratio: 4 / 3;
                    overflow: hidden;
                    background-color: var(--color-bg-subtle);
                }
                .rounded-custom { border-radius: var(--border-radius-large); }
                .rounded-custom-small { border-radius: var(--border-radius-main); }
                .bg-light-custom { background-color: var(--color-bg-subtle); }

                .thumbnail-gallery { overflow-x: auto; }
                .thumbnail-item {
                    width: 100px;
                    height: 100px;
                    border: 1px solid var(--color-border-custom);
                    transition: var(--transition-smooth);
                    overflow: hidden;
                }
                .hover-scale-main { transition: transform 0.3s ease-out; }
                .hover-scale-main:hover { transform: scale(1.03); }
                .hover-scale-thumb { transition: transform 0.2s ease-out; }
                .hover-scale-thumb:hover { transform: scale(1.08); border-color: var(--color-accent-brand); }
                .cursor-pointer { cursor: pointer; }
                .object-fit-cover { object-fit: cover; }
                .object-fit-contain { object-fit: contain; }

                /* Product Info */
                .product-info-card {
                    padding: 1.5rem;
                    background-color: var(--color-bg-subtle);
                    border-radius: var(--border-radius-large);
                }
                .product-name {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    color: var(--color-primary-brand);
                    font-size: 2.8rem;
                    line-height: 1.2;
                }
                .product-price {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    color: var(--color-primary-brand);
                    font-size: 2.2rem;
                }
                .section-title-primary {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    color: var(--color-primary-brand);
                    font-size: 1.3rem;
                    margin-bottom: 0.75rem;
                }
                .product-description {
                    color: var(--color-text-main);
                    line-height: 1.8;
                    font-size: 0.95rem;
                }
                .text-muted-custom { color: var(--color-text-muted-custom); }
                .fs-small { font-size: 0.8rem; }

                /* Badges */
                .badge-custom {
                    padding: 0.5em 1em;
                    font-size: 0.8rem;
                    font-weight: 500;
                    border-radius: var(--border-radius-main);
                    text-transform: capitalize;
                }
                .badge-artisan {
                    background-color: var(--color-accent-brand);
                    color: white;
                }
                .badge-artisan .bs-recycle { color: white !important; }

                .ethical-score-badge {
                    background-color: #f0f0f0;
                    padding: 0.4rem 0.8rem;
                    border-radius: var(--border-radius-main);
                }
                .ethical-score-badge .icon-accent { color: var(--color-accent-brand); }
                .ethical-score-badge .text-value {
                    font-family: var(--font-body);
                    font-weight: 700;
                    color: var(--color-text-main);
                    font-size: 0.9rem;
                }
                .badge-stock-low { background-color: #FFF3CD; color: #856404; border: 1px solid #FFEEBA;}
                .badge-stock-out { background-color: var(--color-text-muted-custom); color: white; }
                .badge-eco {
                    background-color: #E6F4EA;
                    color: #3D8B58;
                    border: 1px solid #CDE6D8;
                }
                .badge-eco .bs-geo-alt { color: #3D8B58; }

                /* Info Boxes (Eco, Artisan) */
                .info-box {
                    background-color: var(--color-bg-main);
                    padding: 1.25rem;
                    border-radius: var(--border-radius-main);
                    border: 1px solid var(--color-border-custom);
                }
                .section-title-box {
                    font-family: var(--font-heading);
                    font-weight: 700;
                    color: var(--color-primary-brand);
                    font-size: 1.1rem;
                    margin-bottom: 1rem;
                }
                .artisan-avatar {
                    width: 80px;
                    height: 80px;
                    background-color: var(--color-primary-brand);
                    color: white;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-family: var(--font-heading);
                    font-size: 2rem;
                    font-weight: 700;
                    border: 3px solid var(--color-bg-subtle);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .artisan-name {
                    font-family: var(--font-body);
                    font-weight: 700;
                    color: var(--color-text-main);
                    font-size: 1.1rem;
                }
                .artisan-category-location, .artisan-location {
                    font-size: 0.9rem;
                    color: var(--color-text-muted-custom);
                }
                .artisan-location { color: var(--color-accent-brand); font-weight: 500; }

                /* Quantity Selector */
                .quantity-selector { max-width: 180px; }
                .quantity-selector .btn-outline-custom {
                    border-color: var(--color-border-custom);
                    color: var(--color-primary-brand);
                    padding: 0.5rem 1rem;
                }
                .quantity-selector .btn-outline-custom:hover {
                    background-color: var(--color-primary-brand);
                    color: white;
                }
                .quantity-selector .quantity-input {
                    border-color: var(--color-border-custom);
                    color: var(--color-text-main);
                    font-weight: 700;
                    max-width: 60px;
                }
                .quantity-input:focus { box-shadow: 0 0 0 0.2rem rgba(44, 62, 80, 0.25); border-color: var(--color-accent-brand); }

                .btn-primary-custom {
                    background-color: var(--color-primary-brand);
                    border-color: var(--color-primary-brand);
                    color: white;
                    font-family: var(--font-body);
                    font-weight: 700;
                    font-size: 1.1rem;
                    border-radius: var(--border-radius-main);
                    transition: var(--transition-smooth);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .btn-primary-custom:hover:not(:disabled) {
                    background-color: #34495E;
                    border-color: #34495E;
                    transform: translateY(-2px) scale(1.01);
                    box-shadow: 0 6px 16px rgba(0,0,0,0.15);
                }
                .btn-primary-custom:disabled {
                    background-color: var(--color-text-muted-custom);
                    border-color: var(--color-text-muted-custom);
                    opacity: 0.7;
                }
                .bg-white-custom { background-color: var(--color-bg-subtle); }
                .border-top-custom { border-top: 1px solid var(--color-border-custom); }
                .shadow-lg-custom { box-shadow: 0 -0.5rem 1.5rem rgba(0,0,0,0.08); }

                /* Updated Image Modal Styles */
                .image-modal .modal-content {
                    background: rgba(255, 255, 255, 0.98);
                    border-radius: var(--border-radius-large);
                    max-width: 90%;
                    max-height: 89vh;
                    margin: 2rem auto;
                    overflow: hidden;
                    border: none;
                }

                .image-modal .modal-body {
                    height: auto;
                    min-height: 65vh;
                    padding: 1.5rem;
                    position: relative;
                }

                .modal-image-zoom-area {
                    max-height: 70vh;
                    width: auto;
                    touch-action: none;
                }

                .modal-image-content {
                    max-height: 70vh;
                    object-fit: contain;
                    padding: 1rem;
                    display: block;
                    margin: 0 auto;
                }

                .bg-modal-dark { background-color: rgba(0, 0, 0, 0.85); }

                /* Modal Navigation */
                .btn-light-modal {
                    background: rgba(0, 0, 0, 0.7);
                    border: none;
                    padding: 0.8rem;
                    color: white;
                    border-radius: 50%;
                    width: 40px;
                    height: 40px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-light-modal:hover {
                    background: rgba(0, 0, 0, 0.9);
                    transform: scale(1.1);
                }

                .modal-nav {
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 10;
                }

                .modal-nav-prev { left: 1rem; }
                .modal-nav-next { right: 1rem; }

                /* Thumbnail Strip */
                .modal-thumbnail-strip {
                    position: absolute;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 10;
                    padding: 0.5rem;
                    background-color: rgba(255, 255, 255, 0.9);
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    max-width: 80%;
                    overflow-x: auto;
                }

                .modal-thumbnail-item {
                    width: 65px;
                    height: 65px;
                    cursor: pointer;
                    border-radius: var(--border-radius-main);
                    overflow: hidden;
                    border: 2px solid rgba(0,0,0,0.1);
                    opacity: 0.7;
                    transition: var(--transition-smooth);
                    flex-shrink: 0;
                }

                .modal-thumbnail-item:hover {
                    opacity: 1;
                    border-color: rgba(44, 62, 80, 0.7);
                }

                .modal-thumbnail-item.active {
                    opacity: 1;
                    border-color: var(--color-primary-brand);
                    transform: scale(1.08);
                }

                /* Close Button */
                .btn-close {
                    position: absolute;
                    right: 1rem;
                    top: 1rem;
                    z-index: 10;
                    filter: invert(0.7);
                    transition: var(--transition-smooth);
                    opacity: 1;
                    background-size: 0.8rem;
                }

                .btn-close:hover {
                    filter: invert(0.9);
                    transform: rotate(90deg);
                }

                /* Utility Classes */
                .z-2 { z-index: 2; }
                .z-3 { z-index: 3; }

                /* Viewport Height Fix */
                body {
                    --vh: 1vh;
                }
            `}</style>
        </Container>
    );
};

export const setVhUnit = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

export default ProductDetail;