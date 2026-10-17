# Task 2: Agile Planning and DevOps Workflow

**Dockerized Fleet Maintenance Management System**

*College DevOps Project*

**Project:** Dockerized Fleet Maintenance Management System  
**Case organization:** ABC Logistics & Transport (organization-owned fleet)  
**Source of truth:** Approved Task 1 documentation (15 frozen MVP features, MVP-01 to MVP-15)

---

## 1. Task 2 Introduction

Task 1 defined the problem and froze the MVP at 15 features. Task 2 turns that scope into an executable plan. It contains:

* User stories with acceptance criteria
* A product backlog
* A 15-task Kanban/Scrum plan
* A sprint plan
* A Definition of Done
* The DevOps lifecycle with its workflow diagram

**Alignment with Task 1.** The 15 MVP features are unchanged. Two clarifications were found while preparing this plan:

| # | Observation | Resolution |
| :-: | ----- | ----- |
| **1** | The role counts in Task 1, Section 12 (Manager 7, Driver 4, Mechanic 2, shared 3) add up to 16 because MVP-15 was counted for both Manager and Driver. | The corrected split is: All roles 3 (MVP-01 to 03), Manager 6 (MVP-04, 05, 06, 07, 11, 12), Driver 3 (MVP-08, 09, 10), Mechanic 2 (MVP-13, 14), shared Manager/Driver 1 (MVP-15). The feature list is unaffected. |
| **2** | Task 1 has no user-registration or user-management feature. | User accounts for the three roles are treated as pre-loaded sample data (test data constraint in Task 1). No new feature is added. |

---

## 2. Agile Development Approach

The project follows a lightweight Scrum with Kanban board (Scrumban) approach, sized for a small student team.

| Element | Approach |
| ----- | ----- |
| **Framework** | Scrum for time-boxed sprints and goals; Kanban board for visual task flow. |
| **Backlog** | One Product Backlog derived directly from the 15 approved MVP features. |
| **Sprints** | 4 development sprints (about 1 week each; extend to 2 weeks if the college calendar requires), preceded by a planning sprint (Sprint 0). |
| **Roles** | **Product Owner:** course requirement/instructor guidance. **Scrum Master & Developer:** student team. |
| **Ceremonies** | Sprint planning (short), brief daily self-check, sprint review/demo, short retrospective. |
| **Estimation** | Story points on a simple scale (1, 2, 3, 5). |
| **Work limits** | Work-in-progress (WIP) limit of 3 tasks on the board. |
| **Change control** | The 15-feature scope is frozen. New ideas go to a "Future Enhancements" list, not into the sprints. |
| **Version control** | Git/GitHub with `main` (stable), `develop` (integration), and `feature/mvp-xx-name` branches. |

**Why this approach suits the project:** Requirements are small and well defined, so short sprints with a visible board give clear progress without enterprise-level process overhead.

---

## 3. User Stories

### 3.1 Fleet / Maintenance Manager

| Story ID | MVP | User Story |
| :-: | :-: | ----- |
| **US-02** | MVP-02 | As a Fleet/Maintenance Manager, I want each role restricted to its permitted pages and actions, so that fleet and maintenance data cannot be changed by unauthorized users. |
| **US-04** | MVP-04 | As a Fleet/Maintenance Manager, I want to add a vehicle to the organization-owned fleet, so that every fleet vehicle has a central record. |
| **US-05** | MVP-05 | As a Fleet/Maintenance Manager, I want to view and search the fleet vehicle list, so that I can quickly find any vehicle. |
| **US-06** | MVP-06 | As a Fleet/Maintenance Manager, I want to edit or deactivate a vehicle, so that fleet data stays accurate and retired vehicles are not used. |
| **US-07** | MVP-07 | As a Fleet/Maintenance Manager, I want to assign a vehicle to a driver, so that each driver has a defined vehicle to operate and report on. |
| **US-11** | MVP-11 | As a Fleet/Maintenance Manager, I want to review all maintenance requests filtered by status and priority, so that I can see and prioritize pending work. |
| **US-12** | MVP-12 | As a Fleet/Maintenance Manager, I want to assign a mechanic to a pending request, so that every repair has a clear owner. |
| **US-15a** | MVP-15 | As a Fleet/Maintenance Manager, I want a dashboard and per-vehicle maintenance history, so that I can monitor maintenance activity and past repairs. |

### 3.2 Driver / Vehicle Operator

| Story ID | MVP | User Story |
| :-: | :-: | ----- |
| **US-08** | MVP-08 | As a Driver/Vehicle Operator, I want to view the vehicle assigned to me, so that I can confirm the correct vehicle before reporting a problem. |
| **US-09** | MVP-09 | As a Driver/Vehicle Operator, I want to create a maintenance request for my assigned vehicle, so that the maintenance team is informed of the problem. |
| **US-10** | MVP-10 | As a Driver/Vehicle Operator, I want to track the status of my requests, so that I know the progress without calling the manager. |
| **US-15b** | MVP-15 | As a Driver/Vehicle Operator, I want to view the maintenance history of my assigned vehicle, so that I know what repairs were done earlier. |

### 3.3 Mechanic / Maintenance Technician

| Story ID | MVP | User Story |
| :-: | :-: | ----- |
| **US-13** | MVP-13 | As a Mechanic/Maintenance Technician, I want to view my assigned jobs with vehicle and problem details, so that I know what to repair and on which vehicle. |
| **US-14** | MVP-14 | As a Mechanic/Maintenance Technician, I want to start a job, add service notes and mark it completed, so that the repair progress and outcome are recorded accurately. |

### 3.4 Common Access Stories (all roles)

| Story ID | MVP | User Story |
| :-: | :-: | ----- |
| **US-01** | MVP-01 | As a registered user (Manager, Driver, or Mechanic), I want to log in with my username and password, so that I can securely access the features meant for my role. |
| **US-03** | MVP-03 | As a registered user (Manager, Driver, or Mechanic), I want to log out, so that my session ends and others cannot use my account. |

---

## 4. Acceptance Criteria

Criteria use a simple **Given / When / Then** style so they can later be turned into Selenium test cases.

### US-01 Login (MVP-01)
* **Given** valid credentials, **when** the user submits the login form, **then** the user is taken to the home page of their role.
* **Given** invalid credentials, **when** the form is submitted, **then** an error message is shown and access is denied.
* Empty username or password is rejected with a validation message.

### US-02 Role-Based Access Control (MVP-02)
* A Manager sees only manager menus; a Driver only driver menus; a Mechanic only mechanic menus.
* **When** a user opens a page or API for another role, the system denies access (access-denied message or redirect).
* An unauthenticated user is redirected to the login page.

### US-03 Logout (MVP-03)
* **When** the user clicks Logout, the session or token is cleared and the login page is shown.
* After logout, the browser back button or a direct URL does not display protected data.

### US-04 Add Fleet Vehicle (MVP-04)
* **Given** the Manager enters registration number, type, make/model, year, and status, **when** the form is saved, **then** the vehicle appears in the fleet list.
* Mandatory fields cannot be empty.
* A duplicate registration number is rejected.

### US-05 View and Search Vehicle List (MVP-05)
* The list shows all fleet vehicles with key details.
* Searching by registration number or filtering by type shows only matching vehicles.
* If nothing matches, a "no vehicles found" message is displayed.

### US-06 Edit/Deactivate Vehicle (MVP-06)
* Edited details are saved and displayed correctly in the list.
* A deactivated vehicle is marked inactive and cannot be assigned or used for new requests.
* Existing maintenance history of a deactivated vehicle is retained.

### US-07 Assign Vehicle to Driver (MVP-07)
* The Manager can select an active vehicle and a driver and save the assignment.
* The assignment is visible in the vehicle details.
* An inactive vehicle cannot be assigned.

### US-08 View Assigned Vehicle (MVP-08)
* The Driver sees the details of only their own assigned vehicle.
* If no vehicle is assigned, a clear message is shown.

### US-09 Create Maintenance Request (MVP-09)
* The request is created only for the Driver's assigned vehicle, with problem description and priority.
* Mandatory fields are validated.
* The new request is saved with status `PENDING` and a creation date.

### US-10 Track Request Status (MVP-10)
* The Driver sees a list of their own requests with the current status (`PENDING`, `ASSIGNED`, `IN_PROGRESS`, or `COMPLETED`).
* The status shown updates when the Manager or Mechanic changes it.
* A Driver cannot see other drivers' requests.

### US-11 Review Maintenance Requests (MVP-11)
* The Manager sees all requests with vehicle, driver, priority, and status.
* Filtering by status or priority displays only matching requests.
* The Manager can open a request to see its full details.

### US-12 Assign Mechanic (MVP-12)
* The Manager can select a mechanic for a `PENDING` request only.
* After assignment the status becomes `ASSIGNED` and the mechanic's name is shown.
* A request that is not `PENDING` cannot be assigned again.

### US-13 View Assigned Jobs (MVP-13)
* The Mechanic sees only jobs assigned to them.
* Job details show the vehicle information and the problem description.

### US-14 Update Progress and Complete Job (MVP-14)
* The assigned Mechanic can change $\text{ASSIGNED} \rightarrow \text{IN\_PROGRESS}$, and then $\text{IN\_PROGRESS} \rightarrow \text{COMPLETED}$.
* Service notes can be added and are saved with the job.
* A completion date is recorded when the job is completed.
* Invalid transitions (for example $\text{ASSIGNED} \rightarrow \text{COMPLETED}$) and updates by other users are rejected.

### US-15a / US-15b Maintenance History and Dashboard (MVP-15)
* Completed requests appear in the vehicle's maintenance history with date, mechanic, and service notes.
* The Manager can view the history of any vehicle; a Driver only for their assigned vehicle.
* The Manager dashboard shows request counts by status (`PENDING`, `ASSIGNED`, `IN_PROGRESS`, `COMPLETED`), and the counts match the stored data.

---

## 5. Product Backlog

Priorities follow Task 1. Status shows the planned sprint (all items start in the To Do state).

| Backlog ID | User Story / Task | Description | Role | Priority | Acceptance Criteria (summary) | Status |
| :-: | ----- | ----- | ----- | :-: | ----- | ----- |
| **PB-01** | US-01 / MVP-01 | User Login | All roles | High | Valid login succeeds; invalid login shows error | ✅ Done (Sprint 1) |
| **PB-02** | US-02 / MVP-02 | Role-Based Access Control | All roles | High | Unauthorized access denied; unauthenticated users redirected | ✅ Done (Sprint 1) |
| **PB-03** | US-03 / MVP-03 | Logout and Session Handling | All roles | Medium | Session cleared; protected pages inaccessible after logout | ✅ Done (Sprint 1) |
| **PB-04** | US-04 / MVP-04 | Add Fleet Vehicle | Fleet Manager | High | Valid vehicle saved; duplicates and empty fields rejected | ✅ Done (Sprint 1) |
| **PB-05** | US-05 / MVP-05 | View and Search Vehicle List | Fleet Manager | High | Search/filter returns correct results; empty-result message | ✅ Done (Sprint 2) |
| **PB-06** | US-06 / MVP-06 | Edit/Deactivate Vehicle | Fleet Manager | Medium | Changes saved; inactive vehicle not selectable; history kept | ✅ Done (Sprint 2) |
| **PB-07** | US-07 / MVP-07 | Assign Vehicle to Driver | Fleet Manager | High | Assignment saved and visible; inactive vehicle blocked | ✅ Done (Sprint 2) |
| **PB-08** | US-08 / MVP-08 | View Assigned Vehicle | Driver | Medium | Only own vehicle shown; message if none assigned | ✅ Done (Sprint 2) |
| **PB-09** | US-09 / MVP-09 | Create Maintenance Request | Driver | High | Request saved with status PENDING; validation works | ✅ Done (Sprint 3) |
| **PB-10** | US-10 / MVP-10 | Track Request Status | Driver | High | Own requests only; status reflects latest update | ✅ Done (Sprint 3) |
| **PB-11** | US-11 / MVP-11 | Review Maintenance Requests | Fleet Manager | High | All requests visible; status/priority filters work | ✅ Done (Sprint 3) |
| **PB-12** | US-12 / MVP-12 | Assign Mechanic to Request | Fleet Manager | High | Status becomes ASSIGNED; only PENDING can be assigned | ✅ Done (Sprint 3) |
| **PB-13** | US-13 / MVP-13 | View Assigned Jobs and Details | Mechanic | High | Only assigned jobs shown with full details | ✅ Done (Sprint 4) |
| **PB-14** | US-14 / MVP-14 | Update Progress and Complete Job | Mechanic | High | Valid transitions only; notes and completion date saved | ✅ Done (Sprint 4) |
| **PB-15** | US-15a, 15b / MVP-15 | Maintenance History and Dashboard | Manager / Driver | High | History shows completed jobs; dashboard counts are accurate | ✅ Done (Sprint 4) |

*Future Enhancements list (not part of MVP): items raised later are recorded here and are not scheduled.*

---

## 6. 15-Task Kanban/Scrum Plan

Each implementation task corresponds one-to-one with an approved MVP feature. A task covers the React screen, the Spring Boot REST API, and the MySQL data for that feature, plus its Git commit, test, and documentation work. Environment, CI/CD, Docker, and Ansible work is handled in the later DevOps tasks of the assignment, not duplicated here.

| Task ID | Task Name | Description | Priority | Dependencies | Expected Outcome |
| :-: | ----- | ----- | :-: | :-: | ----- |
| **T-01** | User Login | Build login page, authentication API and user table with sample users for the three roles. | High | None | Registered users can sign in. |
| **T-02** | Role-Based Access Control | Apply role checks to routes, menus and REST endpoints. | High | T-01 | Each role accesses only its permitted features. |
| **T-03** | Logout and Session Handling | Add logout action and session/token clearing. | Medium | T-01 | Protected pages are inaccessible after logout. |
| **T-04** | Add Fleet Vehicle | Vehicle form, create API and vehicle table. | High | T-02 | New vehicles are stored in the fleet record. |
| **T-05** | View and Search Vehicle List | Vehicle list page with search/filter API. | High | T-04 | Manager can quickly locate vehicles. |
| **T-06** | Edit/Deactivate Vehicle | Edit form, update API and active/inactive flag. | Medium | T-05 | Vehicle data stays accurate; retired vehicles excluded. |
| **T-07** | Assign Vehicle to Driver | Assignment screen and API linking vehicle and driver. | High | T-05 | Each driver has a defined vehicle. |
| **T-08** | View Assigned Vehicle | Driver page showing assigned vehicle details. | Medium | T-07 | Driver confirms the correct vehicle. |
| **T-09** | Create Maintenance Request | Request form, create API and request table (status PENDING). | High | T-08 | Requests are saved as PENDING. |
| **T-10** | Track Request Status | Driver's request list with current status. | High | T-09 | Driver can follow progress. |
| **T-11** | Review Maintenance Requests | Manager request list with status/priority filters. | High | T-09 | Manager sees all pending and active work. |
| **T-12** | Assign Mechanic to Request | Mechanic selection and PENDING $\rightarrow$ ASSIGNED transition. | High | T-11 | Every request has a responsible mechanic. |
| **T-13** | View Assigned Jobs and Details | Mechanic job list and details page. | High | T-12 | Mechanic sees what to repair and on which vehicle. |
| **T-14** | Update Progress & Complete Job | ASSIGNED $\rightarrow$ IN_PROGRESS $\rightarrow$ COMPLETED transitions, service notes, completion date. | High | T-13 | Repair progress and notes are recorded. |
| **T-15** | Maintenance History & Dashboard | Per-vehicle history view and manager status-count dashboard. | High | T-14 | Past repairs are traceable; manager has an operational summary. |

### 6.1 Kanban Board Design

| Column | Meaning | WIP Limit |
| ----- | ----- | :-: |
| **Backlog** | Approved tasks not yet scheduled in a sprint | None |
| **To Do** | Tasks selected for the current sprint | None |
| **In Progress** | Task is being developed | **3** |
| **In Review** | Code committed; pull request being reviewed/merged | **2** |
| **Testing** | Functional and Selenium/automated checks being run | **2** |
| **Done** | Task meets the Definition of Done | None |

```
+----------+    +-------+    +-------------+    +-----------+    +---------+    +------+
| Backlog  |--> | To Do |--> | In Progress |--> | In Review |--> | Testing |--> | Done |
|          |    |       |    |  (WIP = 3)  |    | (WIP = 2) |    | (WIP=2) |    |      |
+----------+    +-------+    +-------------+    +-----------+    +---------+    +------+
```

### 6.2 Initial Board State (at start of Sprint 1)

| Backlog | To Do | In Progress | In Review | Testing | Done |
| ----- | ----- | :-: | :-: | :-: | :-: |
| T-05, T-06, T-07, T-08, T-09, T-10, T-11, T-12, T-13, T-14, T-15 | T-01, T-02, T-03, T-04 | – | – | – | – |

### 6.3 Final MVP Board State (Task 6 Completion / Release Baseline)

| Backlog | To Do | In Progress | In Review | Testing | Done |
| ----- | ----- | :-: | :-: | :-: | :-: |
| – | – | – | – | – | **T-01, T-02, T-03, T-04, T-05, T-06, T-07, T-08, T-09, T-10, T-11, T-12, T-13, T-14, T-15** (All 15 Tasks Completed) |

**Board rules:** Pull work only when the WIP limit allows; a task moves to Done only when the Definition of Done is met; a blocked task is flagged and its dependency resolved first.

---

## 7. Sprint Plan

**Total effort:** 46 story points across 4 sprints. Points use the 1-2-3-5 scale (T-02, T-14, T-15 are the largest because of role rules, workflow rules, and aggregation respectively).

| Sprint | Sprint Goal | Tasks | Points | Sprint Deliverable |
| ----- | ----- | ----- | :-: | ----- |
| **Sprint 0** *(Tasks 1–3 of assignment)* | Define scope, plan, and architecture. | Task 1, 2, 3 documentation | – | Problem definition, backlog, sprint plan, architecture, and setup. |
| **Sprint 1** | Secure access and fleet foundation. | T-01 (3), T-02 (5), T-03 (2), T-04 (3) | 13 | Login, role control, logout, and add-vehicle working end to end. |
| **Sprint 2** | Complete vehicle management and driver link. | T-05 (3), T-06 (2), T-07 (3), T-08 (2) | 10 | Searchable fleet list, edit/deactivate, vehicle-to-driver assignment, driver's vehicle view. |
| **Sprint 3** | Maintenance request lifecycle (request $\rightarrow$ assignment). | T-09 (3), T-10 (2), T-11 (3), T-12 (3) | 11 | Driver raises and tracks requests; Manager reviews and assigns mechanics. |
| **Sprint 4** | Repair completion, history, dashboard, and stabilization. | T-13 (2), T-14 (5), T-15 (5) | 12 | Full workflow $\text{PENDING} \rightarrow \text{COMPLETED}$, history and dashboard; MVP complete. |

* **Dependency check:** Every task is scheduled after its dependencies. T-12 (Sprint 3) is ready before T-13 and T-14 (Sprint 4), and T-15 comes last because it depends on completed jobs.
* **Sprint 4 stabilization:** The end of Sprint 4 is reserved for regression checks, bug fixes, and documentation. The remaining DevOps activities of the assignment (CI job, pipeline, Selenium execution, Docker, Ansible) run alongside and after the sprints on the stable MVP.
* **Sprint review criteria:** The sprint goal is met, all committed tasks satisfy the Definition of Done, and a short demo of the working features is given. A brief retrospective records what to keep and what to improve.

---

## 8. Definition of Done

A task or user story is **Done** only when all of the following are satisfied:

| # | Criterion |
| :-: | ----- |
| **1** | **Code implemented:** React UI, Spring Boot REST API, and MySQL changes for the feature are complete. |
| **2** | **Functionality works:** The feature behaves as described in its acceptance criteria. |
| **3** | **Validation completed:** Input validation and error messages are in place; invalid inputs are rejected. |
| **4** | **Role rules enforced:** Only the permitted role can perform the action (and the status workflow rules are respected where applicable). |
| **5** | **Database/API integration completed:** Frontend, API, and database work together end to end, and data persists after restart. |
| **6** | **Tests pass:** Unit/API tests pass and the manual or Selenium test for the feature succeeds; the build is not broken. |
| **7** | **Code committed to Git:** Changes are committed to a feature branch with a clear message and pushed to GitHub. |
| **8** | **Reviewed and merged:** Pull request reviewed (self-review is acceptable for a single developer) and merged into `develop`. |
| **9** | **Documentation updated:** README, API notes, and the task board are updated. |
| **10** | **Scope respected:** No additional features beyond the approved MVP were added. |

* **Definition of Ready (task can enter a sprint):** The user story and acceptance criteria are written, dependencies are done, and the task is estimated.
* **MVP-level Done:** All 15 tasks are Done, the full path $\text{PENDING} \rightarrow \text{ASSIGNED} \rightarrow \text{IN\_PROGRESS} \rightarrow \text{COMPLETED}$ works for the three roles, and the application can be built and started with the documented procedure.

---

## 9. DevOps Lifecycle

The project moves through ten stages. Each stage is tied to a tool and a concrete output. The "Related assignment task" column is only a pointer to where each stage is carried out later.

| # | Stage | What Happens in This Project | Tool(s) | Output | Related Assignment Task |
| :-: | ----- | ----- | ----- | ----- | :-: |
| **1** | **Plan** | Define scope, user stories, backlog, sprint plan, and Kanban board. | Kanban/Scrum board, GitHub (issues/project board) | Approved backlog and sprint plan | 1–3 |
| **2** | **Code** | Develop React frontend and Spring Boot backend on feature branches; commit and push; merge via pull request. | Git, GitHub | Versioned source code on `develop`/`main` | 4–6 |
| **3** | **Build** | Compile the backend and build the frontend automatically on each commit. | Maven (backend), npm (frontend), Jenkins | Successful build or fast failure feedback | 7–8 |
| **4** | **Test** | Run unit/API tests and automated browser tests of the core workflows. | JUnit, Selenium WebDriver, Jenkins | Pass/fail test report | 9–10 |
| **5** | **Package** | Create deployable artifacts: Spring Boot JAR and React production build. | Maven, npm, Jenkins | Versioned artifacts | 8 |
| **6** | **Containerize** | Build Docker images for frontend, backend, and MySQL; run as containers. | Docker | Container images and running containers | 11 |
| **7** | **Deploy** | Jenkins deploys the latest tested containers to the target server/lab environment. | Jenkins, Docker | Running application in the deployment environment | 8, 12 |
| **8** | **Provision / Configure** | Prepare the target host (install Docker, set configuration, deploy containers) through repeatable scripts. | Ansible | Consistently configured environment | 13–14 |
| **9** | **Validate** | Confirm the deployed system works: health checks, smoke tests of core workflows, restart/reliability checks. | Selenium, Jenkins, Docker | Validation evidence | 14 |
| **10** | **Release** | Tag the stable version, publish the release and final documentation, and demonstrate end to end. | Git/GitHub, Jenkins | Tagged release, final report, and viva demo | 15 |

* **Branching and flow of code:** Work is done on `feature/mvp-xx-name` branches, merged into `develop` after review, and promoted to `main` when the sprint output is stable. Jenkins builds and tests each push, and only a passing `main` build is containerized and deployed.
* **Feedback loop:** A failure at the build, test, deploy, or validate stage stops the pipeline and returns the work to the Code stage. After release, remaining ideas return to the Plan stage as future enhancements.
* **Architecture note:** A simple modular full-stack application, deployed as three containers (React frontend, Spring Boot backend, MySQL database). There are no microservices and no Kubernetes.

---

## 10. DevOps Workflow Diagram

```
+------------+     +------------+     +------------+     +------------+
|  1. PLAN   |     |  2. CODE   |     |  3. BUILD  |     |  4. TEST   |
| Kanban     | --> | Git/GitHub | --> | Maven      | --> | JUnit      |
| Backlog    |     | React      |     | npm        |     | Selenium   |
| Sprints    |     | Spring Boot|     | Jenkins    |     | Jenkins    |
+------------+     +------------+     +------------+     +------------+
       |
       +-------------------------------------------------------+
                                                               |
                                                               v
+--------------------+     +--------------------+     +--------------------+
|    5. PACKAGE      |     |  6. CONTAINERIZE   |     |     7. DEPLOY      |
| Maven (JAR)        | --> | Docker             | --> | Jenkins            |
| npm build          |     | Dockerfile         |     | Docker run         |
| Jenkins            |     | Docker images      |     | Test server        |
+--------------------+     +--------------------+     +--------------------+
                                                               |
       +-------------------------------------------------------+
       |
       v
+--------------------+     +--------------------+     +--------------------+
|  8. PROVISION /    |     |    9. VALIDATE     |     |    10. RELEASE     |
|     CONFIGURE      | --> | Selenium smoke     | --> | Git tag/version    |
| Ansible            |     | Health checks      |     | GitHub release     |
| Playbooks          |     | Reliability test   |     | Final report       |
+--------------------+     +--------------------+     +--------------------+
```

### Feedback Loop
* **Pipeline failures:** Any failure in stages 3, 4, 7, or 9 $\rightarrow$ pipeline stops $\rightarrow$ fix on feature branch $\rightarrow$ back to stage 2 (CODE) $\rightarrow$ commit/push $\rightarrow$ pipeline runs again.
* **Post-release:** After stage 10 (RELEASE) $\rightarrow$ new ideas and next sprint $\rightarrow$ back to stage 1 (PLAN).

### Jenkins Pipeline View (Stages 2 to 9)
```
GitHub push
   |
   v
[Checkout] --> [Build: Maven + npm] --> [Unit/API Tests: JUnit]
   --> [UI Tests: Selenium] --> [Package: JAR + React build]
   --> [Docker Build] --> [Deploy Containers] --> [Smoke/Health Validation]
   ^
   |
Ansible prepares and configures the target host
```

### Runtime View of the Deployed System
```
Browser (Manager / Driver / Mechanic)
   |
   v
+------------------------------------+
| Docker host (test server)          |
|  [React frontend container]        |
|            | REST                  |
|  [Spring Boot backend container]   |
|            | JDBC                  |
|  [MySQL database container]        |
+------------------------------------+
```

---

## 11. Task 2 Deliverables

| Required Deliverable | Where It Is Provided | Status |
| ----- | ----- | :-: |
| **Backlog** | Section 5 (Product Backlog PB-01 to PB-15) and Sections 3–4 (user stories, acceptance criteria) | Completed |
| **Task board** | Section 6 (15-Task plan, Kanban columns, WIP limits, initial board state) | Completed |
| **Sprint plan** | Section 7 (Sprint 0 to Sprint 4 with goals, tasks, and points) | Completed |
| **Definition of Done** | Section 8 | Completed |
| **Workflow diagram** | Sections 9–10 (DevOps lifecycle and text workflow diagrams) | Completed |

> **Summary:** The 15 approved MVP features are broken into 15 implementation tasks, scheduled over four sprints. The plan keeps the same scope as Task 1, adds no new features, and is ready to feed Task 3 (requirements, architecture, and technology setup).