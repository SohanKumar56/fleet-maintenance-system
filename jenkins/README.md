# Jenkins CI/CD Configuration

This directory will contain Jenkins pipeline configuration and related scripts for continuous integration and deployment.

## Planned CI/CD Pipeline
- Source code checkout
- Backend build and test (Maven)
- Frontend build and test (npm)
- Selenium UI test execution
- Docker image building
- Automated deployment

## Pipeline Stages
1. **Build**: Compile backend and frontend
2. **Test**: Run unit tests and Selenium tests
3. **Package**: Create Docker images
4. **Deploy**: Deploy to staging/production environments

**Status**: Implementation pending - Task 8