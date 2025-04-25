#!/bin/bash
# Server setup script for Science Paper CI/CD deployment

# Exit on error
set -e

# Variables (customize these)
APP_DIR="/path/to/your/app"
DOCKER_USERNAME="your-dockerhub-username"

# Create application directory
echo "Creating application directory..."
mkdir -p $APP_DIR

# Copy docker-compose file
echo "Setting up docker-compose.yml..."
cat > $APP_DIR/docker-compose.yml << EOF
version: '3.8'

services:
  web:
    platform: linux/amd64
    image: $DOCKER_USERNAME/science_paper:latest
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - CHROME_PATH=/usr/bin/google-chrome
    shm_size: '2gb'
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 1G
    restart: unless-stopped
EOF

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    rm get-docker.sh
else
    echo "Docker is already installed."
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Docker Compose not found. Installing Docker Compose..."
    curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
else
    echo "Docker Compose is already installed."
fi

# Ensure SSH password authentication is enabled
echo "Checking SSH password authentication..."
if grep -q "^#PasswordAuthentication" /etc/ssh/sshd_config; then
    echo "Enabling password authentication in SSH config..."
    sudo sed -i 's/^#PasswordAuthentication.*/PasswordAuthentication yes/' /etc/ssh/sshd_config
    sudo systemctl restart sshd
elif grep -q "^PasswordAuthentication no" /etc/ssh/sshd_config; then
    echo "Enabling password authentication in SSH config..."
    sudo sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /etc/ssh/sshd_config
    sudo systemctl restart sshd
else
    echo "Password authentication appears to be enabled."
fi

echo "Server setup complete!"
echo "Next steps:"
echo "1. Update the DOCKER_USERNAME in docker-compose.yml"
echo "2. Add your server's SSH password as a GitHub secret named SSH_PASSWORD"
echo "3. Test the deployment by running: cd $APP_DIR && docker-compose pull && docker-compose up -d"
