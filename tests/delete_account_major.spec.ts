import { test, expect } from '@playwright/test';
import { SignupPage } from '../page-objects/SignupPage';
import { LoginPage } from '../page-objects/LoginPage';

test.describe('Delete Account - Major Browsers', () => {
    test('should create and then delete a new account', async ({ page }) => {
        // Create a new account
        const signupPage = new SignupPage(page);
        await signupPage.goto();
        const name = `TestUser_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const email = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
        const password = 'TestPassword123!';
        await signupPage.fillSignupForm(name, email);
        await signupPage.expectAccountInfoForm();
        await signupPage.completeAccountInfo(password);
        await signupPage.expectAccountCreated();

        // Login with the new account
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(email, password);
        await loginPage.expectLoggedIn();

        // Delete the account
        await page.click('a:has-text("Delete Account")');
        await page.waitForSelector('h2:has-text("Account Deleted!")');
        await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
    });
});
