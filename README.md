# Fleet Maintenance Management System

## Project Description

This system is designed for OptiWheels Logistics to manage its fleet vehicles and maintenance workflow efficiently. The system provides a comprehensive solution for vehicle management, maintenance request handling, and job assignment across three distinct user roles.

### User Roles
- **Fleet/Maintenance Manager**: Oversees vehicle fleet, reviews maintenance requests, and assigns mechanics
- **Driver/Vehicle Operator**: Creates maintenance requests for assigned vehicles
- **Mechanic/Maintenance Technician**: Receives job assignments and updates maintenance progress

### Workflow Process
```
Driver creates maintenance request
         ↓
Manager reviews request
         ↓
Manager assigns mechanic
         ↓
Mechanic starts job
         ↓
Mechanic completes job
         ↓
Maintenance history updated
```

### Request Status Flow
```
PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
```

## Technology Stack

- **Frontend**: React.js
- **Backend**: Java, Spring Boot, Maven
- **Database**: MySQL
- **API**: REST/JSON
- **Testing**: Selenium WebDriver, JUnit
- **Version Control**: Git/GitHub
- **CI/CD**: Jenkins
- **Containerization**: Docker
- **Web Server**: Nginx
- **Automation**: Ansible

## Prerequisites

- **Java 8+** (for backend)
- **Node.js 16+** and npm (for frontend)
- **MySQL 8.0+** (for database)
- **Maven 3.6+** (for building Java application)

## Database Setup

1. Install MySQL and start the service
2. Create the database (it will be created automatically by the application):
   ```sql
   -- The application will create the database automatically
   -- Database name: fleet_maintenance
   ```

## How to Run

### Backend (Spring Boot)
```bash
cd backend/
mvn spring-boot:run
```
The backend server will start on **http://localhost:8080**

### Frontend (React)
```bash
cd frontend/
npm install
npm run dev
```
The frontend will start on **http://localhost:5173**

## Demo Accounts

The system comes with three pre-configured demo accounts:

| Username  | Password    | Role      |
|-----------|-------------|-----------|
| manager1  | manager123  | MANAGER   |
| driver1   | driver123   | DRIVER    |
| mechanic1 | mechanic123 | MECHANIC  |

## Project Structure

```
fleet-maintenance-system/
├── README.md                    # Project documentation
├── .gitignore                   # Git ignore rules
├── Jenkinsfile                  # Jenkins pipeline configuration
├── docs/                        # Project documentation
│   ├── task-1-problem-definition.md
│   ├── task-2-agile-devops.md
│   └── task-3-requirements-architecture.md
├── frontend/                    # React.js application
├── backend/                     # Spring Boot application
├── selenium-tests/              # Automated UI tests
├── docker/                      # Docker configuration
│   ├── docker-compose.yml
│   └── .env.example
├── jenkins/                     # Jenkins configuration
└── ansible/                     # Ansible automation
    ├── inventory.ini
    ├── playbook.yml
    └── README.md
```

## Development Workflow

This project follows a Git branching strategy:

```
main
  ↑
development
  ↑
feature/<feature-name>
```

### Branch Strategy
- **main**: Production-ready stable releases
- **development**: Integration branch for testing features
- **feature/<feature-name>**: Individual feature development

### Workflow Steps
1. Create feature branch from `development`
2. Develop feature on feature branch
3. Create pull request to merge into `development`
4. Test and validate in `development`
5. Merge stable releases from `development` into `main`

### Feature Branch Naming Convention
- `feature/vehicle-management`
- `feature/maintenance-request`
- `feature/mechanic-assignment`
- `feature/dashboard`

## Current Status

- **Task 5**: ✅ MVP-01 User Login — Completed
- **Task 6**: ✅ Vehicle Management, Maintenance Workflow, Dashboard — Completed

## MVP-01 Implementation

### What's Implemented
- ✅ User authentication system with JWT tokens
- ✅ Role-based login (Manager, Driver, Mechanic)
- ✅ Password validation using BCrypt
- ✅ React frontend with role-based routing
- ✅ Protected routes and navigation
- ✅ Responsive login interface
- ✅ Demo user accounts with seeded data

### API Endpoints
- `POST /api/auth/login` - User authentication

## Getting Started

1. **Clone the repository**
2. **Set up MySQL database** (database will be created automatically)
3. **Start the backend**: `cd backend && mvn spring-boot:run`
4. **Start the frontend**: `cd frontend && npm install && npm run dev`
5. **Access the application** at http://localhost:5173
6. **Login** with one of the demo accounts

## Contributing

1. Clone the repository
2. Create a feature branch from `development`
3. Make your changes
4. Submit a pull request to `development`
5. Ensure all tests pass before merging

## License

This project is developed as part of a DevOps coursework for OptiWheels Logistics.