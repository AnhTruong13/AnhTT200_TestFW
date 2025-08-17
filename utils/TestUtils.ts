import { test, Page, TestInfo, expect } from '@playwright/test';
import * as fs from 'fs';

export class TestUtils {
    /**
     * Enhanced page readiness check with networkidle fallbacks
     * Matches BasePage waitForPageLoad() approach for consistency
     * @param page - Playwright page object
     * @param timeout - Maximum wait time in milliseconds (default: 30000)
     */
    static async waitForPageReady(page: Page, timeout: number = 30000): Promise<void> {
        try {
            // First ensure DOM is ready
            await page.waitForLoadState('domcontentloaded', { timeout: timeout / 3 });

            // Try network idle, but with fallback
            try {
                await page.waitForLoadState('networkidle', { timeout: timeout / 2 });
            } catch (networkError) {
                console.log('Network idle timeout - using load state fallback');
                await page.waitForLoadState('load', { timeout: timeout / 3 });
            }

            // Small buffer for dynamic content
            await page.waitForTimeout(500);

        } catch (error) {
            console.log(`Page ready timeout after ${timeout}ms - continuing with current state`);
            // Don't throw - let the calling code handle the situation
        }
    }

    /**
     * Takes a screenshot and attaches it to the test report
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
            const viewportHeight = await page.evaluate(() => window.innerHeight);

            if (pageHeight <= sectionHeight) {
                // Page is not too long, take regular screenshot
                await this.takeScreenshot(page, testName);
                return;
            }

            // Take multiple screenshots
            let currentPosition = 0;
            let sectionIndex = 1;

            while (currentPosition < pageHeight) {
                await page.evaluate((y) => window.scrollTo(0, y), currentPosition);
                await page.waitForTimeout(500); // Wait for scroll to complete

                const sectionName = `${testName}-section-${sectionIndex}`;
                const screenshotPath = `${screenshotDir}/${sectionName}-${timestamp}.png`;

                await page.screenshot({ path: screenshotPath, fullPage: false });
                console.log(`Long page section screenshot saved: ${screenshotPath}`);

                // Attach to Allure report
                await test.info().attach(sectionName, {
                    body: await page.screenshot({ fullPage: false }),
                    contentType: 'image/png',
                });

                currentPosition += Math.min(sectionHeight, viewportHeight);
                sectionIndex++;
            }

            // Scroll back to top
            await page.evaluate(() => window.scrollTo(0, 0));
            await page.waitForTimeout(500);

        } catch (error) {
            console.log(`Long page screenshots failed for ${testName}: ${error}`);
            // Fallback to regular screenshot
            await this.takeScreenshot(page, testName);
        }
    }

    /**
     * Takes a conditional screenshot based on test status and environment variables
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     * @param testInfo - Playwright test info object
     * @param forceScreenshot - Force screenshot regardless of conditions
     */
    static async takeConditionalScreenshot(page: Page, testName: string, testInfo: TestInfo, forceScreenshot: boolean = false): Promise<void> {
        const screenshotMode = process.env.SCREENSHOTS || 'minimal';
        const shouldTakeScreenshot = forceScreenshot ||
            testInfo.status === 'failed' ||
            testInfo.status === 'timedOut' ||
            screenshotMode === 'all';

        if (shouldTakeScreenshot) {
            await this.takeScreenshot(page, testName);
        } else {
            console.log(`📷 Conditional screenshot skipped for ${testName} (test passing, no force flag)`);
        }
    }

    /**
     * Takes a screenshot for critical test steps (always taken)
     * Use this for important verification points that should always be documented
     * @param page - Playwright page object  
     * @param testName - Name of the test for screenshot filename
     */
    static async takeCriticalScreenshot(page: Page, testName: string): Promise<void> {
        console.log(`📸 Taking critical screenshot: ${testName}`);
        await this.takeScreenshot(page, testName);
    }

    /**
     * Takes a screenshot only for failed tests or specific conditions
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename  
     * @param testInfo - Playwright test info object
     */
    static async takeSmartScreenshot(page: Page, testName: string, testInfo: TestInfo): Promise<void> {
        // Only take screenshot if test failed or explicitly requested
        if (testInfo.status === 'failed' || testInfo.status === 'timedOut') {
            console.log(`🔍 Taking failure screenshot: ${testName}`);
            await this.takeScreenshot(page, testName);
        } else if (process.env.SCREENSHOTS === 'all') {
            console.log(`📋 Taking documentation screenshot: ${testName}`);
            await this.takeScreenshot(page, testName);
        } else {
            console.log(`✅ Smart screenshot skipped for ${testName} (test passed)`);
        }
    }

    /**
     * Records video evidence for specific test steps
     * @param page - Playwright page object
     * @param stepName - Name of the test step
     * @param action - Action to perform while recording
     */
    static async recordStepEvidence<T>(
        page: Page,
        stepName: string,
        action: () => Promise<T>
    ): Promise<T> {
        const videoMode = process.env.VIDEO_MODE;
        const isVideoEnabled = videoMode === 'all' || videoMode === 'on';

        if (isVideoEnabled) {
            console.log(`🎥 Recording video evidence for step: ${stepName}`);
        }

        // Take screenshot before action (if enabled)
        if (process.env.SCREENSHOTS === 'all') {
            await this.takeScreenshot(page, `${stepName}-before`);
        }

        // Execute the action
        const result = await action();

        // Take screenshot after action (if enabled) 
        if (process.env.SCREENSHOTS === 'all') {
            await this.takeScreenshot(page, `${stepName}-after`);
        }

        if (isVideoEnabled) {
            console.log(`✅ Video evidence recorded for step: ${stepName}`);
        }

        return result;
    }

    /**
     * Creates a test step with optional video evidence
     * @param page - Playwright page object
     * @param stepName - Name of the test step
     * @param action - Action to perform
     * @param options - Recording options
     */
    static async testStep<T>(
        page: Page,
        stepName: string,
        action: () => Promise<T>,
        options: {
            screenshot?: boolean;
            critical?: boolean;
            timeout?: number;
        } = {}
    ): Promise<T> {
        console.log(`📋 Executing step: ${stepName}`);

        try {
            const result = await action();

            // Take screenshot based on options and environment
            if (options.screenshot || options.critical || process.env.SCREENSHOTS === 'all') {
                if (options.critical) {
                    await this.takeCriticalScreenshot(page, stepName);
                } else {
                    await this.takeConditionalScreenshot(page, stepName, test.info());
                }
            }

            console.log(`✅ Step completed: ${stepName}`);
            return result;
        } catch (error) {
            console.log(`❌ Step failed: ${stepName}`);
            // Always take screenshot on failure
            await this.takeScreenshot(page, `${stepName}-FAILED`);
            throw error;
        }
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
                console.log(`Created directory: ${dir}`);
            }
        });
    }

    /**
     * Generates a random email address for testing
     * @param domain - Email domain (default: example.com)
     */
    static generateRandomEmail(domain: string = 'example.com'): string {
        const randomString = this.generateRandomString(8);
        return `test_${randomString}@${domain}`;
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
     * Enables full video recording mode for comprehensive evidence collection
     * Note: This method documents the video recording capability
     */
    static getVideoRecordingInfo(): string {
        const videoMode = process.env.VIDEO_MODE || 'retain-on-failure';
        const screenshotMode = process.env.SCREENSHOTS || 'minimal';

        return `📹 Video Recording Configuration:
        - Video Mode: ${videoMode}
        - Screenshot Mode: ${screenshotMode}
        - Output Directory: Evidence/video/
        - Resolution: 1280x720
        
        Available modes:
        - VIDEO_MODE=all: Record all test steps
        - VIDEO_MODE=off: No video recording  
        - VIDEO_MODE=retain-on-failure: Record only failed tests (default)`;
    }

    /**
     * Setup screenshot capture after each test in a describe block
     * @param page - Playwright page object
     */
    static setupScreenshotAfterEach(page: Page): void {
        test.afterEach(async ({ }, testInfo) => {
            if (testInfo.status !== testInfo.expectedStatus) {
                // Test failed, take screenshot
                await this.takeScreenshot(page, `${testInfo.title}-failed`);
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
     * Performs a safe click with retry logic
     * @param page - Playwright page object
     * @param selector - CSS selector
     * @param options - Click options
     */
    static async safeClick(page: Page, selector: string, options: {
        timeout?: number;
        retries?: number;
        waitForNavigationAfter?: boolean;
    } = {}): Promise<void> {
        const timeout = options.timeout || 10000;
        const retries = options.retries || 3;
        let lastError: Error | null = null;

        for (let i = 0; i < retries; i++) {
            try {
                await page.locator(selector).click({ timeout });

                if (options.waitForNavigationAfter) {
                    await page.waitForLoadState('domcontentloaded');
                }
                return; // Success
            } catch (error) {
                lastError = error as Error;
                console.log(`Click attempt ${i + 1} failed: ${error}. Retrying...`);
                await page.waitForTimeout(1000); // Wait before retry
            }
        }

        throw new Error(`Safe click failed after ${retries} attempts. Last error: ${lastError?.message}`);
    }

    /**
     * Sets up console logging to capture browser console messages, errors, and failed requests
     * @param page - Playwright page object
     */
    static setupConsoleLogging(page: Page): void {
        page.on('console', (msg) => {
            const type = msg.type();
            const text = msg.text();
            console.log(`🌐 Browser ${type}: ${text}`);
        });

        page.on('pageerror', (error) => {
            console.error('❌ Page error:', error.message);
        });

        page.on('requestfailed', (request) => {
            const failure = request.failure();
            console.warn(`⚠️ Failed request: ${request.url()} - ${failure?.errorText || 'Unknown error'}`);
        });

        console.log('🔍 Console logging setup complete for browser events');
    }
}
