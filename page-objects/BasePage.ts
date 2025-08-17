import { Page, Locator, expect } from '@playwright/test';

export abstract class BasePage {
    readonly page: Page;
    readonly header: Locator;
    readonly footer: Locator;
    readonly loadingSpinner: Locator;

    constructor(page: Page) {
        this.page = page;
        this.header = page.locator('header');
        this.footer = page.locator('footer');
        this.loadingSpinner = page.locator('.loading, .spinner');
    }

    async waitForPageLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('domcontentloaded');
    }

    async waitForElement(locator: Locator, timeout: number = 30000): Promise<void> {
        await locator.waitFor({ state: 'visible', timeout });
    }

    async scrollToElement(locator: Locator): Promise<void> {
        await locator.scrollIntoViewIfNeeded();
    }

    async takeScreenshot(name: string): Promise<void> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        await this.page.screenshot({
            path: `test-results/screenshots/${name}-${timestamp}.png`,
            fullPage: true
        });
    }

    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async refreshPage(): Promise<void> {
        await this.page.reload();
        await this.waitForPageLoad();
    }

    async navigateBack(): Promise<void> {
        await this.page.goBack();
        await this.waitForPageLoad();
    }

    async navigateForward(): Promise<void> {
        await this.page.goForward();
        await this.waitForPageLoad();
    }

    async verifyUrl(expectedUrl: string): Promise<void> {
        await expect(this.page).toHaveURL(expectedUrl);
    }

    async verifyPageTitle(expectedTitle: string): Promise<void> {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    async verifyElementVisible(locator: Locator): Promise<void> {
        await expect(locator).toBeVisible();
    }

    async verifyElementHidden(locator: Locator): Promise<void> {
        await expect(locator).toBeHidden();
    }

    async verifyElementText(locator: Locator, expectedText: string): Promise<void> {
        await expect(locator).toHaveText(expectedText);
    }

    async verifyElementContainsText(locator: Locator, expectedText: string): Promise<void> {
        await expect(locator).toContainText(expectedText);
    }
}
