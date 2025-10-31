import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import artisanDashboardService from '../../services/artisanDashboardService';
import { BsCurrencyDollar, BsGraphUp, BsBoxSeam } from 'react-icons/bs';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const analyticsData = await artisanDashboardService.getAnalyticsData();
        setData(analyticsData);
      } catch (err) {
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF'];

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Crafting your analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-3">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container-fluid py-4">
      <h2 className="mb-4"><BsGraphUp className="me-2" />Sales Analytics</h2>

      <Row className="mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle p-3 me-3">
                  <BsCurrencyDollar size={24} />
                </div>
                <div>
                  <Card.Title className="mb-0">Total Sales</Card.Title>
                  <h2 className="mt-2">₹{data.totalSales.toLocaleString()}</h2>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Monthly Revenue</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="total" fill="#8884d8" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Top Products</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data.topProducts}
                      dataKey="sales"
                      nameKey="product"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {data.topProducts.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Analytics;