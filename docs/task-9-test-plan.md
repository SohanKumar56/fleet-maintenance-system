# Task 9 — Selenium Test Plan & Execution Strategy

**Project:** OptiWheels Logistics — Fleet Maintenance Management System  
**Task:** Task 9 — Selenium Test Design and Local Execution  
**Target Environment:** Localhost (Frontend: `http://localhost:5173`, Backend: `http://localhost:8090`)  
**Technology Stack:** Selenium WebDriver 4.20, JUnit 5 Jupiter, WebDriverManager, Chrome Headless  

---

## 1. Overview and Objectives

This test plan defines the automated End-to-End (E2E) browser testing framework for the Fleet Maintenance Management System. The objective is to validate real user journeys from the web UI through the REST API down to the database, ensuring that role permissions, state workflows, and data integrity function correctly.

---

## 2. Test Environment Setup

| Component | Specification |
| :--- | :--- |
| **Operating System** | Linux |
| **Browser Engine** | Google Chrome / Chromium (Headless mode: `--headless=new`, `--no-sandbox`) |
| **Driver Management** | Automatic binary resolution via `WebDriverManager` |
| **Frontend Application** | React + Vite on `http://localhost:5173` |
| **Backend API** | Spring Boot 3 on `http://localhost:8090` |
| **Test Framework** | JUnit 5 with Selenium WebDriver 4.20 |
| **Execution Tool** | Apache Maven (`mvn clean test`) |

---

## 3. Critical User Journeys Tested

### User Journey 1: Authentication & Role-Based Access Control
* **Test Class:** `AuthenticationTest.java`
* **Test Cases:**
  1. `testLoginPageStructure`: Verifies brand identity, input fields (`login-username`, `login-password`), and submit button are rendered.
  2. `testInvalidLoginShowsError`: Submits bad credentials (`invalid_user` / `wrong_password`) and asserts `#login-error` alert displays with descriptive error message.
  3. `testValidManagerLogin`: Authenticates as `manager1` / `manager123`, asserts URL redirects to `/manager` and page heading displays "Fleet Operations Dashboard".
  4. `testLogoutClearsSession`: Clicks "Sign Out" button and asserts user is redirected back to `/login` with clean session.

### User Journey 2: Fleet Vehicle Management (CRUD & Search)
* **Test Class:** `VehicleManagementTest.java`
* **Test Cases:**
  1. `testCreateAndSearchVehicle`:
     * Manager logs in and navigates to the "Vehicles" tab.
     * Clicks "+ Add New Vehicle" and populates registration number, model, vehicle type, and mileage.
     * Submits form and asserts success banner confirms addition.
     * Verifies new vehicle appears in the data table.
     * Inputs registration number in search bar, clicks "Search", and asserts the table filters down exclusively to the created vehicle.

### User Journey 3: Driver Defect Reporting
* **Test Class:** `MaintenanceWorkflowTest.java` (`testDriverReportDefect`)
* **Test Steps:**
  1. Driver logs in with credentials `driver1` / `driver123` and redirects to `/driver`.
  2. Clicks the "Report Issue" navigation tab.
  3. Selects a vehicle from the dropdown, chooses priority `CORRECTIVE`, and enters defect description.
  4. Submits form and verifies success alert.
  5. Asserts automatic redirection to "My Reports" tab and verifies the newly logged ticket is present with status **`OPEN`**.

### User Journey 4: End-to-End Maintenance Lifecycle (Multi-Role Flow)
* **Test Class:** `MaintenanceWorkflowTest.java` (`testEndToEndMaintenanceLifecycle`)
* **State Progression:** `OPEN` ➔ `ASSIGNED` ➔ `IN_PROGRESS` ➔ `COMPLETED` ➔ `CLOSED`
* **Test Steps:**
  1. **Driver Phase:** Driver logs defect report (`OPEN`).
  2. **Manager Phase:** Manager logs in, opens Maintenance tab, clicks "Assign", inputs mechanic username `mechanic1`, and confirms. Asserts status changes to **`ASSIGNED`**.
  3. **Mechanic Phase:** Mechanic logs in, locates assigned job, clicks "Start Work". Asserts status changes to **`IN_PROGRESS`**.
  4. **Mechanic Completion:** Mechanic clicks "Mark Complete". Asserts status transitions to **`COMPLETED`**.
  5. **Manager Sign-off:** Manager re-logs, locates the completed job, and clicks "Sign & Close". Asserts ticket finalizes as **`CLOSED`**.

---

## 4. Failure Screenshot Mechanism

In accordance with Task 9 requirements, an automated screenshot listener is implemented via JUnit 5's `TestWatcher` interface ([`ScreenshotExtension.java`](file:///home/cat/fleet-maintenance-system/selenium-tests/src/test/java/com/abc/fleet/test/ScreenshotExtension.java)):

```java
public class ScreenshotExtension implements TestWatcher {
    @Override
    public void testFailed(ExtensionContext context, Throwable cause) {
        // Automatically captures full-screen PNG
        // Saves to: selenium-tests/screenshots/{TestClass}_{TestMethod}_{Timestamp}.png
    }
}
```

* **Storage Path:** `selenium-tests/screenshots/`
* **Trigger:** Any assertion failure (`AssertionError`) or unhandled element lookup failure (`NoSuchElementException`, `TimeoutException`) automatically produces a high-resolution PNG screenshot with timestamp for debugging and evidence.

---

## 5. Local Execution Instructions

To execute the test suite locally through Maven:

```bash
cd selenium-tests
mvn clean test
```

* **Reports Generated:**
  * XML test summaries: `selenium-tests/target/surefire-reports/*.xml`
  * Text report logs: `selenium-tests/target/surefire-reports/*.txt`
