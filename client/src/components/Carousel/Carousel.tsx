"use client";

import React, { useEffect, useState } from 'react';
import styles from './Carousel.module.css';
import Link from 'next/link';

// Simulate data fetching from the backend (admin panel provides the data)
const fetchCarouselData = async () => {
  // In a real app, you would fetch this from the backend
  return [
    {
      id: 1,
      src: "/demoCarousel.avif",
      title: "Movie 1",
      rating: 4.5,
      description: "An epic journey of a hero.",
    },
    {
      id: 2,
      src: "/demoCarousel.avif",
      title: "Movie 2",
      rating: 4.7,
      description: "A romantic tale set in the 90s.",
    },
    {
      id: 3,
      src: "/demoCarousel.avif",
      title: "Movie 3",
      rating: 4.9,
      description: "A thrilling action-packed movie.",
    },
  ];
};

const Carousel: React.FC = () => {
  const [carouselData, setCarouselData] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchCarouselData();
      setCarouselData(data);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % carouselData.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [carouselData]);

  if (!carouselData.length) return null; // Return null if there's no data

  return (
    <div className={styles.carouselContainer}>
      <div className={styles.carousel}>
        <div
          className={styles.carouselImages}
          style={{ transform: `translateX(${-currentIndex * 100}%)` }}
        >
          {carouselData.map((movie, index) => (
            <div key={index} className={styles.carouselSlide}>
              <img src={movie.src} alt={movie.title} />
              <div className={styles.carouselOverlay}>
                <h2>{movie.title}</h2>
                <p>Rating: {movie.rating}</p>
                <p>{movie.description}</p>
                <Link href={`/book-now/${movie.id}`}>
                  <button className={styles.bookNowButton}>Book Now</button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.carouselDots}>
          {carouselData.map((_, index) => (
            <div
              key={index}
              className={`${styles.dot} ${index === currentIndex ? styles.active : ''}`}
              onClick={() => setCurrentIndex(index)}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
