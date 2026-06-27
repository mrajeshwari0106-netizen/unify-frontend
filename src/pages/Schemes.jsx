import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function Schemes() {
  const [data, setData] = useState(null);
  const [applying, setApplying] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('recommendations');
    if (saved) setData(JSON.parse(saved));
  }, []);

  const apply = async (scheme) => {
    setApplying(scheme.schemeId);
    setMessage('');
    try {
      const profile = JSON.parse(localStorage.getItem('citizenProfile'));
      await axios.post('/applications/submit', {
        citizenName: profile.name,
        schemeId: scheme.schemeId,
        schemeName: scheme.schemeName,
        district: profile.state || 'unknown',
        notes: `Applied via Unify. Match score: ${scheme.matchScore}`,
      });
      setMessage(`success:Applied for ${scheme.schemeName} successfully.`);
    } catch (err) {
      setMessage(`error:Failed to apply. ${err.response?.data?.message || 'Try again.'}`);
    } finally {
      setApplying(null);
    }
  };

  if (!data) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🏛️</div>
        <h3 style={styles.emptyTitle}>No recommendations yet</h3>
        <p style={styles.emptyText}>Complete your profile to discover eligible schemes.</p>
        <button style={styles.emptyBtn} onClick={() => navigate('/profile')}>
          Go to Profile →
        </button>
      </div>
    );
  }

  const isError = message.startsWith('error:');
  const msgText = message.replace(/^(error|success):/, '');

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Your Eligible Schemes</h2>
        <p style={styles.subtitle}>Results for <strong>{data.citizenName}</strong></p>
      </div>

      <div style={styles.statsRow}>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNum, color: '#00C853' }}>{data.totalEligible}</div>
          <div style={styles.statLabel}>Eligible schemes</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNum, color: '#F57F17' }}>{data.totalNearMiss}</div>
          <div style={styles.statLabel}>Near-miss</div>
        </div>
        <div style={styles.statCard}>
          <div style={{ ...styles.statNum, color: '#0D3B2E' }}>{data.readinessScore}</div>
          <div style={styles.statLabel}>Profile score / 100</div>
        </div>
        <div style={{ ...styles.statCard, flex: 2 }}>
          <div style={styles.statLabel} >Profile readiness</div>
          <div style={styles.scoreBarBg}>
            <div style={{ ...styles.scoreBarFill, width: `${data.readinessScore}%` }} />
          </div>
        </div>
      </div>

      {message && (
        <div style={{
          padding: '10px 16px', borderRadius: 8, marginBottom: 16, fontSize: 14, fontWeight: 500,
          background: isError ? '#FFF5F5' : '#E8F8EF',
          color: isError ? '#C53030' : '#0D3B2E',
          border: `1px solid ${isError ? '#FED7D7' : '#C8EDD8'}`,
        }}>
          {isError ? '❌ ' : '✅ '}{msgText}
        </div>
      )}

      {data.eligibleSchemes?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionDot} />
            <h3 style={styles.sectionTitle}>Eligible Schemes</h3>
          </div>
          {data.eligibleSchemes.map((s) => (
            <SchemeCard key={s.schemeId} scheme={s} onApply={apply} applying={applying} type="eligible" />
          ))}
        </div>
      )}

      {data.nearMissSchemes?.length > 0 && (
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={{ ...styles.sectionDot, background: '#F57F17' }} />
            <h3 style={{ ...styles.sectionTitle, color: '#7B3A00' }}>Near-Miss Schemes</h3>
            <span style={styles.nearMissNote}>One condition away</span>
          </div>
          {data.nearMissSchemes.map((s) => (
            <SchemeCard key={s.schemeId} scheme={s} onApply={apply} applying={applying} type="nearmiss" />
          ))}
        </div>
      )}
    </div>
  );
}

function SchemeCard({ scheme, onApply, applying, type }) {
  const [expanded, setExpanded] = useState(false);
  const isEligible = type === 'eligible';

  return (
    <div style={{
      background: '#fff',
      borderRadius: 12,
      padding: 20,
      marginBottom: 14,
      border: '1px solid #C8EDD8',
      borderLeft: `4px solid ${isEligible ? '#00C853' : '#F57F17'}`,
      boxShadow: '0 2px 8px rgba(13,59,46,0.05)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
        <div>
          <h4 style={{ fontSize: 16, fontWeight: 700, color: '#0D3B2E', marginBottom: 6 }}>{scheme.schemeName}</h4>
          <span style={{
            fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 600,
            background: isEligible ? '#E8F8EF' : '#FDE8C8',
            color: isEligible ? '#0D3B2E' : '#7B3A00',
          }}>{scheme.category}</span>
        </div>
        <div style={{
          background: '#0D3B2E', borderRadius: 10, padding: '8px 14px', textAlign: 'center', minWidth: 52,
        }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#00C853', lineHeight: 1 }}>{scheme.matchScore}</div>
          <div style={{ fontSize: 10, color: '#6FCFA0' }}>/ 100</div>
        </div>
      </div>

      <p style={{ color: '#4a7a5f', fontSize: 13, marginBottom: 10 }}>{scheme.benefits}</p>

      <div style={{ height: 5, background: '#E8F8EF', borderRadius: 3, overflow: 'hidden', marginBottom: 10 }}>
        <div style={{ height: '100%', borderRadius: 3, background: isEligible ? '#00C853' : '#F57F17', width: `${scheme.matchScore * 10}%` }} />
      </div>

      {scheme.matchedReasons?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 10 }}>
          {scheme.matchedReasons.map((r, i) => (
            <span key={i} style={{ background: '#E8F8EF', color: '#0D3B2E', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>✓ {r}</span>
          ))}
        </div>
      )}

      {scheme.failedConditions?.length > 0 && expanded && (
        <div style={{ marginBottom: 10 }}>
          <p style={{ fontSize: 12, color: '#6FCFA0', marginBottom: 6 }}>Conditions not met:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {scheme.failedConditions.map((f, i) => (
              <span key={i} style={{ background: '#FDE8C8', color: '#7B3A00', fontSize: 11, padding: '3px 10px', borderRadius: 20 }}>✗ {f}</span>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #E8F8EF' }}>
        <button
          style={{ padding: '7px 16px', background: '#fff', color: '#0D3B2E', border: '1px solid #C8EDD8', borderRadius: 6, fontSize: 12 }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide Details' : 'View Details'}
        </button>
        {isEligible && (
          <button
            style={{ padding: '7px 20px', background: '#00C853', color: '#0D3B2E', border: 'none', borderRadius: 6, fontSize: 13, fontWeight: 700 }}
            onClick={() => onApply(scheme)}
            disabled={applying === scheme.schemeId}
          >
            {applying === scheme.schemeId ? 'Applying...' : 'Apply Now'}
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 820, margin: '0 auto' },
  header: { marginBottom: 20 },
  title: { fontSize: 28, fontWeight: 700, color: '#0D3B2E', marginBottom: 6 },
  subtitle: { color: '#6FCFA0', fontSize: 15 },
  statsRow: { display: 'flex', gap: 12, marginBottom: 24 },
  statCard: { background: '#fff', borderRadius: 12, padding: '14px 20px', border: '1px solid #C8EDD8', flex: 1 },
  statNum: { fontSize: 26, fontWeight: 800, lineHeight: 1, marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#6FCFA0', fontWeight: 500 },
  scoreBarBg: { height: 8, background: '#E8F8EF', borderRadius: 4, overflow: 'hidden', marginTop: 8 },
  scoreBarFill: { height: '100%', background: '#00C853', borderRadius: 4, transition: 'width 0.6s' },
  section: { marginBottom: 28 },
  sectionHeader: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 },
  sectionDot: { width: 10, height: 10, background: '#00C853', borderRadius: '50%' },
  sectionTitle: { fontSize: 17, fontWeight: 700, color: '#0D3B2E' },
  nearMissNote: { fontSize: 12, color: '#F57F17', marginLeft: 4 },
  empty: { textAlign: 'center', padding: '80px 20px' },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 700, color: '#0D3B2E', marginBottom: 8 },
  emptyText: { color: '#6FCFA0', fontSize: 15, marginBottom: 24 },
  emptyBtn: { padding: '12px 28px', background: '#00C853', color: '#0D3B2E', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700 },
};