# GitHub Repository Setup Instructions

## Manual Steps Required

After completing the local repository initialization, perform these steps in GitHub:

### 1. Create GitHub Repository
1. Go to GitHub.com and sign in
2. Click "New repository" or go to https://github.com/new
3. Repository name: `fleet-maintenance-system`
4. Description: "Dockerized Fleet Maintenance Management System for OptiWheels Logistics"
5. Set to Public or Private (as per course requirements)
6. **DO NOT** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 2. Connect Local Repository to GitHub
Run these commands in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/fleet-maintenance-system.git
git push -u origin main
git push -u origin development
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### 3. Set Development Branch as Default (Optional)
1. Go to repository Settings > Branches
2. Change default branch from `main` to `development`
3. This allows feature branches to target `development` by default

### 4. Create GitHub Issues
Create the following 15 MVP issues (copy from docs/mvp-issues.md):

1. **MVP-01**: Implement User Login
2. **MVP-02**: Implement Role-Based Access Control  
3. **MVP-03**: Implement Logout and Session Handling
4. **MVP-04**: Add Fleet Vehicle
5. **MVP-05**: View and Search Vehicle List
6. **MVP-06**: Edit/Deactivate Vehicle
7. **MVP-07**: Assign Vehicle to Driver
8. **MVP-08**: View Assigned Vehicle
9. **MVP-09**: Create Maintenance Request
10. **MVP-10**: Track Request Status
11. **MVP-11**: Review Maintenance Requests
12. **MVP-12**: Assign Mechanic to Request
13. **MVP-13**: View Assigned Jobs and Details
14. **MVP-14**: Update Progress and Complete Job
15. **MVP-15**: Implement Maintenance History and Dashboard

For each issue:
- Use the title format: `MVP-XX: [Feature Name]`
- Add description and acceptance criteria from mvp-issues.md
- Add labels: `enhancement`, `MVP`
- Assign to appropriate milestone (e.g., "Sprint 1", "MVP Release")

### 5. Configure Branch Protection (Recommended)
1. Go to Settings > Branches
2. Add rule for `main` branch:
   - Require pull request reviews before merging
   - Require status checks to pass
   - Restrict pushes to `main`
3. Add rule for `development` branch (optional):
   - Require pull request reviews before merging

### 6. Create Project Board (Optional)
1. Go to Projects tab
2. Create new project: "Fleet Maintenance System Development"
3. Add columns: "Backlog", "To Do", "In Progress", "Review", "Done"
4. Link created issues to project board

### 7. Add Collaborators (If Team Project)
1. Go to Settings > Manage access
2. Click "Invite a collaborator"
3. Add team members with appropriate permissions

## Repository URLs
After setup, your repository will be available at:
- **HTTPS**: `https://github.com/YOUR_USERNAME/fleet-maintenance-system`
- **SSH**: `git@github.com:YOUR_USERNAME/fleet-maintenance-system.git`

## Verification Checklist
After completing GitHub setup:

- [ ] Repository created on GitHub
- [ ] Local repository connected to GitHub remote
- [ ] Both `main` and `development` branches pushed
- [ ] 15 MVP issues created with proper labels
- [ ] Branch protection rules configured (optional)
- [ ] Project board created and issues linked (optional)
- [ ] Team members added as collaborators (if applicable)

## Next Steps
- Task 5: Begin feature development using feature branches
- Create feature branches from `development`
- Submit pull requests to merge features into `development`
- Merge stable releases from `development` to `main`