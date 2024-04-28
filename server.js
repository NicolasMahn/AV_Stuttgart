const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 80; // Default to port 80 for production

// Redirect /karte to /#/ (hash routing handled by React)
app.get('/karte', (req, res) => {
  res.redirect('/');
});

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));

// Handles any other requests that don't match the ones above (default catch-all route)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
