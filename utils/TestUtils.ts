import { test, Page, TestInfo, expect } from '@playwright/test';
import * as fs from 'fs';

export class TestUtils {
    /**
     * Takes a screenshot and attaches i            console.log(`Fallback viewport screenshot saved: ${screenshotPath}`);
        }
    }

    /**
     * Takes a viewport-only screenshot (safe for responsive testing)
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     */
    static async takeViewportScreenshot(page: Page, testName: string): Promise<void> {
        const timestamp = Date.now();
        const screenshotDir = 'Evidence/screenshots';

        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const screenshotPath = `${screenshotDir}/${testName}-${timestamp}.png`;

        try {
            // Always use viewport screenshot for safety
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`Viewport screenshot saved: ${screenshotPath}`);

            // Attach to Allure report
            await test.info().attach(`${testName}-viewport-screenshot`, {
                body: await page.screenshot({ fullPage: false }),
                contentType: 'image/png',
            });
        } catch (error: any) {
            console.error(`Viewport screenshot failed for ${testName}: ${error.message}`);
            // Don't throw the error to prevent test failure
        }
    }

    /**
     * Setup screenshot capture after each test in a describe blockhe test report
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     */
    static async takeScreenshot(page: Page, testName: string): Promise<void> {
        const timestamp = Date.now();
        const screenshotDir = 'Evidence/screenshots';

        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const screenshotPath = `${screenshotDir}/${testName}-${timestamp}.png`;

        try {
            // First try full page screenshot
            await page.screenshot({ path: screenshotPath, fullPage: true });
            console.log(`Screenshot saved: ${screenshotPath}`);

            // Attach to Allure report
            await test.info().attach(`${testName}-screenshot`, {
                body: await page.screenshot({ fullPage: true }),
                contentType: 'image/png',
            });
        } catch (error: any) {
            // If full page screenshot fails due to size limit, take viewport screenshot
            console.log(`Full page screenshot failed for ${testName}: ${error.message}, taking viewport screenshot instead`);

            try {
                await page.screenshot({ path: screenshotPath, fullPage: false });
                console.log(`Viewport screenshot saved: ${screenshotPath}`);

                // Attach viewport screenshot to Allure report
                await test.info().attach(`${testName}-viewport-screenshot`, {
                    body: await page.screenshot({ fullPage: false }),
                    contentType: 'image/png',
                });
            } catch (fallbackError: any) {
                console.error(`Both full page and viewport screenshots failed for ${testName}: ${fallbackError.message}`);
                // Don't throw the error to prevent test failure due to screenshot issues
            }
        }
    }

    /**
     * Takes a screenshot with custom options
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     * @param options - Screenshot options
     */
    static async takeCustomScreenshot(page: Page, testName: string, options: {
        fullPage?: boolean;
        clip?: { x: number; y: number; width: number; height: number };
        quality?: number;
    } = {}): Promise<void> {
        const timestamp = Date.now();
        const screenshotDir = 'Evidence/screenshots';

        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        const screenshotPath = `${screenshotDir}/${testName}-${timestamp}.png`;

        try {
            const screenshotOptions = {
                path: screenshotPath,
                fullPage: options.fullPage !== undefined ? options.fullPage : false,
                ...(options.clip && { clip: options.clip }),
                ...(options.quality && { quality: options.quality })
            };

            await page.screenshot(screenshotOptions);
            console.log(`Custom screenshot saved: ${screenshotPath}`);

            // Attach to Allure report
            const attachmentOptions = {
                fullPage: options.fullPage !== undefined ? options.fullPage : false,
                ...(options.clip && { clip: options.clip }),
                ...(options.quality && { quality: options.quality })
            };

            await test.info().attach(`${testName}-custom-screenshot`, {
                body: await page.screenshot(attachmentOptions),
                contentType: 'image/png',
            });
        } catch (error) {
            console.log(`Custom screenshot failed for ${testName}: ${error}`);
            // Fallback to viewport screenshot
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`Fallback viewport screenshot saved: ${screenshotPath}`);
        }
    }

    /**
     * Takes multiple screenshots for very long pages that exceed pixel limits
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     * @param sectionHeight - Height of each section in pixels (default: 30000)
     */
    static async takeLongPageScreenshots(page: Page, testName: string, sectionHeight: number = 30000): Promise<void> {
        const timestamp = Date.now();
        const screenshotDir = 'Evidence/screenshots';

        // Create screenshots directory if it doesn't exist
        if (!fs.existsSync(screenshotDir)) {
            fs.mkdirSync(screenshotDir, { recursive: true });
        }

        try {
            // Get page dimensions
            const pageHeight = await page.evaluate(() => document.body.scrollHeight);
            const viewportSize = await page.viewportSize();
            const viewportHeight = viewportSize?.height || 720;

            console.log(`Page height: ${pageHeight}px, taking sectioned screenshots`);

            // Take viewport screenshot first (always safe)
            const viewportPath = `${screenshotDir}/${testName}-viewport-${timestamp}.png`;
            await page.screenshot({ path: viewportPath, fullPage: false });

            // If page is not too long, try full page
            if (pageHeight <= 30000) {
                try {
                    const fullPagePath = `${screenshotDir}/${testName}-fullpage-${timestamp}.png`;
                    await page.screenshot({ path: fullPagePath, fullPage: true });
                    console.log(`Full page screenshot saved: ${fullPagePath}`);
                    return;
                } catch (error) {
                    console.log('Full page screenshot failed, continuing with sectioned approach');
                }
            }

            // Take sectioned screenshots for very long pages
            const sections = Math.ceil(pageHeight / sectionHeight);
            console.log(`Taking ${sections} section screenshots`);

            for (let i = 0; i < sections; i++) {
                const y = i * sectionHeight;
                const height = Math.min(sectionHeight, pageHeight - y);

                // Scroll to the section
                await page.evaluate((scrollY) => window.scrollTo(0, scrollY), y);
                await page.waitForTimeout(500); // Wait for scroll to complete

                const sectionPath = `${screenshotDir}/${testName}-section-${i + 1}-${timestamp}.png`;
                await page.screenshot({
                    path: sectionPath,
                    clip: { x: 0, y: 0, width: viewportSize?.width || 1280, height: viewportHeight }
                });

                console.log(`Section ${i + 1}/${sections} screenshot saved: ${sectionPath}`);
            }

            // Scroll back to top
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(500);

        } catch (error) {
            console.log(`Long page screenshot failed: ${error}`);
            // Final fallback - just take viewport screenshot
            const fallbackPath = `${screenshotDir}/${testName}-fallback-${timestamp}.png`;
            await page.screenshot({ path: fallbackPath, fullPage: false });
            console.log(`Fallback screenshot saved: ${fallbackPath}`);
        }
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
     * Creates test data directories if they don't exist
     */
    static ensureTestDataDirectory(): void {
        const evidenceDir = 'Evidence';
        const videoDir = 'Evidence/video';
        const screenshotsDir = 'Evidence/screenshots';
        const tracesDir = 'Evidence/traces';

        // Create all necessary directories
        [evidenceDir, videoDir, screenshotsDir, tracesDir].forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
        });
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
