import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Header.module.css';

const navItems = [
  { to: '/schedule', label: 'Location and Schedule' },
  { to: '/reservation', label: 'Reservation' },
  { to: '/community', label: 'Community' },
];

export function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/');
    window.location.reload();
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <NavLink to="/" className={styles.logo} onClick={closeMenu}>
        <span className={styles.logoTextBus}>BUSK</span>
        <span className={styles.logoTextPort}>PORT</span>
      </NavLink>
      <button 
        className={`${styles.menuToggle} ${menuOpen ? styles.active : ''}`}
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      <nav className={`${styles.nav} ${menuOpen ? styles.open : ''}`}>
        {navItems.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => (isActive ? styles.navItemActive : styles.navItem)}
            onClick={closeMenu}
          >
            {label}
          </NavLink>
        ))}
        {isLoggedIn ? (
          <button onClick={() => { handleLogout(); closeMenu(); }} className={styles.loginBtn}>Logout</button>
        ) : (
          <NavLink 
            to="/login" 
            className={({ isActive }) => (isActive ? styles.navItemActive : styles.navItem)}
            onClick={closeMenu}
          >
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}
