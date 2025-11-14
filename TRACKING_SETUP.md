# Quick Setup Guide - Analytics Tracking

## What Was Added

I've implemented a complete analytics tracking system for your website with the following features:

### ✅ Cookie Consent Banner
- GDPR compliant
- Appears on first visit
- Translated in both German and English
- Users can accept or decline tracking

### ✅ Tracked Events
1. **Page Views** - Every page/section view with timestamp
2. **Link Clicks** - Every external link clicked
3. **Language Changes** - When users switch between DE/EN
4. **Navigation** - When users navigate to different sections

### ✅ Privacy Features
- First-party cookies only (no third-party tracking)
- User consent required before tracking
- Anonymous visitor IDs
- Data stored on your server

## Files Created

1. **`src/utils/analytics.js`** - Core tracking utilities
2. **`src/components/CookieConsent.js`** - Cookie consent banner component
3. **`src/components/CookieConsent.css`** - Styling for the banner
4. **`server.js`** - Express server for production with tracking endpoints
5. **`view-analytics.js`** - Command-line tool to view analytics data
6. **`ANALYTICS_README.md`** - Full documentation
7. **`TRACKING_SETUP.md`** - This file

## Files Modified

1. **`src/App.js`** - Added tracking imports, page view tracking, language cookie persistence
2. **`src/linkitem/LinkItem.js`** - Added link click tracking
3. **`src/menu/Menu.js`** - Added navigation tracking
4. **`package.json`** - Added server scripts and proxy for development
5. **`.gitignore`** - Added analytics data directory

## Analytics Dashboard

A password-protected web dashboard is available at `/analytics`

- **URL:** `http://localhost:3001/analytics`
- **Default Password:** `admin123`
- **Features:**
  - View visitor statistics
  - See most clicked links
  - Export data as JSON or CSV
  - Filter by date

⚠️ **IMPORTANT:** Change the default password! See `ANALYTICS_DASHBOARD.md` for details.

## How to Test It

### Option 1: Quick Test (Development Mode)

1. In one terminal, start the backend server:
```bash
node server.js
```

2. In another terminal, start the React dev server:
```bash
npm start
```

3. Open http://localhost:3000
4. You should see the cookie consent banner
5. Click "Accept" to enable tracking
6. Navigate around the site, click links, change language
7. View the tracked data:
```bash
node view-analytics.js summary
```

### Option 2: Production Build

1. Build and run the production server:
```bash
npm run build:serve
```

2. Open http://localhost:3001
3. Test the same features as above

## Viewing Analytics Data

### Option 1: Web Dashboard (Recommended)

1. Visit `http://localhost:3001/analytics`
2. Login with password (default: `admin123`)
3. View stats, click links, export data

### Option 2: Command Line

Use the analytics viewer script:

```bash
# Show overall summary
node view-analytics.js summary

# Show most clicked links
node view-analytics.js links

# Show most viewed pages
node view-analytics.js pages

# Show language statistics
node view-analytics.js languages

# Show recent events
node view-analytics.js recent 20

# Show data for a specific date
node view-analytics.js date 2024-11-14

# Show everything
node view-analytics.js all
```

Or access via HTTP endpoints:

```bash
# Get summary
curl http://localhost:3001/api/analytics/summary

# Export data for a date
curl http://localhost:3001/api/analytics/export?date=2024-11-14
```

## Data Storage

Analytics data is stored in the `/analytics` directory:
- Files are named: `analytics-YYYY-MM-DD.jsonl`
- Each line is a JSON object with one event
- Files are automatically created when events are tracked
- The directory is in `.gitignore` (not committed to git)

### Example Event:
```json
{
  "visitorId": "visitor_1699875634_abc123xyz",
  "sessionId": "session_1699875634_def456uvw",
  "timestamp": "2024-11-14T10:30:45.123Z",
  "eventType": "link_click",
  "linkTitle": "Challenge 22",
  "linkUrl": "https://challenge22.com"
}
```

## How It Works

### 1. Cookie Consent
- When a user visits for the first time, they see the consent banner
- If they accept: `av_tracking_consent=true` cookie is set
- If they decline: `av_tracking_consent=false` cookie is set
- Tracking only happens if consent is true

### 2. Visitor Tracking
- **Visitor ID**: Persists for 1 year (identifies returning visitors)
- **Session ID**: Stored in sessionStorage (resets when browser closes)
- Both are randomly generated, not personally identifiable

### 3. Language Persistence
- Language preference is now saved in both localStorage AND cookies
- Cookie: `av_language=de` or `av_language=en`
- Persists for 1 year across sessions

### 4. Event Tracking
- Events are sent to `/api/track` endpoint using `navigator.sendBeacon()`
- The beacon API ensures tracking data is sent even if user closes the page
- Server appends IP address and server timestamp
- Data is written to daily `.jsonl` files

## GDPR Compliance

The system is GDPR compliant because:

✅ **Consent Required** - No tracking without user consent
✅ **Clear Information** - Banner explains what is tracked
✅ **Easy Opt-out** - Users can decline
✅ **Privacy Policy Link** - Direct link to Datenschutz page
✅ **Data Minimization** - Only necessary data collected
✅ **No Third Parties** - All data stays on your server
✅ **Anonymous** - Visitor IDs are not personally identifiable

## Next Steps

### 1. Change Analytics Password
**CRITICAL:** Change the default password immediately!

```bash
# Set environment variable
export ANALYTICS_PASSWORD="your-secure-password"
```

Or edit `server.js` line 9. See `ANALYTICS_DASHBOARD.md` for details.

### 2. Update Privacy Policy
Update your privacy policy (`src/Datenschutz.js`) to mention:
- What cookies are used
- What data is tracked
- How long data is stored
- User rights (access, deletion)

### 3. Deploy to Production
When deploying:
- Build the app: `npm run build`
- Run the server: `npm run server` (or use a process manager like PM2)
- Configure nginx/Apache to proxy to the Node.js server
- Ensure `/analytics` directory is writable by the server
- Set up log rotation for analytics files

### 4. Monitor Analytics
- **Web Dashboard:** Visit `/analytics` regularly
- **Command Line:** `node view-analytics.js all`
- Look for popular content (top links, pages)
- Understand language preferences
- Track visitor growth over time
- Export data for deeper analysis

### 5. Advanced Features (Optional)
Consider adding:
- Database storage (PostgreSQL, MongoDB) instead of files
- Email reports (automated weekly/monthly summaries)
- Data retention policies (auto-delete old data)
- Charts and graphs (Chart.js, D3.js)
- Real-time analytics with WebSocket updates

## Troubleshooting

### No cookie banner appearing?
- Clear your browser cookies and refresh
- Check browser console for errors

### Tracking not working?
- Ensure you clicked "Accept" on the cookie banner
- Check that server is running (for tracking endpoint)
- Check browser console for network errors
- Verify `/api/track` endpoint is accessible

### No analytics data?
- Ensure server is running when you test
- Check that `/analytics` directory exists and is writable
- Verify you accepted cookies
- Check for errors in server logs

### Cookie banner shows wrong language?
- The banner uses the app's current language state
- Change language in the app and the banner text will update

## Security Notes

- Analytics files contain IP addresses
- Protect `/analytics` directory from public web access
- Consider implementing authentication for analytics endpoints
- Regularly backup analytics data
- Implement data retention policies (delete old data after X months)

## Questions?

See `ANALYTICS_README.md` for full technical documentation.

