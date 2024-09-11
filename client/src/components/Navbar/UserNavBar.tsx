'use client';
import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import SignUpPopup from './components/signin-popup/SignUpPopUp';
import { getUser, isAuthenticated, logout, User } from '../../hooks/auth'; // Import utility functions
import { useRouter } from 'next/navigation';

interface Movie {
    _id: string;
    title: string;
}

const Navbar = () => {
    const [user, setUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSignUpPopup, setShowSignUpPopup] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            if (isAuthenticated()) {
                const userData = await getUser();
                setUser(userData);
            } else {
                setUser(null);
            }
        };

        fetchUser();
    }, []);



    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('authToken', token); // Store token in localStorage
        }
    }, []);

    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
    };

    const handleSearchInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            try {
                const response = await axios.get(`http://localhost:5000/api/search-movies?title=${value}`);
                setSearchResults(response.data);
            } catch (error) {
                console.error("Error searching for movies:", error);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleMovieClick = (movieId: string) => {
        router.push(`/user/movie-details?id=${movieId}`);
        setSearchTerm("");
        setSearchResults([]);
    };

    const toggleSignUpPopup = () => {
        setShowSignUpPopup(!showSignUpPopup);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handleLogout = () => {
        logout();
        setUser(null);
        router.push('/'); // Redirect to home or login page
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
                            <img src='/Navbar/close.svg' className={styles.searchIcon} onClick={handleClearSearch} />
                        ) : (
                            <img className={styles.searchIcon} src='/Navbar/search.svg' />
                        )}
                        {searchResults.length > 0 && (
                            <div className={styles.searchResults}>
                                {searchResults.map((movie) => (
                                    <div
                                        key={movie._id}
                                        className={styles.searchResultItem}
                                        onClick={() => handleMovieClick(movie._id)}
                                    >
                                        {movie.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className={`${styles.profileHeader} ${showDropdown ? styles.active : ''}`} onClick={toggleDropdown}>
                        {user ? (
                            <div className={styles.profileIcon}>
                                {user.photo ? (
                                    <img src={user.photo} alt={user.firstname} className={styles.profilePhoto} />
                                ) : (
                                    <i className="fas fa-user-circle"></i>
                                )}
                                <span>{user.firstname}</span>
                                <div className={`${styles.profileDropdown} ${showDropdown ? styles.showDropdown : ''}`}>
                                    <Link href="/profile">Account Settings</Link>
                                    <a onClick={handleLogout}>Logout</a>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link className={styles.listNav} href="/log-in">
                                    Login<i className="fas fa-sign-out-alt"></i>
                                </Link>
                                <button onClick={toggleSignUpPopup} className={styles.signUpBtn}>
                                    <i className="fas fa-user"></i> Sign Up
                                </button>
                            </>
                        )}
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
                    </ul>
                </div>
            </div>

            {showSignUpPopup && <SignUpPopup toggleSignUpPopup={toggleSignUpPopup} />}
        </>
    );
};

export default Navbar;
