"use client";

import React, { useState } from 'react';
import axios from 'axios';
import styles from './AdminLoginPopUp.module.css';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/utils/api';

interface AdminLoginPopupProps {
  onClose: () => void;
}

const AdminLoginPopup: React.FC<AdminLoginPopupProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const router = useRouter();

  const validateForm = () => {
    let valid = true;

    // Reset errors
    setEmailError(null);
    setPasswordError(null);

    // Check if email is empty or invalid
    if (!email) {
      setEmailError('* Email is required.!');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('* Please enter a valid email address.!');
      valid = false;
    }

    // Check if password is empty
    if (!password) {
      setPasswordError('* Password is required.!');
      valid = false;
    }

    return valid;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateForm()) {
      return; // Stop if form validation fails
    }

    try {
      const response = await axios.post(`${API_URL}/api/admin/admin-login`, { email, password });
      const data = response.data;

      if (data.success) {
        setSuccess('Login successful! Redirecting...');
        setTimeout(() => {
          router.push('/admin/admin-dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <form onSubmit={handleSubmit}>
          <h2>Admin Login</h2>
          {success && <p className={styles.successMessage}>{success}</p>}
          {error && <p className={styles.errorMessage}>{error}</p>}
          
          <div>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Enter Email'
            />
            {emailError && <p className={styles.errorMessage}>{emailError}</p>}
          </div>

          <div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter Password'
            />
            {passwordError && <p className={styles.errorMessage}>{passwordError}</p>}
          </div>

          <button type="submit" className={styles.loginBtn}>Login</button>
          <button type="button" onClick={onClose} className={styles.closeButton}>X</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPopup;
