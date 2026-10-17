# Task 3: Requirements, Architecture and Technology Setup

**Dockerized Fleet Maintenance Management System**

*College DevOps Project*

**Project:** Dockerized Fleet Maintenance Management System  
**Case organization:** ABC Logistics & Transport (organization-owned fleet)  
**Source of truth:** Approved Task 1 (15 frozen MVP features) and Task 2 (user stories, backlog, 15 tasks, sprint plan, Definition of Done)

---

## 1. Task 3 Introduction

Tasks 1 and 2 defined what the system must do and how the work is planned. Task 3 defines how the system will be specified, structured, and set up. It covers:

* The software requirements
* The use cases
* A simple layered architecture
* The database design
* The REST API list
* The technology stack
* The local development environment

All content implements the same 15 approved MVP features (MVP-01 to MVP-15). No feature, role, or technology beyond the approved scope is added.

### How the Assignment's Minimum Architecture is Covered

| Assignment Requirement | Coverage in This Project |
| :--- | :--- |
| **Create records** | Add fleet vehicle (MVP-04); create maintenance request (MVP-09) |
| **View records** | Vehicle list, assigned vehicle, request lists, assigned jobs, maintenance history (MVP-05, 08, 10, 11, 13, 15) |
| **Update records** | Edit/deactivate vehicle, assign driver/mechanic, update job progress (MVP-06, 07, 12, 14) |
| **Search records** | Vehicle search/filter and request filters (MVP-05, 11) |
| **Role-based status workflow** | $\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$, restricted by role (MVP-02, 09, 12, 14) |
| **Summary dashboard** | Manager dashboard with request counts by status (MVP-15) |
| **Stack, build tool, DB, Tomcat/Nginx target, local setup** | Sections 9, 11, 15, and 16 |

---

## 2. Software Requirements Specification (SRS) Summary

| SRS Item | Summary |
| :--- | :--- |
| **Purpose** | Specify a web-based system that manages vehicle records and the full maintenance workflow of an organization-owned fleet. |
| **Scope** | 15 frozen MVP features for three roles: Fleet/Maintenance Manager, Driver/Vehicle Operator, Mechanic/Maintenance Technician. This is not a customer workshop system. |
| **Intended audience** | Course instructor/evaluator, project team, and future maintainers. |
| **Product perspective** | A standalone, simple layered full-stack web application (React frontend, Spring Boot REST backend, MySQL database). |
| **User classes** | Manager (full fleet and request control), Driver (reports and tracks own requests), Mechanic (executes assigned jobs). |
| **Operating environment** | Modern desktop web browser (for example Chrome); backend on JDK 17 or later; MySQL 8.x; Docker for packaging. |
| **Design constraints** | Technology stack and DevOps toolchain fixed in Task 1; no microservices; no Kubernetes. |
| **Assumptions** | User accounts for the three roles are pre-loaded sample data (no registration feature). One driver is assigned at most one vehicle, and one vehicle has at most one assigned driver. Data is test data only. |
| **Dependencies** | Stable network connection between browser, backend, and database; Java, Node.js, and MySQL available on the development machine. |
| **Out of scope** | AI/ChatGPT, predictive maintenance, IoT, GPS, fuel, payments, inventory, mobile applications, customer workshop features, microservices, Kubernetes. |

---

## 3. Functional Requirements

| FR ID | Requirement | MVP |
| :--- | :--- | :--- |
| **FR-01** | The system shall allow a registered user to log in with a username and password. | MVP-01 |
| **FR-02** | The system shall reject invalid credentials and empty fields with an error message. | MVP-01 |
| **FR-03** | The system shall restrict menus, pages, and REST endpoints according to the logged-in user's role, and redirect unauthenticated users to the login page. | MVP-02 |
| **FR-04** | The system shall allow a user to log out and shall clear the session/token so that protected pages become inaccessible. | MVP-03 |
| **FR-05** | The system shall allow the Manager to add a fleet vehicle (registration number, type, make/model, year, status) with mandatory-field validation. | MVP-04 |
| **FR-06** | The system shall reject a vehicle whose registration number already exists. | MVP-04 |
| **FR-07** | The system shall list fleet vehicles and allow search/filter by registration number or type. | MVP-05 |
| **FR-08** | The system shall allow the Manager to edit vehicle details. | MVP-06 |
| **FR-09** | The system shall allow the Manager to deactivate a vehicle; a deactivated vehicle cannot be assigned or used for new requests, and its maintenance history is retained. | MVP-06 |
| **FR-10** | The system shall allow the Manager to assign an active vehicle to a driver. | MVP-07 |
| **FR-11** | The system shall allow a Driver to view the details of only their assigned vehicle. | MVP-08 |
| **FR-12** | The system shall allow a Driver to create a maintenance request (problem description, priority) for their assigned vehicle; the request is saved with status `PENDING` and a creation date. | MVP-09 |
| **FR-13** | The system shall allow a Driver to view the list and current status of only their own requests. | MVP-10 |
| **FR-14** | The system shall allow the Manager to view all requests and filter them by status and priority. | MVP-11 |
| **FR-15** | The system shall allow the Manager to assign a mechanic to a `PENDING` request, changing its status to `ASSIGNED`. | MVP-12 |
| **FR-16** | The system shall allow a Mechanic to view only the jobs assigned to them, with vehicle and problem details. | MVP-13 |
| **FR-17** | The system shall allow the assigned Mechanic to change a job from `ASSIGNED` to `IN_PROGRESS`. | MVP-14 |
| **FR-18** | The system shall allow the assigned Mechanic to add service notes to a job. | MVP-14 |
| **FR-19** | The system shall allow the assigned Mechanic to change a job from `IN_PROGRESS` to `COMPLETED` and shall record the completion date. | MVP-14 |
| **FR-20** | The system shall enforce the status workflow $\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$ and reject any other transition. | MVP-09, 12, 14 |
| **FR-21** | The system shall show per-vehicle maintenance history (completed requests with date, mechanic, and service notes) to the Manager for any vehicle and to a Driver for their assigned vehicle. | MVP-15 |
| **FR-22** | The system shall show the Manager a dashboard with request counts by status. | MVP-15 |

### 3.1 Business Rules

| BR ID | Rule |
| :--- | :--- |
| **BR-01** | Status moves only forward: $\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$. Skipping or reversing is rejected. |
| **BR-02** | A request can be created only by a Driver, only for the Driver's own assigned and active vehicle. |
| **BR-03** | Only a `PENDING` request can be assigned, and only to a user with the Mechanic role. |
| **BR-04** | Only the mechanic assigned to a request may start it, add notes, or complete it. |
| **BR-05** | A vehicle's registration number is unique. |
| **BR-06** | A deactivated vehicle cannot be assigned to a driver or used for new requests; its history is retained. |
| **BR-07** | A driver has at most one assigned vehicle, and a vehicle has at most one assigned driver. |
| **BR-08** | A `COMPLETED` request is a historical record and is not changed further. |

---

## 4. Non-Functional Requirements

| NFR ID | Category | Requirement |
| :--- | :--- | :--- |
| **NFR-01** | **Security** | Passwords are stored as hashes (never plain text); every protected API call requires authentication and a role check. |
| **NFR-02** | **Access control** | Role restrictions are enforced on the backend, not only hidden in the user interface. |
| **NFR-03** | **Performance** | Typical page loads and API responses complete in under 3 seconds in the demo environment. |
| **NFR-04** | **Usability** | A new user can complete their primary task (report, assign, or update a job) within 3 minutes without training; forms show clear validation messages. |
| **NFR-05** | **Reliability/Persistence** | All data is stored in MySQL and survives application restart. |
| **NFR-06** | **Data integrity** | Primary keys, foreign keys, and unique constraints protect data consistency. |
| **NFR-07** | **Maintainability** | Code follows the layered structure (controller, service, repository) with clear package separation. |
| **NFR-08** | **Portability** | The application runs on Windows, Linux, or macOS for development and runs in Docker containers for deployment. |
| **NFR-09** | **Testability** | Key screens use stable element identifiers so core workflows can be tested with Selenium WebDriver and JUnit. |
| **NFR-10** | **Deployability** | The system can be built with Maven and started through one documented procedure. |
| **NFR-11** | **Compatibility** | Works on current versions of mainstream desktop browsers (primarily Chrome). |
| **NFR-12** | **Simplicity** | Single backend application; no microservices, no Kubernetes, no unnecessary middleware. |

---

## 5. Role-Based Requirements

### 5.1 Role Summary

| Role | Can Do | Cannot Do |
| :--- | :--- | :--- |
| **Fleet / Maintenance Manager** | Manage vehicles (add, search, edit, deactivate), assign vehicles to drivers, review all requests, assign mechanics, view any vehicle's history, view dashboard. | Create requests, or change job progress (start, notes, complete). |
| **Driver / Vehicle Operator** | View assigned vehicle, create requests for it, track own requests, view history of the assigned vehicle. | Manage vehicles, see other drivers' requests, assign mechanics, update job progress. |
| **Mechanic / Maintenance Technician** | View assigned jobs and details, start job, add service notes, complete job. | Manage vehicles, create or assign requests, see jobs assigned to others, view dashboard. |

### 5.2 Permission Matrix

| MVP | Feature | Manager | Driver | Mechanic |
| :--- | :--- | :---: | :---: | :---: |
| **MVP-01** | Login | Yes | Yes | Yes |
| **MVP-02** | Role-based access control | Yes | Yes | Yes |
| **MVP-03** | Logout | Yes | Yes | Yes |
| **MVP-04** | Add fleet vehicle | Yes | – | – |
| **MVP-05** | View/search vehicle list | Yes | – | – |
| **MVP-06** | Edit/deactivate vehicle | Yes | – | – |
| **MVP-07** | Assign vehicle to driver | Yes | – | – |
| **MVP-08** | View assigned vehicle | – | Yes | – |
| **MVP-09** | Create maintenance request | – | Yes | – |
| **MVP-10** | Track request status | – | Yes (own) | – |
| **MVP-11** | Review maintenance requests | Yes (all) | – | – |
| **MVP-12** | Assign mechanic | Yes | – | – |
| **MVP-13** | View assigned jobs | – | – | Yes (own) |
| **MVP-14** | Update progress/complete job | – | – | Yes (assigned) |
| **MVP-15** | History and dashboard | Yes (any vehicle, dashboard) | Yes (assigned vehicle history) | – |

### 5.3 Role-Based Status Workflow

| Transition | Allowed Role | Condition |
| :--- | :--- | :--- |
| $(\text{new}) \longrightarrow \text{PENDING}$ | Driver | Own assigned, active vehicle |
| $\text{PENDING} \longrightarrow \text{ASSIGNED}$ | Manager | Valid mechanic selected |
| $\text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS}$ | Assigned Mechanic | Request currently `ASSIGNED` |
| $\text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$ | Assigned Mechanic | Request currently `IN_PROGRESS`; completion date recorded |

---

## 6. System Features

| SF ID | System Feature | Description | MVP Features | Roles |
| :--- | :--- | :--- | :--- | :--- |
| **SF-01** | **Authentication & Access Control** | Login, logout, and role-based restriction of pages and APIs. | MVP-01, 02, 03 | All |
| **SF-02** | **Fleet Vehicle Management** | Add, list/search, edit/deactivate vehicles and assign them to drivers. | MVP-04, 05, 06, 07 | Manager |
| **SF-03** | **Maintenance Request Management** | Driver views assigned vehicle, creates and tracks requests; Manager reviews requests. | MVP-08, 09, 10, 11 | Driver, Manager |
| **SF-04** | **Assignment & Repair Execution** | Manager assigns mechanic; mechanic views jobs, updates progress, adds notes, and completes the job. | MVP-12, 13, 14 | Manager, Mechanic |
| **SF-05** | **History and Dashboard** | Per-vehicle maintenance history and manager status dashboard. | MVP-15 | Manager, Driver |

---

## 7. Use Cases

**Actors:** Fleet/Maintenance Manager, Driver/Vehicle Operator, Mechanic/Maintenance Technician.

| UC ID | Use Case | Actor | MVP | Precondition | Main Flow | Postcondition |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **UC-01** | Log in | All roles | MVP-01 | User account exists | User enters credentials; system validates and opens the role's home page. | Authenticated session/token created. |
| **UC-02** | Enforce role-based access | All roles (system) | MVP-02 | User authenticated | System checks role on every page/API request and allows or denies access. | Only permitted actions are available. |
| **UC-03** | Log out | All roles | MVP-03 | User logged in | User selects Logout; system clears session/token and shows login page. | Protected pages inaccessible. |
| **UC-04** | Add fleet vehicle | Manager | MVP-04 | Manager logged in | Manager enters vehicle details; system validates and saves. | Vehicle stored in fleet record. |
| **UC-05** | View and search vehicle list | Manager | MVP-05 | Manager logged in | Manager opens list, searches or filters by registration number/type. | Matching vehicles displayed. |
| **UC-06** | Edit / deactivate vehicle | Manager | MVP-06 | Vehicle exists | Manager edits details or deactivates the vehicle; system saves. | Vehicle data updated; inactive vehicle not selectable. |
| **UC-07** | Assign vehicle to driver | Manager | MVP-07 | Active vehicle and driver exist | Manager selects vehicle and driver; system saves the link. | Driver has an assigned vehicle. |
| **UC-08** | View assigned vehicle | Driver | MVP-08 | Vehicle assigned | Driver opens "My Vehicle"; system shows vehicle details. | Vehicle confirmed by driver. |
| **UC-09** | Create maintenance request | Driver | MVP-09 | Driver has active assigned vehicle | Driver enters problem description and priority; system validates and saves. | Request stored with status `PENDING`. |
| **UC-10** | Track request status | Driver | MVP-10 | Driver logged in | Driver opens "My Requests"; system lists own requests with status. | Current status visible. |
| **UC-11** | Review maintenance requests | Manager | MVP-11 | Manager logged in | Manager views all requests and filters by status/priority. | Requests reviewed. |
| **UC-12** | Assign mechanic to request | Manager | MVP-12 | Request is `PENDING` | Manager selects a mechanic; system assigns. | Status `ASSIGNED`; mechanic responsible. |
| **UC-13** | View assigned jobs and details | Mechanic | MVP-13 | Mechanic logged in | Mechanic opens "My Jobs" and selects a job; system shows vehicle and problem details. | Job details visible. |
| **UC-14** | Update progress and complete job | Mechanic | MVP-14 | Job assigned to this mechanic | Mechanic starts job (`IN_PROGRESS`), adds service notes, marks `COMPLETED`; system saves each change. | Status, notes, and completion date stored. |
| **UC-15a** | View vehicle maintenance history | Manager, Driver | MVP-15 | Completed requests exist | User selects a vehicle (Driver: own vehicle); system lists completed maintenance with date, mechanic, and notes. | History displayed. |
| **UC-15b** | View manager dashboard | Manager | MVP-15 | Manager logged in | Manager opens dashboard; system shows request counts by status. | Operational summary displayed. |

> **Core Workflow (Main Success Scenario):**  
> $\text{UC-09 (Driver creates request)} \longrightarrow \text{UC-11 (Manager reviews)} \longrightarrow \text{UC-12 (Manager assigns mechanic)} \longrightarrow \text{UC-13 (Mechanic views job)} \longrightarrow \text{UC-14 (Mechanic starts, adds notes, completes)} \longrightarrow \text{UC-10 (Driver sees status)} \longrightarrow \text{UC-15a/15b (History and dashboard updated)}$.

---

## 8. Use-Case Diagram

```
                            +--------------------------------------------+
                            |    FLEET MAINTENANCE MANAGEMENT SYSTEM     |
                            +--------------------------------------------+
                            |                                            |
+--------------+    +-------| (UC-01  Log in)                            |
|  All users   |    +-------| (UC-02  Enforce role-based access)         |
|  (3 roles)   |----+-------| (UC-03  Log out)                           |
+--------------+            |                                            |
                            |                                            |
                    +-------| (UC-04  Add fleet vehicle)                 |
+--------------+    +-------| (UC-05  View and search vehicle list)      |
|    Fleet/    |    +-------| (UC-06  Edit / deactivate vehicle)         |
| Maintenance  |----+-------| (UC-07  Assign vehicle to driver)          |
|   Manager    |    +-------| (UC-11  Review maintenance requests)       |
+--------------+    +-------| (UC-12  Assign mechanic to request)        |
                    +-------| (UC-15b View manager dashboard)            |
                            |                                            |
+--------------+            |                                            |
|   Driver/    |    +-------| (UC-08  View assigned vehicle)             |
|   Vehicle    |----+-------| (UC-09  Create maintenance request)        |
|   Operator   |    +-------| (UC-10  Track request status)              |
+--------------+            |                                            |
                            |                                            |
+--------------+            |                                            |
|  Mechanic/   |    +-------| (UC-13  View assigned jobs and details)    |
| Maintenance  |----+-------| (UC-14  Update progress, complete job)     |
|  Technician  |            |                                            |
+--------------+            |                                            |
                            |                                            |
+--------------+            |                                            |
| Manager and  |    +-------| (UC-15a View vehicle maintenance history)  |
|    Driver    |----+       |                                            |
+--------------+            |                                            |
                            |                                            |
                            +--------------------------------------------+
```

*Notes for the UML version: UC-02 is applied to every other use case (draw it as an `«include»` relationship from UC-04 to UC-15b). UC-15a is shared by the Manager and the Driver, so draw one association from each actor.*

---

## 9. System Architecture

### 9.1 Architectural Style

The system is a simple layered, three-tier web application: a React frontend, one Spring Boot backend, and one MySQL database. It is a single deployable backend (a modular monolith), with no microservices.

| Layer | Responsibility |
| :--- | :--- |
| **Presentation (React.js)** | Pages, forms, and tables; role-aware menus and routes; sends REST requests and displays JSON responses. |
| **REST Controller layer (Spring Boot)** | Exposes the REST endpoints, validates input, and maps requests and responses. |
| **Service layer** | Holds the business rules (status workflow, ownership checks, unique registration, dashboard counts). |
| **Repository / Data Access layer** | Reads and writes data through Spring Data JPA repositories. |
| **Database (MySQL)** | Stores users, vehicles, maintenance requests, and service notes with key constraints. |
| **Security (cross-cutting)** | A Spring Security filter authenticates each request and checks the user's role before it reaches a controller. |

### 9.2 Component Interaction

1. The user opens the React application in a browser and logs in.
2. React sends `POST /api/auth/login`; the backend validates credentials and returns an authentication token and the user's role.
3. React stores the token, builds the menu for that role, and sends it with every later REST call.
4. For each call, the security filter verifies the token and role. A permitted request reaches the controller, which validates input and calls the service.
5. The service applies business rules, then uses the repository to read or write MySQL.
6. The result returns through the same layers as JSON, and React updates the screen.

*Example (Assigning a Mechanic - UC-12):* The Manager's browser sends `PUT /api/maintenance-requests/{id}/assign`. The filter confirms the role is Manager. The controller passes the request to the service, which checks that the request is `PENDING` and the selected user is a mechanic. The repository saves `ASSIGNED` and the mechanic ID, and the response returns the updated request.

### 9.3 Deployment Approach (Tomcat/Nginx Requirement)

The assignment mentions a Tomcat/Nginx target. Spring Boot already contains an embedded Apache Tomcat server, so the backend is packaged as a single executable JAR and does not need a separately installed Tomcat or a WAR deployment. This keeps deployment as simple as possible.

| Component | Deployment Target | Relation to the Assignment |
| :--- | :--- | :--- |
| **Spring Boot backend** | Executable JAR running on embedded Tomcat (port 8080) | Satisfies the Tomcat requirement without extra setup. |
| **React frontend** | Production build (static files) served by Nginx in the frontend container | Satisfies the Nginx requirement; Nginx forwards `/api` calls to the backend, which avoids cross-origin configuration. |
| **MySQL** | MySQL container with a data volume | Persistent database. |

During local development, the React development server and the Spring Boot application run separately (Section 15). For deployment (later tasks), the three components run as three Docker containers. A simpler fallback, if needed, is to copy the React build into the Spring Boot static resources and serve everything from embedded Tomcat, which gives two containers instead of three.

---

## 10. Architecture Diagram

```
+------------------------------------------------------------------------+
| USER'S WEB BROWSER                                                     |
| Fleet/Maintenance Manager | Driver/Vehicle Operator | Mechanic         |
+------------------------------------------------------------------------+
                                    |
                                    | HTTP (HTML, JS, CSS)
                                    v
+------------------------------------------------------------------------+
| LAYER 1 - PRESENTATION: React.js frontend (single-page app)            |
| Pages: Login | Vehicles | Requests | My Jobs | History | Dashboard     |
| Role-aware menus and routes; calls the backend through REST            |
+------------------------------------------------------------------------+
                                    |
                                    | REST API calls (JSON + authentication token)
                                    v
+------------------------------------------------------------------------+
| SPRING BOOT BACKEND (one application, one executable JAR)              |
|                                                                        |
| Security filter: checks token and role before each request             |
|                                                                        |
| LAYER 2 - REST CONTROLLERS                                             |
|    receive requests, validate input, return JSON                       |
|         |                                                              |
|         v                                                              |
| LAYER 3 - SERVICE LAYER                                                |
|    business rules, status workflow, ownership checks, dashboard counts |
|         |                                                              |
|         v                                                              |
| LAYER 4 - REPOSITORY LAYER                                             |
|    data access through Spring Data JPA entities and repositories       |
+------------------------------------------------------------------------+
                                    |
                                    | JDBC (SQL)
                                    v
+------------------------------------------------------------------------+
| LAYER 5 - DATABASE: MySQL                                              |
| users | vehicles | maintenance_requests | service_notes                |
+------------------------------------------------------------------------+
```

### Deployment View (used in later tasks)

```
Docker host (test server or developer machine)
+--------------------------------------------------------------------+
|  [frontend container]     [backend container]    [mysql container] |
|  Nginx + React build ---> Spring Boot JAR  --->  MySQL 8.x         |
|  (static files)  /api     (embedded Tomcat)      + data volume     |
|  port 80                  port 8080              port 3306         |
+--------------------------------------------------------------------+
        ^
        |  Browser (Manager / Driver / Mechanic)
```

---

## 11. Technology Stack and Justification

| Area | Technology | Why It Is Appropriate for This Project |
| :--- | :--- | :--- |
| **Frontend** | React.js | Component-based UI suits the role-specific pages and tables; large community and learning material; produces a static build that is easy to serve and containerize. Standard companions: React Router (page navigation) and a REST client (Axios or the browser fetch API). |
| **Backend** | Java + Spring Boot | Rapid REST API development with embedded Tomcat; built-in support for validation, security (role-based access) and database access; widely used in industry and well suited to a layered design. |
| **Database** | MySQL | Reliable, free relational database that fits the structured, related data (users, vehicles, requests, notes); supports primary/foreign keys and runs easily in Docker. |
| **Build tool** | Maven | Standard for Spring Boot; manages dependencies, builds the JAR, runs tests and is easy to call from Jenkins. |
| **API style** | REST API (JSON) | Simple, stateless and well understood; clean separation between the React frontend and the backend; easy to test. |
| **Testing** | Selenium WebDriver + JUnit | Automates real browser tests of the core workflows (login, request, assignment, completion); JUnit also covers backend unit/API tests; both run in Maven and Jenkins. |
| **Version control** | Git + GitHub | Tracks all work, supports feature branches and pull requests, and triggers the CI pipeline. |
| **CI/CD** | Jenkins | Automates build, test, packaging and deployment on every change; pipeline defined as a Jenkinsfile. |
| **Containerization** | Docker | Packages frontend, backend and database so the system runs identically on any machine; supports repeatable deployment. |
| **Configuration management** | Ansible | Prepares and configures the target host with repeatable playbooks; agentless and simple to learn. |

* **Supporting backend libraries (inside Spring Boot):** Spring Web (REST), Spring Data JPA (data access), Spring Security (authentication and roles), Bean Validation (input checks), MySQL JDBC driver.
* **Technologies deliberately not used:** Microservices, Kubernetes, message brokers, caching servers, AI/ChatGPT services, and mobile frameworks.

---

## 12. Database / Data Model

A simple relational schema of four tables, based only on the approved MVP. There is no separate roles table (the role is a column in `users`) and no separate history table (maintenance history is the set of `COMPLETED` requests, shown with their service notes).

### 12.1 Table: `users`

| Column | Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, auto-increment | User identifier |
| `full_name` | VARCHAR(100) | NOT NULL | Display name |
| `username` | VARCHAR(50) | UNIQUE, NOT NULL | Login name |
| `password_hash` | VARCHAR(255) | NOT NULL | Hashed password |
| `role` | VARCHAR(20) | NOT NULL | MANAGER, DRIVER, or MECHANIC |
| `created_at` | DATETIME | NOT NULL | Record creation time |

### 12.2 Table: `vehicles`

| Column | Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, auto-increment | Vehicle identifier |
| `registration_number` | VARCHAR(20) | UNIQUE, NOT NULL | Fleet registration number |
| `vehicle_type` | VARCHAR(20) | NOT NULL | TRUCK, VAN, CAR, or PICKUP |
| `make` | VARCHAR(50) | NOT NULL | Manufacturer |
| `model` | VARCHAR(50) | NOT NULL | Model name |
| `manufacture_year` | INT | NOT NULL | Year |
| `status` | VARCHAR(10) | NOT NULL | ACTIVE or INACTIVE |
| `assigned_driver_id` | BIGINT | FK $\rightarrow$ `users.id`, UNIQUE, NULL allowed | Driver this vehicle is assigned to |

### 12.3 Table: `maintenance_requests`

| Column | Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, auto-increment | Request identifier |
| `vehicle_id` | BIGINT | FK $\rightarrow$ `vehicles.id`, NOT NULL | Vehicle needing maintenance |
| `requested_by` | BIGINT | FK $\rightarrow$ `users.id`, NOT NULL | Driver who created the request |
| `assigned_mechanic_id` | BIGINT | FK $\rightarrow$ `users.id`, NULL allowed | Mechanic assigned (empty while `PENDING`) |
| `problem_description` | VARCHAR(500) | NOT NULL | Problem reported |
| `priority` | VARCHAR(10) | NOT NULL | LOW, MEDIUM, or HIGH |
| `status` | VARCHAR(15) | NOT NULL | `PENDING`, `ASSIGNED`, `IN_PROGRESS`, or `COMPLETED` |
| `created_at` | DATETIME | NOT NULL | Request creation time |
| `assigned_at` | DATETIME | NULL allowed | Time mechanic was assigned |
| `started_at` | DATETIME | NULL allowed | Time work started |
| `completed_at` | DATETIME | NULL allowed | Completion date/time |

### 12.4 Table: `service_notes`

| Column | Type | Key / Constraint | Description |
| :--- | :--- | :--- | :--- |
| `id` | BIGINT | PK, auto-increment | Note identifier |
| `request_id` | BIGINT | FK $\rightarrow$ `maintenance_requests.id`, NOT NULL | Request the note belongs to |
| `author_id` | BIGINT | FK $\rightarrow$ `users.id`, NOT NULL | Mechanic who wrote the note |
| `note_text` | VARCHAR(1000) | NOT NULL | Service/maintenance note |
| `created_at` | DATETIME | NOT NULL | Time note was added |

### 12.5 Keys and Indexes Summary

| Item | Definition |
| :--- | :--- |
| **Primary keys** | `id` in each of the four tables |
| **Foreign keys** | `vehicles.assigned_driver_id`, `maintenance_requests.vehicle_id`, `maintenance_requests.requested_by`, `maintenance_requests.assigned_mechanic_id`, `service_notes.request_id`, `service_notes.author_id` |
| **Unique constraints** | `users.username`, `vehicles.registration_number`, `vehicles.assigned_driver_id` |
| **Suggested indexes** | `maintenance_requests.status` (filters and dashboard counts), `maintenance_requests.vehicle_id` (history) |
| **Sample data** | Pre-loaded users for each role, a few vehicles, and sample requests for demonstration and testing |

---

## 13. Entity Relationships

| \# | Relationship | Cardinality | Implemented By |
| :---: | :--- | :--- | :--- |
| **1** | A driver (user) is assigned to a vehicle | One user : zero or one vehicle | `vehicles.assigned_driver_id` (unique) |
| **2** | A vehicle has maintenance requests | One vehicle : zero or many requests | `maintenance_requests.vehicle_id` |
| **3** | A driver (user) creates requests | One user : zero or many requests | `maintenance_requests.requested_by` |
| **4** | A mechanic (user) is assigned requests | One user : zero or many requests | `maintenance_requests.assigned_mechanic_id` |
| **5** | A request has service notes | One request : zero or many notes | `service_notes.request_id` |
| **6** | A mechanic (user) writes service notes | One user : zero or many notes | `service_notes.author_id` |

```
USERS (driver)     1 ---- 0..1  VEHICLES                via vehicles.assigned_driver_id
VEHICLES           1 ---- 0..*  MAINTENANCE_REQUESTS    via maintenance_requests.vehicle_id
USERS (driver)     1 ---- 0..*  MAINTENANCE_REQUESTS    via maintenance_requests.requested_by
USERS (mechanic)   1 ---- 0..*  MAINTENANCE_REQUESTS    via maintenance_requests.assigned_mechanic_id
MAINT._REQUESTS    1 ---- 0..*  SERVICE_NOTES           via service_notes.request_id
USERS (mechanic)   1 ---- 0..*  SERVICE_NOTES           via service_notes.author_id
```

* **Maintenance history is derived data:** All `maintenance_requests` of a vehicle with status `COMPLETED`, together with `completed_at`, the assigned mechanic, and the related `service_notes`.
* **The dashboard is derived data:** A count of `maintenance_requests` grouped by status.

---

## 14. REST API List

All endpoints use the base path `/api` and exchange JSON. Every endpoint except login requires authentication. Access is also enforced on the backend (NFR-02).

### 14.1 Authentication (MVP-01, 02, 03)

| Method | Endpoint | Purpose | Role / Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Validate credentials and return token and role | Public |
| `POST` | `/api/auth/logout` | End the session/token (the frontend also clears the stored token) | Any logged-in user |

### 14.2 Vehicles (MVP-04 to MVP-08)

| Method | Endpoint | Purpose | Role / Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/vehicles` | Add a fleet vehicle | Manager |
| `GET` | `/api/vehicles` | List vehicles; optional query parameters keyword (registration number) and type | Manager |
| `GET` | `/api/vehicles/{id}` | View one vehicle's details | Manager |
| `PUT` | `/api/vehicles/{id}` | Edit vehicle details | Manager |
| `PUT` | `/api/vehicles/{id}/deactivate` | Mark a vehicle `INACTIVE` | Manager |
| `PUT` | `/api/vehicles/{id}/assign-driver` | Assign the vehicle to a driver (driver id in request body) | Manager |
| `GET` | `/api/vehicles/my-vehicle` | View the vehicle assigned to the logged-in driver | Driver |

### 14.3 Maintenance Requests (MVP-09 to MVP-14)

| Method | Endpoint | Purpose | Role / Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/maintenance-requests` | Create a request for the driver's assigned vehicle (status `PENDING`) | Driver |
| `GET` | `/api/maintenance-requests/my` | List the driver's own requests with status | Driver |
| `GET` | `/api/maintenance-requests` | List all requests; optional filters status, priority | Manager |
| `GET` | `/api/maintenance-requests/assigned` | List jobs assigned to the logged-in mechanic | Mechanic |
| `GET` | `/api/maintenance-requests/{id}` | View request details with vehicle info and service notes | Manager; Driver (own); Mechanic (assigned) |
| `PUT` | `/api/maintenance-requests/{id}/assign` | Assign a mechanic (mechanic id in body); `PENDING` $\rightarrow$ `ASSIGNED` | Manager |
| `PUT` | `/api/maintenance-requests/{id}/status` | Change status to `IN_PROGRESS` or `COMPLETED` (new status in body) | Mechanic (assigned) |
| `POST` | `/api/maintenance-requests/{id}/notes` | Add a service note to the job | Mechanic (assigned) |

### 14.4 History, Dashboard and Lookup (MVP-15, supporting MVP-07 and MVP-12)

| Method | Endpoint | Purpose | Role / Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/vehicles/{id}/maintenance-history` | Completed requests of a vehicle with date, mechanic, and notes | Manager (any vehicle); Driver (own assigned vehicle) |
| `GET` | `/api/dashboard` | Request counts by status | Manager |
| `GET` | `/api/users?role=DRIVER` or `role=MECHANIC` | Supply driver and mechanic choices for the assignment screens (read-only lookup) | Manager |

### 14.5 Common Response Rules

| Situation | HTTP Status |
| :--- | :--- |
| Success (read/update) | `200 OK` |
| Resource created | `201 Created` |
| Invalid input or invalid status transition | `400 Bad Request` |
| Not logged in or invalid token | `401 Unauthorized` |
| Logged in but role/ownership not permitted | `403 Forbidden` |
| Record not found | `404 Not Found` |
| Duplicate registration number | `409 Conflict` |

---

## 15. Local Development Setup

### 15.1 Prerequisites

| Tool | Recommended Version | Purpose | Verify With |
| :--- | :--- | :--- | :--- |
| **JDK** | 17 or later (LTS) | Compile and run Spring Boot | `java -version` |
| **Maven** | 3.9 or later | Build backend and run tests | `mvn -v` |
| **Node.js + npm** | Current LTS (Node 20 or later) | Build and run React | `node -v`, `npm -v` |
| **MySQL** | 8.x | Application database | `mysql --version` |
| **Git** | 2.x | Version control | `git --version` |
| **IDE / Editor** | IntelliJ IDEA (Community), Eclipse/STS, or VS Code | Development | – |
| **Web Browser** | Current Chrome | Running and testing the UI | – |
| **Docker Desktop** | Current | Needed later for containerization tasks | `docker --version` |

### 15.2 Setup Steps (High Level)

1. **Install tools:** Install JDK, Maven, Node.js, MySQL, Git, and the IDE; run verification commands. Ensure `JAVA_HOME` points to the JDK.
2. **Setup database:** Start MySQL server and create an empty database (`fleet_maintenance`) and a dedicated user with access.
3. **Setup repository:** Create and clone the GitHub repository locally.
4. **Configure backend:** Create the Spring Boot project with Web, Data JPA, Security, Validation, and MySQL driver dependencies. Set DB parameters in configuration via environment variables.
5. **Run backend:** Execute `mvn spring-boot:run` from the backend directory. Verify it starts on port 8080.
6. **Configure frontend:** Create the React app in the frontend directory, run `npm install`, and configure the API base URL (`http://localhost:8080/api`).
7. **Run frontend:** Execute `npm run dev` or `npm start`. Open local address in browser (e.g., port 5173 or 3000).
8. **Load sample data:** Populate database with pre-configured users and initial vehicle entries.
9. **Verify auth:** Log in with sample accounts for each role to confirm functional navigation.

### 15.3 Default Ports

| Component | Port |
| :--- | :--- |
| **React development server** | 5173 (Vite) or 3000 |
| **Spring Boot (embedded Tomcat)** | 8080 |
| **MySQL** | 3306 |

### 15.4 Local Setup Verification Checklist

| \# | Check | Expected Result |
| :---: | :--- | :--- |
| **1** | Version CLI commands | All tools return version strings without errors. |
| **2** | MySQL Connection | Successful connection to `fleet_maintenance` database. |
| **3** | Backend Execution | Spring Boot starts on port 8080 and establishes DB connection. |
| **4** | Frontend Execution | React development server renders initial landing page. |
| **5** | API Reachability | Frontend successfully receives response from `http://localhost:8080/api`. |
| **6** | Git Status | Clean repository status ready for feature commits. |

---

## 16. Proposed Project Folder Structure

```text
fleet-maintenance-system/
|-- README.md
|-- .gitignore
|-- Jenkinsfile                      # pipeline definition (CI/CD)
|
|-- docs/                            # Task 1-3 documents and diagrams
|
|-- frontend/                        # React application
|   |-- package.json
|   |-- Dockerfile                   # build React, serve with Nginx
|   |-- nginx.conf                   # static files + /api forwarding
|   |-- public/
|   `-- src/
|       |-- pages/                   # Login, Vehicles, Requests, MyJobs, History, Dashboard
|       |-- components/              # tables, forms, navigation
|       |-- services/                # REST API calls
|       |-- context/                 # authentication / role state
|       `-- routes/                  # protected, role-based routes
|
|-- backend/                         # Spring Boot application
|   |-- pom.xml
|   |-- Dockerfile                   # run the packaged JAR
|   `-- src/
|       |-- main/
|       |   |-- java/com/abc/fleet/
|       |   |   |-- config/          # security and application configuration
|       |   |   |-- controller/      # REST controllers
|       |   |   |-- service/         # business logic
|       |   |   |-- repository/      # data access (Spring Data JPA)
|       |   |   |-- entity/          # User, Vehicle, MaintenanceRequest, ServiceNote
|       |   |   |-- dto/             # request/response objects
|       |   |   `-- exception/       # error handling
|       |   `-- resources/
|       |       |-- application.properties
|       |       `-- sample-data/     # schema and sample data scripts
|       `-- test/java/               # JUnit unit/API tests
|
|-- selenium-tests/                  # automated UI tests
|   |-- pom.xml
|   `-- src/test/java/
|       |-- pages/                   # page objects (Login, Vehicle, Request)
|       `-- tests/                   # workflow tests (login, request, assign, complete)
|
|-- docker/
|   |-- docker-compose.yml           # frontend + backend + MySQL containers
|   `-- .env.example                 # example environment variables
|
|-- jenkins/
|   `-- README.md                    # Jenkins setup notes, job configuration
|
`-- ansible/
    |-- inventory.ini                # target hosts
    |-- playbook.yml                 # install Docker, deploy containers
    `-- roles/                       # optional: docker, app-deploy
```

---

## 17. Requirements Traceability

| MVP | Feature | User Story | Functional Req. | Use Case | REST API | DB Tables | Plan Task |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **MVP-01** | User Login | US-01 | FR-01, 02 | UC-01 | `POST /api/auth/login` | `users` | T-01 |
| **MVP-02** | Role-Based Access Control | US-02 | FR-03 | UC-02 | All endpoints | `users` | T-02 |
| **MVP-03** | Logout & Session Handling | US-03 | FR-04 | UC-03 | `POST /api/auth/logout` | `users` | T-03 |
| **MVP-04** | Add Fleet Vehicle | US-04 | FR-05, 06 | UC-04 | `POST /api/vehicles` | `vehicles` | T-04 |
| **MVP-05** | View & Search Vehicles | US-05 | FR-07 | UC-05 | `GET /api/vehicles` | `vehicles` | T-05 |
| **MVP-06** | Edit/Deactivate Vehicle | US-06 | FR-08, 09 | UC-06 | `PUT /api/vehicles/{id}` | `vehicles` | T-06 |
| **MVP-07** | Assign Vehicle to Driver | US-07 | FR-10 | UC-07 | `PUT /api/vehicles/{id}/assign-driver` | `vehicles`, `users` | T-07 |
| **MVP-08** | View Assigned Vehicle | US-08 | FR-11 | UC-08 | `GET /api/vehicles/my-vehicle` | `vehicles` | T-08 |
| **MVP-09** | Create Request | US-09 | FR-12, 20 | UC-09 | `POST /api/maintenance-requests` | `maintenance_requests` | T-09 |
| **MVP-10** | Track Request Status | US-10 | FR-13 | UC-10 | `GET /api/maintenance-requests/my` | `maintenance_requests` | T-10 |
| **MVP-11** | Review Requests | US-11 | FR-14 | UC-11 | `GET /api/maintenance-requests` | `maintenance_requests` | T-11 |
| **MVP-12** | Assign Mechanic | US-12 | FR-15, 20 | UC-12 | `PUT /api/maintenance-requests/{id}/assign` | `maintenance_requests`, `users` | T-12 |
| **MVP-13** | View Assigned Jobs | US-13 | FR-16 | UC-13 | `GET /api/maintenance-requests/assigned` | `maintenance_requests` | T-13 |
| **MVP-14** | Update Progress & Complete | US-14 | FR-17, 18, 19, 20 | UC-14 | `PUT /api/maintenance-requests/{id}/status` | `maintenance_requests`, `service_notes` | T-14 |
| **MVP-15** | History & Dashboard | US-15a, 15b | FR-21, 22 | UC-15a, 15b | `GET /api/dashboard` | All tables | T-15 |

---

## 18. Task 3 Deliverables

| Required Deliverable | Where It Is Provided | Status |
| :--- | :--- | :--- |
| **SRS summary** | Sections 2–6 (SRS summary, requirements, permissions, features) | Completed |
| **Use-case diagram** | Sections 7–8 (use cases and text diagram) | Completed |
| **Architecture diagram** | Sections 9–10 (layered architecture, interaction, and diagrams) | Completed |
| **Data model / API list** | Sections 12–14 (tables, keys, relationships, and REST API list) | Completed |
| **Working local setup** | Sections 15–16 (environment prerequisites, steps, folder structure) | Defined |
| **Technology selection** | Sections 9.3 and 11 | Completed |
| **Traceability to Tasks 1 and 2** | Section 17 | Completed |

> **Summary:** The architecture, requirements, database, and API design implement exactly the 15 approved MVP features, the three roles, and the status workflow $\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$. The design uses a simple layered Spring Boot backend with embedded Tomcat, a React frontend served by Nginx, and a four-table MySQL database.