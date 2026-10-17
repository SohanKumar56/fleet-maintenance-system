# Task 9 Completion Summary — Selenium Test Design & Local Execution

**Project:** OptiWheels Logistics — Fleet Maintenance Management System  
**Task:** Task 9: Selenium Test Design and Local Execution  
**Status:** ✅ Complete  
**Date:** 2026-10-17  
**Execution Environment:** Linux | Headless Chrome 154 | JUnit 5 | Maven 3.9  

---

## 1. Overview & Deliverables Summary

Task 9 required the design and automated execution of critical user journeys through Selenium WebDriver, complete with assertions, test data, local Maven execution, and a failure screenshot mechanism.

| Deliverable | Implementation Location | Status |
| :--- | :--- | :--- |
| **1. Test Plan** | [`docs/task-9-test-plan.md`](file:///home/cat/fleet-maintenance-system/docs/task-9-test-plan.md) | ✅ Complete |
| **2. Selenium WebDriver Scripts** | [`selenium-tests/src/test/java/com/abc/fleet/test/`](file:///home/cat/fleet-maintenance-system/selenium-tests/src/test/java/com/abc/fleet/test/) | ✅ Complete (5 classes, 7 tests) |
| **3. Local Maven Test Report** | `selenium-tests/target/surefire-reports/` | ✅ Complete (7/7 Passed, 0 Failures) |
| **4. Failure Screenshot Mechanism** | [`ScreenshotExtension.java`](file:///home/cat/fleet-maintenance-system/selenium-tests/src/test/java/com/abc/fleet/test/ScreenshotExtension.java) & `selenium-tests/screenshots/` | ✅ Complete & Verified |

---

## 2. Test Suite Architecture

```
selenium-tests/
├── pom.xml                                   # Selenium 4.20, JUnit 5, WebDriverManager, Surefire
├── screenshots/                              # Auto-generated failure screenshot directory
│   ├── AuthenticationTest_testLogoutClearsSession_*.png
│   └── VehicleManagementTest_testCreateAndSearchVehicle_*.png
└── src/test/java/com/abc/fleet/test/
    ├── BaseTest.java                         # Headless Chrome options, lifecycle hooks, explicit waits & helpers
    ├── ScreenshotExtension.java              # JUnit 5 extension implementing TestExecutionExceptionHandler
    ├── AuthenticationTest.java               # Journey 1: Login structure, bad credentials, manager redirect, logout
    ├── VehicleManagementTest.java            # Journey 2: Add fleet vehicle, data table assert, search filtering
    └── MaintenanceWorkflowTest.java          # Journeys 3 & 4: Driver defect logging & complete multi-role lifecycle
```

---

## 3. Critical User Journeys Covered

### Journey 1: Authentication & RBAC (`AuthenticationTest.java`)
- **`testLoginPageStructure`**: Asserts branding, `#login-username`, `#login-password`, and `#login-submit` inputs are rendered.
- **`testInvalidLoginShowsError`**: Submits invalid credentials and verifies `#login-error` alert displays with error text.
- **`testValidManagerLogin`**: Authenticates manager credentials, verifies URL redirect to `/manager`, and checks page heading "Fleet Operations Dashboard".
- **`testLogoutClearsSession`**: Clicks "Sign Out", asserts user is redirected to `/login`, and verifies `#login-username` input is displayed.

### Journey 2: Vehicle Management (`VehicleManagementTest.java`)
- **`testCreateAndSearchVehicle`**:
  - Manager logs in and navigates to the "Vehicles" tab (`#nav-tab-vehicles`).
  - Opens the vehicle creation form (`#btn-add-vehicle`).
  - Inputs registration number, model, vehicle type, and mileage.
  - Submits form and verifies success message `"Vehicle added to fleet successfully"`.
  - Asserts new vehicle is rendered in the fleet data table.
  - Inputs registration into the search box and triggers search; asserts table filters down to the single matching vehicle.

### Journey 3: Driver Defect Reporting (`MaintenanceWorkflowTest.java`)
- **`testDriverReportDefect`**:
  - Driver logs in (`driver1` / `driver123`) and redirects to `/driver`.
  - Navigates to the "Report Issue" tab (`#tab-report-issue`).
  - Selects vehicle from dropdown, inputs defect description into `#textarea-issue-desc`.
  - Submits report (`#btn-submit-defect`) and verifies `"submitted successfully"`.
  - Asserts redirect to "My Reports" and verifies ticket appears with initial status **`OPEN`**.

### Journey 4: Complete Multi-Role Maintenance Lifecycle (`MaintenanceWorkflowTest.java`)
- **`testEndToEndMaintenanceLifecycle`**:
  - **Phase 1 (Driver):** Logs defect with unique identifier (`OPEN`).
  - **Phase 2 (Manager):** Logs in, navigates to Maintenance tab, assigns ticket to `mechanic1`. Asserts status transitions to **`ASSIGNED`**.
  - **Phase 3 (Mechanic):** Logs in (`mechanic1`), clicks "Start Work" (status **`IN_PROGRESS`**), then clicks "Mark Complete" (status **`COMPLETED`**).
  - **Phase 4 (Manager):** Logs in, reviews completed job, clicks "Sign & Close". Asserts ticket final status updates to **`CLOSED`**.

---

## 4. Failure Screenshot Mechanism

The framework implements [`ScreenshotExtension.java`](file:///home/cat/fleet-maintenance-system/selenium-tests/src/test/java/com/abc/fleet/test/ScreenshotExtension.java), registering with JUnit 5 via `@ExtendWith(ScreenshotExtension.class)` in `BaseTest.java`:

- **Mechanism:** Implements `TestExecutionExceptionHandler` to capture high-resolution full-screen PNGs while the browser is still active before teardown.
- **File Naming Pattern:** `{ClassName}_{MethodName}_{yyyyMMdd_HHmmss}.png`
- **Destination:** `selenium-tests/screenshots/`
- **Evidence:** Verified during test suite tuning, capturing failure screenshots for visual triage (e.g., `AuthenticationTest_testLogoutClearsSession_*.png` and `VehicleManagementTest_testCreateAndSearchVehicle_*.png`).

---

## 5. Maven Execution Results

Execution command:
```bash
cd selenium-tests && mvn clean test
```

### Execution Log Output:
```text
[INFO] -------------------------------------------------------
[INFO]  T E S T S
[INFO] -------------------------------------------------------
[INFO] Running com.abc.fleet.test.MaintenanceWorkflowTest
[INFO] Tests run: 2, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 16.38 s -- in com.abc.fleet.test.MaintenanceWorkflowTest
[INFO] Running com.abc.fleet.test.VehicleManagementTest
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 4.320 s -- in com.abc.fleet.test.VehicleManagementTest
[INFO] Running com.abc.fleet.test.AuthenticationTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 10.02 s -- in com.abc.fleet.test.AuthenticationTest
[INFO] 
[INFO] Results:
[INFO] 
[INFO] Tests run: 7, Failures: 0, Errors: 0, Skipped: 0
[INFO] 
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time:  40.418 s
[INFO] Finished at: 2026-10-17T11:08:42+05:30
[INFO] ------------------------------------------------------------------------
```

All 7 test cases across all critical user journeys passed with zero failures and zero errors.
