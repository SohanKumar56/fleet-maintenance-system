package com.abc.fleet.test;

import org.junit.jupiter.api.extension.ExtensionContext;
import org.junit.jupiter.api.extension.TestExecutionExceptionHandler;
import org.junit.jupiter.api.extension.TestWatcher;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Optional;

/**
 * JUnit 5 extension that automatically captures a screenshot upon test failure.
 * Implements TestExecutionExceptionHandler to capture while browser is still active.
 */
public class ScreenshotExtension implements TestWatcher, TestExecutionExceptionHandler {

    private static final String SCREENSHOTS_DIR = "screenshots";

    @Override
    public void handleTestExecutionException(ExtensionContext context, Throwable throwable) throws Throwable {
        Optional<Object> testInstance = context.getTestInstance();
        if (testInstance.isPresent() && testInstance.get() instanceof BaseTest) {
            WebDriver driver = ((BaseTest) testInstance.get()).getDriver();
            if (driver != null) {
                captureScreenshot(driver, context.getRequiredTestClass().getSimpleName(), context.getRequiredTestMethod().getName());
            }
        }
        throw throwable; // Rethrow to propagate failure to JUnit
    }

    public static String captureScreenshot(WebDriver driver, String className, String methodName) {
        try {
            TakesScreenshot ts = (TakesScreenshot) driver;
            File source = ts.getScreenshotAs(OutputType.FILE);

            Path dirPath = Paths.get(SCREENSHOTS_DIR);
            if (!Files.exists(dirPath)) {
                Files.createDirectories(dirPath);
            }

            String timestamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
            String fileName = String.format("%s_%s_%s.png", className, methodName, timestamp);
            Path targetPath = dirPath.resolve(fileName);

            Files.copy(source.toPath(), targetPath, StandardCopyOption.REPLACE_EXISTING);
            System.out.println("📸 [Failure Screenshot Captured]: " + targetPath.toAbsolutePath());
            return targetPath.toAbsolutePath().toString();
        } catch (Exception e) {
            System.err.println("Failed to capture failure screenshot: " + e.getMessage());
            return null;
        }
    }
}
