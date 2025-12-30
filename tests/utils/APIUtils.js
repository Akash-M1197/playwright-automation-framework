const { expect } = require('@playwright/test');

/*
 * APIUtils: Utility class for handling all API-related operations,
 * such as authentication and order creation.
 * Enables reuse of API logic across multiple tests.
 */

class APIUtils {
    constructor(apiContext, loginCredentials) {
        // Playwright's isolated API context for making backend requests
        this.apiContext = apiContext;

        // User credentials required for login and token generation
        this.loginCredentials = loginCredentials;
    }

    // Authenticate the user via API and return a valid token
    async getToken() {
        const loginResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login",
            {
                data: this.loginCredentials,
            });

        // Ensure login API call succeeded
        expect(loginResponse.ok()).toBeTruthy();

        const loginResponseJson = await loginResponse.json();

        // Extract token from response object
        const token = loginResponseJson.token;
        return token;
    }

    /*
     * Creates an order by calling the "Create Order" API
     * using the token fetched from the login API.
     */
    async createOrder(orderPayLoad) {

        // Authenticate and receive a fresh token
        const token = await this.getToken();

        // Create order via API
        const orderResponse = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",
            {
                data: orderPayLoad,
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                }
            }
        );

        const orderResponseJson = await orderResponse.json();

        // Extract the order ID of the created order from the API response
        const orderId = orderResponseJson.orders[0];

        return { token, orderId };
    }
}
module.exports = { APIUtils };