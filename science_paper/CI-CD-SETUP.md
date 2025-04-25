# CI/CD Pipeline Setup Guide

This guide explains how to set up the CI/CD pipeline for the Science Paper project. The pipeline will:

1. Run the linter on every push and pull request
2. Build and push a Docker image to Docker Hub
3. Deploy the updated image to your remote server

## Prerequisites

- A GitHub repository for your project
- A Docker Hub account
- A remote server with Docker and Docker Compose installed

## Step 1: Configure GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Add the following secrets:

| Secret Name | Description |
|-------------|-------------|
| `DOCKER_USERNAME` | Your Docker Hub username |
| `DOCKER_PASSWORD` | Your Docker Hub access token (not your password) |
| `SSH_HOST` | Your server's hostname or IP address |
| `SSH_USERNAME` | The username for SSH access to your server |
| `SSH_PRIVATE_KEY` | The private SSH key for connecting to your server (if using key-based auth) |
| `SSH_PASSWORD` | Your SSH password (if using password-based auth) |

## Step 2: Set Up Docker Hub

1. Create a Docker Hub account if you don't have one
2. Create a repository named `science_paper`
3. Generate an access token:
   - Go to Account Settings > Security
   - Click "New Access Token"
   - Give it a name like "GitHub Actions"
   - Choose "Read & Write" permissions
   - Copy the token and save it as the `DOCKER_PASSWORD` secret in GitHub

## Step 3: Prepare Your Server

### Option A: Using the Automated Setup Script

We've provided a server setup script that automates most of the process:

1. Copy the `server-setup.sh` script to your server
2. Make it executable:
   ```bash
   chmod +x server-setup.sh
   ```
3. Run the script (may require sudo):
   ```bash
   sudo ./server-setup.sh
   ```
4. Follow the instructions at the end of the script

### Option B: Manual Setup

If you prefer to set up manually:

1. Install Docker and Docker Compose if not already installed
2. Create a directory for your application:
   ```bash
   mkdir -p /path/to/your/app
   ```
3. Copy the `server-docker-compose.yml` file to your server as `docker-compose.yml`:
   ```bash
   scp server-docker-compose.yml user@your-server:/path/to/your/app/docker-compose.yml
   ```
4. Edit the file to replace `${DOCKER_USERNAME}` with your actual Docker Hub username

## Step 4: Configure SSH Access

### Password-Based Authentication

1. Make sure your server allows password authentication in the SSH configuration
   - Check the `/etc/ssh/sshd_config` file for `PasswordAuthentication yes`
   - If you made changes, restart the SSH service: `sudo systemctl restart sshd`

2. Add your SSH password as the `SSH_PASSWORD` secret in GitHub:
   - Go to your GitHub repository
   - Click on "Settings" > "Secrets and variables" > "Actions"
   - Add a new secret named `SSH_PASSWORD` with your SSH password

The workflow file is already configured to use password authentication by default.

### Alternative: Key-Based Authentication

If you prefer to use key-based authentication instead:

1. Generate an SSH key pair:
   ```bash
   ssh-keygen -t ed25519 -C "github-actions"
   ```

2. Add the public key to your server's `~/.ssh/authorized_keys` file:
   ```bash
   cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
   ```

3. Add the private key as the `SSH_PRIVATE_KEY` secret in GitHub

4. Modify the GitHub workflow file to use key-based authentication:
   - Comment out the `password` line
   - Uncomment the `key` line

## Step 5: Update the Workflow File Path

In the `.github/workflows/ci-cd.yml` file, update the path in the deploy step to match your server's directory:

```yaml
script: |
  cd /path/to/your/app  # Update this path
  docker-compose pull
  docker-compose down
  docker-compose up -d
```

## Step 6: Test the Pipeline

1. Commit and push your changes to the main branch
2. Go to the "Actions" tab in your GitHub repository to monitor the workflow
3. Check your server to verify the deployment

## Troubleshooting

- **Linting Fails**: Check the error messages in the GitHub Actions logs and fix any linting issues
- **Docker Build Fails**: Verify your Dockerfile is correct and that you have the necessary permissions in Docker Hub
- **Deployment Fails**: Check your SSH credentials and ensure Docker is running on your server

## Security Considerations

- Use Docker Hub access tokens instead of your account password
- Consider using SSH keys instead of passwords for better security
- Regularly rotate your credentials and tokens
- Use specific Docker image tags in production rather than `latest`
