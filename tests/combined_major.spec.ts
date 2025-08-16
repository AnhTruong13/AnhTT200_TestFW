import { test, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { SignupPage } from '../page-objects/SignupPage';
import { LoginPage } from '../page-objects/LoginPage';
import * as fs from 'fs';

// HomePage Test

test.describe('Combined E2E Tests - Major Browsers', () => {
    test('should load and display main elements on homepage', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.expectTitle();
        await homePage.expectHomeVisible();
        await homePage.expectContactUsVisible();
        await homePage.expectSignupLoginVisible();
    });

    // Signup Test
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
        const account = `Name: ${name}\nEmail: ${email}\nPassword: ${password}\n---\n`;
        fs.appendFileSync('account-records.txt', account);
    });

    // Login/Logout Test
    test('should login and logout successfully', async ({ page }) => {
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
        const loginPage = new LoginPage(page);
        await loginPage.goto();
        await loginPage.login(email, password);
        await loginPage.expectLoggedIn();
        await loginPage.logout();
        await loginPage.expectLoggedOut();
    });

    // Delete static account Test (with Promise)
    test('should create and then delete a single static account', async ({ page }) => {
        const runTest = (): Promise<void> => {
            return new Promise(async (resolve, reject) => {
                try {
                    const name = 'TestUser_To_delete';
                    const email = 'user_to_delete@example.com';
                    const password = 'TestPassword123!';
                    const signupPage = new SignupPage(page);
                    await signupPage.goto();
                    await signupPage.fillSignupForm(name, email);
                    await signupPage.expectAccountInfoForm();
                    await signupPage.completeAccountInfo(password);
                    await signupPage.expectAccountCreated();
                    const loginPage = new LoginPage(page);
                    await loginPage.goto();
                    await loginPage.login(email, password);
                    await loginPage.expectLoggedIn();
                    await page.click('a:has-text("Delete Account")');
                    await page.waitForSelector('h2:has-text("Account Deleted!")');
                    await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        };
        await runTest();
    });

    // Delete latest 4 accounts Test (with Promise.all)
    test('should delete the 4 latest accounts in parallel', async ({ browser }) => {
        function getLatestAccounts(n: number) {
            const data = fs.readFileSync('account-records.txt', 'utf-8');
            const accounts = data.trim().split('---').filter(Boolean);
            return accounts.slice(-n).map(acc => {
                const nameMatch = acc.match(/Name: (.*)/);
                const emailMatch = acc.match(/Email: (.*)/);
                const passwordMatch = acc.match(/Password: (.*)/);
                return {
                    name: nameMatch ? nameMatch[1].trim() : '',
                    email: emailMatch ? emailMatch[1].trim() : '',
                    password: passwordMatch ? passwordMatch[1].trim() : '',
                };
            });
        }
        const latestAccounts = getLatestAccounts(4);
        await Promise.all(latestAccounts.map(async (account) => {
            const context = await browser.newContext();
            const page = await context.newPage();
            const loginPage = new LoginPage(page);
            await loginPage.goto();
            await loginPage.login(account.email, account.password);
            await loginPage.expectLoggedIn();
            await page.click('a:has-text("Delete Account")');
            await page.waitForSelector('h2:has-text("Account Deleted!")');
            await expect(page.locator('h2:has-text("Account Deleted!")')).toBeVisible();
            await context.close();
        }));
    });
});
