import { test } from '@playwright/test';
import { SignupPage } from '../page-objects/SignupPage';

// E2E test for signup flow using POM

test.describe('Signup - Major Browsers', () => {
    test('should sign up a new user', async ({ page }) => {
        const signupPage = new SignupPage(page);
        await signupPage.goto();
        const name = `TestUser_${Date.now()}_${Math.floor(Math.random() * 10000)}`;
        const email = `user_${Date.now()}_${Math.floor(Math.random() * 10000)}@example.com`;
        const password = 'TestPassword123!';
        await signupPage.fillSignupForm(name, email);
        await signupPage.expectAccountInfoForm();
        await signupPage.completeAccountInfo(password);
        await signupPage.expectAccountCreated();

        // Record account details
        const fs = require('fs');
        const account = `Name: ${name}\nEmail: ${email}\nPassword: ${password}\n---\n`;
        fs.appendFileSync('account-records.txt', account);
    });
});
