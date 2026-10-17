package com.abc.fleet.test;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import static org.junit.jupiter.api.Assertions.*;

@DisplayName("User Journey 1: Authentication & Role-Based Access Control")
public class AuthenticationTest extends BaseTest {

    @Test
    @DisplayName("Verify Login Page Elements and Structure")
    public void testLoginPageStructure() {
        driver.get(baseUrl + "/login");

        WebElement usernameInput = waitForVisible(By.id("login-username"));
        WebElement passwordInput = driver.findElement(By.id("login-password"));
        WebElement submitButton = driver.findElement(By.id("login-submit"));

        assertNotNull(usernameInput, "Username field must be present");
        assertNotNull(passwordInput, "Password field must be present");
        assertTrue(submitButton.isDisplayed(), "Submit button must be displayed");
        assertTrue(driver.getPageSource().contains("OptiWheels"), "Brand header must be displayed");
    }

    @Test
    @DisplayName("Verify Invalid Credentials Displays Error Message")
    public void testInvalidLoginShowsError() {
        loginAs("invalid_user", "wrong_password");

        WebElement errorAlert = waitForVisible(By.id("login-error"));
        assertTrue(errorAlert.isDisplayed(), "Error message must appear for invalid login");
        assertTrue(driver.getCurrentUrl().contains("/login"), "User must remain on login page after failure");
    }

    @Test
    @DisplayName("Verify Valid Manager Login Redirects to Operations Dashboard")
    public void testValidManagerLogin() {
        loginAs("manager1", "manager123");

        wait.until(ExpectedConditions.urlContains("/manager"));
        WebElement heading = waitForVisible(By.id("role-home-heading"));

        // [TASK-10 DELIBERATE DEFECT]: Intentional assertion mismatch to trigger CI test failure
        assertEquals("Fleet Operations Dashboard [DELIBERATE DEFECT]", heading.getText().trim(),
                "TASK-10: Intentional defect to demonstrate that test failure stops deployment");
        assertTrue(driver.findElement(By.cssSelector("button.logout")).isDisplayed());
    }

    @Test
    @DisplayName("Verify Logout Returns to Login Screen")
    public void testLogoutClearsSession() {
        loginAs("manager1", "manager123");
        wait.until(ExpectedConditions.urlContains("/manager"));

        logout();

        wait.until(ExpectedConditions.urlContains("/login"));
        assertTrue(driver.findElement(By.id("login-username")).isDisplayed());
    }
}
