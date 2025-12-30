/*
 * login.spec.js
 * Contains Login test scenarios:
 * 1. Positive Login scenario
 * 2. Negative Login scenario
 * Uses centralized test data from testData.js
 */

const { test, expect } = require('@playwright/test');
const { LoginPage } = require('./Pages/LoginPage');
const { loginCredentials, invalidLoginCredentials } = require('./utils/testData');

test('Positive Scenario - Successful Login', async ({ page }) => {

    const login = new LoginPage(page);

    // Navigate to Login page
    await login.navigate();

    // Perform Login with valid credentials
    await login.login(loginCredentials.userEmail, loginCredentials.userPassword);

    // Validate URL after successful Login
    await expect(page).toHaveURL(/.*rahulshettyacademy.com/);

    console.log("Login test passed: Successful login");

    // Sign out
    await page.locator('button.btn.btn-custom:has-text(" Sign Out ")').click();

});

test('Negative Scenario - Invalid Credentials', async ({ page }) => {

    const login = new LoginPage(page);

    // Navigate to Login page
    await login.navigate();

    // Validate Login behaviour with incorrect credentials
    await login.login(invalidLoginCredentials.userEmail, invalidLoginCredentials.userPassword);

    // Capture and validate error toast message
    const message = await login.getErrorMessage();
    expect(message).toBe("Incorrect email or password.");

    console.log("Login test passed: Invalid credentials toast displayed");
});


