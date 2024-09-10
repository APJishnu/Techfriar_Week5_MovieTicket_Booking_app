'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './NavBar.module.css';

const Navbar = ({ user }: { user?: { firstname: string } }) => {
    const [cartCount] = useState(50);  // Simulates cart item count
    const [searchTerm, setSearchTerm] = useState(""); // Tracks search input

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
                        <h1>Logo</h1>
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
                            <img src='/Navbar/close.svg' className={styles.searchIcon}  onClick={handleClearSearch}></img>
                        ):(
                          <img className={styles.searchIcon} src='/Navbar/search.svg'></img>
                        )
                        }
                    </div>
                    <div className={styles.cartHeader}>
                        <i className="fas fa-shopping-cart"></i>
                        <span>{cartCount}</span>
                    </div>
                </nav>
            </header>
            <div className={styles.mainNavigations}>
                <div className={styles.mainNavigationsDiv}>
                    <ul className={styles.mainNavigationsUl}>
                        <li className={`${styles.mainNavigationsLi} ${styles.mobileHide}`}>
                            <Link className={styles.listNav} href="/">Home</Link>
                        </li>
                        <li className={styles.mainNavigationsLi}>
                            <a className={styles.categories}>Categories <i className="fas fa-caret-down"></i></a>
                            <div className={styles.categoriesItems}>
                                <p><Link href="/category1">Category 1</Link></p>
                                <p><Link href="/category2">Category 2</Link></p>
                                <p><Link href="/category3">Category 3</Link></p>
                                <p><Link href="/category4">Category 4</Link></p>
                                <p><Link href="/category5">Category 5</Link></p>
                            </div>
                        </li>
                        <li className={`${styles.mainNavigationsLi} ${styles.user}`}>
                            {user ? (
                                <>
                                    <Link href="/profile">
                                        <i className="fas fa-user"></i> Hello, {user.firstname}
                                    </Link>
                                    <Link className={styles.listNav} href="/logout">
                                        Logout <i className="fas fa-sign-out-alt"></i>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link className={styles.listNav} href="/login">
                                        <i className="fas fa-user"></i> Login
                                    </Link>
                                </>
                            )}
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
};

export default Navbar;
