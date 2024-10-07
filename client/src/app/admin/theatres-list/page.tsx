"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import styles from "../../../styles/admin/theatreList.module.css";
import { API_URL } from "@/utils/api";

interface Theatre {
  _id: string;
  theatreName: string;
  location: string;
  screenResolution: "2K" | "4K";
  amenities: string[];
  capacity: number;
}

const TheatreList: React.FC = () => {
  const [theatres, setTheatres] = useState<Theatre[]>([]);
  const [filteredTheatres, setFilteredTheatres] = useState<Theatre[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [theatreToDelete, setTheatreToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchTheatres = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/theatre-list`);
        setTheatres(response.data);
        setFilteredTheatres(response.data);
      } catch (error) {
        setErrorMessage("Failed to fetch theatres. Please try again later.");
      }
    };
    fetchTheatres();
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = theatres.filter(
      (theatre) =>
        theatre.theatreName.toLowerCase().includes(lowercasedQuery) ||
        theatre.location.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredTheatres(filtered);
  }, [searchQuery, theatres]);

  const handleDelete = (theatreId: string) => {
    setTheatreToDelete(theatreId); // Set the theatre to delete
    setIsModalOpen(true); // Open the confirmation modal
  };

  const confirmDelete = async () => {
    if (theatreToDelete) {
      try {
        await axios.delete(`${API_URL}/api/admin/theatre-delete/${theatreToDelete}`);
        setTheatres(theatres.filter((theatre) => theatre._id !== theatreToDelete));
        setFilteredTheatres(filteredTheatres.filter((theatre) => theatre._id !== theatreToDelete));
        setIsModalOpen(false); // Close the modal after deletion
      } catch (error) {
        setErrorMessage("Failed to delete the theatre. Please try again.");
        setIsModalOpen(false); // Close the modal on error
      }
    }
  };

  return (
    <section className={styles.mainSection}>
      <div className={styles.container}>
        <div className={styles.fixedContainer}>
          <div className={styles.header}>
            <h2 className={styles.title}>Theatre List</h2>

            {/* Search input */}
            <div className={styles.searchContainer}>
              <input
                type="text"
                placeholder="Search theatres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <button
              className={styles.addButton}
              onClick={() => router.push("/admin/add-theatre")}
            >
              Add Theatre
            </button>
          </div>

          <div className={styles.theatreCardHeading}>
            <div className={styles.cardRow}>
              <span className={styles.index}>#</span>
              <span>Name</span>
              <span>Location</span>
              <span>Resolution</span>
              <span>Capacity</span>
              <span>Amenities</span>
              <div className={styles.cardActions} style={{ opacity: "0" }}>
                <button className={styles.deleteButton}>Delete</button>
                <button className={styles.editButton}>Edit</button>
              </div>
            </div>
          </div>
        </div>

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        {filteredTheatres.length > 0 ? (
          <div className={styles.cardContainer}>
            {filteredTheatres.map((theatre, index) => (
              <div className={styles.theatreCard} key={theatre._id}>
                <div className={styles.cardRow}>
                  <span className={styles.index}>{index + 1}</span>
                  <span>{theatre.theatreName}</span>
                  <span>{theatre.location}</span>
                  <span>{theatre.screenResolution}</span>
                  <span>{theatre.capacity}</span>
                  <span>{theatre.amenities.join(", ")}</span>
                  <div className={styles.cardActions}>
                    <button>
                      <img
                        src="/admin/trash.svg"
                        alt="Delete Theatre"
                        onClick={() => handleDelete(theatre._id)}
                        className={styles.deleteButton}
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <h3 className={styles.emptyMessage}>No theatres available</h3>
        )}

        {/* Confirmation Modal */}
        {isModalOpen && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Confirm Deletion</h3>
              <p>Are you sure you want to delete this theatre?</p>
              <div className={styles.modalActions}>
                <button onClick={confirmDelete} className={styles.confirmButton}>
                  Yes, Delete
                </button>
                <button onClick={() => setIsModalOpen(false)} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default TheatreList;
