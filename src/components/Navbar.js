import { Link } from 'react-router-dom';

import styles from '../styles/navbar.module.css';
import { useAuth } from '../hooks';
import { useState } from 'react';
import { useEffect, useReducer } from 'react';
import { searchUsers } from '../api';

const Navbar = () => {
  const auth = useAuth();
  const [results, setResults] = useState([]);
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    const fetchUser = async () => {
      const response = await searchUsers(searchText);
      if (response.success) {
        setResults(response.data.users);
      }
    };
    if (searchText.length > 2) {
      fetchUser();
    } else {
      setResults([]);
    }
  }, [searchText]);
  return (
    <div className={styles.nav}>
      <div className={styles.leftDiv}>
        <Link to="/">
          <img
            alt=""
            src="https://ninjasfiles.s3.amazonaws.com/0000000000003454.png"
          />
        </Link>
      </div>
      <div className={styles.searchContainer}>
        <img className={styles.searchIcon} alt="img icon" />
        <input
          placeholder="Search User"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {results.length > 0 && (
          <div className={styles.searchResults}>
            <ul>
              {results.map((user) => (
                <li
                  className={styles.searchResultsRow}
                  key={`user-${user._id}`}
                >
                  <Link to={`/user/${user._id}`}>
                    <img src="" alt="imh" />
                    <span>{user.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className={styles.rightNav}>
        {auth.user && (
          <div className={styles.user}>
            <Link to="/settings">
              <img
                src="https://image.flaticon.com/icons/svg/2154/2154651.svg"
                alt="dasdasd"
                className={styles.userDp}
              />
            </Link>
            <span>{auth.user.name}</span>
          </div>
        )}

        <div className={styles.navLinks}>
          <ul>
            {auth.user ? (
              <>
                <li onClick={auth.logout}>Log out</li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Log in</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
