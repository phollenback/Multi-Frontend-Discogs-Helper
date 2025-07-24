#!/bin/bash

# Raspberry Pi Setup Script for Discogs Helper App
# This script runs on the Pi to set up the application

set -e  # Exit on any error

echo "🍓 Setting up Discogs Helper App on Raspberry Pi..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="/home/pi/discogs-app"
BACKEND_PORT="3001"
FRONTEND_PORT="3002"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Update system packages
update_system() {
    print_status "Updating system packages..."
    sudo apt update
    sudo apt upgrade -y
    print_status "System updated!"
}

# Install Node.js and npm
install_nodejs() {
    print_status "Installing Node.js and npm..."
    
    # Check if Node.js is already installed
    if command -v node &> /dev/null; then
        print_status "Node.js is already installed: $(node --version)"
        return
    fi
    
    # Install Node.js 18.x (LTS)
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    
    print_status "Node.js installed: $(node --version)"
    print_status "npm installed: $(npm --version)"
}

# Install MySQL
install_mysql() {
    print_status "Installing MySQL..."
    
    # Check if MySQL is already installed
    if command -v mysql &> /dev/null; then
        print_status "MySQL is already installed"
        return
    fi
    
    # Install MySQL
    sudo apt install -y mysql-server
    
    # Secure MySQL installation
    print_warning "Setting up MySQL security..."
    sudo mysql_secure_installation
    
    print_status "MySQL installed and secured!"
}

# Install PM2 for process management
install_pm2() {
    print_status "Installing PM2 process manager..."
    
    if ! command -v pm2 &> /dev/null; then
        sudo npm install -g pm2
        print_status "PM2 installed!"
    else
        print_status "PM2 is already installed"
    fi
}

# Install nginx for reverse proxy
install_nginx() {
    print_status "Installing nginx..."
    
    if ! command -v nginx &> /dev/null; then
        sudo apt install -y nginx
        sudo systemctl enable nginx
        sudo systemctl start nginx
        print_status "nginx installed and started!"
    else
        print_status "nginx is already installed"
    fi
}

# Setup application directory
setup_app_directory() {
    print_status "Setting up application directory..."
    
    # Create app directory
    sudo mkdir -p $APP_DIR
    sudo chown pi:pi $APP_DIR
    
    # Copy application files
    cp -r backend/* $APP_DIR/
    cp -r frontend/* $APP_DIR/public/
    
    # Install backend dependencies
    cd $APP_DIR
    npm install --production
    
    print_status "Application directory setup complete!"
}

# Configure nginx
configure_nginx() {
    print_status "Configuring nginx..."
    
    # Create nginx configuration
    sudo tee /etc/nginx/sites-available/discogs-app > /dev/null <<EOF
server {
    listen 80;
    server_name _;
    
    # Frontend
    location / {
        proxy_pass http://localhost:$FRONTEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF
    
    # Enable the site
    sudo ln -sf /etc/nginx/sites-available/discogs-app /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default  # Remove default site
    
    # Test nginx configuration
    sudo nginx -t
    
    # Reload nginx
    sudo systemctl reload nginx
    
    print_status "nginx configured!"
}

# Setup PM2 ecosystem
setup_pm2() {
    print_status "Setting up PM2 ecosystem..."
    
    # Create PM2 ecosystem file
    tee $APP_DIR/ecosystem.config.js > /dev/null <<EOF
module.exports = {
  apps: [
    {
      name: 'discogs-backend',
      script: 'dist/app.js',
      cwd: '$APP_DIR',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: $BACKEND_PORT
      }
    },
    {
      name: 'discogs-frontend',
      script: 'node_modules/serve/bin/serve.js',
      cwd: '$APP_DIR',
      args: ['-s', 'public', '-l', $FRONTEND_PORT],
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
EOF
    
    # Install serve for static file serving
    npm install -g serve
    
    # Start applications with PM2
    cd $APP_DIR
    pm2 start ecosystem.config.js
    
    # Save PM2 configuration
    pm2 save
    pm2 startup
    
    print_status "PM2 ecosystem configured!"
}

# Setup firewall
setup_firewall() {
    print_status "Setting up firewall..."
    
    # Allow SSH, HTTP, and HTTPS
    sudo ufw allow ssh
    sudo ufw allow 80
    sudo ufw allow 443
    
    # Enable firewall
    sudo ufw --force enable
    
    print_status "Firewall configured!"
}

# Create database
setup_database() {
    print_status "Setting up database..."
    
    # Create database and user
    sudo mysql -e "
    CREATE DATABASE IF NOT EXISTS Discogs;
    CREATE USER IF NOT EXISTS 'discogs_user'@'localhost' IDENTIFIED BY 'your_secure_password';
    GRANT ALL PRIVILEGES ON Discogs.* TO 'discogs_user'@'localhost';
    FLUSH PRIVILEGES;
    "
    
    print_warning "Database created! Don't forget to update the database password in your app configuration."
}

# Main setup process
main() {
    print_status "Starting Raspberry Pi setup..."
    
    update_system
    install_nodejs
    install_mysql
    install_pm2
    install_nginx
    setup_app_directory
    configure_nginx
    setup_pm2
    setup_firewall
    setup_database
    
    print_status "🎉 Setup complete!"
    print_status "Your Discogs Helper App is now running!"
    print_status "Access it at: http://$(hostname -I | awk '{print $1}')"
    print_warning "Don't forget to:"
    print_warning "1. Update database credentials in your app"
    print_warning "2. Configure your Discogs API token"
    print_warning "3. Set up SSL certificate for production use"
}

# Run main function
main "$@" 