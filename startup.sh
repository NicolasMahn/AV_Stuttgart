#!/bin/sh

echo "Starting AV Stuttgart services..."

# Start Express server (serves both React app and API)
echo "Starting Express server on port ${PORT:-3001}..."
node server.js

