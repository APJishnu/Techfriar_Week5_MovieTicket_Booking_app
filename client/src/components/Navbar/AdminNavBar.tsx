'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './NavBar.module.css';

const AdminNavbar = ({ user }: { user?: { firstname: string } }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isMoviesDropdownOpen, setMoviesDropdownOpen] = useState(false); // Tracks if Movies dropdown is open
    const [isTheatersDropdownOpen, setTheatersDropdownOpen] = useState(false); // Tracks if Theaters dropdown is open

    // Clear search input
    const handleClearSearch = () => {
        setSearchTerm("");
    };

    // Handles typing in the search bar (can trigger an API call for auto-search)
    const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        // Trigger auto-search logic here
        if (value.length > 0) {
            console.log("Searching for:", value); // Simulate search action
        }
    };

    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.logo}>
                        <h1>Admin Logo</h1>
                    </div>
                    <div className={styles.searchBar}>
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchInput}
                            aria-label="Search"
                        />
                        {searchTerm ? (
                            <img src='/Navbar/close.svg' className={styles.searchIcon} onClick={handleClearSearch}></img>
                        ) : (
                            <img className={styles.searchIcon} src='/Navbar/search.svg'></img>
                        )}
                    </div>
                    <div className={styles.cartHeader}>
                        <Link className={styles.adminLogOutNav} href="/logout">
                            Logout <i className="fas fa-sign-out-alt"></i>
                        </Link>
                    </div>
                </nav>
            </header>

            <div className={styles.mainNavigations}>
                <div className={styles.mainNavigationsDiv}>
                    <ul className={styles.mainNavigationsUl}>
                        <li className={`${styles.mainNavigationsLi} ${styles.mobileHide}`}>
                            <Link className={styles.listNav} href="/admin/dashboard">Admin Dashboard</Link>
                        </li>

                        {/* Movies Dropdown */}
                        <li
                            className={styles.mainNavigationsLi}
                            onMouseEnter={() => setMoviesDropdownOpen(true)}

                        >
                            <a className={styles.categories}>Movies <i className="fas fa-caret-down"></i></a>
                            {isMoviesDropdownOpen && (
                                <div className={styles.categoriesItems}>
                                    <p><Link className={styles.categoriesItemsLink} href="/admin/movies-list">Movies List</Link></p>
                                    <p><Link className={styles.categoriesItemsLink} href="/admin/add-movies">Add Movie</Link></p>
                                </div>
                            )}
                        </li>

                        {/* Theaters Dropdown */}
                        <li
                            className={styles.mainNavigationsLi}
                            onMouseEnter={() => setTheatersDropdownOpen(true)}

                        >
                            <a className={styles.categories}>Theatres <i className="fas fa-caret-down"></i></a>
                            {isTheatersDropdownOpen && (
                                <div className={styles.categoriesItems}>
                                    <p><Link className={styles.categoriesItemsLink} href="/admin/theatres-list">Theaters List</Link></p>
                                    <p><Link className={styles.categoriesItemsLink} href="/admin/add-theatre">Add Theaters</Link></p>
                                </div>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default AdminNavbar;
