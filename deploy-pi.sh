#!/bin/bash

# Raspberry Pi Deployment Script for Discogs Helper App
# This script builds and deploys the app to a Raspberry Pi

set -e  # Exit on any error

echo "🚀 Starting Raspberry Pi deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
PI_HOST="your-pi-ip-address"  # Change this to your Pi's IP
PI_USER="pi"                  # Default Pi username
PI_APP_DIR="/home/pi/discogs-app"
PI_BACKEND_PORT="3001"
PI_FRONTEND_PORT="3002"

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

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js first."
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    print_status "Dependencies check passed!"
}

# Build the React frontend
build_frontend() {
    print_status "Building React frontend..."
    
    cd react-front
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing frontend dependencies..."
        npm install
    fi
    
    # Build for production
    print_status "Creating production build..."
    npm run build
    
    cd ..
    print_status "Frontend build complete!"
}

# Build the backend
build_backend() {
    print_status "Building backend..."
    
    cd discogs-back
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        print_status "Installing backend dependencies..."
        npm install
    fi
    
    # Build TypeScript
    print_status "Compiling TypeScript..."
    npm run build
    
    cd ..
    print_status "Backend build complete!"
}

# Create deployment package
create_deployment_package() {
    print_status "Creating deployment package..."
    
    # Create deployment directory
    rm -rf deployment
    mkdir -p deployment
    
    # Copy backend
    cp -r discogs-back/dist deployment/backend
    cp discogs-back/package.json deployment/backend/
    cp discogs-back/package-lock.json deployment/backend/ 2>/dev/null || true
    
    # Copy frontend build
    cp -r react-front/build deployment/frontend
    
    # Copy deployment scripts
    cp pi-setup.sh deployment/
    cp pm2-ecosystem.config.js deployment/
    
    print_status "Deployment package created!"
}

# Deploy to Raspberry Pi
deploy_to_pi() {
    print_status "Deploying to Raspberry Pi at $PI_HOST..."
    
    # Create tar.gz package
    tar -czf discogs-app.tar.gz deployment/
    
    # Upload to Pi
    print_status "Uploading to Pi..."
    scp discogs-app.tar.gz $PI_USER@$PI_HOST:/tmp/
    
    # Execute setup on Pi
    print_status "Running setup on Pi..."
    ssh $PI_USER@$PI_HOST "cd /tmp && tar -xzf discogs-app.tar.gz && cd deployment && chmod +x pi-setup.sh && ./pi-setup.sh"
    
    # Clean up
    rm discogs-app.tar.gz
    rm -rf deployment
    
    print_status "Deployment complete!"
}

# Main deployment process
main() {
    print_status "Starting deployment process..."
    
    check_dependencies
    build_frontend
    build_backend
    create_deployment_package
    deploy_to_pi
    
    print_status "🎉 Deployment successful!"
    print_status "Your app should be running at:"
    print_status "  Frontend: http://$PI_HOST:$PI_FRONTEND_PORT"
    print_status "  Backend:  http://$PI_HOST:$PI_BACKEND_PORT"
    print_warning "Don't forget to update the PI_HOST variable in this script with your Pi's actual IP address!"
}

# Run main function
main "$@" 