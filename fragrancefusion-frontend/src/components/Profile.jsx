import React, { useState, useEffect } from 'react';
import {
  Container, Card, ListGroup, Button,
  Form, Alert, Spinner
} from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/currency';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { user, authChecked, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      if (!authChecked || !user?.userId) return;

      try {
        const response = await axios.get(`/api/orders/user/${user.userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('userToken')}`
          }
        });
        setOrders(response.data);
      } catch (err) {
        setError('Failed to load orders');
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [authChecked, user?.userId]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await axios.post('/api/auth/change-password', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      setSuccess('Password changed successfully!');
      setShowPasswordForm(false);
      setFormData({ oldPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  if (!authChecked) {
    return (
      <Container className="my-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Container className="py-5">
      <Card className="shadow-sm mb-4">
        <Card.Header as="h5" className="d-flex align-items-center">
          <span className="me-2">👤</span>
          Profile Information
        </Card.Header>
        <Card.Body>
          <div className="mb-4">
            <p className="mb-1"><strong>Email:</strong> {user.email}</p>
            <p className="mb-0">
              <strong>Account Type:</strong> {user.role.replace('ROLE_', '')}
            </p>
          </div>

          <Button
            variant="outline-primary"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="me-3"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </Button>

          <Button
            variant="outline-danger"
            onClick={logout}
          >
            Logout
          </Button>

          {showPasswordForm && (
            <Form className="mt-4" onSubmit={handlePasswordChange}>
              <Form.Group controlId="oldPassword" className="mb-3">
                <Form.Label>Current Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.oldPassword}
                  onChange={(e) => setFormData({...formData, oldPassword: e.target.value})}
                  required
                />
              </Form.Group>

              <Form.Group controlId="newPassword" className="mb-4">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  required
                />
              </Form.Group>

              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}

              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="secondary"
                  onClick={() => setShowPasswordForm(false)}
                >
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  Update Password
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>

      <Card className="shadow-sm">
        <Card.Header as="h5" className="d-flex align-items-center">
          <span className="me-2">📦</span>
          Order History
        </Card.Header>
        <Card.Body>
          {loadingOrders ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2 text-muted">Loading your orders...</p>
            </div>
          ) : error ? (
            <Alert variant="danger">
              <h5>Error Loading Orders</h5>
              <p>{error}</p>
            </Alert>
          ) : orders.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-muted">No orders found</p>
              <Button variant="primary" onClick={() => navigate('/')}>
                Start Shopping
              </Button>
            </div>
          ) : (
            <ListGroup variant="flush">
              {orders.map(order => (
                <ListGroup.Item key={order.id} className="py-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h6 className="mb-1">Order #{order.razorpayOrderId}</h6>
                      <small className="text-muted">
                        {new Date(order.orderDate).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </small>
                      <div className="mt-1">
                        <strong>Total:</strong> {formatCurrency(order.totalAmount)}
                      </div>
                    </div>
                    <Button
                      variant="outline-secondary"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      View Details
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Profile;