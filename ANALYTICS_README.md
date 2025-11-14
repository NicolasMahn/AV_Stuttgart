# Analytics Tracking System

This project includes a privacy-friendly, GDPR-compliant analytics tracking system.

## Features

### Tracked Events
- **Page Views**: Track when users visit pages with timestamps and referrer information
- **Link Clicks**: Track which external links users click on
- **Language Changes**: Track when users switch between German and English
- **Navigation**: Track which sections users navigate to within the single-page application

### Privacy Features
- **Cookie Consent Banner**: Users must accept cookies before any tracking begins
- **First-party Cookies Only**: No third-party tracking services
- **Anonymous Tracking**: Visitor IDs are randomly generated, not personally identifiable
- **Data Storage**: All data stored on your own server (not shared with third parties)

## Cookie Information

The system uses the following cookies:

1. **`av_visitor_id`** (365 days)
   - Unique identifier for returning visitors
   - Format: `visitor_[timestamp]_[random]`
   
2. **`av_tracking_consent`** (365 days)
   - Stores user's consent choice (true/false)
   
3. **`av_language`** (365 days)
   - Stores user's language preference (de/en)

## Data Storage

Analytics data is stored in JSON Lines format (`.jsonl` files) in the `/analytics` directory:
- One file per day: `analytics-YYYY-MM-DD.jsonl`
- Each line is a complete JSON object representing one event
- Easy to parse and analyze with scripts or import into analytics tools

### Example Event Data

```json
{
  "visitorId": "visitor_1699875634_abc123xyz",
  "sessionId": "session_1699875634_def456uvw",
  "timestamp": "2024-11-14T10:30:45.123Z",
  "serverTimestamp": "2024-11-14T10:30:45.127Z",
  "eventType": "link_click",
  "url": "https://av-stuttgart.de/#Resources",
  "referrer": "https://google.com",
  "userAgent": "Mozilla/5.0...",
  "screenResolution": "1920x1080",
  "language": "de-DE",
  "ip": "192.168.1.1",
  "linkTitle": "Challenge 22",
  "linkUrl": "https://challenge22.com",
  "linkType": "external_link"
}
```

## Running the Analytics Server

### Development
During development, run the React dev server normally:
```bash
npm start
```
Note: Tracking API calls will fail in development since there's no backend server running.

### Production
1. Build the React app:
```bash
npm run build
```

2. Run the production server:
```bash
npm run server
```

Or combine both steps:
```bash
npm run build:serve
```

The server will:
- Serve the built React app
- Handle tracking API calls at `/api/track`
- Provide analytics endpoints

## Analytics Endpoints

### POST `/api/track`
Receives and stores tracking events. Called automatically by the frontend.

### GET `/api/analytics/summary`
Returns a summary of all tracked data:
```json
{
  "totalVisitors": 150,
  "totalSessions": 200,
  "totalEvents": 1500,
  "eventTypes": {
    "page_view": 600,
    "link_click": 450,
    "navigation": 400,
    "language_change": 50
  },
  "topLinks": [
    {
      "title": "Challenge 22",
      "url": "https://challenge22.com",
      "clicks": 45
    }
  ],
  "languageChanges": 50,
  "pageViews": 600,
  "dateRange": {
    "start": "2024-11-01",
    "end": "2024-11-14"
  }
}
```

### GET `/api/analytics/export?date=YYYY-MM-DD`
Export raw data for a specific date:
```bash
curl http://localhost:3001/api/analytics/export?date=2024-11-14
```

## Analyzing Data

### Using Command Line Tools

Count total events:
```bash
wc -l analytics/analytics-2024-11-14.jsonl
```

View all link clicks:
```bash
cat analytics/analytics-2024-11-14.jsonl | grep '"eventType":"link_click"' | jq .
```

Count unique visitors:
```bash
cat analytics/*.jsonl | jq -r .visitorId | sort | uniq | wc -l
```

Most clicked links:
```bash
cat analytics/*.jsonl | grep '"eventType":"link_click"' | jq -r '.linkTitle' | sort | uniq -c | sort -rn
```

### Using JavaScript/Node.js

```javascript
const fs = require('fs');

// Read and parse analytics data
const data = fs.readFileSync('analytics/analytics-2024-11-14.jsonl', 'utf-8');
const events = data.split('\n').filter(l => l.trim()).map(l => JSON.parse(l));

// Analyze
const linkClicks = events.filter(e => e.eventType === 'link_click');
console.log(`Total link clicks: ${linkClicks.length}`);

const clickCounts = {};
linkClicks.forEach(click => {
  clickCounts[click.linkTitle] = (clickCounts[click.linkTitle] || 0) + 1;
});
console.log('Top links:', clickCounts);
```

## GDPR Compliance

This tracking system is designed to be GDPR compliant:

1. ✅ **Consent Required**: Users must explicitly consent before tracking
2. ✅ **Clear Information**: Banner explains what data is collected
3. ✅ **Easy to Decline**: Users can decline tracking
4. ✅ **Privacy Policy Link**: Link to privacy policy in consent banner
5. ✅ **Data Minimization**: Only necessary data is collected
6. ✅ **No Third Parties**: All data stays on your server
7. ✅ **Anonymous IDs**: Visitor IDs are not personally identifiable

### Updating Privacy Policy

Make sure to update your privacy policy (`src/Datenschutz.js`) to include:
- What cookies are used and why
- What data is collected
- How long data is stored
- Users' rights (access, deletion, etc.)

## Disabling Tracking

To temporarily disable tracking:

1. **In code**: Comment out the tracking calls
2. **Server**: Stop running the server (tracking will fail silently)
3. **User**: Users can decline cookies or clear their browser data

## Security Considerations

- Analytics files contain IP addresses (for spam detection)
- Protect the `/analytics` directory from public access
- Consider implementing authentication for analytics endpoints
- Regularly rotate/archive old analytics files
- Implement data retention policies (e.g., delete data older than 1 year)

## Future Enhancements

Potential improvements:
- Dashboard UI for viewing analytics
- Database storage instead of flat files
- Bot detection and filtering
- Heatmap tracking
- Real-time analytics
- Export to CSV/Excel
- Email reports

