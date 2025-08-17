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
     * Waits for network idle state and DOM to be fully loaded with fallback strategies
     * @param page - Playwright page object
     * @param timeout - Timeout in milliseconds (default: 30000)
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

    /**
     * Takes a conditional screenshot based on test status or environment
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     * @param testInfo - Playwright test info object (optional, used to check test status)
     * @param force - Force screenshot regardless of conditions (default: false)
     */
    static async takeConditionalScreenshot(page: Page, testName: string, testInfo?: TestInfo, force: boolean = false): Promise<void> {
        // Conditions for taking screenshot:
        // 1. Test is failing/failed
        // 2. Force flag is true
        // 3. Environment variable SCREENSHOTS=all
        // 4. CI environment (for debugging CI issues)

        const shouldTakeScreenshot =
            force ||
            (testInfo && (testInfo.status === 'failed' || testInfo.status === 'timedOut')) ||
            process.env.SCREENSHOTS === 'all' ||
            process.env.CI ||
            process.env.NODE_ENV === 'test';

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
}
