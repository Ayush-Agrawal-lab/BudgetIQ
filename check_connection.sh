#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo "🔍 Checking BudgetIQ Frontend-Backend Connection..."

# Check frontend environment variables
echo -n "Checking frontend environment variables... "
if [ -f "frontend/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Missing frontend/.env file"
    exit 1
fi

# Check backend environment variables
echo -n "Checking backend environment variables... "
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Missing backend/.env file"
    exit 1
fi

# Check backend health endpoint
echo -n "Checking backend health... "
BACKEND_URL=$(grep REACT_APP_BACKEND_URL frontend/.env | cut -d '=' -f2 | tr -d ' "')
HEALTH_CHECK=$(curl -s "${BACKEND_URL}/health")
if [[ $HEALTH_CHECK == *"healthy"* ]]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "Backend health check failed"
    exit 1
fi

# Check CORS configuration
echo -n "Checking CORS configuration... "
FRONTEND_URL=$(grep PUBLIC_URL frontend/.env | cut -d '=' -f2 | tr -d ' "')
CORS_CHECK=$(curl -s -I -H "Origin: ${FRONTEND_URL}" "${BACKEND_URL}/health" | grep -i "access-control-allow-origin")
if [[ ! -z "$CORS_CHECK" ]]; then
    echo -e "${GREEN}✓${NC}"
else
    echo -e "${RED}✗${NC}"
    echo "CORS configuration issue detected"
    exit 1
fi

# Verify API endpoints
echo "Testing API endpoints..."
ENDPOINTS=("/api/auth/signup" "/api/auth/login" "/api/transactions" "/api/accounts" "/api/goals")

for endpoint in "${ENDPOINTS[@]}"; do
    echo -n "Testing ${endpoint}... "
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}${endpoint}")
    if [[ $STATUS == "401" || $STATUS == "200" ]]; then
        echo -e "${GREEN}✓${NC}"
    else
        echo -e "${RED}✗${NC}"
        echo "Endpoint ${endpoint} returned unexpected status code: ${STATUS}"
    fi
done

echo -e "\n✅ Connection check completed!"