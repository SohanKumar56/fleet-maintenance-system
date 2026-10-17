# Task 15: Operations & Troubleshooting Runbook

**Project:** Fleet Maintenance Management System (ABC Logistics)  
**Author:** DevOps Operations & Site Reliability Engineering (SRE)  
**Date:** October 17, 2026  
**Audience:** DevOps Engineers, System Administrators, Evaluators  

---

## 1. Quick Diagnostic Cheat Sheet

| Symptom | Probable Cause | One-Line Fix / Diagnostic Command |
|---|---|---|
| `Got permission denied while trying to connect to the Docker daemon socket` | `jenkins` user not in `docker` group | `sudo usermod -aG docker jenkins && sudo systemctl restart jenkins` |
| `Selenium Quality Gate Triggered: Stage Deploy Container skipped` | Headless test failed or service unavailable | Inspect `selenium-tests/target/surefire-reports/` & `selenium-tests/screenshots/` |
| `Ansible requires locale encoding to be UTF-8; Detected ISO8859-1` | Terminal environment missing UTF-8 locale | Prefix command: `LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook ...` |
| `curl: (7) Failed to connect to localhost port 5173` | Vite dev server listening only on IPv6 `[::1]` | Add `server: { host: '0.0.0.0', port: 5173 }` in `frontend/vite.config.js` |
| `Error response from daemon: driver failed programming external connectivity ... port is already allocated` | Existing container or process occupying port 8092 | `docker rm -f fleet-production-app && ss -tulpn \| grep :8092` |
| `curl: (7) Failed to connect to localhost port 5000` | Docker registry container is stopped | `docker start registry \|\| docker run -d -p 5000:5000 --restart always --name registry registry:2` |
| `Rollback failed: object of type 'dict' has no attribute 'previous_image'` | Metadata file missing historical tag | Use safe dictionary parsing in `ansible/rollback.yml` or pass `-e rollback_to=build-5` |

---

## 2. CI/CD & Jenkins Pipeline Runbook

### Incident 2.1: Docker Socket Permission Denied in Jenkins Agent
- **Symptoms:** Jenkins build fails during Stage 5 (`Docker Build & Version`) or Stage 6 (`Publish to Registry`) with:
  ```text
  docker: permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock
  ```
- **Root Cause:** The Jenkins daemon executes jobs under the system service account `jenkins`. By default, Debian/Ubuntu restricts `/var/run/docker.sock` to the `root` user and `docker` group (GID 132).
- **Resolution Procedure:**
  1. Add user `jenkins` to group `docker`:
     ```bash
     sudo usermod -aG docker jenkins
     ```
  2. Verify membership:
     ```bash
     id jenkins
     # Output must include: groups=...,132(docker)
     ```
  3. Restart Jenkins service to reload group tokens:
     ```bash
     sudo systemctl restart jenkins
     ```

---

### Incident 2.2: Selenium Fail-Fast Quality Gate Blocks Deployment
- **Symptoms:** Jenkins build completes with `FAILURE`, and Stage 7 (`Deploy Container`) shows:
  ```text
  Stage "Deploy Container" skipped due to earlier failure(s)
  ❌ Quality Gate Triggered: Selenium test suite encountered failures! Halting pipeline and blocking deployment.
  ```
- **Diagnostic Procedure:**
  1. Check JUnit test reports recorded by Jenkins:
     - Navigate to `http://localhost:8080/job/Fleet-maintenance-Pipeline/<build-number>/testReport/`.
  2. Inspect captured failure screenshots:
     - Check archived artifacts under `selenium-tests/screenshots/*.png`.
  3. Verify whether target backend (port 8090) and frontend (port 5173) are responding:
     ```bash
     curl -i http://localhost:8090/api/auth/health
     curl -i http://localhost:5173
     ```
  4. Fix the underlying bug, commit to Git, and trigger a rerun.

---

## 3. Selenium & Automated Testing Runbook

### Incident 3.1: React Virtual DOM Form Click Interception
- **Symptoms:** Selenium test fails with `ElementClickInterceptedException` or form submission does not trigger React `onSubmit` event handlers.
- **Root Cause:** React 18 uses synthetic event delegation at the root container. A traditional Selenium `element.click()` may fail if another element overlaps or if React has not attached event listeners.
- **Resolution:** Use native `form.requestSubmit(btn)` dispatched via JavascriptExecutor (implemented in `BaseTest.java`):
  ```java
  protected void submitForm(WebElement submitBtn) {
      ((JavascriptExecutor) driver).executeScript(
          "const btn = arguments[0];" +
          "const form = btn.closest('form');" +
          "if (form && form.requestSubmit) { form.requestSubmit(btn); } else { btn.click(); }",
          submitBtn
      );
  }
  ```

---

### Incident 3.2: Asynchronous Dropdown Population Timeout
- **Symptoms:** Selenium tests fail with `TimeoutException` waiting for vehicle dropdown options to load.
- **Root Cause:** The vehicle list is loaded via an asynchronous REST API call (`/api/vehicles`) inside a React `useEffect` hook. If Selenium evaluates `<select>` options before the HTTP response arrives, cached element references remain empty.
- **Resolution:** Dynamically wait for the second `<option>` element to be present in the live DOM (implemented in `MaintenanceWorkflowTest.java`):
  ```java
  wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("#select-vehicle option:nth-child(2)")));
  new Select(driver.findElement(By.id("select-vehicle"))).selectByIndex(1);
  ```

---

## 4. Network & Port Collision Runbook

### Incident 4.1: Port Collisions on Host
- **Symptoms:** `java.net.BindException: Address already in use` or `Error response from daemon: port is already allocated`.
- **Diagnostic Procedure:**
  1. Scan for processes bound to application ports:
     ```bash
     ss -tulpn | grep -E ':(8090|8092|5000|5173|8080)'
     ```
  2. Reference the port ownership matrix:
     - `8090`: Spring Boot local backend
     - `5173`: React Vite frontend
     - `8092`: Deployed production Docker container
     - `5000`: Local Docker image registry
     - `8080`: Jenkins automation server
  3. Terminate conflicting orphan processes:
     ```bash
     # To clean up previous docker container
     docker rm -f fleet-production-app
     
     # To terminate orphan background process by PID
     kill -9 <PID>
     ```

---

### Incident 4.2: Vite IPv6 Host Binding Mismatch
- **Symptoms:** React works in Chrome at `http://localhost:5173`, but `curl http://127.0.0.1:5173` fails with `Connection refused`.
- **Root Cause:** By default, Vite binds strictly to IPv6 loopback `[::1]`. Tools using IPv4 (such as headless Selenium or curl) cannot connect.
- **Resolution:** Explicitly bind to dual-stack `0.0.0.0` in `frontend/vite.config.js`:
  ```javascript
  export default defineConfig({
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5173,
    },
  })
  ```

---

## 5. Docker Registry & Image Operations Runbook

### Incident 5.1: Registry Unavailable or Catalog Inaccessible
- **Symptoms:** `curl http://localhost:5000/v2/_catalog` returns `Connection refused` or `docker push` fails.
- **Resolution:**
  1. Check registry container status:
     ```bash
     docker ps -a --filter "name=registry"
     ```
  2. If container exists but is stopped:
     ```bash
     docker start registry
     ```
  3. If missing entirely, launch registry with persistent restart:
     ```bash
     docker run -d -p 5000:5000 --restart always --name registry registry:2
     ```
  4. Verify catalog response:
     ```bash
     curl -s http://localhost:5000/v2/_catalog
     # Expected: {"repositories":["fleet-maintenance-system"]}
     ```

---

## 6. Ansible Configuration & Rollback Runbook

### Incident 6.1: UTF-8 Locale Requirement in Ansible Core
- **Symptoms:** `ERROR: Ansible requires the locale encoding to be UTF-8; Detected ISO8859-1.`
- **Resolution:** Always invoke Ansible commands with standard UTF-8 environment variables:
  ```bash
  LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i ansible/inventory.ini <playbook.yml>
  ```

---

### Incident 6.2: Automated Container Rollback Runbook
- **Scenario:** A faulty release was deployed, container crashes or fails health check.
- **Recovery Procedure:**
  1. Trigger immediate automated rollback via Ansible:
     ```bash
     LC_ALL=C.UTF-8 LANG=C.UTF-8 ansible-playbook -i ansible/inventory.ini ansible/rollback.yml
     ```
  2. The playbook will:
     - Read `.current_deployment.json` to identify the last verified stable image tag (`build-5` or `v1.0.0`).
     - Remove the failing container.
     - Redeploy the stable image on port `8092`.
     - Poll `/api/auth/health` until HTTP 200 is confirmed.
  3. Verify recovery status:
     ```bash
     curl -i http://localhost:8092/api/auth/health
     ```
