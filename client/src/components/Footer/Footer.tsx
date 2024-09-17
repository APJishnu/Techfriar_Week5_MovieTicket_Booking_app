"use client"

import React from 'react';
import styles from './Footer.module.css';
import { useRouter } from 'next/navigation';

const Footer: React.FC = () => {

 const router = useRouter();


 const handleFooterClick = () => {
    router.push('/admin/admin-login'); // Change this to your actual admin login page route
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h4>About Us</h4>
          <ul>
            <li><a href="/about">Our Story</a></li>
            <li><a href="/team">Meet the Team</a></li>
            <li><a href="/careers">Careers</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact</h4>
          <ul>
            <li><a href="/contact">Contact Us</a></li>
            <li><a href="/support">Support</a></li>
            <li><a href="/feedback">Feedback</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/cookie-policy">Cookie Policy</a></li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Follow Us</h4>
          <ul className={styles.socialLinks}>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-facebook-f"></i> Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-twitter"></i> Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i> Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className={styles.footerBottom}  onClick={handleFooterClick}>
        <p>&copy; {new Date().getFullYear()} Movie Booking App. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
