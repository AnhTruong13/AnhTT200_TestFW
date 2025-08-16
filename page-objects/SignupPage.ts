import { Page, expect } from '@playwright/test';

export class SignupPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async goto() {
        await this.page.goto('https://www.automationexercise.com/');
        await this.page.click('a:has-text("Signup / Login")');
    }

    async fillSignupForm(name: string, email: string) {
        await this.page.fill('input[data-qa="signup-name"]', name);
        await this.page.fill('input[data-qa="signup-email"]', email);
        await this.page.click('button[data-qa="signup-button"]');
    }

    async expectAccountInfoForm() {
        await expect(this.page.locator('h2:has-text("Enter Account Information")')).toBeVisible();
    }

    async completeAccountInfo(password: string) {
        await this.page.check('input#id_gender1');
        await this.page.fill('input[data-qa="password"]', password);
        await this.page.selectOption('select[data-qa="days"]', '1');
        await this.page.selectOption('select[data-qa="months"]', '1');
        await this.page.selectOption('select[data-qa="years"]', '2000');
        await this.page.fill('input[data-qa="first_name"]', 'Test');
        await this.page.fill('input[data-qa="last_name"]', 'User');
        await this.page.fill('input[data-qa="address"]', '123 Test St');
        await this.page.selectOption('select[data-qa="country"]', 'United States');
        await this.page.fill('input[data-qa="state"]', 'TestState');
        await this.page.fill('input[data-qa="city"]', 'TestCity');
        await this.page.fill('input[data-qa="zipcode"]', '12345');
        await this.page.fill('input[data-qa="mobile_number"]', '+1234567890');
        await this.page.click('button[data-qa="create-account"]');
    }

    async expectAccountCreated() {
        await expect(this.page.locator('h2:has-text("Account Created!")')).toBeVisible();
    }
}
