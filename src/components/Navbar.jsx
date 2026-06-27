import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { path: '/profile', label: '👤 Profile' },
    { path: '/schemes', label: '🏛️ Schemes' },
    { path: '/chat', label: '💬 Chat' },
  ];

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('citizenProfile');
    localStorage.removeItem('recommendations');
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <div style={styles.logoBox}>U</div>
          <span style={styles.brandName}>Unify</span>
          <span style={styles.brandTag}>Welfare Platform</span>
        </div>

        <div style={styles.tabs}>
          {tabs.map((tab) => (
            <button
              key={tab.path}
              style={location.pathname === tab.path ? styles.tabActive : styles.tab}
              onClick={() => navigate(tab.path)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button style={styles.logout} onClick={logout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#0D3B2E',
    boxShadow: '0 2px 12px rgba(13,59,46,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 16px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  logoBox: {
    width: 32,
    height: 32,
    background: '#00C853',
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    color: '#0D3B2E',
  },
  brandName: {
    color: '#fff',
    fontWeight: 700,
    fontSize: 20,
  },
  brandTag: {
    color: '#6FCFA0',
    fontSize: 12,
    marginLeft: 2,
  },
  tabs: {
    display: 'flex',
    gap: 4,
  },
  tab: {
    padding: '8px 18px',
    background: 'transparent',
    color: '#6FCFA0',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 500,
  },
  tabActive: {
    padding: '8px 18px',
    background: '#00C853',
    color: '#0D3B2E',
    border: 'none',
    borderRadius: 6,
    fontSize: 14,
    fontWeight: 700,
  },
  logout: {
    padding: '7px 16px',
    background: 'transparent',
    color: '#fc8181',
    border: '1px solid #fc8181',
    borderRadius: 6,
    fontSize: 13,
    fontWeight: 500,
  },
};