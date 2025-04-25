# Science Paper CI/CD Pipeline

This repository includes a complete CI/CD (Continuous Integration/Continuous Deployment) pipeline setup that:

1. **Runs the linter** on every push and pull request
2. **Builds and pushes** a Docker image to Docker Hub
3. **Deploys** the updated image to a remote server via SSH

## Quick Start

To set up the CI/CD pipeline:

1. Configure GitHub secrets (Docker Hub credentials, SSH details)
2. Prepare your server using the provided setup script
3. Push to your main branch to trigger the pipeline

## Files Included

- `.github/workflows/ci-cd.yml` - GitHub Actions workflow file
- `server-docker-compose.yml` - Docker Compose file for the server
- `server-setup.sh` - Script to prepare your server for deployment
- `CI-CD-SETUP.md` - Detailed setup instructions

## Authentication

The pipeline is configured to use **password-based SSH authentication** by default. If you prefer key-based authentication, instructions for switching are included in the setup guide.

## Detailed Setup Guide

For complete setup instructions, see [CI-CD-SETUP.md](CI-CD-SETUP.md).

## Security Considerations

- Use Docker Hub access tokens instead of your account password
- Consider using SSH keys instead of passwords for better security
- Regularly rotate your credentials and tokens
- Use specific Docker image tags in production rather than `latest`
