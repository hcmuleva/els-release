#!/bin/bash

# Simple script to run seed data generation
# Make sure Strapi is running before executing this

echo "🌱 LMS Server - Seed Data Generator"
echo "===================================="
echo ""
echo "⚠️  Make sure Strapi is running on http://localhost:1337"
echo ""
read -p "Press Enter to continue or Ctrl+C to cancel..."
echo ""

cd "$(dirname "$0")"
node scripts/seed-users.js

echo ""
echo "✅ Seed process completed!"
echo ""
echo "You can now login to your React app with any of these credentials:"
echo "  - student1 / welcome123"
echo "  - teacher1 / welcome123"  
echo "  - admin1 / welcome123"
echo "  - parent1 / welcome123"
echo "  - superadmin1 / welcome123"
echo ""
