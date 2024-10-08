import React from 'react';
import styles from './PopUpVerification.module.css'; // Import your styles for the modal

interface PopUpVerificationProps {
  show: boolean;
  onClose: () => void;
  message: string;
  buttonText: string;
  onConfirm: () => void;
}

const PopUpVerification: React.FC<PopUpVerificationProps> = ({
  show,
  onClose,
  message,
  buttonText,
  onConfirm,
}) => {
  if (!show) return null;

  return (
    <div className={styles.popupOverlay}>
      <div className={styles.popupContent}>
        <button className={styles.closeIcon} onClick={onClose}>&times;</button> {/* Close icon */}
        <h2>Email Verification</h2>
        <p>{message}</p>
        <div className={styles.popupButtons}>
          <button onClick={onConfirm} className={styles.confirmButton}>
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopUpVerification;
