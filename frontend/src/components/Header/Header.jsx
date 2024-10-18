import { Link } from 'react-router-dom';
import {useSelector } from 'react-redux';
import './Header.css';

const Header = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src="frontend/public/airbnb-logo.png" alt="App Logo" className="logo" />
      </Link>
      <nav className="auth-buttons">
        {user ? (
          <>
            <Link to="/profile" className="button">Profile</Link>
            <button className="button">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="button"></Link>
            <Link to="/signup" className="button">Signup</Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;