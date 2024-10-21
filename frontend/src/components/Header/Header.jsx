import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/session';
import './Header.css';

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();

  const openMenu = () => {
    if (!showMenu) setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const handleLogout = () => {
    dispatch(logout());
    setShowMenu(false);
  };

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src="/airbnb-logo.png" alt="App Logo" className="logo" />
      </Link>
      <nav className="auth-buttons">
        {user ? (
          <>
            <Link to="/spots/new" className="button create-spot">Create a New Spot</Link>
            <div className="user-menu" ref={menuRef}>
              <button onClick={openMenu} className="user-menu-button">
                {user.firstName}
              </button>
              {showMenu && (
                <div className="user-menu-dropdown">
                  <p className="user-greeting" onClick={(e) => e.stopPropagation()}>
                    Hello, {user.firstName}
                  </p>
                  <p className="user-email" onClick={(e) => e.stopPropagation()}>
                    {user.email}
                  </p>
                  <button onClick={handleLogout} className="logout-button">
                    Log Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="button">Log In</Link>
            <Link to="/signup" className="button">Sign Up</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;