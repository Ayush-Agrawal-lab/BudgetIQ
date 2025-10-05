#!/bin/bash

# Start backend server
cd backend
uvicorn app:app --host 0.0.0.0 --port 8000 &

# Wait for backend to start
sleep 5

# Start frontend server
cd ../frontend
npm start