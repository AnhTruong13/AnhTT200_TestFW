import { test, Page, TestInfo, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { TemplateManager } from '../page-objects/templates/TemplateFactory';

export class TestUtils {
    // Static variable to store current test run directory
    private static currentTestRunDir: string | null = null;

    /**
     * Gets or creates a timestamped directory for the current test run
     * @returns The path to the current test run directory
     */
    static getTestRunDirectory(): string {
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
    static ensureTestRunDirectories(testRunDir: string): void {
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
    static resetTestRunDirectory(): void {
        this.currentTestRunDir = null;
        console.log('🔄 Test run directory reset for new session');
    }

    /**
     * Gets the screenshots directory for the current test run
     * @returns The path to the screenshots directory
     */
    static getScreenshotsDirectory(): string {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/screenshots`;
    }

    /**
     * Gets the videos directory for the current test run
     * @returns The path to the videos directory
     */
    static getVideosDirectory(): string {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/videos`;
    }

    /**
     * Gets the traces directory for the current test run
     * @returns The path to the traces directory
     */
    static getTracesDirectory(): string {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/traces`;
    }

    /**
     * Gets the reports directory for the current test run
     * @returns The path to the reports directory
     */
    static getReportsDirectory(): string {
        const testRunDir = this.getTestRunDirectory();
        return `${testRunDir}/reports`;
    }

    /**
     * Waits for a page to be in ready state with enhanced timeout handling
     * @param page - Playwright page object
     * @param options - Wait options with timeout configuration
     */
    static async waitForPageReady(page: Page, options: {
        timeout?: number;
        additionalWait?: number;
    } = {}): Promise<void> {
        const {
            timeout = 30000,
            additionalWait = 1000
        } = options;

        try {
            console.log(`⏳ Waiting for page ready state (timeout: ${timeout}ms)`);

            // Primary wait strategy - networkidle
            await page.waitForLoadState('networkidle', { timeout: timeout });
            console.log('✅ Page reached networkidle state');

        } catch (error) {
            console.log(`⚠️ NetworkIdle timeout, trying domcontentloaded fallback`);
            try {
                await page.waitForLoadState('domcontentloaded', { timeout: Math.min(timeout / 2, 15000) });
                console.log('✅ Page reached domcontentloaded state');
            } catch (fallbackError) {
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
    static async recordStepEvidence(
        page: Page,
        stepName: string,
        description: string
    ): Promise<void> {
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

        } catch (error) {
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
    static async testStep<T>(
        testName: string,
        stepName: string,
        stepFunction: () => Promise<T>,
        page?: Page
    ): Promise<T> {
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

        } catch (error) {
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
    static async takeScreenshot(page: Page, testName: string): Promise<void> {
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
        } catch (error) {
            console.log(`Screenshot failed for ${testName}: ${error}`);
        }
    }

    /**
     * Setup console logging for browser events, network requests, and errors
     * @param page - Playwright page object
     */
    static async setupConsoleLogging(page: Page): Promise<void> {
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
            console.log(`🚫 [Request Failed]: ${request.method()} ${request.url()} - ${request.failure()?.errorText}`);
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
    static async waitForVisible(page: Page, selector: string, timeout: number = 15000): Promise<void> {
        try {
            const element = page.locator(selector);
            await expect(element).toBeVisible({ timeout });
            console.log(`✅ Element visible: ${selector}`);
        } catch (error) {
            console.log(`❌ Element not visible within ${timeout}ms: ${selector}`);
            throw error;
        }
    }

    /**
     * Takes a conditional screenshot based on test status and environment variables
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     * @param testInfo - Test info object (optional)
     */
    static async takeConditionalScreenshot(page: Page, testName: string, testInfo?: TestInfo): Promise<void> {
        const screenshotMode = process.env.SCREENSHOTS || 'minimal';

        if (screenshotMode === 'off') {
            return;
        }

        try {
            await this.takeScreenshot(page, testName);
        } catch (error) {
            console.log(`Conditional screenshot failed for ${testName}: ${error}`);
        }
    }

    /**
     * Takes a critical screenshot (alias for takeScreenshot for backward compatibility)
     * @param page - Playwright page object
     * @param testName - Name of the test for screenshot filename
     */
    static async takeCriticalScreenshot(page: Page, testName: string): Promise<void> {
        await this.takeScreenshot(page, testName);
    }

    /**
     * Creates test data directories if they don't exist (legacy method)
     */
    static ensureTestDataDirectory(): void {
        // Legacy method - now delegates to the new directory structure
        const runDir = this.getTestRunDirectory();
        // The directory creation is already handled by getTestRunDirectory()
    }

    /**
     * Gets video recording configuration information
     * @returns String with video recording information
     */
    static getVideoRecordingInfo(): string {
        const videoMode = process.env.VIDEO_MODE || 'retain-on-failure';
        const screenshotMode = process.env.SCREENSHOTS || 'minimal';
        const currentRunDir = this.getTestRunDirectory();

        return `📹 Video Recording Configuration:
        - Video Mode: ${videoMode}
        - Screenshot Mode: ${screenshotMode}
        - Output Directory: ${currentRunDir}/videos/
        - Resolution: 1280x720
        
        Available modes:
        - VIDEO_MODE=all: Record all test steps
        - VIDEO_MODE=off: No video recording  
        - VIDEO_MODE=retain-on-failure: Record only failed tests (default)`;
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
     * Creates a template manager for the given page
     * @param page - Playwright page object
     * @returns TemplateManager instance
     */
    static createTemplateManager(page: Page): TemplateManager {
        return new TemplateManager(page);
    }

    /**
     * Executes a form template workflow with error handling and screenshots
     * @param page - Playwright page object
     * @param templateName - Name of the form template to use
     * @param formData - Data to fill in the form
     * @param expectedOutcome - Expected result ('success' or 'error')
     */
    static async executeFormTemplate(
        page: Page,
        templateName: string,
        formData: Record<string, any>,
        expectedOutcome: 'success' | 'error' = 'success'
    ): Promise<void> {
        const templateManager = this.createTemplateManager(page);
        const formTemplate = templateManager.getFormTemplate(templateName);

        try {
            console.log(`📝 Executing form template: ${templateName}`);
            await this.takeScreenshot(page, `form-${templateName}-start`);

            // Validate form fields first
            await formTemplate.validateFields();

            // Fill the form
            await formTemplate.fillForm(formData);

            // Submit the form
            await formTemplate.submitForm(expectedOutcome);

            await this.takeScreenshot(page, `form-${templateName}-completed`);
            console.log(`✅ Form template executed successfully: ${templateName}`);
        } catch (error) {
            await this.takeScreenshot(page, `form-${templateName}-error`);
            console.log(`❌ Form template execution failed: ${templateName} - ${error}`);
            throw error;
        }
    }

    /**
     * Executes a list template workflow with item interaction
     * @param page - Playwright page object
     * @param templateName - Name of the list template to use
     * @param action - Action to perform ('view', 'search', 'sort', etc.)
     * @param actionData - Data for the action (search term, sort option, etc.)
     */
    static async executeListTemplate(
        page: Page,
        templateName: string,
        action: string,
        actionData?: any
    ): Promise<any> {
        const templateManager = this.createTemplateManager(page);
        const listTemplate = templateManager.getListTemplate(templateName);

        try {
            console.log(`📋 Executing list template: ${templateName} - ${action}`);
            await this.takeScreenshot(page, `list-${templateName}-${action}-start`);

            let result;

            switch (action) {
                case 'view':
                case 'count':
                    result = await listTemplate.getItemCount();
                    await listTemplate.verifyItemsLoaded();
                    break;
                case 'search':
                    if (!actionData) throw new Error('Search term required for search action');
                    await listTemplate.searchItems(actionData);
                    result = await listTemplate.getItemCount();
                    break;
                case 'sort':
                    if (!actionData) throw new Error('Sort option required for sort action');
                    await listTemplate.sortItems(actionData);
                    result = await listTemplate.getItemCount();
                    break;
                case 'clickFirst':
                    await listTemplate.clickItemByIndex(0);
                    result = 'clicked';
                    break;
                case 'clickByField':
                    if (!actionData?.field || !actionData?.value) {
                        throw new Error('Field name and value required for clickByField action');
                    }
                    await listTemplate.clickItemByField(actionData.field, actionData.value);
                    result = 'clicked';
                    break;
                case 'loadMore':
                    await listTemplate.loadMoreItems();
                    result = await listTemplate.getItemCount();
                    break;
                default:
                    throw new Error(`Unknown list action: ${action}`);
            }

            await this.takeScreenshot(page, `list-${templateName}-${action}-completed`);
            console.log(`✅ List template executed successfully: ${templateName} - ${action}`);
            return result;
        } catch (error) {
            await this.takeScreenshot(page, `list-${templateName}-${action}-error`);
            console.log(`❌ List template execution failed: ${templateName} - ${action} - ${error}`);
            throw error;
        }
    }

    /**
     * Executes a modal template workflow
     * @param page - Playwright page object
     * @param templateName - Name of the modal template to use
     * @param action - Action to perform ('confirm', 'cancel', 'close', 'verify')
     * @param expectedData - Expected modal data for verification
     */
    static async executeModalTemplate(
        page: Page,
        templateName: string,
        action: string,
        expectedData?: { title?: string; content?: string; buttons?: string[] }
    ): Promise<any> {
        const templateManager = this.createTemplateManager(page);
        const modalTemplate = templateManager.getModalTemplate(templateName);

        try {
            console.log(`🔲 Executing modal template: ${templateName} - ${action}`);
            await modalTemplate.waitForModal();
            await this.takeScreenshot(page, `modal-${templateName}-${action}-start`);

            let result;

            switch (action) {
                case 'confirm':
                    await modalTemplate.confirmModal();
                    result = 'confirmed';
                    break;
                case 'cancel':
                    await modalTemplate.cancelModal();
                    result = 'cancelled';
                    break;
                case 'close':
                    await modalTemplate.closeModal();
                    result = 'closed';
                    break;
                case 'closeByEscape':
                    await modalTemplate.closeByEscape();
                    result = 'closed by escape';
                    break;
                case 'closeByOverlay':
                    await modalTemplate.closeByOverlay();
                    result = 'closed by overlay';
                    break;
                case 'verify':
                    if (expectedData?.title) {
                        await modalTemplate.verifyTitle(expectedData.title);
                    }
                    if (expectedData?.content) {
                        await modalTemplate.verifyContentContains(expectedData.content);
                    }
                    if (expectedData?.buttons) {
                        await modalTemplate.verifyButtons(expectedData.buttons);
                    }
                    result = 'verified';
                    break;
                case 'getTitle':
                    result = await modalTemplate.getModalTitle();
                    break;
                case 'getContent':
                    result = await modalTemplate.getModalContent();
                    break;
                default:
                    throw new Error(`Unknown modal action: ${action}`);
            }

            await this.takeScreenshot(page, `modal-${templateName}-${action}-completed`);
            console.log(`✅ Modal template executed successfully: ${templateName} - ${action}`);
            return result;
        } catch (error) {
            await this.takeScreenshot(page, `modal-${templateName}-${action}-error`);
            console.log(`❌ Modal template execution failed: ${templateName} - ${action} - ${error}`);
            throw error;
        }
    }
}
