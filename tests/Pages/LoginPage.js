/*
 * Page Object Model for LoginPage
 * Encapsulates all element locators and actions
 */

class LoginPage {
    constructor(page) {
        this.page = page;

        // Locators for Login Page elements
        this.emailField = page.locator('#userEmail');
        this.passwordField = page.locator('#userPassword');
        this.loginButton = page.locator('#login');
        this.errorMessage = page.locator('.toast-message'); // Toast-Message for Invalid login
    }

    // Navigate to Login Page
    async navigate() {
        await this.page.goto("https://rahulshettyacademy.com/client");
    }

    // Perform Login actions with provided credentials
    async login(email, password) {
        await this.emailField.fill(email);
        await this.passwordField.fill(password);
        await this.loginButton.click();
    }

    // Returns toast error message text 
    async getErrorMessage() {
        await this.errorMessage.waitFor({ state: 'visible', timeout: 5000 });
        return (await this.errorMessage.textContent()).trim();
    }
}
module.exports = { LoginPage };