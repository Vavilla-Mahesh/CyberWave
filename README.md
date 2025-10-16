# CyberWave - Phishing Awareness & Training Platform

A modern, full-stack cybersecurity training platform designed to help organizations combat phishing attacks through immersive, gamified learning experiences.

## 🌟 Features

### Core Capabilities
- **Multi-Channel Phishing Simulations**: Email, SMS, QR codes, and social media training modules
- **Gamification System**: Points, badges, leaderboards, and certificates to drive engagement
- **Real-time Analytics**: Track performance with interactive charts and heatmaps
- **Admin Dashboard**: Comprehensive campaign and user management
- **Role-Based Access Control**: Separate user and admin experiences
- **Modern UI/UX**: Cybersecurity-themed design with animations and glass-morphism effects

### Security Features
- JWT-based authentication with refresh tokens
- Password hashing with bcrypt (10+ salt rounds)
- HTTP security headers via Helmet.js
- Input validation and sanitization
- Rate limiting on API endpoints
- SQL injection prevention via Sequelize ORM
- OWASP security best practices

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet.js, bcrypt, CORS, express-validator
- **Logging**: Morgan

### Frontend
- **Framework**: Vue.js 3 (Composition API)
- **State Management**: Vuex
- **Routing**: Vue Router
- **Styling**: Tailwind CSS with custom animations
- **Charts**: Chart.js for data visualization
- **Advanced Viz**: D3.js for heatmaps (ready for integration)
- **Build Tool**: Vite

## 📋 Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Vavilla-Mahesh/CyberWave.git
cd CyberWave
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Edit .env with your configuration
# Update database credentials and JWT secrets
```

**Configure PostgreSQL Database:**
```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE cyberwave;

# Exit psql
\q
```

**Update `.env` file:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=cyberwave
DB_USER=postgres
DB_PASSWORD=your_password

JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_REFRESH_SECRET=your_super_secret_refresh_key_change_this
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

CORS_ORIGIN=http://localhost:3000
```

**Start the backend server:**
```bash
npm start
# or for development with auto-reload
npm run dev
```

The backend will:
- Connect to PostgreSQL
- Create all necessary tables automatically
- Start listening on port 5000

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:3000`

## 📊 Database Schema

The application uses the following database tables:

- **users**: User accounts with authentication and gamification data
- **campaigns**: Training campaign definitions
- **results**: User performance and quiz results
- **certificates**: Generated certificates for completed modules
- **threat_intelligence**: Prepared for external threat feed integration

All tables are created automatically when the backend starts.

## 🎯 Usage

### First-Time Setup

1. **Start both backend and frontend servers**

2. **Register an Admin Account**:
   - Navigate to `http://localhost:3000/register`
   - Create your first account
   - Manually update the user role to 'admin' in the database:
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

3. **Login and Explore**:
   - Admin users are redirected to `/admin/dashboard`
   - Regular users are redirected to `/dashboard`

### Creating Training Campaigns (Admin)

1. Navigate to Admin Dashboard
2. Go to Campaign Management
3. Create campaigns with:
   - Title and description
   - Type (email, sms, qr, social)
   - Difficulty level
   - Content (JSON format with questions/scenarios)

### User Training Flow

1. Users log in and see their dashboard
2. Select a training module
3. Complete interactive simulations
4. Earn points and badges based on performance
5. View analytics and certificates

## 🎨 UI/UX Highlights

### Color Palette
- **Primary**: Electric blue (#0EA5E9, #3B82F6)
- **Secondary**: Cyber purple (#A855F7, #8B5CF6)
- **Accent**: Neon green (#10B981, #22C55E)
- **Danger**: Hot pink/red (#F43F5E, #EC4899)
- **Background**: Deep dark (#0F172A, #1E293B)

### Animations
- Page transitions with fade/slide effects
- Hover effects with glow and scale transforms
- Animated gradients and backgrounds
- Particle effects on landing page
- Chart animations
- Progress bars with smooth fills
- Badge unlock animations

## 📁 Project Structure

```
CyberWave/
├── backend/
│   ├── config/          # Database configuration
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Auth, validation, error handling
│   ├── models/          # Sequelize models
│   ├── routes/          # API routes
│   ├── utils/           # Helper functions
│   ├── server.js        # Express server
│   └── package.json
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── assets/      # CSS and images
│   │   ├── components/  # Vue components
│   │   ├── views/       # Page components
│   │   ├── router/      # Vue Router config
│   │   ├── store/       # Vuex store
│   │   ├── App.vue
│   │   └── main.js
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/progress` - Get training progress
- `GET /api/users/certificates` - Get certificates

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:id` - Get campaign by ID
- `POST /api/campaigns` - Create campaign (admin)
- `PUT /api/campaigns/:id` - Update campaign (admin)
- `DELETE /api/campaigns/:id` - Delete campaign (admin)

### Results
- `POST /api/results` - Submit training result
- `GET /api/results/user/:userId` - Get user results
- `GET /api/results/campaign/:campaignId` - Get campaign results (admin)

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/heatmap/:campaignId` - Get heatmap data
- `GET /api/analytics/leaderboard` - Get leaderboard
- `GET /api/analytics/reports` - Generate reports (admin)

### Admin
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/statistics` - Get platform statistics

## 🔐 Security Best Practices

1. **Always use HTTPS in production**
2. **Keep JWT secrets secure** - Never commit to version control
3. **Regularly update dependencies** - `npm audit` and `npm update`
4. **Use environment variables** for sensitive configuration
5. **Implement rate limiting** on all API endpoints
6. **Validate and sanitize all inputs**
7. **Use parameterized queries** (handled by Sequelize)
8. **Set secure HTTP headers** (handled by Helmet.js)

## 🚀 Deployment

### Backend Deployment

1. Set `NODE_ENV=production` in environment
2. Update database credentials
3. Configure production CORS origins
4. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name cyberwave-api
   ```

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Serve the `dist` folder with a web server (Nginx, Apache, etc.)
3. Update API base URL in production

### Database Backup

```bash
# Backup
pg_dump cyberwave > backup.sql

# Restore
psql cyberwave < backup.sql
```

## 🔮 Future Enhancements

- [ ] Live threat intelligence integration (OpenPhish, URLhaus, VirusTotal)
- [ ] Advanced D3.js heatmaps for click tracking
- [ ] PDF certificate generation
- [ ] Email campaign scheduling
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Advanced analytics with ML-based risk scoring
- [ ] SCORM compliance for LMS integration

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

MIT License - See LICENSE file for details

## 👥 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

**Built with ❤️ for cybersecurity awareness**