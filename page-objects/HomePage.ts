import { Page, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://www.automationexercise.com/');
    }

    async expectHomeVisible() {
        await expect(this.page.locator('a:has-text("Home")')).toBeVisible();
    }

    async expectContactUsVisible() {
        await expect(this.page.locator('a:has-text("Contact us")')).toBeVisible();
    }

    async expectSignupLoginVisible() {
        await expect(this.page.locator('a:has-text("Signup / Login")')).toBeVisible();
    }

    async expectTitle() {
        await expect(this.page).toHaveTitle(/Automation Exercise/);
    }
}
