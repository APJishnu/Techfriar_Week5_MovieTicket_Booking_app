"use client"
import React, { useState } from 'react';
import AdminLoginPopup from '../../../components/AdminLoginPopUp/AdminLoginPopUp'; // Adjust the path as necessary
import styles from '../../../components/AdminLoginPopUp/AdminLoginPopUp.module.css';

const AdminLoginPage: React.FC = () => {
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleOpenPopup = () => {
    setShowLoginPopup(true);
  };

  const handleClosePopup = () => {
    setShowLoginPopup(false);
  };

  return (
    <div className={styles.container}>
      <h1>Admin Login</h1>
      <button onClick={handleOpenPopup} className={styles.openPopupBtn}>
        Open Admin Login
      </button>

      {showLoginPopup && <AdminLoginPopup onClose={handleClosePopup} />}
    </div>
  );
};

export default AdminLoginPage;
