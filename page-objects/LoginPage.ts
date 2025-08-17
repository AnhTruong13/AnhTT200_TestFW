import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly loginForm: Locator;
    readonly signupForm: Locator;
    readonly loginErrorMessage: Locator;
    readonly signupErrorMessage: Locator;
    readonly loginSuccessMessage: Locator;
    readonly loggedInUserName: Locator;
    readonly logoutLink: Locator;
    readonly deleteAccountLink: Locator;
    readonly forgotPasswordLink: Locator;

    constructor(page: Page) {
        super(page);

        // Login form elements
        this.loginForm = page.locator('form').filter({ hasText: 'Login' });
        this.emailInput = this.loginForm.locator('[data-qa="login-email"]');
        this.passwordInput = this.loginForm.locator('[data-qa="login-password"]');
        this.loginButton = this.loginForm.locator('[data-qa="login-button"]');
        this.loginErrorMessage = page.locator('.login-form p').filter({ hasText: 'incorrect' });
        this.forgotPasswordLink = page.locator('a[href="/forgot_password"]');

        // Signup form elements (on same page)
        this.signupForm = page.locator('form').filter({ hasText: 'Signup' });
        this.signupNameInput = this.signupForm.locator('[data-qa="signup-name"]');
        this.signupEmailInput = this.signupForm.locator('[data-qa="signup-email"]');
        this.signupButton = this.signupForm.locator('[data-qa="signup-button"]');
        this.signupErrorMessage = page.locator('.signup-form p').filter({ hasText: 'exist' });

        // Post-login elements
        this.loginSuccessMessage = page.locator('.navbar-nav').filter({ hasText: 'Logged in as' });
        this.loggedInUserName = page.locator('.navbar-nav li a b');
        this.logoutLink = page.locator('a[href="/logout"]');
        this.deleteAccountLink = page.locator('a[href="/delete_account"]');
    }

    /**
     * Navigate to login page
     */
    async goto(): Promise<void> {
        await this.page.goto('/login');
        await this.waitForPageLoad();
        await this.takeScreenshot('login-page-loaded');
    }

    /**
     * Perform login with credentials
     */
    async login(email: string, password: string): Promise<void> {
        console.log(`🔑 Logging in with email: ${email}`);
        await this.takeScreenshot('before-login');

        await this.waitForElement(this.emailInput);
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);

        await this.takeScreenshot('login-form-filled');
        await this.loginButton.click();

        // Wait for navigation or error message
        await this.page.waitForTimeout(2000);
        await this.takeScreenshot('after-login-attempt');

        console.log('✅ Login attempt completed');
    }

    /**
     * Perform signup (initial step - name and email only)
     */
    async signup(name: string, email: string): Promise<void> {
        console.log(`📝 Signing up with name: ${name}, email: ${email}`);
        await this.takeScreenshot('before-signup');

        await this.waitForElement(this.signupNameInput);
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);

        await this.takeScreenshot('signup-form-filled');
        await this.signupButton.click();

        await this.page.waitForTimeout(2000);
        await this.takeScreenshot('after-signup-attempt');

        console.log('✅ Signup attempt completed');
    }

    /**
     * Verify successful login
     */
    async verifyLoginSuccess(expectedUserName: string): Promise<void> {
        await this.waitForElement(this.loginSuccessMessage);
        await expect(this.loginSuccessMessage).toBeVisible();

        const userName = await this.loggedInUserName.textContent();
        expect(userName?.trim()).toBe(expectedUserName);

        await this.takeScreenshot('login-success-verified');
        console.log(`✅ Login success verified for user: ${expectedUserName}`);
    }

    /**
     * Verify login failure
     */
    async verifyLoginFailure(): Promise<void> {
        await this.waitForElement(this.loginErrorMessage);
        await expect(this.loginErrorMessage).toBeVisible();

        const errorText = await this.loginErrorMessage.textContent();
        expect(errorText).toContain('incorrect');

        await this.takeScreenshot('login-failure-verified');
        console.log('✅ Login failure verified');
    }

    /**
     * Verify signup failure (email already exists)
     */
    async verifySignupFailure(): Promise<void> {
        await this.waitForElement(this.signupErrorMessage);
        await expect(this.signupErrorMessage).toBeVisible();

        const errorText = await this.signupErrorMessage.textContent();
        expect(errorText).toContain('exist');

        await this.takeScreenshot('signup-failure-verified');
        console.log('✅ Signup failure verified - email already exists');
    }

    /**
     * Verify user is redirected to signup form completion
     */
    async verifySignupRedirect(): Promise<void> {
        await this.page.waitForURL('**/signup');
        expect(this.page.url()).toContain('/signup');

        await this.takeScreenshot('signup-redirect-verified');
        console.log('✅ Signup redirect verified');
    }

    /**
     * Logout from the application
     */
    async logout(): Promise<void> {
        console.log('🚪 Logging out');
        await this.takeScreenshot('before-logout');

        await this.waitForElement(this.logoutLink);
        await this.logoutLink.click();

        await this.page.waitForTimeout(2000);
        await this.takeScreenshot('after-logout');

        console.log('✅ Logout completed');
    }

    /**
     * Check if user is currently logged in
     */
    async isLoggedIn(): Promise<boolean> {
        try {
            await this.loginSuccessMessage.waitFor({ state: 'visible', timeout: 5000 });
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get current logged in user name
     */
    async getLoggedInUserName(): Promise<string> {
        if (await this.isLoggedIn()) {
            return await this.loggedInUserName.textContent() || '';
        }
        return '';
    }

    /**
     * Delete user account (if logged in)
     */
    async deleteAccount(): Promise<void> {
        if (await this.isLoggedIn()) {
            console.log('🗑️ Deleting account');
            await this.takeScreenshot('before-delete-account');

            await this.deleteAccountLink.click();
            await this.page.waitForTimeout(2000);

            await this.takeScreenshot('after-delete-account');
            console.log('✅ Account deletion initiated');
        }
    }

    /**
     * Clear all form fields
     */
    async clearLoginForm(): Promise<void> {
        await this.emailInput.clear();
        await this.passwordInput.clear();
        console.log('🧹 Login form cleared');
    }

    /**
     * Clear signup form fields
     */
    async clearSignupForm(): Promise<void> {
        await this.signupNameInput.clear();
        await this.signupEmailInput.clear();
        console.log('🧹 Signup form cleared');
    }
}
