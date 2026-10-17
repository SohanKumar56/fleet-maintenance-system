# Task 15: Viva Voce Defense & Project Presentation Guide

**Project:** Fleet Maintenance Management System (ABC Logistics)  
**Author:** DevOps Engineering Team  
**Date:** October 17, 2026  
**Audience:** Project Presenter, Technical Interviewer, Academic Evaluator  

---

## 1. Five-Minute Scripted Live Demonstration Walkthrough

When demonstrating the project live to an evaluator or examiner, follow this 5-step structured walkthrough:

### Step 1: Architecture & Problem Context (30 seconds)
> *"Hello! The Fleet Maintenance Management System is a full-stack, cloud-native DevOps platform built for ABC Logistics. It solves the operational challenge of vehicle maintenance tracking, driver defect filing, and mechanic dispatch across 3 distinct roles: Managers, Drivers, and Mechanics. More importantly, this repository implements a complete enterprise DevOps lifecycle: from Git branching to Jenkins CI/CD, Selenium quality gates, multi-stage Docker builds, private registry publishing, and Ansible configuration management with automated rollback."*

---

### Step 2: Live Application & Role-Based Workflows (1 minute)
1. Open browser to **`http://localhost:5173`**.
2. **Log in as Driver (`driver1` / `driver123`)**:
   - Go to "Report Issue", select a vehicle, type defect summary, submit.
   - Highlight the ticket appearing immediately with status **`OPEN`**.
3. **Log in as Manager (`manager1` / `manager123`)**:
   - Show fleet metrics dashboard.
   - Go to Maintenance tab, click **"Assign"** on the ticket, assign to `mechanic1`.
   - Status changes to **`ASSIGNED`**.
4. **Log in as Mechanic (`mechanic1` / `mechanic123`)**:
   - View assigned jobs. Click **"Start Work"** (status: **`IN_PROGRESS`**), then **"Mark Complete"** (status: **`COMPLETED`**).
5. **Log back in as Manager**:
   - Click **"Sign & Close"** $\rightarrow$ status finalizes as **`CLOSED`**.

---

### Step 3: Jenkins CI/CD Pipeline & Quality Gate (1 minute)
1. Open Jenkins at **`http://localhost:8080/job/Fleet-maintenance-Pipeline`**.
2. Show the **Stage View** with all 7 stages completed in green:
   $$\text{Checkout} \rightarrow \text{Build \& Test} \rightarrow \text{Package} \rightarrow \text{Selenium E2E Tests} \rightarrow \text{Docker Build} \rightarrow \text{Publish Registry} \rightarrow \text{Deploy Container}$$
3. Explain the **Fail-Fast Quality Gate (Stage 4)**:
   > *"If any of our 7 automated Selenium UI tests fail, the quality gate immediately triggers, aborting the build and skipping Stage 7 (Deploy Container). This guarantees defective code can never reach production."*
4. Click into the latest build, show test results (22 unit tests + 7 Selenium tests).

---

### Step 4: Docker Containerization & Local Registry (1 minute)
Open your terminal and run:
1. **Show Versioned Images**:
   ```bash
   docker images "localhost:5000/fleet-maintenance-system"
   ```
   > *"Notice the versioned tag `build-5` alongside `latest` and `v1.0.0`. Our multi-stage Dockerfile uses eclipse-temurin:17-jre-alpine to package the runtime in just 301MB, running as an unprivileged user `appuser`."*
2. **Show Private Registry Catalog**:
   ```bash
   curl -s http://localhost:5000/v2/fleet-maintenance-system/tags/list
   ```
   Show output: `{"name":"fleet-maintenance-system","tags":["v1.0.0","latest","build-5"]}`.

---

### Step 5: Ansible Automation, Idempotency & Rollback (1.5 minutes)
1. **Demonstrate Idempotency**:
   ```bash
   LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i ansible/inventory.ini ansible/deploy.yml
   ```
   Point out:
   > *"Notice `Idempotent Bypass: True` and `changed=0`. Ansible verified the container is already running `build-5` and healthy, so it made zero changes and caused zero downtime. That proves idempotency."*
2. **Demonstrate Automated Disaster Recovery & Rollback**:
   ```bash
   LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i ansible/inventory.ini ansible/rollback.yml
   ```
   Point out:
   > *"Our rollback playbook reads `.current_deployment.json`, detects the previous stable version, stops the container, reinstates the stable release, and verifies HTTP 200 health recovery in under 15 seconds."*
3. **Verify Health Endpoint**:
   ```bash
   curl -i http://localhost:8092/api/auth/health
   ```
   Show HTTP 200 with `{"status":"UP","version":"1.0.0"}`.

---

## 2. High-Yield Viva Voce Questions & Answers

### Domain 1: Agile Planning & Git Version Control

#### Q1: What branching strategy did you use and why?
**Answer:** We implemented a Git Flow branching strategy:
- `main`: Protected production-ready stable branch.
- `development`: Primary integration branch where features are merged after passing peer code review.
- `feature/*`: Dedicated branches for individual user stories (e.g., `feature/mvp-01-user-login`).
This isolates experimental changes, prevents unstable code from polluting `main`, and provides clean audit trails.

#### Q2: How did you handle Git merge conflicts?
**Answer:** In Task 7, we simulated a 3-way conflict between two parallel branches modifying the same section of code. We resolved the conflict manually using Git conflict markers (`<<<<<<<`, `=======`, `>>>>>>>`), kept the consolidated logic, committed the resolved merge commit, and validated that tests passed.

---

### Domain 2: Automated Testing & Quality Assurance

#### Q3: What is the testing pyramid and how is it reflected in your project?
**Answer:** The testing pyramid advocates for a large base of fast, isolated unit tests, fewer integration tests, and a focused suite of end-to-end UI tests:
- **Base Layer (Unit & Service Tests):** 22 JUnit 5 and Mockito tests covering `UserService`, `VehicleService`, `MaintenanceService`, and `AuthController`. Fast execution (~3 seconds).
- **Top Layer (E2E UI Tests):** 7 Selenium WebDriver tests using Headless Chrome simulating real user interactions across 4 critical user journeys. Slower execution (~40 seconds).

#### Q4: Why did you use Mockito in backend testing?
**Answer:** Mockito allows us to isolate the service business logic from the database and external dependencies. By mocking repository methods (e.g. `when(vehicleRepository.findByLicensePlate(...)).thenReturn(...)`), we test edge cases, error handling, and business rules deterministically without requiring a live database connection.

---

### Domain 3: Continuous Integration & Jenkins

#### Q5: What is a Declarative Pipeline and what are its advantages?
**Answer:** A Declarative Pipeline (written in Groovy inside a `Jenkinsfile`) uses a structured, syntax-checked DSL (`pipeline { agent, stages, steps, post }`). Compared to Scripted Pipelines, Declarative Pipelines provide better readability, strict syntax enforcement, built-in post actions (`always`, `success`, `failure`), and native integration with the Blue Ocean stage view.

#### Q6: Explain your pipeline's "Quality Gate". What happens when tests fail?
**Answer:** In Stage 4 (`Selenium E2E Tests`), we execute automated end-to-end browser tests against live backend and frontend instances. If any test fails, Jenkins triggers the `failure` post-condition, halts the pipeline, and **skips downstream stages** (`Docker Build`, `Publish to Registry`, and `Deploy Container`). This guarantees that broken builds can never overwrite the registry or reach production containers.

---

### Domain 4: Docker & Containerization

#### Q7: Why did you use a multi-stage Docker build?
**Answer:** Traditional single-stage Dockerfiles include the full JDK (compiler, source files, Maven dependencies), resulting in bloated image sizes (~850MB+) and a larger attack surface. Our multi-stage `Dockerfile`:
- Stage 1 (Builder): Uses `maven:3.9.6-eclipse-temurin-17-alpine` to compile the JAR.
- Stage 2 (Runtime): Copies only the final packaged JAR into `eclipse-temurin:17-jre-alpine`.
This reduced the final image size to **301MB** and eliminated build tools from the production runtime.

#### Q8: How did you secure your Docker container?
**Answer:** 
1. **Non-Root Execution:** We created a dedicated user `appuser` (UID 10001) in group `appgroup` and enforced `USER appuser`. The container never runs as root.
2. **Minimal Base Image:** We used Alpine Linux which has minimal packages and fewer known CVE vulnerabilities.
3. **HEALTHCHECK Instruction:** Configured native Docker health checking polling `/api/auth/health` to automatically detect hung processes.

---

### Domain 5: Configuration Management & Ansible

#### Q9: What is Idempotency in Ansible and how did you prove it?
**Answer:** An automation script is **idempotent** if running it multiple times against the target node results in the exact same state without unintended changes or side effects. 
In Task 14, when we executed `ansible/deploy.yml` on an already-running container, Ansible inspected the container state, confirmed the image and status already matched the desired state, and bypassed destructive actions, completing with **`changed=0`**.

#### Q10: Why choose Ansible over manual shell scripts?
**Answer:**
1. **Declarative State:** Ansible specifies *what* the system should look like (e.g., `state: present`), not procedural commands.
2. **Built-in Idempotency:** Modules check the current state before taking action.
3. **Templating Engine:** Jinja2 templates allow dynamic configuration injection (`application.env.j2`, `fleet-maintenance.service.j2`).
4. **Agentless Architecture:** Operates over standard SSH/local connections without requiring an installed agent on managed nodes.

#### Q11: How does your automated rollback mechanism work?
**Answer:** Our continuous deployment playbook writes deployment state (`active_image`, `previous_image`, `port`, `timestamp`) to `ansible/.current_deployment.json`. When `ansible/rollback.yml` is triggered, it parses this metadata, terminates the failing container, starts the verified previous release (`build-5` or `v1.0.0`), and validates HTTP 200 health recovery via `/api/auth/health`.

---

## 3. Quick Terminal Commands Cheat Sheet for Demo

```bash
# 1. Verify Docker Registry Catalog
curl -s http://localhost:5000/v2/fleet-maintenance-system/tags/list

# 2. View Active Production Container Status
docker ps --filter "name=fleet-production-app"

# 3. Test Container Health
curl -i http://localhost:8092/api/auth/health

# 4. Demonstrate Idempotency (observe changed=0)
LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i ansible/inventory.ini ansible/deploy.yml

# 5. Demonstrate Automated Rollback & Recovery
LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i ansible/inventory.ini ansible/rollback.yml
```
