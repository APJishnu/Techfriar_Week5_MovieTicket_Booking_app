"use client"
// AdminDashboard.tsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Card, Col, Row, Typography } from 'antd';
import { Chart, CategoryScale, LinearScale, PointElement, LineElement } from 'chart.js'; // Import necessary components
import styles from './AdminDashboard.module.css'; // Import CSS module

// Register the components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement);

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  // Sample data for the movie ticket booking chart
  const chartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Tickets Sold',
        data: [65, 59, 80, 81, 56, 55, 40],
        fill: false,
        backgroundColor: '#e50914',
        borderColor: '#e50914',
        tension: 0.1,
      },
    ],
  };

  return (
    <div className={styles.detailsSection}>
      <div className={styles.movieInfoContainer}>
        <div className={styles.movieInfo}>
          <h2>Admin Dashboard</h2>
          <p>Manage movie schedules, view ticket sales, and more.</p>
        </div>
      </div>

      <Row gutter={16}>
        <Col span={24}>
          <Card title="Movie Ticket Booking Chart" bordered={false}>
            <Line data={chartData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
