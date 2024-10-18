import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <Link to="/" className="logo-link">
        <img src="frontend/public/airbnb-logo.png" alt="App Logo" className="logo" />
      </Link>
      <nav className="auth-buttons">
        
      </nav>
    </header>
  )
}

export default Header;