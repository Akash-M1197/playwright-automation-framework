/*
 * dashboardPage.spec.js
 * Test Scenario: Add product to cart using API-based login.
 * Uses centralized test data and APIUtils for token management.
 */

const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const { loginCredentials } = require('./utils/testData');

let token;

// Get authentication token once before all tests (API-based login)

test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginCredentials);

    token = await apiUtils.getToken();
});

test('Add to cart via API login', async ({ page }) => {

    // Inject token into browser local storage before navigation 
    await page.addInitScript(token => {
        window.localStorage.setItem('token', token);
    }, token);


    // Navigate to the application home page
    await page.goto("https://rahulshettyacademy.com/client");

    const productName = 'ZARA COAT 3';
    const products = page.locator(".card-body");

    // Wait for all products to load
    await page.waitForLoadState('networkidle');
    await page.locator('.card-body b').first().waitFor();

    const count = await products.count();

    // Iterate through products and add the target product to cart
    for (let i = 0; i < count; ++i) {
        const name = (await products.nth(i).locator("b").textContent()).trim();

        if (name === productName) {
            await products.nth(i).locator("text= Add To Cart").click();
            break;
        }
    }

})