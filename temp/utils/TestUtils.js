import { test, expect } from '@playwright/test';
import * as fs from 'fs';
export class TestUtils {
    /**
     * Gets or creates a timestamped directory for the current test run
     * @returns The path to the current test run directory
     */
    static getTestRunDirectory() {
        if (!this.currentTestRunDir) {
            const timestamp = new Date().toISOString()
                .replace(/[:.]/g, '-')
                .replace('T', '_')
                .substring(0, 19); // Format: YYYY-MM-DD_HH-MM-SS
            this.currentTestRunDir = `Evidence/test-run-${timestamp}`;
            // Create the test run directory structure
            this.ensureTestRunDirectories(this.currentTestRunDir);
            console.log(`🗂️ Created new test run directory: ${this.currentTestRunDir}`);
        }
        return this.currentTestRunDir;
    }
    /**
     * Creates the complete directory structure for a test run
     * @param testRunDir - The base test run directory path
     */
    static ensureTestRunDirectories(testRunDir) {
        const directories = [
            testRunDir,
            `${testRunDir}/screenshots`,
            `${testRunDir}/videos`,
            `${testRunDir}/traces`,
            `${testRunDir}/reports`
        ];
        directories.forEach(dir => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`📁 Created directory: ${dir}`);
            }
        });
    }
    /**
     * Resets the test run directory (for new test sessions)
     * Call this at the beginning of a new test session
     */
    static resetTestRunDirectory() {
        this.currentTestRunDir = null;
        console.log('🔄 Test run directory reset for new session');
    }
    /**
     * Gets the screenshots directory for the current test run
     * @returns The path to the screenshots directory
     */
    static getScreenshotsDirectory() {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/screenshots`;
    }
    /**
     * Gets the videos directory for the current test run
     * @returns The path to the videos directory
     */
    static getVideosDirectory() {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/videos`;
    }
    /**
     * Gets the traces directory for the current test run
     * @returns The path to the traces directory
     */
    static getTracesDirectory() {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/traces`;
    }
    /**
     * Gets the reports directory for the current test run
     * @returns The path to the reports directory
     */
    static getReportsDirectory() {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/reports`;
    }
    /**
     * Waits for a page to be in ready state with enhanced timeout handling
     * @param page - Playwright page object
     * @param options - Wait options with timeout configuration
     */
    static async waitForPageReady(page, options = {}) {
        const { timeout = 30000, additionalWait = 1000 } = options;
        try {
            console.log(`⏳ Waiting for page ready state (timeout: ${timeout}ms)`);
            // Primary wait strategy - networkidle
            await page.waitForLoadState('networkidle', { timeout: timeout });
            console.log('✅ Page reached networkidle state');
        }
        catch (error) {
            console.log(`⚠️ NetworkIdle timeout, trying domcontentloaded fallback`);
            try {
                await page.waitForLoadState('domcontentloaded', { timeout: Math.min(timeout / 2, 15000) });
                console.log('✅ Page reached domcontentloaded state');
            }
            catch (fallbackError) {
                console.log(`⚠️ DOM content loaded timeout, using final fallback`);
                // Final fallback - just wait for load
                await page.waitForLoadState('load', { timeout: 10000 });
                console.log('✅ Page reached basic load state');
            }
        }
        // Additional wait for any remaining async operations
        if (additionalWait > 0) {
            await page.waitForTimeout(additionalWait);
        }
    }
    /**
     * Records step evidence for video recording
     * @param page - Playwright page object
     * @param stepName - Name of the step
     * @param description - Description of the step
     */
    static async recordStepEvidence(page, stepName, description) {
        // Only record if video mode is enabled
        const videoMode = process.env.VIDEO_MODE || 'retain-on-failure';
        if (videoMode === 'off') {
            return;
        }
        try {
            console.log(`🎬 Recording step: ${stepName} - ${description}`);
            // Take a screenshot for this step
            await this.takeScreenshot(page, `${stepName}-step`);
            // Add a small pause to ensure video capture
            await page.waitForTimeout(500);
        }
        catch (error) {
            console.log(`❌ Failed to record step evidence: ${error}`);
        }
    }
    /**
     * Enhanced test step wrapper with video evidence recording
     * @param testName - Name of the test
     * @param stepName - Name of the step
     * @param stepFunction - Function to execute for this step
     * @param page - Playwright page object (optional, for screenshot)
     */
    static async testStep(testName, stepName, stepFunction, page) {
        const fullStepName = `${testName}-${stepName}`;
        console.log(`🔄 Starting step: ${fullStepName}`);
        try {
            // Record step start if video mode is enabled and page is available
            if (page) {
                await this.recordStepEvidence(page, fullStepName, `Starting: ${stepName}`);
            }
            // Execute the step
            const result = await stepFunction();
            // Record step completion
            if (page) {
                await this.recordStepEvidence(page, fullStepName, `Completed: ${stepName}`);
            }
            console.log(`✅ Completed step: ${fullStepName}`);
            return result;
        }
        catch (error) {
            console.log(`❌ Failed step: ${fullStepName} - ${error}`);
            // Record step failure
            if (page) {
                await this.takeScreenshot(page, `${fullStepName}-FAILED`);
            }
            throw error;
        }
    }
    /**
     * Takes a standard screenshot with organized directory structure
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     */
    static async takeScreenshot(page, testName) {
        const timestamp = Date.now();
        const screenshotDir = this.getScreenshotsDirectory();
        const screenshotPath = `${screenshotDir}/${testName}-${timestamp}.png`;
        try {
            await page.screenshot({ path: screenshotPath, fullPage: false });
            console.log(`Screenshot saved: ${screenshotPath}`);
            // Attach to Allure report
            await test.info().attach(testName, {
                body: await page.screenshot(),
                contentType: 'image/png',
            });
        }
        catch (error) {
            console.log(`Screenshot failed for ${testName}: ${error}`);
        }
    }
    /**
     * Setup console logging for browser events, network requests, and errors
     * @param page - Playwright page object
     */
    static async setupConsoleLogging(page) {
        // Listen for console messages
        page.on('console', (msg) => {
            const type = msg.type();
            const text = msg.text();
            console.log(`🖥️ [Browser ${type.toUpperCase()}]: ${text}`);
        });
        // Listen for page errors
        page.on('pageerror', (error) => {
            console.log(`❌ [Page Error]: ${error.message}`);
        });
        // Listen for failed requests
        page.on('requestfailed', (request) => {
            var _a;
            console.log(`🚫 [Request Failed]: ${request.method()} ${request.url()} - ${(_a = request.failure()) === null || _a === void 0 ? void 0 : _a.errorText}`);
        });
        // Listen for response errors (4xx, 5xx)
        page.on('response', (response) => {
            if (response.status() >= 400) {
                console.log(`⚠️ [HTTP Error]: ${response.status()} ${response.url()}`);
            }
        });
        console.log('🔧 Browser console logging enabled');
    }
    /**
     * Waits for an element to be visible with enhanced timeout handling
     * @param page - Playwright page object
     * @param selector - CSS selector for the element
     * @param timeout - Maximum time to wait in milliseconds
     */
    static async waitForVisible(page, selector, timeout = 15000) {
        try {
            const element = page.locator(selector);
            await expect(element).toBeVisible({ timeout });
            console.log(`✅ Element visible: ${selector}`);
        }
        catch (error) {
            console.log(`❌ Element not visible within ${timeout}ms: ${selector}`);
            throw error;
        }
    }
    /**
     * Generates a random email address for testing
     * @param domain - Email domain (default: example.com)
     */
    static generateRandomEmail(domain = 'example.com') {
        const randomString = this.generateRandomString(8);
        return `test_${randomString}@${domain}`;
    }
    /**
     * Generates a random string of specified length
     * @param length - Length of the string to generate
     */
    static generateRandomString(length = 8) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}
// Static variable to store current test run directory
TestUtils.currentTestRunDir = null;
