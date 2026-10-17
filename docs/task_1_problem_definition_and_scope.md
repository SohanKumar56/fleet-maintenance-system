# Task 1: Problem Definition and Scope
**Dockerized Fleet Maintenance Management System**  
*College DevOps Project*

---

## 1. Project Title
**Dockerized Fleet Maintenance Management System**

A web-based system for managing maintenance of an organization-owned fleet, built with React, Spring Boot, and MySQL, and delivered through a DevOps pipeline (Git, Jenkins, Selenium, Docker, Ansible).

**Case organization:** ABC Logistics & Transport, a hypothetical organization that owns and operates its own fleet of trucks, vans, cars, and pickups, and maintains it through an internal maintenance team.

---

## 2. Problem Definition / Problem Statement
ABC Logistics & Transport operates an organization-owned fleet that must stay roadworthy to meet delivery commitments. Maintenance is currently coordinated through phone calls, messages, paper forms, or spreadsheets. As a result:

* **Drivers** have no structured way to report vehicle problems.
* **Fleet managers** cannot see which requests are pending, who is working on them, or how long repairs are taking.
* **Mechanics** receive incomplete job information.
* **Past repair records** are scattered and hard to retrieve.

This causes delayed repairs, unassigned or forgotten requests, vehicle downtime, and weak accountability.

> **Problem Statement:** The organization lacks a centralized, role-based system to record fleet vehicles, report vehicle problems, assign repair work to internal mechanics, track repair progress, and retain maintenance history. A simple web application is needed to manage the complete maintenance workflow, from problem reporting to repair completion, for the organization-owned fleet.

---

## 3. Real-World Need
Organizations that run their own vehicles, such as logistics firms, courier companies, municipal departments, and corporate transport units, depend on vehicle availability. An unavailable vehicle delays deliveries and increases operating cost.

| Need | Explanation |
| :--- | :--- |
| **Timely problem reporting** | Faults must reach the maintenance team as soon as the driver notices them. |
| **Clear ownership of work** | Every request should have a responsible mechanic and a visible status. |
| **Visibility for management** | Managers need an at-a-glance view of open, in-progress, and completed work. |
| **Reliable maintenance records** | Past repairs help in reviewing recurring problems and planning work. |
| **Reduced manual effort** | Replacing calls, paper, and spreadsheets saves time and avoids lost information. |

*Scope clarification:* This is an internal fleet maintenance system for an organization that owns its vehicles. It is not a customer workshop or service-centre system. There are no external customers, billing, or appointment booking.

---

## 4. Target Users

| Role | Description | Main Activities |
| :--- | :--- | :--- |
| **Fleet / Maintenance Manager** | Oversees the organization-owned fleet and the maintenance team. | Manage vehicles, review requests, assign mechanics, monitor progress, view history and dashboard. |
| **Driver / Vehicle Operator** | Employee who operates an assigned fleet vehicle. | View assigned vehicle, report problems, create requests, track request status, view history. |
| **Mechanic / Maintenance Technician** | Internal technician who repairs fleet vehicles. | View assigned jobs and vehicle/problem details, update progress, add service notes, mark jobs completed. |

---

## 5. Stakeholders

| Stakeholder | Type | Interest in the System |
| :--- | :--- | :--- |
| **Fleet / Maintenance Manager** | Primary user | Control, visibility, and accountability over maintenance work. |
| **Drivers / Vehicle Operators** | Primary user | Easy reporting and status feedback on their vehicles. |
| **Mechanics / Technicians** | Primary user | Clear job details and a simple way to record work. |
| **Senior Management / Operations Head** | Indirect | Reduced downtime and better fleet availability. |
| **Organization IT / Administration** | Support | Deployment, hosting, and maintenance of the application. |
| **Project Team (Student Developer)** | Developer | Design, implement, test, and deploy the system. |
| **Course Instructor / Evaluator** | Academic | Assess the correctness, scope, and DevOps practices of the project. |

---

## 6. Pain Points / Problems with the Existing Process

| # | Pain Point | Impact |
| :-: | :--- | :--- |
| **1** | Problems are reported verbally, by phone, or by message, with no standard format. | Incomplete or lost information. |
| **2** | No central list of fleet vehicles and their details. | Difficulty identifying the correct vehicle and its history. |
| **3** | Requests are not formally reviewed or prioritized. | Urgent problems may be delayed. |
| **4** | Mechanic assignment is informal. | Unclear responsibility, duplicated or missed work. |
| **5** | Drivers cannot see the progress of their reports. | Repeated follow-up calls, frustration. |
| **6** | Mechanics lack a single place for job and vehicle details. | Time wasted collecting information. |
| **7** | Repair notes are on paper or not recorded. | No reliable maintenance history. |
| **8** | Managers have no summary of maintenance activity. | Poor planning and decision making. |
| **9** | Access is not role-controlled. | Risk of unauthorized changes to records. |

---

## 7. Project Objectives

**Primary Objective:** To develop a simple, role-based web application that manages the full maintenance lifecycle of an organization-owned fleet:  
$$\text{Vehicle Management} \longrightarrow \text{Maintenance Request} \longrightarrow \text{Assignment} \longrightarrow \text{Repair} \longrightarrow \text{Completion} \longrightarrow \text{History / Dashboard}$$

### Specific Objectives:
1. Provide secure, role-based login for the Manager, Driver, and Mechanic roles.
2. Maintain a central record of organization-owned fleet vehicles.
3. Allow drivers to raise maintenance requests for their assigned vehicles.
4. Enable the manager to review requests and assign mechanics.
5. Enforce the status workflow: $\text{PENDING} \longrightarrow \text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$ with role-appropriate actions.
6. Allow mechanics to update progress and record service notes.
7. Preserve a searchable maintenance history per vehicle.
8. Provide a summary dashboard for the manager.
9. Build the application using a DevOps workflow (Git/GitHub, Jenkins CI/CD, Selenium testing, Docker, Ansible).

---

## 8. Project Scope

### 8.1 In Scope
* Role-based authentication and authorization (Manager, Driver, Mechanic)
* Vehicle record management for the organization-owned fleet
* Driver-vehicle assignment
* Maintenance request creation, review, assignment, progress update, and completion
* Service notes and maintenance history
* Manager dashboard with summary counts
* REST API backend, React frontend, MySQL database
* Automated UI testing, CI/CD, and containerized deployment

### 8.2 Out of Scope
* Customer workshop or service-centre management (customers, appointments, billing)
* AI/ChatGPT features, predictive maintenance, IoT sensors
* GPS tracking and fuel management
* Payment processing and invoicing
* Spare-parts or inventory management
* Mobile applications
* Microservices, Kubernetes, Kafka, Redis, and other enterprise infrastructure

*Note: AI-based features may be considered only as a future enhancement, not as part of the core MVP.*

---

## 9. Project Constraints

| Category | Constraint |
| :--- | :--- |
| **Technology** | **Frontend:** React.js; **Backend:** Java + Spring Boot; **Database:** MySQL; **Build:** Maven; **API:** REST. |
| **DevOps toolchain** | Git/GitHub, Jenkins, Selenium WebDriver + JUnit, Docker, Ansible must be used. |
| **Architecture** | Simple modular full-stack application (no microservices). |
| **Time** | Must be completed within the academic schedule across 15 tasks. |
| **Team / Resources** | Student project with limited developers, hosting, and budget. |
| **Scope** | MVP is frozen at exactly 15 features. |
| **Users** | Three defined roles only. |
| **Data** | Test/sample data only; no real organizational data. |
| **Deployment** | Must run in a local or lab environment using Docker containers. |
| **Testability** | Features must be testable through browser automation (Selenium). |

---

## 10. Measurable Success Criteria

| # | Criterion | Target / Measure |
| :-: | :--- | :--- |
| **1** | **MVP feature completion** | All 15 MVP features implemented and demonstrable. |
| **2** | **Workflow correctness** | A request completes the full path $\text{PENDING} \rightarrow \text{ASSIGNED} \rightarrow \text{IN\_PROGRESS} \rightarrow \text{COMPLETED}$ without error. |
| **3** | **Role-based access** | 100% of restricted actions blocked for unauthorized roles (verified by test cases). |
| **4** | **Automated testing** | At least one Selenium test per core workflow; all pass in Jenkins. |
| **5** | **CI/CD** | Jenkins job builds, tests, and deploys on each commit to the main branch. |
| **6** | **Containerization** | Application starts with Docker using a single documented procedure. |
| **7** | **Performance (basic)** | Typical page loads and API responses complete in under 3 seconds on the demo environment. |
| **8** | **Data persistence** | All records survive application restart (stored in MySQL). |
| **9** | **Usability** | A new user can complete their primary task (report, assign, or update a job) in under 3 minutes without training. |
| **10** | **Traceability** | Every completed request appears in maintenance history with date, mechanic, and notes. |

---

## 11. Proposed MVP Scope

The following 15 application-level features are proposed. They cover the core workflow of vehicle management, maintenance request, assignment, repair, completion, and history/dashboard, using only React, Spring Boot, and MySQL.

| MVP ID | Feature | Description | Primary Role | Priority | Expected Outcome |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **MVP-01** | User Login | Users sign in with username and password. | All roles | High | Only registered users access the system. |
| **MVP-02** | Role-Based Access Control | Menus, pages, and APIs are restricted according to the logged-in role. | All roles | High | Each role sees and performs only its permitted actions. |
| **MVP-03** | Logout and Session Handling | Users can sign out; sessions/tokens are cleared securely. | All roles | Medium | Protected pages become inaccessible after logout. |
| **MVP-04** | Add Fleet Vehicle | Manager registers a vehicle (registration number, type, make/model, year, status). | Fleet Manager | High | New vehicle is stored in the fleet record. |
| **MVP-05** | View and Search Vehicle List | List of organization-owned vehicles with search/filter by registration number or type. | Fleet Manager | High | Manager quickly locates any fleet vehicle. |
| **MVP-06** | Edit / Deactivate Vehicle | Manager updates vehicle details or marks a vehicle inactive. | Fleet Manager | Medium | Vehicle data stays accurate; retired vehicles are no longer selectable. |
| **MVP-07** | Assign Vehicle to Driver | Manager links a fleet vehicle to a driver/operator. | Fleet Manager | High | Each driver has a defined assigned vehicle. |
| **MVP-08** | View Assigned Vehicle | Driver views the details of the vehicle assigned to them. | Driver | Medium | Driver confirms the correct vehicle before reporting. |
| **MVP-09** | Create Maintenance Request | Driver submits a request with problem description and priority for the assigned vehicle. | Driver | High | Request is saved with status `PENDING`. |
| **MVP-10** | Track Request Status | Driver views own requests and their current status. | Driver | High | Driver knows progress without calling the manager. |
| **MVP-11** | Review Maintenance Requests | Manager views all requests with filters by status and priority. | Fleet Manager | High | Manager sees all pending and active work. |
| **MVP-12** | Assign Mechanic to Request | Manager selects a mechanic for a pending request. | Fleet Manager | High | Status changes `PENDING` $\rightarrow$ `ASSIGNED`; mechanic is responsible. |
| **MVP-13** | View Assigned Jobs and Details | Mechanic views assigned jobs with vehicle and problem details. | Mechanic | High | Mechanic knows what to repair and on which vehicle. |
| **MVP-14** | Update Progress and Complete Job | Mechanic starts work (`ASSIGNED` $\rightarrow$ `IN_PROGRESS`), adds service notes, and marks the job `COMPLETED`. | Mechanic | High | Status and notes are updated; completion date recorded. |
| **MVP-15** | Maintenance History & Dashboard | Per-vehicle maintenance history (viewable by Manager and Driver) and manager dashboard with request counts by status. | Fleet Manager / Driver | High | Past repairs are traceable; manager gets a quick operational summary. |

### 11.1 Status Workflow Rules (MVP)

| Transition | Allowed Role |
| :--- | :--- |
| $(\text{new}) \longrightarrow \text{PENDING}$ | Driver |
| $\text{PENDING} \longrightarrow \text{ASSIGNED}$ | Fleet Manager |
| $\text{ASSIGNED} \longrightarrow \text{IN\_PROGRESS}$ | Assigned Mechanic |
| $\text{IN\_PROGRESS} \longrightarrow \text{COMPLETED}$ | Assigned Mechanic |

### 11.2 Workflow Coverage

| Workflow Stage | MVP Features |
| :--- | :--- |
| **Access and security** | MVP-01, MVP-02, MVP-03 |
| **Vehicle management** | MVP-04, MVP-05, MVP-06, MVP-07, MVP-08 |
| **Maintenance request** | MVP-09, MVP-10, MVP-11 |
| **Assignment** | MVP-12 |
| **Repair and completion** | MVP-13, MVP-14 |
| **History and dashboard** | MVP-15 |

---

## 12. Recommended MVP Freeze

The 15 features listed above are recommended as the frozen MVP scope for the following reasons:

* **Complete core workflow:** They cover every stage of the maintenance lifecycle for an organization-owned fleet (vehicle management, request, assignment, repair, completion, and history), ensuring the system is fully functional end to end.
* **All three roles are meaningfully served:** The Manager (7 features), Driver (4 features), and Mechanic (2 features) each have distinct responsibilities, and shared access features (3 features) secure the system. This allows role-based behavior to be demonstrated and tested effectively.
* **Realistic for a college project:** Each feature maps to simple CRUD operations, role checks, or status updates using React, Spring Boot, and MySQL, avoiding complex integrations.
* **Suitable for automated testing:** Features such as login, vehicle creation, request submission, mechanic assignment, and job completion represent clear, repeatable browser flows for Selenium WebDriver and JUnit.
* **Suitable for DevOps tasks:** The small, modular application can be built with Maven, verified in a Jenkins pipeline, packaged in Docker containers, and configured with Ansible without unnecessary infrastructure complexity.
* **Controlled scope:** Advanced items (AI, predictive maintenance, IoT, GPS, fuel, payments, inventory, mobile apps, microservices) are deliberately excluded to reduce risk and maintain the project timeline.

> **Freeze Decision:** The scope is fixed at these 15 MVP features. Any new idea will be recorded as a future enhancement and will not enter the current MVP unless formally approved.