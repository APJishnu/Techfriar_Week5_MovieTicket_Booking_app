"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import OTPInput from "../../../components/OtpInput/OtpInput";
import styles from "../../../components/OtpInput/OtpInput.module.css";
import { getUser, User } from "../../../utils/auth";
import { useRouter } from "next/navigation"; // Import useRouter
import PopUpVerification from "../../../components/PopUpVerification/PopUpVerification";
import { API_URL } from "@/utils/api";
import Cookies from "js-cookie";

const EmailVerification: React.FC = () => {
  const router = useRouter(); // Initialize useRouter

  const [email, setEmail] = useState<string>("");
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  // State to manage both initial and success popups
  const [showInitialPopup, setShowInitialPopup] = useState<boolean>(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      Cookies.set("authToken", token, { expires: 1 / 24 });
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getUser();
      setUser(userData);
      if (userData?.email) {
        setEmail(userData.email);
      } else {
        setEmail("");
      }
    };

    fetchUser();
  }, []);

  const getAuthToken = () => localStorage.getItem("authToken");

  const sendOtp = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/send-otp`,
        { field: "email", value: email },
        { withCredentials: true }
      );
      if (response.data.message === "OTP sent successfully.") {
        setOtpSent(true);
        setCountdown(60);
        startCountdown();
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Failed to send OTP. Please try again..");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (otp.length !== 4) {
      setError("Please enter a valid 4-digit OTP.");
      return;
    }

    const token = getAuthToken();
    setError("");
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/verify-otp`,
        { otp },
        { headers: { Authorization: `Bearer ${token}` }, withCredentials: true }
      );
      if (response.data.verified) {
        setSuccess(true);
        setShowSuccessPopup(true);

        setTimeout(() => {
          router.push("/");
        }, 5000);
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError("Verification failed. Please try again.");
    }
  };

  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) clearInterval(timer);
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className={styles.wrapper}>
      {/* Initial popup to ask for email verification */}
      <PopUpVerification
        show={showInitialPopup}
        onClose={() => router.push("/")}
        message="Please verify your email to continue."
        buttonText="Enter Now"
        onConfirm={() => {
          setShowInitialPopup(false);
          // Additional logic if needed
        }}
      />

      {/* Success popup after OTP verification */}
      <PopUpVerification
        show={showSuccessPopup}
        onClose={() => router.push("/")}
        message="Your email has been successfully verified!"
        buttonText="Continue"
        onConfirm={() => {
          setShowSuccessPopup(false);
          // Navigate to the home page after success
          router.push("/");
        }}
      />

      <div className={styles.container}>
        <h1 className={styles.title}>Email Verification</h1>
        {user ? (
          <>
            <div className={styles.inputFieldWrapper}>
              <input
                type="email"
                value={email}
                readOnly
                className={styles.inputField}
                placeholder="Email"
              />
              <img
                src={user.photo || "/default-photo.png"}
                alt="Profile Icon"
                className={styles.profileIcon}
              />
            </div>
            <div className={styles.secondMaindiv}>
              {!loading && (
                <button
                  onClick={sendOtp}
                  disabled={countdown > 0} // Disable button after OTP sent
                  className={`${styles.sendButton} ${
                    otpSent ? styles.activeSendButton : ""
                  }`}
                >
                  {countdown > 0 ? `Resend OTP (${countdown})` : "Send OTP"}
                </button>
              )}
              {loading && (
                <div className={styles.spinnerDiv}>
                  <div className={styles.loadingSpinner}></div>
                </div>
              )}
              <OTPInput length={4} onChange={setOtp} />
              <button
                onClick={verifyOtp}
                disabled={!otpSent}
                className={styles.verifyButton}
              >
                Verify OTP
              </button>
              {!otpSent ? (
                <span className={styles.tooltip}>
                  sent Otp to Email for enable the button
                </span>
              ) : null}
              {error && <p className={styles.errorMessage}>{error}</p>}
              {success && <p className={styles.successMessage}>{success}</p>}
            </div>
          </>
        ) : (
          <div>Loading...</div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
