# CyberWave Quick Start Guide

Get CyberWave up and running in minutes!

## Prerequisites Checklist

- ✅ Node.js v16+ installed (`node --version`)
- ✅ PostgreSQL v12+ installed and running
- ✅ npm or yarn package manager

## 5-Minute Setup

### Step 1: Database Setup (2 minutes)

```bash
# Create PostgreSQL database
createdb cyberwave

# Or using psql
psql -U postgres
CREATE DATABASE cyberwave;
\q
```

### Step 2: Backend Setup (2 minutes)

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create and configure .env
cp .env.example .env

# Edit .env with your database credentials
# Minimum required:
# - DB_PASSWORD=your_postgres_password
# - JWT_SECRET=any_random_secure_string
# - JWT_REFRESH_SECRET=another_random_secure_string
```

**Start backend server:**
```bash
npm start
```

✅ Backend should be running on http://localhost:5000

The first time you start the server, it will:
- Create all database tables automatically
- Create a default admin user: `admin@cyberwave.com` / `Admin123!`
- Create sample training campaigns

### Step 3: Frontend Setup (1 minute)

Open a new terminal:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

✅ Frontend should be running on http://localhost:3000

## Quick Test

1. **Open browser**: http://localhost:3000
2. **Register a new user** or use the default admin:
   - Email: `admin@cyberwave.com`
   - Password: `Admin123!`
3. **Explore the platform!**

## Default Accounts

### Admin Account
- **Email**: admin@cyberwave.com
- **Password**: Admin123!
- **Access**: Full admin dashboard and user features

### Creating Additional Users
- Register at: http://localhost:3000/register
- New users have 'user' role by default

## Common Issues

### "Cannot connect to database"
- ✅ Ensure PostgreSQL is running: `pg_isready`
- ✅ Check database exists: `psql -l | grep cyberwave`
- ✅ Verify credentials in `backend/.env`

### "Port 5000 already in use"
- ✅ Change PORT in `backend/.env`
- ✅ Update API URL in frontend if needed

### "Module not found"
- ✅ Run `npm install` in both backend and frontend directories
- ✅ Delete `node_modules` and `package-lock.json`, then reinstall

## Next Steps

- 📖 Read the full [README.md](README.md) for detailed documentation
- 🎓 Complete the Email Phishing training module
- 👨‍💼 Explore the Admin Dashboard to create custom campaigns
- 📊 View analytics and leaderboards
- 🎨 Customize the UI theme in `frontend/tailwind.config.js`

## Development Tips

### Backend
- **Auto-reload**: Use `npm run dev` for automatic server restart on changes
- **View logs**: Server logs show all API requests and database operations
- **Database reset**: Delete and recreate the database to start fresh

### Frontend
- **Hot reload**: Changes to Vue files auto-refresh the browser
- **Tailwind classes**: See `frontend/src/assets/styles.css` for custom utilities
- **State management**: Check Vuex store in `frontend/src/store/index.js`

## Production Deployment

Quick production checklist:

1. Set `NODE_ENV=production` in backend
2. Update `JWT_SECRET` and `JWT_REFRESH_SECRET` to strong random values
3. Configure production database
4. Build frontend: `cd frontend && npm run build`
5. Serve frontend `dist` folder with nginx/apache
6. Use PM2 or similar for backend process management

See [README.md](README.md) for detailed deployment instructions.

---

**Need help?** Open an issue on GitHub!
