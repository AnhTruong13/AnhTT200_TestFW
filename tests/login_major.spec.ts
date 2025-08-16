import { test } from '@playwright/test';
import { LoginPage } from '../page-objects/LoginPage';
import * as fs from 'fs';

function getLatestAccount() {
    const data = fs.readFileSync('account-records.txt', 'utf-8');
    const accounts = data.trim().split('---').filter(Boolean);
    const last = accounts[accounts.length - 1];
    const emailMatch = last.match(/Email: (.*)/);
    const passwordMatch = last.match(/Password: (.*)/);
    return {
        email: emailMatch ? emailMatch[1].trim() : '',
        password: passwordMatch ? passwordMatch[1].trim() : '',
    };
}

const { email, password } = getLatestAccount();

test.describe('Login/Logout - Major Browsers', () => {
    test('should login and logout successfully', async ({ page }) => {
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(email, password);
        await loginPage.expectLoggedIn();
        await loginPage.logout();
        await loginPage.expectLoggedOut();
    });
});
