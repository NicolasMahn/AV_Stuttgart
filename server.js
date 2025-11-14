const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Analytics password - CHANGE THIS!
const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD;

// Middleware
app.use(express.json());

// Serve static React files from build directory
app.use(express.static(path.join(__dirname, 'build')));

// Enable CORS for external domains (optional, if needed)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && origin !== `http://localhost:${PORT}`) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  }
  next();
});

// Tracking endpoint
app.post('/api/track', async (req, res) => {
  try {
    const trackingData = req.body;
    
    // Add server timestamp and IP
    trackingData.serverTimestamp = new Date().toISOString();
    trackingData.ip = req.ip || req.connection.remoteAddress;
    
    // Create analytics directory if it doesn't exist
    const analyticsDir = path.join(__dirname, 'analytics');
    await fs.mkdir(analyticsDir, { recursive: true });
    
    // Log to file (JSON Lines format - one JSON object per line)
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(analyticsDir, `analytics-${today}.jsonl`);
    
    await fs.appendFile(logFile, JSON.stringify(trackingData) + '\n');
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Tracking failed' });
  }
});

// Analytics password authentication endpoint
app.post('/api/analytics/auth', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (password === ANALYTICS_PASSWORD) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Invalid password' });
    }
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
});

// Analytics summary endpoint (optional - for viewing stats)
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const analyticsDir = path.join(__dirname, 'analytics');
    
    // Check if directory exists
    try {
      await fs.access(analyticsDir);
    } catch {
      return res.json({ 
        totalVisitors: 0, 
        totalSessions: 0, 
        totalEvents: 0,
        message: 'No tracking data yet'
      });
    }
    
    // Read all analytics files
    const files = await fs.readdir(analyticsDir);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl'));
    
    let totalEvents = 0;
    const uniqueVisitors = new Set();
    const uniqueSessions = new Set();
    const eventTypes = {};
    const linkClicks = [];
    const pageViews = [];
    const languageChanges = [];
    
    // Process each file
    for (const file of jsonlFiles) {
      const filePath = path.join(analyticsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const event = JSON.parse(line);
          totalEvents++;
          
          if (event.visitorId) uniqueVisitors.add(event.visitorId);
          if (event.sessionId) uniqueSessions.add(event.sessionId);
          
          // Count event types
          eventTypes[event.eventType] = (eventTypes[event.eventType] || 0) + 1;
          
          // Collect specific event data
          if (event.eventType === 'link_click') {
            linkClicks.push({
              title: event.linkTitle,
              url: event.linkUrl,
              timestamp: event.timestamp
            });
          } else if (event.eventType === 'page_view') {
            pageViews.push({
              path: event.path,
              hash: event.hash,
              timestamp: event.timestamp
            });
          } else if (event.eventType === 'language_change') {
            languageChanges.push({
              from: event.fromLanguage,
              to: event.toLanguage,
              timestamp: event.timestamp
            });
          }
        } catch (e) {
          console.error('Error parsing line:', e);
        }
      }
    }
    
    // Calculate most clicked links
    const linkClickCounts = {};
    linkClicks.forEach(link => {
      const key = `${link.title}|${link.url}`;
      linkClickCounts[key] = (linkClickCounts[key] || 0) + 1;
    });
    
    const topLinks = Object.entries(linkClickCounts)
      .map(([key, count]) => {
        const [title, url] = key.split('|');
        return { title, url, clicks: count };
      })
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
    
    res.json({
      totalVisitors: uniqueVisitors.size,
      totalSessions: uniqueSessions.size,
      totalEvents,
      eventTypes,
      topLinks,
      languageChanges: languageChanges.length,
      pageViews: pageViews.length,
      dateRange: {
        start: jsonlFiles[0]?.replace('analytics-', '').replace('.jsonl', ''),
        end: jsonlFiles[jsonlFiles.length - 1]?.replace('analytics-', '').replace('.jsonl', '')
      }
    });
  } catch (error) {
    console.error('Analytics summary error:', error);
    res.status(500).json({ error: 'Failed to generate summary' });
  }
});

// Analytics raw data endpoint (optional - for exporting data)
app.get('/api/analytics/export', async (req, res) => {
  try {
    const { date } = req.query; // Format: YYYY-MM-DD
    
    if (!date) {
      return res.status(400).json({ error: 'Date parameter required (YYYY-MM-DD)' });
    }
    
    const analyticsDir = path.join(__dirname, 'analytics');
    const logFile = path.join(analyticsDir, `analytics-${date}.jsonl`);
    
    try {
      const content = await fs.readFile(logFile, 'utf-8');
      const events = content.split('\n')
        .filter(line => line.trim())
        .map(line => JSON.parse(line));
      
      res.json({ date, events, count: events.length });
    } catch (error) {
      res.status(404).json({ error: 'No data found for this date' });
    }
  } catch (error) {
    console.error('Analytics export error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Export all analytics data
app.get('/api/analytics/export-all', async (req, res) => {
  try {
    const analyticsDir = path.join(__dirname, 'analytics');
    
    // Check if directory exists
    try {
      await fs.access(analyticsDir);
    } catch {
      return res.json({ 
        events: [],
        count: 0,
        message: 'No tracking data yet'
      });
    }
    
    // Read all analytics files
    const files = await fs.readdir(analyticsDir);
    const jsonlFiles = files.filter(f => f.endsWith('.jsonl')).sort();
    
    const allEvents = [];
    
    for (const file of jsonlFiles) {
      const filePath = path.join(analyticsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          allEvents.push(JSON.parse(line));
        } catch (e) {
          console.error('Error parsing line:', e);
        }
      }
    }
    
    res.json({ 
      events: allEvents, 
      count: allEvents.length,
      files: jsonlFiles.length,
      dateRange: {
        start: jsonlFiles[0]?.replace('analytics-', '').replace('.jsonl', ''),
        end: jsonlFiles[jsonlFiles.length - 1]?.replace('analytics-', '').replace('.jsonl', '')
      }
    });
  } catch (error) {
    console.error('Export all error:', error);
    res.status(500).json({ error: 'Failed to export data' });
  }
});

// Catch-all route: serve React app for any non-API routes (for client-side routing)
app.get('*', (req, res) => {
  // Don't serve HTML for API routes - let them 404 properly
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Analytics tracking endpoint: http://localhost:${PORT}/api/track`);
  console.log(`Analytics summary: http://localhost:${PORT}/api/analytics/summary`);
});

module.exports = app;

