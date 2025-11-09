# LMS Server - Seed Users Guide

## Quick Start

### 1. Start Strapi Server
In one terminal:
```bash
cd lmsserver
npm run develop
```

Wait for the message: `Strapi started successfully`

### 2. Run Seed Script
In a **new terminal**:
```bash
cd lmsserver
npm run seed
```

## What Gets Created

The seed script creates 25 users across 5 roles:

- **2 Superadmins**: superadmin1, superadmin2
- **3 Admins**: admin1, admin2, admin3
- **5 Teachers**: teacher1 through teacher5
- **10 Students**: student1 through student10
- **5 Parents**: parent1 through parent5

All users have the password: `welcome123`

## Testing

Login with any user:
```bash
curl -X POST 'http://localhost:1337/api/auth/local' \
  -H 'Content-Type: application/json' \
  --data-raw '{
    "identifier": "student1",
    "password": "welcome123"
  }'
```

## Full User List

See README.md for complete list of all users with their full names.
