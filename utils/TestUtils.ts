import { test, Page, TestInfo, expect } from '@playwright/test';
import * as fs from 'fs';

export class TestUtils {
    /**
     * Takes a screenshot and attaches it to the test report
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     */
    static async takeScreenshot(page: Page, testName: string): Promise<void> {
        const timestamp = Date.now();
        const screenshotDir = 'test-results/screenshots';

        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const screenshotPath = `${screenshotDir}/${testName}-${timestamp}.png`;
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`Screenshot saved: ${screenshotPath}`);

        // Attach to Allure report
        await test.info().attach(`${testName}-screenshot`, {
            body: await page.screenshot({ fullPage: true }),
            contentType: 'image/png',
        });
    }

    /**
     * Setup screenshot capture after each test in a describe block
     * Call this function inside your test.describe block
     */
    static setupScreenshots(): void {
        test.afterEach(async ({ page }, testInfo: TestInfo) => {
            await TestUtils.takeScreenshot(page, testInfo.title);
        });
    }

    /**
     * Generates a random email address for testing
     * @param domain - Optional domain (defaults to 'test.com')
     */
    static generateRandomEmail(domain: string = 'test.com'): string {
        const randomString = Math.random().toString(36).substring(2, 15);
        return `user_${randomString}@${domain}`;
    }

    /**
     * Generates a random string of specified length
     * @param length - Length of the string to generate
     */
    static generateRandomString(length: number = 8): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

    /**
     * Waits for network idle state and DOM to be fully loaded
     * @param page - Playwright page object
     * @param timeout - Timeout in milliseconds (default: 30000)
     */
    static async waitForPageReady(page: Page, timeout: number = 30000): Promise<void> {
        await page.waitForLoadState('networkidle', { timeout });
        await page.waitForLoadState('domcontentloaded', { timeout });
    }

    /**
     * Scrolls to an element and ensures it's visible
     * @param page - Playwright page object
     * @param selector - CSS selector or locator
     */
    static async scrollToElement(page: Page, selector: string): Promise<void> {
        const element = page.locator(selector);
        await element.scrollIntoViewIfNeeded();
        await expect(element).toBeVisible();
    }

    /**
     * Gets current timestamp in a readable format
     */
    static getCurrentTimestamp(): string {
        return new Date().toISOString().replace(/[:.]/g, '-');
    }

    /**
     * Creates test data directory if it doesn't exist
     */
    static ensureTestDataDirectory(): void {
        const testDataDir = 'test-results';
        const screenshotsDir = 'test-results/screenshots';

        if (!fs.existsSync(testDataDir)) {
            fs.mkdirSync(testDataDir, { recursive: true });
        }

        if (!fs.existsSync(screenshotsDir)) {
            fs.mkdirSync(screenshotsDir, { recursive: true });
        }
    }

    /**
     * Waits for an element to be visible with custom timeout
     * @param page - Playwright page object
     * @param selector - CSS selector
     * @param timeout - Timeout in milliseconds (default: 10000)
     */
    static async waitForElement(page: Page, selector: string, timeout: number = 10000): Promise<void> {
        await page.locator(selector).waitFor({ state: 'visible', timeout });
    }

    /**
     * Captures and logs console messages during test execution
     * @param page - Playwright page object
     */
    static setupConsoleLogging(page: Page): void {
        page.on('console', msg => {
            if (msg.type() === 'error') {
                console.log(`Console Error: ${msg.text()}`);
            } else if (msg.type() === 'warning') {
                console.log(`Console Warning: ${msg.text()}`);
            }
        });
    }
}
