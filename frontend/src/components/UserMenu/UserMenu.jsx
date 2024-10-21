import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import * as sessionActions from '../../store/session';
import './UserMenu.css';

function UserMenu({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    setShowMenu(false);
    navigate('/');
  };

  return (
    <div className="user-menu-container" ref={menuRef}>
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
          <button onClick={logout} className="logout-button">
            Log Out
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;