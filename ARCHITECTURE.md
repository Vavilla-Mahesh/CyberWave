# CyberWave Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (Vue.js 3)                  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Landing Page  │  Auth Pages  │  User Dashboard      │  │
│  │  Training Modules  │  Analytics  │  Admin Dashboard  │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Vue Router (Navigation)  │  Vuex (State Management) │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Axios (HTTP Client) + JWT Token Management          │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Security Middleware (Helmet, CORS, Rate Limiting)   │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Authentication Middleware (JWT Verification)        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  API Routes                                           │  │
│  │  /auth  /users  /campaigns  /results  /analytics     │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Controllers (Business Logic)                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Sequelize ORM (Data Access Layer)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↓ SQL Queries
┌─────────────────────────────────────────────────────────────┐
│                     PostgreSQL Database                      │
│  ┌─────────┬─────────────┬─────────┬──────────────────┐   │
│  │  Users  │  Campaigns  │ Results │  Certificates    │   │
│  └─────────┴─────────────┴─────────┴──────────────────┘   │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Threat Intelligence (Future)                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────┐
│       Users         │
├─────────────────────┤
│ • id (PK)          │
│ • username         │
│ • email            │
│ • password (hash)  │
│ • role             │
│ • points           │
│ • badges (JSON)    │
│ • completed_modules│
└─────────────────────┘
         │
         │ 1:N
         ├────────────────────────────┐
         │                            │
         ↓                            ↓
┌─────────────────────┐      ┌─────────────────────┐
│     Campaigns       │      │      Results        │
├─────────────────────┤      ├─────────────────────┤
│ • id (PK)          │      │ • id (PK)          │
│ • title            │      │ • user_id (FK)     │
│ • description      │←─────│ • campaign_id (FK) │
│ • type             │ N:1  │ • score            │
│ • difficulty       │      │ • time_spent       │
│ • content (JSON)   │      │ • clicked_elements │
│ • created_by (FK)  │      │ • is_completed     │
│ • is_active        │      │ • completed_at     │
└─────────────────────┘      └─────────────────────┘
                                      │
                                      │ N:1
                                      ↓
                             ┌─────────────────────┐
                             │    Certificates     │
                             ├─────────────────────┤
                             │ • id (PK)          │
                             │ • user_id (FK)     │
                             │ • module_type      │
                             │ • certificate_id   │
                             │ • issued_at        │
                             └─────────────────────┘
```

## Request Flow

### User Registration/Login
```
1. User submits credentials → Frontend (Login.vue)
2. Vuex action dispatched → store/index.js
3. HTTP POST request → /api/auth/login
4. Backend validates credentials → authController.js
5. Password verified with bcrypt → User model
6. JWT token generated → authController.js
7. Token + user data returned
8. Token stored in localStorage + Vuex state
9. User redirected to dashboard
```

### Training Module Completion
```
1. User completes training → EmailTraining.vue
2. Submit result action → Vuex store
3. HTTP POST → /api/results
4. Backend validates data → resultController.js
5. Calculate points/badges → Result model logic
6. Update user stats → User model
7. Check for certificates → Certificate model
8. Return updated data
9. Frontend updates UI with animations
```

### Admin Campaign Management
```
1. Admin creates campaign → AdminCampaigns.vue
2. HTTP POST → /api/campaigns
3. Auth middleware verifies admin role
4. Campaign created → campaignController.js
5. Sequelize saves to DB → Campaign model
6. Success response returned
7. Campaign list refreshed
```

## Security Layers

### Layer 1: Network Security
- HTTPS (production)
- CORS configuration
- Rate limiting (100 req/15min)

### Layer 2: Authentication
- JWT token-based auth
- Refresh token mechanism
- Token expiration (1h access, 7d refresh)

### Layer 3: Authorization
- Role-based access control (user/admin)
- Middleware protection on routes
- User-specific data filtering

### Layer 4: Data Security
- Bcrypt password hashing (10+ rounds)
- SQL injection prevention (Sequelize ORM)
- Input validation (express-validator)
- XSS protection (Helmet.js)

### Layer 5: Application Security
- Environment variables for secrets
- HTTP security headers
- Error handling without data leakage

## Component Structure

### Frontend Components
```
src/
├── components/
│   ├── Navbar.vue           # Navigation with auth state
│   └── Notification.vue     # Toast notifications
├── views/
│   ├── Home.vue            # Landing page
│   ├── Login.vue           # Login form
│   ├── Register.vue        # Registration with validation
│   ├── Dashboard.vue       # User dashboard
│   ├── Analytics.vue       # Personal analytics
│   ├── Leaderboard.vue     # Gamification leaderboard
│   ├── training/
│   │   ├── EmailTraining.vue    # Interactive email sim
│   │   ├── SmsTraining.vue      # SMS phishing module
│   │   ├── QrTraining.vue       # QR code security
│   │   └── SocialTraining.vue   # Social media impersonation
│   └── admin/
│       ├── AdminDashboard.vue   # Admin overview
│       ├── AdminCampaigns.vue   # Campaign management
│       ├── AdminUsers.vue       # User management
│       ├── AdminReports.vue     # Analytics & reports
│       └── ThreatFeed.vue       # Threat intelligence
├── router/
│   └── index.js            # Route definitions + guards
└── store/
    └── index.js            # Vuex state management
```

### Backend Structure
```
backend/
├── config/
│   └── database.js         # Sequelize configuration
├── controllers/
│   ├── authController.js   # Auth logic
│   ├── userController.js   # User operations
│   ├── campaignController.js  # Campaign CRUD
│   ├── resultController.js    # Result processing
│   ├── analyticsController.js # Analytics & reports
│   └── adminController.js     # Admin operations
├── middleware/
│   ├── auth.js            # JWT verification
│   ├── validation.js      # Input validation
│   └── errorHandler.js    # Error middleware
├── models/
│   ├── User.js            # User model + hooks
│   ├── Campaign.js        # Campaign model
│   ├── Result.js          # Result model
│   ├── Certificate.js     # Certificate model
│   ├── ThreatIntelligence.js  # Threat data
│   └── index.js           # Model relationships
├── routes/
│   ├── auth.js            # Auth endpoints
│   ├── users.js           # User endpoints
│   ├── campaigns.js       # Campaign endpoints
│   ├── results.js         # Result endpoints
│   ├── analytics.js       # Analytics endpoints
│   └── admin.js           # Admin endpoints
├── utils/
│   └── seedData.js        # Database seeding
└── server.js              # Express app setup
```

## Data Flow Diagrams

### Authentication Flow
```
┌────────┐     credentials     ┌─────────┐     validate     ┌──────────┐
│ Client │ ──────────────────> │ Backend │ ───────────────> │ Database │
└────────┘                      └─────────┘                  └──────────┘
    ↑                                │                            │
    │         JWT + user data        │         user found         │
    └────────────────────────────────┴────────────────────────────┘
```

### Training Submission Flow
```
┌────────┐     result data     ┌─────────┐   calculate pts   ┌──────────┐
│ Client │ ──────────────────> │ Backend │ ────────────────> │ Database │
└────────┘                      └─────────┘                   └──────────┘
    ↑                                │                             │
    │    points + badges + certs     │    update user stats        │
    └────────────────────────────────┴─────────────────────────────┘
                                     │
                                     ↓
                            ┌──────────────────┐
                            │ Certificate Gen  │
                            └──────────────────┘
```

## Technology Decisions

### Why PostgreSQL?
- ✅ ACID compliance for data integrity
- ✅ JSON/JSONB support for flexible content storage
- ✅ Strong type system
- ✅ Excellent performance for analytics queries
- ✅ Production-ready with replication support

### Why Sequelize ORM?
- ✅ SQL injection prevention
- ✅ Model relationships
- ✅ Migration support
- ✅ Query optimization
- ✅ Transaction support

### Why Vue.js 3?
- ✅ Composition API for better code organization
- ✅ Reactive state management
- ✅ Component-based architecture
- ✅ Excellent performance
- ✅ Strong ecosystem (Router, Vuex, etc.)

### Why JWT?
- ✅ Stateless authentication
- ✅ Scalable across multiple servers
- ✅ Includes expiration
- ✅ Can store user role/claims
- ✅ Industry standard

### Why Tailwind CSS?
- ✅ Utility-first approach
- ✅ Highly customizable
- ✅ Responsive design utilities
- ✅ Small production bundle
- ✅ Consistent design system

## Performance Considerations

### Database Optimization
- Indexed foreign keys
- Indexed email/username for fast lookups
- Connection pooling (max 10 connections)
- Query optimization with Sequelize

### Frontend Optimization
- Code splitting with Vue Router
- Lazy loading of routes
- Optimized Tailwind CSS (PurgeCSS)
- Vite for fast build times

### API Optimization
- Rate limiting to prevent abuse
- Compression middleware (future)
- Caching strategies (future)
- Pagination on list endpoints

## Scalability Path

### Current: Single Server
```
[Frontend] → [Backend] → [PostgreSQL]
```

### Future: Distributed System
```
[CDN]
  ↓
[Load Balancer]
  ↓
[Backend 1] [Backend 2] [Backend 3]
  ↓           ↓           ↓
[PostgreSQL Primary] → [Replica 1] [Replica 2]
  ↓
[Redis Cache]
```

## Security Best Practices Implemented

1. ✅ Password hashing with bcrypt
2. ✅ JWT token authentication
3. ✅ HTTPS ready (production)
4. ✅ CORS configuration
5. ✅ Rate limiting
6. ✅ Input validation
7. ✅ SQL injection prevention
8. ✅ XSS protection headers
9. ✅ Environment-based configuration
10. ✅ Role-based access control

## Monitoring & Logging

### Current Implementation
- Console logging in development
- Morgan HTTP request logging
- Database query logging (dev only)

### Future Enhancements
- Winston for structured logging
- Log aggregation (ELK stack)
- Performance monitoring (New Relic/DataDog)
- Error tracking (Sentry)
- Uptime monitoring

---

**This architecture provides a solid foundation for a production-ready phishing awareness training platform with room for future enhancements.**
