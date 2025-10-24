#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

BASE_URL="http://localhost:3000"

echo -e "${BLUE}🧪 Testing Classes CRUD API${NC}\n"

# 1. GET all classes
echo -e "${BLUE}1️⃣  GET /classes - List all classes${NC}"
curl -s -X GET "$BASE_URL/classes" | jq '.' || echo "Error"
echo -e "\n"

# 2. GET specific class
echo -e "${BLUE}2️⃣  GET /classes/:id - Get specific class${NC}"
CLASS_ID="00000000-0000-0000-0000-000000000001"
curl -s -X GET "$BASE_URL/classes/$CLASS_ID" | jq '.' || echo "Error"
echo -e "\n"

# 3. GET class stats
echo -e "${BLUE}3️⃣  GET /classes/:id/stats - Get class statistics${NC}"
curl -s -X GET "$BASE_URL/classes/$CLASS_ID/stats" | jq '.' || echo "Error"
echo -e "\n"

# 4. CREATE a new class
echo -e "${BLUE}4️⃣  POST /classes - Create new class${NC}"
NEW_CLASS=$(curl -s -X POST "$BASE_URL/classes" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Grande Section",
    "capacite": 25,
    "trancheAge": "5-6 ans",
    "active": true
  }')
echo "$NEW_CLASS" | jq '.'
NEW_CLASS_ID=$(echo "$NEW_CLASS" | jq -r '.id')
echo -e "\n"

# 5. UPDATE the new class
echo -e "${BLUE}5️⃣  PATCH /classes/:id - Update class${NC}"
curl -s -X PATCH "$BASE_URL/classes/$NEW_CLASS_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "nom": "Grande Section (Updated)",
    "capacite": 28
  }' | jq '.'
echo -e "\n"

# 6. DELETE the new class
echo -e "${BLUE}6️⃣  DELETE /classes/:id - Delete class${NC}"
curl -s -X DELETE "$BASE_URL/classes/$NEW_CLASS_ID" | jq '.'
echo -e "\n"

# 7. Verify deletion
echo -e "${BLUE}7️⃣  Verify deletion - GET all classes${NC}"
curl -s -X GET "$BASE_URL/classes" | jq '.' || echo "Error"
echo -e "\n"

echo -e "${GREEN}✅ CRUD tests completed!${NC}"

