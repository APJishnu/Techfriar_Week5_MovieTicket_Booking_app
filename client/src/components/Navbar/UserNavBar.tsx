import Link from 'next/link';
import axios from 'axios';
import { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import SignUpPopup from './components/signin-popup/SignUpPopUp';
import { getUser, isAuthenticated, logout, User } from '../../utils/auth';
import { useRouter, usePathname } from 'next/navigation';
import { API_URL } from '@/utils/api';


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
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [showMenu, setShowMenu] = useState(false);

    const pathname = usePathname();
    const router = useRouter();

    const [activePath, setActivePath] = useState<string>(pathname);

    useEffect(() => {
        setActivePath(pathname);
    }, [pathname]);

    useEffect(() => {
        const fetchUser = async () => {
            if (await isAuthenticated()) {
                const userData = await getUser();
                setUser(userData);
            } else {
                setUser(null);
            }
        };

        fetchUser();
    }, []);

    const handleToggleClick = () => {
        setShowMenu(!showMenu);
    };


    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
    };

    const handleSearchInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            try {
                const response = await axios.get(`${API_URL}/api/search-movies?title=${value}`);
                setSearchResults(response.data);
            } catch (error) {
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleMovieClick = (movieId: string) => {
        router.push(`/user/movie-details?movieId=${movieId}`);
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
        router.push('/');
    };

    const handleSearchIconClick = () => {
        setIsSearchVisible(!isSearchVisible);
    };




    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.logo}>
                        <h1>cineMagic</h1>
                        <button className={styles.toggleBtn} onClick={handleToggleClick}>
                            {showMenu ? ' ✕' : '☰'}
                        </button>
                    </div>

                    <div className={`${styles.searchBar} ${showMenu ? styles.show : styles.hidden}`}  >
                        <input
                            type="text"
                            placeholder="Search Movies..."
                            value={searchTerm}
                            onChange={handleSearchInput}
                            aria-label="Search"
                            className={styles.searchInput}
                        />
                        {searchTerm ? (
                            <img src='/Navbar/close.svg' className={styles.searchIcon} onClick={handleClearSearch} />
                        ) : (
                            <img className={styles.searchIcon} src='/Navbar/search.svg' onClick={handleSearchIconClick} />
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
                    {user ? (
                        <div className={`${styles.profileHeader} ${showMenu ? styles.show : styles.hidden}`} onClick={toggleDropdown}>

                            <div className={styles.profileIcon}>
                                {user.photo ? (
                                    <img src={user.photo} alt={user.firstname} className={styles.profilePhoto} />
                                ) : (
                                    <i className="fas fa-user-circle"></i>
                                )}
                                <span>{user.firstname}</span>
                                <div className={`${styles.profileDropdown} ${showDropdown ? styles.showDropdown : ''}`}>

                                    <Link href="/user/email-verification">2F Authentication</Link>
                                    <Link href="/user/booking-details">Booking Collection</Link>
                                    <a onClick={handleLogout}>Logout</a>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button onClick={toggleSignUpPopup} className={`${styles.signUpBtn} ${showMenu ? styles.show : styles.hidden}`}>
                            Sign Up
                        </button>
                    )}

                </nav>

                <ul
                    className={`${styles.mainNavigationsUl} ${showMenu ? styles.show : styles.hidden
                        }`}
                >
                    <li
                        className={styles.mainNavigationsLi}

                    >
                        <Link className={styles.listNav} href="/" style={
                            activePath === '/'
                                ? { backgroundColor: '#fc1212', color: '#ffffff' }
                                : {}
                        }>
                            Home
                        </Link>
                    </li>
                    <li
                        className={styles.mainNavigationsLi}

                    >
                        <Link className={styles.categories} href="/user/movies-list" style={
                            activePath === '/user/movies-list'
                                ? { backgroundColor: '#fc1212', color: '#ffffff' }
                                : {}
                        }>
                            Movies
                        </Link>
                    </li>
                    <li
                        className={styles.mainNavigationsLi}

                    >
                        <Link className={styles.categories} href="/admin/admin-login" style={
                            activePath === '/admin/admin-login'
                                ? { backgroundColor: '#fc1212', color: '#ffffff' }
                                : {}
                        }>
                            Admin
                        </Link>
                    </li>
                </ul>
            </header>

            {showSignUpPopup && <SignUpPopup toggleSignUpPopup={toggleSignUpPopup} />}
        </>
    );
};

export default Navbar;
