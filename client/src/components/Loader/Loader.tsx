import React from "react";
import styles from "./Loader.module.css"; // Ensure this path is correct

const Loader: React.FC = () => {
  return (
    <div className={styles.loader}>
      {/* Optional: You can add an SVG or other elements here if you want */}
      <div className={styles.spinner}></div>
  
    </div>
  );
};

export default Loader;
