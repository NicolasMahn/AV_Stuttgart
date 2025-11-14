# Analytics Dashboard

The analytics dashboard provides a web-based interface to view and export tracking data.

## Access

Visit: **`https://your-domain.com/analytics`** or **`http://localhost:3001/analytics`** (in development)

## Default Password

**Default password:** `admin123`

⚠️ **IMPORTANT:** Change this password immediately!

## Changing the Password

### Method 1: Environment Variable (Recommended)

Set the `ANALYTICS_PASSWORD` environment variable:

```bash
# Linux/Mac
export ANALYTICS_PASSWORD="your-secure-password"
node server.js

# Windows (Command Prompt)
set ANALYTICS_PASSWORD=your-secure-password
node server.js

# Windows (PowerShell)
$env:ANALYTICS_PASSWORD="your-secure-password"
node server.js
```

### Method 2: Edit server.js

Open `server.js` and change line 9:

```javascript
const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD || 'your-secure-password';
```

### For Production Deployment

Add to your `.env` file or hosting platform environment variables:

```
ANALYTICS_PASSWORD=your-secure-password-here
```

## Features

### 📊 Summary Tab
- **Visitors**: Total unique visitors
- **Sessions**: Total unique sessions
- **Events**: Total tracked events
- **Language Changes**: How many times users changed language
- **Event Types Breakdown**: Table showing counts for each event type

### 🔗 Links Tab
- View most clicked links with click counts
- See full URLs
- Export as CSV for spreadsheet analysis

### 📥 Export Tab
Three export options:

1. **All Data** - Download all analytics data as JSON
2. **By Date** - Download data for a specific date
3. **CSV Export** - Download top links as CSV spreadsheet

## Using the Dashboard

### 1. Login
1. Navigate to `/analytics`
2. Enter password
3. Click "Anmelden / Login"

### 2. View Statistics
- Click on tabs to switch between views
- Summary tab shows overall statistics
- Links tab shows click-through data
- Export tab provides download options

### 3. Export Data

**All Data (JSON):**
- Click "Alle Daten herunterladen / Download All Data"
- Downloads: `analytics-all-YYYY-MM-DD.json`
- Contains every event with full details

**By Date (JSON):**
- Select a date from the date picker
- Click "Datum herunterladen / Download Date"
- Downloads: `analytics-YYYY-MM-DD.json`
- Contains events for that specific date

**CSV Export:**
- Click "CSV herunterladen / Download CSV"
- Downloads: `top-links-YYYY-MM-DD.csv`
- Can be opened in Excel, Google Sheets, etc.

### 4. Logout
- Click "Abmelden / Logout" in the top right
- This clears the session authentication
- You'll need to log in again to access the dashboard

## Security

### Session-Based Authentication
- Authentication is stored in `sessionStorage`
- Expires when browser tab is closed
- No authentication cookies stored

### Password Protection
- Simple password check (single password for all users)
- Password sent via HTTPS in production
- For better security, consider implementing:
  - Multiple user accounts
  - Hashed passwords
  - JWT tokens
  - Rate limiting

### Best Practices
1. **Change the default password immediately**
2. **Use a strong password** (12+ characters, mix of letters, numbers, symbols)
3. **Don't share the password** in public repositories
4. **Use environment variables** instead of hardcoding
5. **Enable HTTPS** in production
6. **Consider IP whitelisting** for extra security

## Data Privacy

The dashboard shows:
- Visitor IDs (anonymous random strings)
- Session IDs (anonymous random strings)
- IP addresses (for spam detection)
- User agents
- Timestamps
- URLs visited
- Links clicked

⚠️ **GDPR Compliance:** Ensure you comply with GDPR and other privacy regulations:
- Implement data retention policies
- Provide ability to delete specific user data
- Update privacy policy to mention admin access to data

## Troubleshooting

### Can't Access Dashboard
**Problem:** 404 Not Found
- **Solution:** Make sure you built the React app: `npm run build`
- **Solution:** Make sure server is running: `npm run server`

### Wrong Password Error
**Problem:** "Falsches Passwort / Wrong password"
- **Solution:** Double-check the password
- **Solution:** Check if environment variable is set correctly
- **Solution:** Restart the server after changing password

### No Data Showing
**Problem:** Dashboard shows 0 visitors, 0 events
- **Solution:** Users need to accept cookies first
- **Solution:** Make sure tracking is working (check `/analytics` directory exists)
- **Solution:** Navigate around the site to generate events

### Export Not Working
**Problem:** Export button doesn't download anything
- **Solution:** Check browser console for errors
- **Solution:** Ensure `/analytics` directory exists and has data
- **Solution:** Check if selected date has data

## Advanced: Adding IP Whitelisting

To restrict dashboard access to specific IP addresses, add this to `server.js`:

```javascript
// IP whitelist middleware
const analyticsIpWhitelist = ['127.0.0.1', '::1', 'YOUR_IP_HERE'];

app.use('/api/analytics', (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress;
  if (analyticsIpWhitelist.includes(clientIp)) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied' });
  }
});
```

## Advanced: Rate Limiting

To prevent brute-force password attempts, install and use express-rate-limit:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: 'Too many login attempts, please try again later'
});

app.post('/api/analytics/auth', authLimiter, async (req, res) => {
  // ... existing code
});
```

## Integration with External Tools

### Importing into Google Sheets
1. Export data as CSV
2. Open Google Sheets
3. File → Import → Upload
4. Select your CSV file

### Importing into Excel
1. Export data as CSV
2. Open Excel
3. Data → Get Data → From File → From Text/CSV
4. Select your CSV file

### Custom Analysis
Export as JSON and use your preferred tools:
- Python with pandas
- R for statistical analysis
- JavaScript/Node.js scripts
- Database import (MongoDB, PostgreSQL, etc.)

## Example JSON Structure

```json
{
  "events": [
    {
      "visitorId": "visitor_1699875634_abc123",
      "sessionId": "session_1699875634_def456",
      "timestamp": "2024-11-14T10:30:45.123Z",
      "eventType": "link_click",
      "linkTitle": "Challenge 22",
      "linkUrl": "https://challenge22.com",
      "url": "https://av-stuttgart.de/#Resources",
      "referrer": "https://google.com"
    }
  ],
  "count": 1500,
  "files": 14,
  "dateRange": {
    "start": "2024-11-01",
    "end": "2024-11-14"
  }
}
```

## Example CSV Structure

```csv
Title,URL,Clicks
"Challenge 22","https://challenge22.com",45
"Dominion Documentary","https://dominionmovement.com",38
"Happy Cow App","https://happycow.net",32
```

## Support

For issues or questions:
1. Check this documentation
2. Review `ANALYTICS_README.md` for technical details
3. Check browser console for errors
4. Verify server logs

## Future Enhancements

Consider adding:
- Multiple user accounts with roles
- Real-time analytics (WebSocket updates)
- Charts and graphs (Chart.js, D3.js)
- Date range filtering
- Search and filter functionality
- Automated email reports
- Database backend (PostgreSQL, MongoDB)
- API tokens for programmatic access

