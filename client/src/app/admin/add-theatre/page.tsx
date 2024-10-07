"use client";

import React, { useState } from "react";
import axios from "axios";
import styles from '../../../styles/admin/addTheatre.module.css';
import { API_URL } from "@/utils/api";
import { useRouter } from "next/navigation";

const AddTheatre: React.FC = () => {
  const router = useRouter();

  const [theatreData, setTheatreData] = useState({
    theatreName: "",
    location: "",
    screenResolution: "2K" as '2K' | '4K',
    amenities: [] as string[],
    capacity: 0
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationErrors, setValidationErrors] = useState({
    theatreName: "",
    location: "",
    amenities: "",
    capacity: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    setTheatreData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleAmenitiesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTheatreData(prevData => ({
      ...prevData,
      amenities: value.split(",").map(item => item.trim())
    }));
  };

  const validateForm = () => {
    const errors: any = {};
    
    if (!theatreData.theatreName.trim()) {
      errors.theatreName = "Theatre Name is required";
    }
    if (!theatreData.location.trim()) {
      errors.location = "Location is required";
    }
    if (theatreData.amenities.length === 0) {
      errors.amenities = "At least one amenity is required";
    }
    if (theatreData.capacity <= 0) {
      errors.capacity = "Capacity should be greater than 0";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/api/admin/add-theatre`, theatreData);

      if (response.status === 200) {
        setSuccessMessage("Theatre added successfully!");
        setTheatreData({
          theatreName: "",
          location: "",
          screenResolution: "2K",
          amenities: [],
          capacity: 0
        });

        setTimeout(() => {
          router.push("/admin/theatres-list");
        }, 1500);
      }
    } catch (error) {
      setErrorMessage("Failed to add the theatre. Please try again.");
    }
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.addTheatreContainer}>
        <h2>Add a New Theatre</h2>
        {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
        {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

        <form onSubmit={handleSubmit} className={styles.theatreForm}>
          <div className={styles.formGroup}>
            <label htmlFor="theatreName">Theatre Name:</label>
            <input
              type="text"
              id="theatreName"
              name="theatreName"
              value={theatreData.theatreName}
              onChange={handleChange}
              className={styles.inputField}
            />
            {validationErrors.theatreName && <div className={styles.errorText}>{validationErrors.theatreName}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              id="location"
              name="location"
              value={theatreData.location}
              onChange={handleChange}
              className={styles.inputField}
            />
            {validationErrors.location && <div className={styles.errorText}>{validationErrors.location}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="screenResolution">Screen Resolution:</label>
            <select
              id="screenResolution"
              name="screenResolution"
              value={theatreData.screenResolution}
              onChange={handleChange}
              className={styles.inputField}
            >
              <option value="2K">2K</option>
              <option value="4K">4K</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="amenities">Amenities (comma-separated):</label>
            <input
              type="text"
              id="amenities"
              name="amenities"
              value={theatreData.amenities.join(",")}
              onChange={handleAmenitiesChange}
              className={styles.inputField}
            />
            {validationErrors.amenities && <div className={styles.errorText}>{validationErrors.amenities}</div>}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="capacity">Capacity:</label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={theatreData.capacity}
              onChange={handleChange}
              className={styles.inputField}
            />
            {validationErrors.capacity && <div className={styles.errorText}>{validationErrors.capacity}</div>}
          </div>

          <button type="submit" className={styles.submitButton}>Add Theatre</button>
        </form>
      </div>
    </div>
  );
};

export default AddTheatre;
