import { Page, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://www.automationexercise.com/');
        await this.page.click('a:has-text("Signup / Login")');
    }

    async login(email: string, password: string) {
        await this.page.fill('input[data-qa="login-email"]', email);
        await this.page.fill('input[data-qa="login-password"]', password);
        await this.page.click('button[data-qa="login-button"]');
    }

    async expectLoggedIn() {
        await expect(this.page.locator('a:has-text("Logged in as")')).toBeVisible();
    }

    async logout() {
        await this.page.click('a:has-text("Logout")');
    }

    async expectLoggedOut() {
        await expect(this.page.locator('a:has-text("Signup / Login")')).toBeVisible();
    }
}
