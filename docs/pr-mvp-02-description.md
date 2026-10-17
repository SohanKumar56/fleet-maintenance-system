# PR: feat: MVP-02 Fleet Maintenance MVP (backend + frontend)

**Base**: development  
**Head**: feature/mvp-02-fleet-maintenance

## Summary
Implements the complete OptiWheels Fleet Maintenance Management System MVP including vehicle management, maintenance workflow, role-based authorization, dashboard, and full React UI.

## Linked Issues
Closes #4 (Add Fleet Vehicle)
Closes #5 (View and Search Vehicle List)
Closes #6 (Edit/Deactivate Vehicle)
Closes #9 (Create Maintenance Request)
Closes #10 (Track Request Status)
Closes #11 (Review Maintenance Requests)
Closes #12 (Assign Mechanic to Request)
Closes #13 (View Assigned Jobs and Details)
Closes #14 (Update Progress and Complete Job)
Closes #15 (Maintenance History and Dashboard)

## What Changed

### Backend
- Vehicle entity, VehicleStatus enum, VehicleRepository
- VehicleService + VehicleController (CRUD + search, MANAGER only for create/update)
- MaintenanceRecord entity, MaintenanceStatus/Type enums, MaintenanceRepository
- MaintenanceService with full workflow: OPEN→ASSIGNED→IN_PROGRESS→COMPLETED→CLOSED
- MaintenanceController with role-enforced workflow endpoints
- DashboardService + DashboardController (real DB counts)
- New exceptions: ResourceNotFoundException, ConflictException, InvalidTransitionException
- GlobalExceptionHandler extended to cover 403, 404, 409
- @EnableMethodSecurity added to SecurityConfig

### Frontend
- vehicleService.js, maintenanceService.js API clients
- shared.css (tables, badges, forms, stat cards)
- ManagerPage: Dashboard tab, Vehicles tab (CRUD+search), Maintenance tab (assign, close)
- DriverPage: My Reports tab, Report Issue form
- MechanicPage: Assigned jobs with Start/Complete buttons

### Tests
- VehicleServiceTest: 7 tests (create, duplicate, getAll, getById, notFound, update, search)
- MaintenanceServiceTest: 9 tests (create, assign, start, complete, close, invalid transitions)
- All 22 tests passing including existing Task 5 auth tests

## How to Test
1. Start backend: `cd backend && mvn spring-boot:run`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173

**Manager** (manager1/manager123): Dashboard → Vehicles → create a vehicle → Maintenance → see reports → assign mechanic  
**Driver** (driver1/driver123): Report Issue → select vehicle → submit → My Reports → see OPEN status  
**Mechanic** (mechanic1/mechanic123): My Jobs → Start Work → Complete

## Checklist
- [x] Vehicle CRUD implemented and working
- [x] Maintenance workflow enforced (invalid transitions rejected)
- [x] Role-based authorization enforced in backend (@PreAuthorize)
- [x] reportedBy set from JWT principal, not from client body
- [x] Dashboard returns real DB counts
- [x] 22 backend tests passing
- [x] Frontend builds without errors
- [x] No secrets committed
- [x] Task 5 login still working
