# CyberWave API Documentation

Base URL: `http://localhost:5000/api`

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "points": 0
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Login
```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "points": 150,
    "badges": ["learner", "proficient"],
    "completed_modules": ["email"]
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Refresh Token
```http
POST /api/auth/refresh
```

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Logout
```http
POST /api/auth/logout
```

**Response (200):**
```json
{
  "message": "Logout successful"
}
```

---

## User Endpoints

### Get User Profile
```http
GET /api/users/profile
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "user",
    "points": 150,
    "badges": ["learner"],
    "completed_modules": ["email"],
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-16T14:20:00.000Z"
  }
}
```

### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "newemail@example.com"
}
```

### Get Training Progress
```http
GET /api/users/progress
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "user": {
    "id": 1,
    "username": "johndoe",
    "points": 150,
    "badges": ["learner"],
    "completed_modules": ["email"]
  },
  "progress": {
    "email": {
      "completed": 2,
      "total": 3,
      "avgScore": "85.50"
    },
    "sms": {
      "completed": 0,
      "total": 0,
      "avgScore": 0
    },
    "qr": {
      "completed": 0,
      "total": 0,
      "avgScore": 0
    },
    "social": {
      "completed": 0,
      "total": 0,
      "avgScore": 0
    }
  },
  "recentResults": [...]
}
```

### Get Certificates
```http
GET /api/users/certificates
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "certificates": [
    {
      "id": 1,
      "user_id": 1,
      "module_type": "email",
      "certificate_id": "550e8400-e29b-41d4-a716-446655440000",
      "issued_at": "2024-01-16T15:30:00.000Z"
    }
  ]
}
```

---

## Campaign Endpoints

### Get All Campaigns
```http
GET /api/campaigns
Authorization: Bearer <token>
```

**Query Parameters:**
- `type` (optional): Filter by type (email, sms, qr, social)
- `difficulty` (optional): Filter by difficulty (beginner, intermediate, advanced)
- `is_active` (optional): Filter by active status (true/false)

**Response (200):**
```json
{
  "campaigns": [
    {
      "id": 1,
      "title": "Email Phishing Basics",
      "description": "Learn to identify common email phishing attacks",
      "type": "email",
      "difficulty": "beginner",
      "content": {...},
      "created_by": 1,
      "is_active": true,
      "created_at": "2024-01-15T10:00:00.000Z",
      "creator": {
        "id": 1,
        "username": "admin"
      }
    }
  ]
}
```

### Get Campaign by ID
```http
GET /api/campaigns/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "campaign": {
    "id": 1,
    "title": "Email Phishing Basics",
    "description": "Learn to identify common email phishing attacks",
    "type": "email",
    "difficulty": "beginner",
    "content": {
      "questions": [...]
    },
    "created_by": 1,
    "is_active": true,
    "creator": {
      "id": 1,
      "username": "admin"
    }
  }
}
```

### Create Campaign (Admin Only)
```http
POST /api/campaigns
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Advanced Email Phishing",
  "description": "Advanced email phishing scenarios",
  "type": "email",
  "difficulty": "advanced",
  "content": {
    "questions": [
      {
        "id": 1,
        "from": "Security Team",
        "email": "security@suspicious-domain.com",
        "subject": "Account Verification Required",
        "body": "Click here to verify your account...",
        "correct": "phishing"
      }
    ]
  },
  "is_active": true
}
```

**Response (201):**
```json
{
  "message": "Campaign created successfully",
  "campaign": {...}
}
```

### Update Campaign (Admin Only)
```http
PUT /api/campaigns/:id
Authorization: Bearer <token>
```

**Request Body:** (all fields optional)
```json
{
  "title": "Updated Title",
  "is_active": false
}
```

### Delete Campaign (Admin Only)
```http
DELETE /api/campaigns/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "Campaign deleted successfully"
}
```

---

## Results Endpoints

### Submit Training Result
```http
POST /api/results
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "campaign_id": 1,
  "score": 85.5,
  "time_spent": 180,
  "clicked_elements": [
    {
      "questionId": 1,
      "userAnswer": "phishing",
      "correct": true
    }
  ],
  "is_completed": true,
  "feedback": "Great job!"
}
```

**Response (201):**
```json
{
  "message": "Result submitted successfully",
  "result": {...},
  "pointsEarned": 86,
  "totalPoints": 236,
  "badges": ["learner", "proficient"]
}
```

### Get User Results
```http
GET /api/results/user/:userId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "results": [
    {
      "id": 1,
      "user_id": 1,
      "campaign_id": 1,
      "score": 85.5,
      "time_spent": 180,
      "is_completed": true,
      "completed_at": "2024-01-16T15:30:00.000Z",
      "Campaign": {
        "id": 1,
        "title": "Email Phishing Basics",
        "type": "email",
        "difficulty": "beginner"
      }
    }
  ]
}
```

### Get Campaign Results (Admin Only)
```http
GET /api/results/campaign/:campaignId
Authorization: Bearer <token>
```

---

## Analytics Endpoints

### Get Dashboard Analytics
```http
GET /api/analytics/dashboard
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalResults": 150,
  "completedResults": 120,
  "avgScore": "78.50",
  "moduleStats": [...],
  "recentActivity": [...]
}
```

### Get Heatmap Data (Admin Only)
```http
GET /api/analytics/heatmap/:campaignId
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "heatmapData": [
    {
      "element": {
        "questionId": 1,
        "userAnswer": "phishing"
      },
      "clicks": 45
    }
  ]
}
```

### Get Leaderboard
```http
GET /api/analytics/leaderboard?limit=10
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "cybermaster",
      "points": 2500,
      "badges": ["learner", "proficient", "expert"],
      "modulesCompleted": 4
    }
  ]
}
```

### Generate Report (Admin Only)
```http
GET /api/analytics/reports?startDate=2024-01-01&endDate=2024-01-31&type=csv
Authorization: Bearer <token>
```

**Query Parameters:**
- `startDate` (optional): Start date for report
- `endDate` (optional): End date for report
- `type` (optional): Format (json or csv)

---

## Admin Endpoints

### Get All Users (Admin Only)
```http
GET /api/admin/users
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "users": [
    {
      "id": 1,
      "username": "johndoe",
      "email": "john@example.com",
      "role": "user",
      "points": 150,
      "badges": ["learner"],
      "created_at": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### Update User (Admin Only)
```http
PUT /api/admin/users/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "role": "admin",
  "points": 500,
  "badges": ["learner", "proficient", "expert"]
}
```

### Delete User (Admin Only)
```http
DELETE /api/admin/users/:id
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "message": "User deleted successfully"
}
```

### Get Platform Statistics (Admin Only)
```http
GET /api/admin/statistics
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "totalUsers": 250,
  "totalCampaigns": 12,
  "totalResults": 1500,
  "completedResults": 1200,
  "totalCertificates": 180,
  "avgScore": "76.50",
  "topUsers": [...],
  "campaignsByType": [...],
  "recentActivity": [...]
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid input data",
  "errors": [
    {
      "field": "email",
      "message": "Please provide a valid email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "error": "No authentication token, access denied"
}
```

### 403 Forbidden
```json
{
  "error": "Access denied. Admin privileges required."
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error"
}
```

---

## Rate Limiting

- All API endpoints are rate-limited to 100 requests per 15 minutes per IP address
- Exceeding the limit returns a 429 status code

---

## Notes

- All timestamps are in ISO 8601 format
- All dates/times are in UTC
- Password requirements: minimum 6 characters, must contain uppercase, lowercase, and number
- JWT tokens expire after 1 hour (configurable)
- Refresh tokens expire after 7 days (configurable)
