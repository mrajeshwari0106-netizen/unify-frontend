import React, { useState } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ username: '', password: '', role: 'CITIZEN' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    setError('');
    setLoading(true);
    try {
      if (mode === 'register') {
        await axios.post('/auth/register', form);
        setMode('login');
        setError('Registered successfully. Please login.');
      } else {
        const res = await axios.post('/auth/login', {
          username: form.username,
          password: form.password,
        });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify({ username: form.username }));
        navigate('/profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter') submit();
  };

  return (
    <div style={styles.page}>
      <div style={styles.left}>
        <div style={styles.leftContent}>
          <div style={styles.brandRow}>
            <div style={styles.logoBox}>🏛️</div>
            <span style={styles.brandName}>Unify</span>
          </div>
          <h1 style={styles.tagline}>One profile.<br />Every scheme<br />you deserve.</h1>
          <p style={styles.leftSub}>AI-powered welfare discovery for every Indian citizen. Find, apply, and track government schemes in minutes.</p>
          <div style={styles.pills}>
            <span style={styles.pill}>⚡ Gemini AI</span>
            <span style={styles.pill}>🌐 Tamil & English</span>
            <span style={styles.pill}>🏛️ 20+ Schemes</span>
          </div>
        </div>
      </div>

      <div style={styles.right}>
        <div style={styles.card}>
          <div style={styles.cardTop}>
            <div style={styles.cardLogo}>🏛️</div>
            <h2 style={styles.cardTitle}>Unify</h2>
            <p style={styles.cardSub}>Government Welfare Platform</p>
          </div>

          <div style={styles.toggleRow}>
            <button
              style={mode === 'login' ? styles.toggleActive : styles.toggleInactive}
              onClick={() => { setMode('login'); setError(''); }}
            >Login</button>
            <button
              style={mode === 'register' ? styles.toggleActive : styles.toggleInactive}
              onClick={() => { setMode('register'); setError(''); }}
            >Register</button>
          </div>

          <input
            style={styles.input}
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handle}
            onKeyDown={handleKey}
          />
          <div style={{ position: 'relative', marginBottom: 12 }}>
  <input
    style={{ ...styles.input, marginBottom: 0 }}
    name="password"
    type={showPassword ? 'text' : 'password'}
    placeholder="Password"
    value={form.password}
    onChange={handle}
    onKeyDown={handleKey}
  />
  <button
    type="button"
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: 'absolute',
      right: 12,
      top: '50%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      fontSize: 16,
      color: '#6FCFA0',
      padding: 0,
    }}
  >
    {showPassword ? '🙈' : '👁️'}
  </button>
</div>

          {mode === 'register' && (
            <select style={styles.input} name="role" value={form.role} onChange={handle}>
              <option value="CITIZEN">Citizen</option>
              <option value="OFFICER">Government Officer</option>
            </select>
          )}

          {error && (
            <p style={{
              color: error.includes('success') ? '#00C853' : '#E53E3E',
              fontSize: 13,
              marginBottom: 12,
              padding: '8px 12px',
              background: error.includes('success') ? '#E8F8EF' : '#FFF5F5',
              borderRadius: 7,
            }}>
              {error}
            </p>
          )}

          <button style={styles.button} onClick={submit} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Login to Unify' : 'Create Account'}
          </button>

          <div style={styles.aiBadge}>
            <span>⚡</span>
            <span>Powered by Gemini AI</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    background: '#F4FBF7',
  },
  left: {
    flex: 1,
    background: '#0D3B2E',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 40px',
  },
  leftContent: {
    maxWidth: 400,
  },
  brandRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 40,
  },
  logoBox: {
    width: 40,
    height: 40,
    background: '#00C853',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 20,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 600,
    color: '#fff',
  },
  tagline: {
    fontSize: 40,
    fontWeight: 700,
    color: '#fff',
    lineHeight: 1.2,
    marginBottom: 20,
  },
  leftSub: {
    fontSize: 15,
    color: '#6FCFA0',
    lineHeight: 1.7,
    marginBottom: 32,
  },
  pills: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  pill: {
    padding: '6px 14px',
    background: 'rgba(0,200,83,0.15)',
    border: '1px solid rgba(0,200,83,0.3)',
    borderRadius: 20,
    fontSize: 13,
    color: '#00C853',
  },
  right: {
    width: 480,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  card: {
    background: '#fff',
    borderRadius: 16,
    padding: '36px 32px',
    width: '100%',
    border: '1px solid #C8EDD8',
    boxShadow: '0 4px 24px rgba(13,59,46,0.08)',
  },
  cardTop: {
    textAlign: 'center',
    marginBottom: 24,
  },
  cardLogo: {
    fontSize: 36,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: '#0D3B2E',
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: '#6FCFA0',
  },
  toggleRow: {
    display: 'flex',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    border: '1px solid #C8EDD8',
  },
  toggleActive: {
    flex: 1,
    padding: '10px 0',
    background: '#0D3B2E',
    color: '#fff',
    border: 'none',
    fontWeight: 600,
    fontSize: 14,
  },
  toggleInactive: {
    flex: 1,
    padding: '10px 0',
    background: '#fff',
    color: '#6FCFA0',
    border: 'none',
    fontWeight: 500,
    fontSize: 14,
  },
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: 12,
    borderRadius: 8,
    border: '1px solid #C8EDD8',
    fontSize: 14,
    outline: 'none',
    background: '#FAFFFE',
    color: '#0D3B2E',
  },
  button: {
    width: '100%',
    padding: '13px 0',
    background: '#00C853',
    color: '#0D3B2E',
    border: 'none',
    borderRadius: 8,
    fontSize: 15,
    fontWeight: 700,
    marginBottom: 16,
  },
  aiBadge: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    fontSize: 12,
    color: '#6FCFA0',
    background: '#E8F8EF',
    border: '1px solid #C8EDD8',
    borderRadius: 20,
    padding: '6px 14px',
  },
};