package com.abc.fleet.test;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("User Journeys 3 & 4: Maintenance Request & Multi-Role Lifecycle")
public class MaintenanceWorkflowTest extends BaseTest {

    @Test
    @DisplayName("Journey 3: Driver Logs in and Reports Vehicle Defect")
    public void testDriverReportDefect() {
        loginAs("driver1", "driver123");
        wait.until(ExpectedConditions.urlContains("/driver"));

        // 1. Navigate to "Report Issue" Tab
        WebElement reportTab = waitForVisible(By.id("tab-report-issue"));
        jsClick(reportTab);

        // 2. Fill Defect Form
        WebElement vehicleSelectElem = waitForVisible(By.id("select-vehicle"));
        wait.until(d -> new Select(vehicleSelectElem).getOptions().size() > 1);
        Select vehicleSelect = new Select(vehicleSelectElem);
        vehicleSelect.selectByIndex(1);

        String defectSummary = "Front axle vibration at highway speeds (AutoTest)";
        WebElement descTextarea = waitForVisible(By.id("textarea-issue-desc"));
        setReactInputValue(descTextarea, defectSummary);

        WebElement submitBtn = driver.findElement(By.id("btn-submit-defect"));
        jsClick(submitBtn);

        // 3. Verify Success and Auto-Redirect to My Reports
        WebElement successBanner = waitForVisible(By.cssSelector("p.success"));
        assertTrue(successBanner.getText().contains("submitted successfully"));

        // Wait for redirect to My Reports tab
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//table//td[contains(text(),'" + defectSummary + "')]")));
        WebElement reportRow = driver.findElement(By.xpath("//table//tr[td[contains(text(),'" + defectSummary + "')]]"));
        
        assertTrue(reportRow.getText().contains("OPEN"), "New report status must be OPEN");
    }

    @Test
    @DisplayName("Journey 4: Complete End-to-End Maintenance Workflow (Manager Assign -> Mechanic Repair -> Manager Close)")
    public void testEndToEndMaintenanceLifecycle() {
        // Step 1: Driver files a defect
        loginAs("driver1", "driver123");
        wait.until(ExpectedConditions.urlContains("/driver"));

        WebElement reportTab = waitForVisible(By.id("tab-report-issue"));
        jsClick(reportTab);

        WebElement vehicleSelectElem = waitForVisible(By.id("select-vehicle"));
        wait.until(d -> new Select(vehicleSelectElem).getOptions().size() > 1);
        new Select(vehicleSelectElem).selectByIndex(1);

        String uniqueIssue = "Engine overheating check (LifecycleTest " + System.currentTimeMillis() + ")";
        WebElement descArea = waitForVisible(By.id("textarea-issue-desc"));
        setReactInputValue(descArea, uniqueIssue);
        jsClick(driver.findElement(By.id("btn-submit-defect")));

        waitForVisible(By.cssSelector("p.success"));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//table//td[contains(text(),'" + uniqueIssue + "')]")));
        logout();

        // Step 2: Manager Reviews and Assigns to mechanic1
        loginAs("manager1", "manager123");
        wait.until(ExpectedConditions.urlContains("/manager"));

        WebElement maintenanceTab = waitForVisible(By.id("nav-tab-maintenance"));
        jsClick(maintenanceTab);

        // Find the open ticket row and click Assign
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]")));
        WebElement targetRow = driver.findElement(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]"));
        WebElement assignBtn = targetRow.findElement(By.xpath(".//button[contains(text(),'Assign')]"));
        jsClick(assignBtn);

        // Fill assign mechanic form
        WebElement mechInput = waitForVisible(By.id("input-assign-mechanic"));
        setReactInputValue(mechInput, "mechanic1");
        jsClick(driver.findElement(By.id("btn-confirm-assign")));

        // Verify status changes to ASSIGNED
        waitForVisible(By.cssSelector("p.success"));
        WebElement updatedRow = waitForVisible(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]"));
        assertTrue(updatedRow.getText().contains("ASSIGNED"), "Status must update to ASSIGNED");
        logout();

        // Step 3: Mechanic Starts and Completes the Job
        loginAs("mechanic1", "mechanic123");
        wait.until(ExpectedConditions.urlContains("/mechanic"));

        WebElement jobRow = waitForVisible(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]"));
        WebElement startBtn = jobRow.findElement(By.xpath(".//button[contains(text(),'Start Work')]"));
        jsClick(startBtn);

        // Verify status transitions to IN_PROGRESS
        waitForVisible(By.cssSelector("p.success"));
        WebElement inProgressRow = waitForVisible(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]"));
        assertTrue(inProgressRow.getText().contains("IN_PROGRESS"), "Status must update to IN_PROGRESS");

        // Mark as Complete
        WebElement completeBtn = inProgressRow.findElement(By.xpath(".//button[contains(text(),'Mark Complete')]"));
        jsClick(completeBtn);

        waitForVisible(By.cssSelector("p.success"));
        WebElement completedRow = waitForVisible(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]"));
        assertTrue(completedRow.getText().contains("COMPLETED"), "Status must update to COMPLETED");
        logout();

        // Step 4: Manager Closes the Completed Record
        loginAs("manager1", "manager123");
        wait.until(ExpectedConditions.urlContains("/manager"));

        WebElement managerMaintTab = waitForVisible(By.id("nav-tab-maintenance"));
        jsClick(managerMaintTab);

        WebElement reviewRow = waitForVisible(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]"));
        WebElement closeBtn = reviewRow.findElement(By.xpath(".//button[contains(text(),'Sign & Close')]"));
        jsClick(closeBtn);

        waitForVisible(By.cssSelector("p.success"));
        WebElement closedRow = waitForVisible(By.xpath("//table//tr[td[contains(text(),'" + uniqueIssue + "')]]"));
        assertTrue(closedRow.getText().contains("CLOSED"), "Status must finalize as CLOSED");
    }
}
