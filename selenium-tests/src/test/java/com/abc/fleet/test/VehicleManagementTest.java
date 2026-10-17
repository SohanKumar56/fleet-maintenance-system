package com.abc.fleet.test;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("User Journey 2: Vehicle Management (Create, List, & Search)")
public class VehicleManagementTest extends BaseTest {

    @Test
    @DisplayName("Verify Manager Can Add New Vehicle and Search for It")
    public void testCreateAndSearchVehicle() {
        loginAs("manager1", "manager123");
        wait.until(ExpectedConditions.urlContains("/manager"));

        // 1. Navigate to Vehicles tab and wait for current list to load
        WebElement vehiclesTab = waitForVisible(By.id("nav-tab-vehicles"));
        jsClick(vehiclesTab);
        wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("table tbody tr")));

        // 2. Click "+ Add New Vehicle"
        WebElement addVehicleBtn = waitForVisible(By.id("btn-add-vehicle"));
        jsClick(addVehicleBtn);

        // 3. Populate Vehicle Details with unique registration
        String uniqueReg = "KA-01-SL-" + (System.currentTimeMillis() % 10000);
        
        WebElement regInput = waitForVisible(By.id("input-vehicle-reg"));
        WebElement modelInput = driver.findElement(By.id("input-vehicle-model"));
        WebElement typeInput = driver.findElement(By.id("input-vehicle-type"));
        WebElement mileageInput = driver.findElement(By.id("input-vehicle-mileage"));
        setReactInputValue(regInput, uniqueReg);
        setReactInputValue(modelInput, "Scania R500");
        setReactInputValue(typeInput, "Heavy Transport");
        setReactInputValue(mileageInput, "24500");

        WebElement submitBtn = waitForClickable(By.id("btn-save-vehicle"));
        submitForm(submitBtn);

        // 4. Verify Success Message & Table Presence
        WebElement successBanner = waitForVisible(By.cssSelector("p.success"));
        assertTrue(successBanner.getText().contains("Vehicle added to fleet successfully"));

        // Verify row exists in table
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//table//td[text()='" + uniqueReg + "']")));
        WebElement createdRow = driver.findElement(By.xpath("//table//td[text()='" + uniqueReg + "']"));
        assertNotNull(createdRow, "Created vehicle must appear in table");

        // 5. Test Search Filtering
        WebElement searchInput = waitForVisible(By.id("input-search-vehicle"));
        WebElement searchBtn = driver.findElement(By.id("btn-search-vehicle"));

        setReactInputValue(searchInput, uniqueReg);
        jsClick(searchBtn);

        // Wait for search result row and table filter
        wait.until(ExpectedConditions.numberOfElementsToBe(By.cssSelector("table tbody tr"), 1));
        WebElement searchResult = waitForVisible(By.xpath("//table//td[text()='" + uniqueReg + "']"));
        assertEquals(uniqueReg, searchResult.getText().trim());
    }
}
