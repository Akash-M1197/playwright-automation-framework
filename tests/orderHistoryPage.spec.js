/*
 * orderHistoryPage.spec.js
 * Test Scenario: Verify order history page and order details for user.
 * Creates an order through API, then validate it on the UI.
 * Uses centralized test data and APIUtils for token management.
 */

const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const { loginCredentials } = require('./utils/testData');
const { orderPayLoad } = require('./utils/testData');

let response;

// Create an order through API before all tests
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginCredentials);
    response = await apiUtils.createOrder(orderPayLoad);
});



test('Order History Page', async ({ page }) => {

    // Inject token into browser local storage before navigation 
    await page.addInitScript(value => {
        window.localStorage.setItem('token', value);
    }, response.token);

    // Navigate to the application
    await page.goto("https://rahulshettyacademy.com/client");
    await page.waitForLoadState('networkidle');

    // Wait for products to load
    await page.locator('.card-body b').first().waitFor();

    // Opens 'My Orders' page
    await page.locator("button[routerlink*='myorders']").click();
    await page.locator("tbody").waitFor();

    const rows = await page.locator("tbody tr");

    // Find and open the specific order created via API
    for (let i = 0; i < await rows.count(); ++i) {
        const rowOrderId = await rows.nth(i).locator('th').textContent();
        if (response.orderId.includes(rowOrderId)) {
            await rows.nth(i).locator("button").first().click();
            break;
        }
    }

    // Verify order details page
    await expect(page.locator("p.tagline")).toHaveText("Thank you for Shopping With Us");
    await expect(page.locator("div.col-text")).toHaveText(response.orderId);
});