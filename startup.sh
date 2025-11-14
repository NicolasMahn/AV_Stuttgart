#!/bin/sh

echo "Starting AV Stuttgart services..."

# Start React production server in background
echo "Starting React server on port 3000..."
serve -s build -l 3000 &

# Wait a moment for React server to start
sleep 2

# Start Express API server
echo "Starting Express API server on port 3001..."
node server.js

# Keep container running
wait