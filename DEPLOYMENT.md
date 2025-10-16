# CyberWave Deployment Guide

Complete guide for deploying CyberWave to production environments.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Configuration](#environment-configuration)
3. [Database Setup](#database-setup)
4. [Backend Deployment](#backend-deployment)
5. [Frontend Deployment](#frontend-deployment)
6. [Nginx Configuration](#nginx-configuration)
7. [SSL/HTTPS Setup](#ssl-https-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

- [ ] Production server(s) with SSH access
- [ ] Domain name configured
- [ ] PostgreSQL installed on production server
- [ ] Node.js v16+ installed
- [ ] Nginx or Apache web server
- [ ] SSL certificate (Let's Encrypt recommended)
- [ ] Backup strategy in place

---

## Environment Configuration

### 1. Backend Environment Variables

Create `/backend/.env` for production:

```env
# Server Configuration
PORT=5000
NODE_ENV=production

# Database Configuration (Use strong credentials!)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=cyberwave_prod
DB_USER=cyberwave_user
DB_PASSWORD=YOUR_STRONG_DATABASE_PASSWORD

# JWT Configuration (Generate strong random secrets!)
JWT_SECRET=YOUR_SUPER_SECRET_JWT_KEY_HERE_USE_64_CHARS_OR_MORE
JWT_REFRESH_SECRET=YOUR_SUPER_SECRET_REFRESH_KEY_HERE_USE_64_CHARS_OR_MORE
JWT_EXPIRE=1h
JWT_REFRESH_EXPIRE=7d

# CORS Configuration
CORS_ORIGIN=https://yourdomain.com

# API Keys (Optional)
PHISHTANK_API_KEY=your_phishtank_api_key
VIRUSTOTAL_API_KEY=your_virustotal_api_key
```

**Generate Strong Secrets:**
```bash
# Generate random 64-character secrets
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Frontend Configuration

Update API endpoint in production build.

Create `frontend/.env.production`:
```env
VITE_API_URL=https://api.yourdomain.com
```

---

## Database Setup

### 1. Install PostgreSQL

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2. Create Production Database

```bash
# Login as postgres user
sudo -u postgres psql

# Create database user
CREATE USER cyberwave_user WITH PASSWORD 'YOUR_STRONG_PASSWORD';

# Create database
CREATE DATABASE cyberwave_prod;

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE cyberwave_prod TO cyberwave_user;

# Exit psql
\q
```

### 3. Configure PostgreSQL for Production

Edit `/etc/postgresql/[version]/main/postgresql.conf`:

```conf
# Optimize for production
max_connections = 100
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 2621kB
min_wal_size = 1GB
max_wal_size = 4GB
```

Restart PostgreSQL:
```bash
sudo systemctl restart postgresql
```

---

## Backend Deployment

### Option 1: PM2 (Recommended)

**Install PM2:**
```bash
npm install -g pm2
```

**Create PM2 Ecosystem File** (`backend/ecosystem.config.js`):
```javascript
module.exports = {
  apps: [{
    name: 'cyberwave-api',
    script: './server.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 5000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '500M'
  }]
}
```

**Deploy:**
```bash
cd backend
npm install --production
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow the instructions
```

**PM2 Commands:**
```bash
pm2 status              # Check status
pm2 logs cyberwave-api  # View logs
pm2 restart cyberwave-api  # Restart
pm2 stop cyberwave-api  # Stop
pm2 delete cyberwave-api  # Remove
```

### Option 2: Systemd Service

Create `/etc/systemd/system/cyberwave-api.service`:

```ini
[Unit]
Description=CyberWave API Server
After=network.target postgresql.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/cyberwave/backend
Environment=NODE_ENV=production
ExecStart=/usr/bin/node server.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=cyberwave-api

[Install]
WantedBy=multi-user.target
```

**Start the service:**
```bash
sudo systemctl daemon-reload
sudo systemctl start cyberwave-api
sudo systemctl enable cyberwave-api
sudo systemctl status cyberwave-api
```

---

## Frontend Deployment

### 1. Build Production Bundle

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder with optimized static files.

### 2. Deploy to Server

```bash
# Copy build files to server
scp -r dist/* user@server:/var/www/cyberwave/frontend/

# Or using rsync
rsync -avz dist/ user@server:/var/www/cyberwave/frontend/
```

---

## Nginx Configuration

### 1. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Configure Nginx

Create `/etc/nginx/sites-available/cyberwave`:

```nginx
# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req zone=api burst=20 nodelay;
}

# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/cyberwave/frontend;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
}
```

**Enable site:**
```bash
sudo ln -s /etc/nginx/sites-available/cyberwave /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## SSL/HTTPS Setup

### Using Let's Encrypt (Recommended)

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx
```

**Obtain SSL Certificate:**
```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

Certbot automatically updates your Nginx configuration to use SSL.

**Auto-renewal:**
```bash
# Test renewal
sudo certbot renew --dry-run

# Certbot sets up automatic renewal via systemd timer
sudo systemctl status certbot.timer
```

### Manual SSL Configuration (if needed)

Update Nginx config to redirect HTTP to HTTPS:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # ... rest of config
}
```

---

## Monitoring & Maintenance

### 1. Log Management

**Backend logs (PM2):**
```bash
pm2 logs cyberwave-api
pm2 logs cyberwave-api --lines 100
pm2 flush  # Clear logs
```

**Nginx logs:**
```bash
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

**PostgreSQL logs:**
```bash
sudo tail -f /var/log/postgresql/postgresql-[version]-main.log
```

### 2. Database Backup

**Automated backup script** (`/usr/local/bin/backup-cyberwave.sh`):

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/cyberwave"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="cyberwave_$DATE.sql"

mkdir -p $BACKUP_DIR

# Create backup
pg_dump -U cyberwave_user -h localhost cyberwave_prod > "$BACKUP_DIR/$FILENAME"

# Compress
gzip "$BACKUP_DIR/$FILENAME"

# Keep only last 30 days
find $BACKUP_DIR -name "*.gz" -mtime +30 -delete

echo "Backup completed: $FILENAME.gz"
```

**Setup cron job:**
```bash
sudo chmod +x /usr/local/bin/backup-cyberwave.sh
sudo crontab -e

# Add line: Daily backup at 2 AM
0 2 * * * /usr/local/bin/backup-cyberwave.sh
```

### 3. Restore Database

```bash
# Decompress backup
gunzip /var/backups/cyberwave/cyberwave_20240116_020000.sql.gz

# Restore
psql -U cyberwave_user -h localhost cyberwave_prod < /var/backups/cyberwave/cyberwave_20240116_020000.sql
```

### 4. Monitoring Setup

**Install monitoring tools:**
```bash
# htop for system monitoring
sudo apt install htop

# pgAdmin for PostgreSQL monitoring (optional)
# Or use command-line tools:
psql -U cyberwave_user -d cyberwave_prod -c "SELECT * FROM pg_stat_activity;"
```

**Basic monitoring script** (`monitor.sh`):
```bash
#!/bin/bash
echo "=== CyberWave Status ==="
echo "Backend API:"
pm2 status cyberwave-api

echo -e "\nNginx:"
sudo systemctl status nginx --no-pager

echo -e "\nPostgreSQL:"
sudo systemctl status postgresql --no-pager

echo -e "\nDisk Usage:"
df -h | grep -v tmpfs

echo -e "\nMemory Usage:"
free -h
```

### 5. Update Procedure

**Backend updates:**
```bash
cd /var/www/cyberwave/backend
git pull origin main
npm install --production
pm2 restart cyberwave-api
```

**Frontend updates:**
```bash
cd /var/www/cyberwave/frontend
git pull origin main
npm install
npm run build
sudo cp -r dist/* /var/www/cyberwave/frontend/
```

### 6. Security Updates

```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Update Node.js packages
cd backend && npm audit fix
cd frontend && npm audit fix

# Check for security vulnerabilities
npm audit
```

---

## Performance Tuning

### 1. Node.js Clustering

Already configured in PM2 ecosystem file with 2 instances.

### 2. Nginx Caching

Add to Nginx config:
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=1g inactive=60m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    proxy_cache_key "$scheme$request_method$host$request_uri";
    # ... rest of proxy config
}
```

### 3. Database Optimization

```sql
-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_results_completed_at ON results(completed_at);
CREATE INDEX IF NOT EXISTS idx_results_score ON results(score);
```

---

## Troubleshooting

### Backend won't start
```bash
# Check logs
pm2 logs cyberwave-api

# Check environment variables
pm2 env cyberwave-api

# Test database connection
psql -U cyberwave_user -h localhost -d cyberwave_prod
```

### Frontend shows API errors
```bash
# Check CORS settings in backend .env
# Check API URL in frontend build
# Check Nginx proxy configuration
sudo nginx -t
```

### High memory usage
```bash
# Monitor process
htop

# Restart services
pm2 restart cyberwave-api
sudo systemctl restart nginx
```

### Database connection issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check connections
psql -U postgres -c "SELECT * FROM pg_stat_activity;"

# Check max_connections
psql -U postgres -c "SHOW max_connections;"
```

---

## Rollback Procedure

If deployment fails:

1. **Backend rollback:**
```bash
cd /var/www/cyberwave/backend
git reset --hard HEAD~1
npm install --production
pm2 restart cyberwave-api
```

2. **Frontend rollback:**
```bash
cd /var/www/cyberwave/frontend
git reset --hard HEAD~1
npm install && npm run build
sudo cp -r dist/* /var/www/cyberwave/frontend/
```

3. **Database rollback:**
```bash
# Restore from latest backup
psql -U cyberwave_user -h localhost cyberwave_prod < /var/backups/cyberwave/latest_backup.sql
```

---

## Success Checklist

After deployment, verify:

- [ ] API health check: `curl https://api.yourdomain.com/api/health`
- [ ] Frontend loads: `https://yourdomain.com`
- [ ] User can register
- [ ] User can login
- [ ] Training modules work
- [ ] Admin dashboard accessible
- [ ] SSL certificate valid
- [ ] Database backups running
- [ ] Monitoring active
- [ ] Logs accessible

---

**For issues or questions, refer to the main README.md or open a GitHub issue.**
