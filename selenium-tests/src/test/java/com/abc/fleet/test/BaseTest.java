package com.abc.fleet.test;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

/**
 * Base test configuration managing WebDriver lifecycle, ChromeOptions,
 * explicit waits, and helper navigation utilities.
 */
@ExtendWith(ScreenshotExtension.class)
public abstract class BaseTest {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected String baseUrl;

    @BeforeEach
    public void setUp() {
        baseUrl = System.getProperty("app.url", "http://localhost:5173");

        WebDriverManager.chromedriver().setup();

        ChromeOptions options = new ChromeOptions();
        options.addArguments("--headless=new");
        options.addArguments("--no-sandbox");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--disable-gpu");
        options.addArguments("--window-size=1920,1080");

        driver = new ChromeDriver(options);
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(3));
        wait = new WebDriverWait(driver, Duration.ofSeconds(8));
    }

    @AfterEach
    public void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }

    public WebDriver getDriver() {
        return driver;
    }

    /**
     * Helper to log into the application with specified credentials
     */
    protected void loginAs(String username, String password) {
        driver.get(baseUrl + "/login");
        
        WebElement usernameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("login-username")));
        WebElement passwordInput = driver.findElement(By.id("login-password"));
        WebElement submitButton = driver.findElement(By.id("login-submit"));

        setReactInputValue(usernameInput, username);
        setReactInputValue(passwordInput, password);

        jsClick(submitButton);
    }

    protected void jsClick(WebElement element) {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    protected void setReactInputValue(WebElement element, String value) {
        ((org.openqa.selenium.JavascriptExecutor) driver).executeScript(
            "const el = arguments[0];" +
            "const val = arguments[1];" +
            "const proto = (el instanceof HTMLTextAreaElement) ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype;" +
            "const setter = Object.getOwnPropertyDescriptor(proto, 'value').set;" +
            "setter.call(el, val);" +
            "el.dispatchEvent(new Event('input', { bubbles: true }));" +
            "el.dispatchEvent(new Event('change', { bubbles: true }));",
            element, value
        );
    }

    /**
     * Helper to log out of the current session
     */
    protected void logout() {
        try {
            WebElement logoutBtn = wait.until(ExpectedConditions.presenceOfElementLocated(By.cssSelector("button.logout")));
            jsClick(logoutBtn);
            wait.until(ExpectedConditions.urlContains("/login"));
        } catch (Exception e) {
            ((org.openqa.selenium.JavascriptExecutor) driver).executeScript("localStorage.clear(); window.location.href='/login';");
            wait.until(ExpectedConditions.urlContains("/login"));
        }
    }

    protected WebElement waitForVisible(By by) {
        return wait.until(ExpectedConditions.visibilityOfElementLocated(by));
    }

    protected WebElement waitForClickable(By by) {
        return wait.until(ExpectedConditions.elementToBeClickable(by));
    }
}
