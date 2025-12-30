/*
* cartPage.spec.js
* Test Scenario: Place an order from the cart page using API-based login.
* Uses centralized test data and APIUtils for token management.
 */

const { test, expect, request } = require('@playwright/test');
const { APIUtils } = require('./utils/APIUtils');
const { loginCredentials } = require('./utils/testData');

let token;

// Get token once before all tests (API-based authentication)
test.beforeAll(async () => {
    const apiContext = await request.newContext();
    const apiUtils = new APIUtils(apiContext, loginCredentials);

    token = await apiUtils.getToken();
});


test('Place the order from cart page via API login', async ({ page }) => {

    // Inject token into browser before navigation 
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

    // Navigate to cart page
    await page.locator("[routerlink='/dashboard/cart']").click();
    await page.locator("div li").first().waitFor();

    // Cart page UI validations
    await expect(page.getByText('My Cart')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Continue Shopping' })).toBeVisible();
    await expect(page.getByText('ZARA COAT 3')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Buy Now' })).toBeVisible();
    await expect(page.getByText('Subtotal')).toBeVisible();
    await expect(page.locator('.label').last()).toHaveText('Total');
    await expect(page.getByRole('button', { name: 'Checkout' })).toBeVisible();

    // Proceed to checkout
    await page.getByRole('button', { name: 'Checkout' }).click();
    await page.locator("[placeholder*='Country']").pressSequentially("ind");
    await page.getByRole('button', { name: 'India' }).nth(1).click();
    await page.getByText('Place Order ').click();

    // Order confirmation page validation
    await expect(page.locator("h1.hero-primary")).toHaveText(" Thankyou for the order. ");

    const orderId = await page.locator("label.ng-star-inserted").textContent();
    console.log(orderId);

    // Validate ordered product details
    await expect(page.locator("div.title").nth(0)).toHaveText("ZARA COAT 3");
})