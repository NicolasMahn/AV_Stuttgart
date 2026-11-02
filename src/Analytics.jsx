import React, { useState, useEffect } from 'react';
import './Analytics.css';

const Analytics = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Analytics data
  const [summary, setSummary] = useState(null);
  const [selectedView, setSelectedView] = useState('summary');
  const [exportDate, setExportDate] = useState(new Date().toISOString().split('T')[0]);

  // Check if already authenticated
  useEffect(() => {
    const authToken = sessionStorage.getItem('analytics_auth');
    if (authToken === 'authenticated') {
      setIsAuthenticated(true);
      loadAnalytics();
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/analytics/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem('analytics_auth', 'authenticated');
        setIsAuthenticated(true);
        loadAnalytics();
      } else {
        setError('Falsches Passwort / Wrong password');
      }
    } catch (err) {
      setError('Verbindungsfehler / Connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('analytics_auth');
    setIsAuthenticated(false);
    setSummary(null);
    setPassword('');
  };

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/summary');
      const data = await response.json();
      setSummary(data);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    }
  };

  const downloadData = async (date) => {
    try {
      const response = await fetch(`/api/analytics/export?date=${date}`);
      const data = await response.json();
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-${date}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Fehler beim Exportieren / Export error');
    }
  };

  const downloadAllData = async () => {
    try {
      const response = await fetch('/api/analytics/export-all');
      const data = await response.json();
      
      // Create downloadable file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `analytics-all-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      alert('Fehler beim Exportieren / Export error');
    }
  };

  const downloadCSV = () => {
    if (!summary || !summary.topLinks) return;
    
    // Create CSV from top links
    const csvRows = [
      ['Title', 'URL', 'Clicks'],
      ...summary.topLinks.map(link => [
        `"${link.title}"`,
        `"${link.url}"`,
        link.clicks
      ])
    ];
    
    const csvContent = csvRows.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `top-links-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="analytics-container">
        <div className="analytics-login">
          <h1>📊 Analytics Dashboard</h1>
          <p>Passwort erforderlich / Password required</p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Passwort / Password"
              className="analytics-password-input"
              disabled={loading}
            />
            {error && <p className="analytics-error">{error}</p>}
            <button type="submit" className="analytics-login-btn" disabled={loading}>
              {loading ? 'Laden... / Loading...' : 'Anmelden / Login'}
            </button>
          </form>
          <a href="/" className="analytics-back-link">← Zurück zur Startseite / Back to home</a>
        </div>
      </div>
    );
  }

  // Main dashboard
  return (
    <div className="analytics-container">
      <div className="analytics-dashboard">
        <div className="analytics-header">
          <h1>📊 Analytics Dashboard</h1>
          <button onClick={handleLogout} className="analytics-logout-btn">
            Abmelden / Logout
          </button>
        </div>

        {!summary ? (
          <div className="analytics-loading">Laden... / Loading...</div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="analytics-tabs">
              <button 
                className={selectedView === 'summary' ? 'active' : ''}
                onClick={() => setSelectedView('summary')}
              >
                Übersicht / Summary
              </button>
              <button 
                className={selectedView === 'links' ? 'active' : ''}
                onClick={() => setSelectedView('links')}
              >
                Links
              </button>
              <button 
                className={selectedView === 'export' ? 'active' : ''}
                onClick={() => setSelectedView('export')}
              >
                Export
              </button>
            </div>

            {/* Summary View */}
            {selectedView === 'summary' && (
              <div className="analytics-content">
                <div className="analytics-cards">
                  <div className="analytics-card">
                    <div className="card-value">{summary.totalVisitors}</div>
                    <div className="card-label">Besucher / Visitors</div>
                  </div>
                  <div className="analytics-card">
                    <div className="card-value">{summary.totalSessions}</div>
                    <div className="card-label">Sitzungen / Sessions</div>
                  </div>
                  <div className="analytics-card">
                    <div className="card-value">{summary.totalEvents}</div>
                    <div className="card-label">Events</div>
                  </div>
                  <div className="analytics-card">
                    <div className="card-value">{summary.languageChanges || 0}</div>
                    <div className="card-label">Sprachwechsel / Language Changes</div>
                  </div>
                </div>

                <div className="analytics-section">
                  <h2>Event-Typen / Event Types</h2>
                  <div className="analytics-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Type</th>
                          <th>Anzahl / Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.eventTypes && Object.entries(summary.eventTypes).map(([type, count]) => (
                          <tr key={type}>
                            <td>{type}</td>
                            <td>{count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {summary.dateRange && (
                  <div className="analytics-info">
                    <p>
                      <strong>Zeitraum / Date Range:</strong> {summary.dateRange.start} bis/to {summary.dateRange.end}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Links View */}
            {selectedView === 'links' && (
              <div className="analytics-content">
                <div className="analytics-section">
                  <div className="section-header">
                    <h2>Top Geklickte Links / Top Clicked Links</h2>
                    <button onClick={downloadCSV} className="analytics-download-btn">
                      📥 CSV Download
                    </button>
                  </div>
                  <div className="analytics-table">
                    <table>
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Titel / Title</th>
                          <th>URL</th>
                          <th>Klicks / Clicks</th>
                        </tr>
                      </thead>
                      <tbody>
                        {summary.topLinks && summary.topLinks.map((link, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{link.title}</td>
                            <td className="link-url">
                              <a href={link.url} target="_blank" rel="noopener noreferrer">
                                {link.url}
                              </a>
                            </td>
                            <td><strong>{link.clicks}</strong></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Export View */}
            {selectedView === 'export' && (
              <div className="analytics-content">
                <div className="analytics-section">
                  <h2>Daten exportieren / Export Data</h2>
                  
                  <div className="export-option">
                    <h3>Alle Daten / All Data</h3>
                    <p>Exportiert alle verfügbaren Analytics-Daten als JSON / Export all available analytics data as JSON</p>
                    <button onClick={downloadAllData} className="analytics-download-btn">
                      📥 Alle Daten herunterladen / Download All Data
                    </button>
                  </div>

                  <div className="export-option">
                    <h3>Daten nach Datum / Data by Date</h3>
                    <p>Exportiert Daten für ein bestimmtes Datum / Export data for a specific date</p>
                    <div className="export-date-picker">
                      <input 
                        type="date" 
                        value={exportDate}
                        onChange={(e) => setExportDate(e.target.value)}
                        className="analytics-date-input"
                      />
                      <button 
                        onClick={() => downloadData(exportDate)} 
                        className="analytics-download-btn"
                      >
                        📥 Datum herunterladen / Download Date
                      </button>
                    </div>
                  </div>

                  <div className="export-option">
                    <h3>Top Links als CSV</h3>
                    <p>Exportiert die am häufigsten geklickten Links als CSV / Export most clicked links as CSV</p>
                    <button onClick={downloadCSV} className="analytics-download-btn">
                      📥 CSV herunterladen / Download CSV
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="analytics-footer">
          <a href="/" className="analytics-back-link">← Zurück zur Startseite / Back to home</a>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

