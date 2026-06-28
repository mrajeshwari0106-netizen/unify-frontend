import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const INITIAL_FORM = {
  name: '', age: '', income: '', occupation: '', education: '',
  category: '', state: '', gender: '', disability: false,
  widow: false, firstGraduate: false, hasHouse: true,
};

export default function Profile() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('citizenProfile');
    if (saved) setForm(JSON.parse(saved));
  }, []);

  const handle = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const submit = async () => {
    if (!form.name || !form.age || !form.income) {
      setMessage('error:Name, age, and income are required.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const payload = {
        ...form,
        age: parseInt(form.age),
        income: parseFloat(form.income),
      };
      localStorage.setItem('citizenProfile', JSON.stringify(payload));
      const res = await axios.post('/schemes/recommend', payload);
      localStorage.setItem('recommendations', JSON.stringify(res.data));
      setMessage('success:Profile saved! Finding your eligible schemes...');
      setTimeout(() => navigate('/schemes'), 1200);
    } catch (err) {
      setMessage('error:Failed to get recommendations. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const isSuccess = message.startsWith('success:');
  const msgText = message.replace(/^(error|success):/, '');

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Citizen Profile</h2>
        <p style={styles.subtitle}>Fill your details once. We find every scheme you qualify for.</p>
      </div>

      <div style={styles.card}>
        <div style={styles.sectionLabel}>Personal Information</div>
        <div style={styles.grid}>
          <Field label="Full Name *" name="name" value={form.name} onChange={handle} placeholder="e.g. Rajesh Kumar" />
          <Field label="Age *" name="age" value={form.age} onChange={handle} placeholder="e.g. 24" type="number" />
          <Field label="Annual Income (₹) *" name="income" value={form.income} onChange={handle} placeholder="e.g. 150000" type="number" />
          <Field label="State Code" name="state" value={form.state} onChange={handle} placeholder="e.g. tn, ka, mh" />
          <SelectField label="Gender" name="gender" value={form.gender} onChange={handle}
            options={[
              { value: '', label: 'Select gender' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
            ]} />
          <SelectField label="Occupation" name="occupation" value={form.occupation} onChange={handle}
            options={[
              { value: '', label: 'Select occupation' },
              { value: 'student', label: 'Student' },
              { value: 'farmer', label: 'Farmer' },
              { value: 'unemployed', label: 'Unemployed' },
              { value: 'self-employed', label: 'Self Employed' },
              { value: 'employed', label: 'Employed' },
              { value: 'homemaker', label: 'Homemaker' },
            ]} />
          <SelectField label="Education" name="education" value={form.education} onChange={handle}
            options={[
              { value: '', label: 'Select education' },
              { value: 'school', label: 'School (up to 10th)' },
              { value: '12th', label: '12th Standard' },
              { value: 'diploma', label: 'Diploma' },
              { value: 'ug', label: 'Undergraduate' },
              { value: 'pg', label: 'Postgraduate' },
            ]} />
          <SelectField label="Category" name="category" value={form.category} onChange={handle}
            options={[
              { value: '', label: 'Select category' },
              { value: 'general', label: 'General' },
              { value: 'obc', label: 'OBC' },
              { value: 'sc', label: 'SC' },
              { value: 'st', label: 'ST' },
            ]} />
        </div>

        <div style={styles.sectionLabel} >Additional Details</div>
        <div style={styles.checkboxRow}>
          <CheckBox label="Person with Disability" name="disability" checked={form.disability} onChange={handle} />
          <CheckBox label="Widow" name="widow" checked={form.widow} onChange={handle} />
          <CheckBox label="First Graduate in Family" name="firstGraduate" checked={form.firstGraduate} onChange={handle} />
          <CheckBox label="Owns a House" name="hasHouse" checked={form.hasHouse} onChange={handle} />
        </div>

        {message && (
          <div style={{
            padding: '10px 14px',
            borderRadius: 8,
            marginBottom: 16,
            fontSize: 14,
            fontWeight: 500,
            background: isSuccess ? '#E8F8EF' : '#FFF5F5',
            color: isSuccess ? '#0D3B2E' : '#C53030',
            border: `1px solid ${isSuccess ? '#C8EDD8' : '#FED7D7'}`,
          }}>
            {isSuccess ? '✅ ' : '❌ '}{msgText}
          </div>
        )}

        <button style={styles.button} onClick={submit} disabled={loading}>
          {loading ? '🔍 Finding your schemes...' : '🔍 Find My Eligible Schemes'}
        </button>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, type = 'text' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0D3B2E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <input
        style={{ padding: '11px 12px', borderRadius: 8, border: '1px solid #C8EDD8', fontSize: 14, outline: 'none', background: '#FAFFFE', color: '#0D3B2E' }}
        name={name} value={value} onChange={onChange} placeholder={placeholder} type={type}
      />
    </div>
  );
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#0D3B2E', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{label}</label>
      <select
        style={{ padding: '11px 12px', borderRadius: 8, border: '1px solid #C8EDD8', fontSize: 14, outline: 'none', background: '#FAFFFE', color: '#0D3B2E' }}
        name={name} value={value} onChange={onChange}
      >
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function CheckBox({ label, name, checked, onChange }) {
  return (
    <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#0D3B2E', cursor: 'pointer', padding: '8px 12px', background: checked ? '#E8F8EF' : '#fff', borderRadius: 8, border: `1px solid ${checked ? '#00C853' : '#C8EDD8'}` }}>
      <input type="checkbox" name={name} checked={checked} onChange={onChange} style={{ width: 16, height: 16, accentColor: '#00C853' }} />
      {label}
    </label>
  );
}

const styles = {
  page: { maxWidth: 820, margin: '0 auto' },
  header: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: 700, color: '#0D3B2E', marginBottom: 6 },
  subtitle: { color: '#6FCFA0', fontSize: 15 },
  card: { background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 4px 20px rgba(13,59,46,0.08)', border: '1px solid #C8EDD8' },
  sectionLabel: { fontSize: 11, fontWeight: 700, color: '#00C853', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16, paddingBottom: 8, borderBottom: '1px solid #E8F8EF' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 },
  checkboxRow: { display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  button: { width: '100%', padding: '14px 0', background: '#00C853', color: '#0D3B2E', border: 'none', borderRadius: 8, fontSize: 16, fontWeight: 700 },
};