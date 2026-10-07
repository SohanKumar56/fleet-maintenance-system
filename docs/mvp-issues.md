# MVP GitHub Issues

The following GitHub Issues should be created for the Fleet Maintenance Management System MVP:

## 1. MVP-01: Implement User Login
**Description**: Implement authentication system allowing users to log in with username/password.
**Acceptance Criteria**:
- Users can enter username and password
- System validates credentials against database
- Successful login redirects to appropriate dashboard
- Failed login shows error message
- Session management implemented

## 2. MVP-02: Implement Role-Based Access Control
**Description**: Implement role-based access control system for three user types.
**Acceptance Criteria**:
- System recognizes Fleet Manager, Driver, and Mechanic roles
- Role-specific menus and features displayed
- Unauthorized access attempts blocked
- Role permissions enforced on all endpoints

## 3. MVP-03: Implement Logout and Session Handling
**Description**: Implement secure logout functionality and session management.
**Acceptance Criteria**:
- Users can logout from any page
- Session expires after inactivity
- Logout clears user session completely
- Redirect to login page after logout

## 4. MVP-04: Add Fleet Vehicle
**Description**: Fleet Manager can add new vehicles to the system.
**Acceptance Criteria**:
- Form to input vehicle details (make, model, year, VIN, license plate)
- Vehicle data validation
- Vehicle successfully saved to database
- Confirmation message displayed
- Vehicle appears in vehicle list

## 5. MVP-05: View and Search Vehicle List
**Description**: Display paginated list of vehicles with search functionality.
**Acceptance Criteria**:
- All vehicles displayed in paginated list
- Search by make, model, license plate, or VIN
- Sort by different columns
- Vehicle status indicators (active/inactive)
- Click vehicle to view details

## 6. MVP-06: Edit/Deactivate Vehicle
**Description**: Fleet Manager can modify vehicle information or deactivate vehicles.
**Acceptance Criteria**:
- Edit vehicle details form
- Update vehicle information in database
- Deactivate vehicle (soft delete)
- Confirmation dialogs for destructive actions
- Changes reflected in vehicle list

## 7. MVP-07: Assign Vehicle to Driver
**Description**: Fleet Manager can assign vehicles to drivers.
**Acceptance Criteria**:
- Select vehicle from list
- Choose driver from dropdown
- Assignment saved to database
- Driver notified of assignment
- Assignment visible in vehicle details

## 8. MVP-08: View Assigned Vehicle
**Description**: Driver can view their assigned vehicle details.
**Acceptance Criteria**:
- Driver sees only their assigned vehicle
- Vehicle details and maintenance history displayed
- Current maintenance requests shown
- Option to create new maintenance request

## 9. MVP-09: Create Maintenance Request
**Description**: Driver can create maintenance requests for their assigned vehicle.
**Acceptance Criteria**:
- Form with issue description and priority level
- Request submitted with PENDING status
- Request visible in driver's request list
- Manager notified of new request

## 10. MVP-10: Track Request Status
**Description**: Driver can view status of their maintenance requests.
**Acceptance Criteria**:
- List of all driver's maintenance requests
- Status indicators (PENDING, ASSIGNED, IN_PROGRESS, COMPLETED)
- Request details and progress updates
- Estimated completion time if available

## 11. MVP-11: Review Maintenance Requests
**Description**: Fleet Manager can review and manage maintenance requests.
**Acceptance Criteria**:
- List of all maintenance requests across fleet
- Filter by status, vehicle, or date
- View request details and history
- Option to assign mechanic to request

## 12. MVP-12: Assign Mechanic to Request
**Description**: Fleet Manager can assign mechanics to maintenance requests.
**Acceptance Criteria**:
- Select mechanic from available list
- Assignment updates request status to ASSIGNED
- Mechanic notified of assignment
- Assignment visible in request details

## 13. MVP-13: View Assigned Jobs and Details
**Description**: Mechanic can view jobs assigned to them.
**Acceptance Criteria**:
- List of assigned maintenance jobs
- Job details including vehicle info and issue description
- Ability to view vehicle history
- Option to update job progress

## 14. MVP-14: Update Progress and Complete Job
**Description**: Mechanic can update job progress and mark jobs complete.
**Acceptance Criteria**:
- Update job status to IN_PROGRESS
- Add progress notes and time estimates
- Upload photos or documents if needed
- Mark job as COMPLETED with final notes

## 15. MVP-15: Implement Maintenance History and Dashboard
**Description**: Comprehensive dashboard showing maintenance history and system overview.
**Acceptance Criteria**:
- Vehicle maintenance history timeline
- Summary statistics and KPIs
- Recent activity feed
- Quick access to common actions
- Role-appropriate dashboard content

---

**Note**: These issues should be created in the GitHub repository during Task 4 implementation. Each issue should be labeled appropriately (e.g., `enhancement`, `MVP`, `frontend`, `backend`) and assigned to appropriate milestones.