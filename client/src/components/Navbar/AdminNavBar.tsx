'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './NavBar.module.css';
import { useRouter, usePathname } from 'next/navigation';

const AdminNavbar = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showMenu, setShowMenu] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const pathname = usePathname();

    const [activePath, setActivePath] = useState<string>(pathname);

    useEffect(() => {
        // Update the active path whenever the route changes
        setActivePath(pathname);
    }, [pathname]);

    const handleToggleClick = () => {
        setShowMenu(!showMenu);
    };

    const handleSearchInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchTerm(value);

        if (value.length > 0) {
            // Simulate search logic here
        } else {
            setSearchResults([]);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
    };

    const handleSearchIconClick = () => {
        setIsSearchVisible(!isSearchVisible);
    };




    return (
        <>
            <header className={styles.header}>
                <nav className={styles.nav}>
                    <div className={styles.logo}>
                        <h1>cineMagic.Admin</h1>
                        <button className={styles.toggleBtn} onClick={handleToggleClick}>
                            ☰
                        </button>
                    </div>

                    <div className={`${styles.searchBar} ${showMenu ? styles.show : styles.hidden}`}>
                        <input
                            type="text"
                            placeholder="Search..."
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

                    </div>

                    <div className={`${styles.profileHeaderAdmin} ${showMenu ? styles.show : styles.hidden}`}>
                        <Link className={styles.adminLogOutNav} href="/">
                            Logout
                        </Link>
                    </div>
                </nav>


                <ul
                    className={`${styles.mainNavigationsUl} ${showMenu ? styles.show : styles.hidden
                        }`}
                >
                    <li className={styles.mainNavigationsLi}>
                        <Link href="/admin/dashboard" className={styles.listNav} style={
                            activePath === '/admin/dashboard'
                                ? { backgroundColor: '#f65c5c', color: '#ffffff' }
                                : {}
                        }>
                            Admin Dashboard
                        </Link>
                    </li>
                    <li className={styles.mainNavigationsLi}>
                        <Link href="/admin/movies-list" className={styles.listNav} style={
                            activePath === '/admin/movies-list'
                                ? { backgroundColor: '#f65c5c', color: '#ffffff' }
                                : {}
                        }>
                            Movies
                        </Link>
                    </li>
                    <li className={styles.mainNavigationsLi}>
                        <Link href="/admin/theatres-list" className={styles.listNav} style={
                            activePath === '/admin/theatres-list'
                                ? { backgroundColor: '#f65c5c', color: '#ffffff' }
                                : {}
                        }>
                            Theaters
                        </Link>
                    </li>
                    <li className={styles.mainNavigationsLi}>
                        <Link href="/admin/movie-scheduled-list" className={styles.listNav} style={
                            activePath === '/admin/movie-scheduled-list'
                                ? { backgroundColor: '#f65c5c', color: '#ffffff' }
                                : {}
                        }>
                            Movie Schedule
                        </Link>
                    </li>
                </ul>
            </header>
        </>
    );
};

export default AdminNavbar;
