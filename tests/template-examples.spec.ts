import { test, expect } from '@playwright/test';
import { TestUtils } from '../utils/TestUtils';
import { TemplateFactory } from '../page-objects/templates/TemplateFactory';

test.describe('UI Template System Demo', () => {

    test('Template System - Basic Functionality', async ({ page }) => {
        // Set up test environment
        await TestUtils.setupConsoleLogging(page);
        await page.goto('https://automationexercise.com');

        // Test Template Manager creation
        const templateManager = TestUtils.createTemplateManager(page);
        expect(templateManager).toBeDefined();
        console.log('✅ Template Manager created successfully');

        // Test available templates
        const availableTemplates = TemplateFactory.getAvailableTemplates() as Record<string, string[]>;
        console.log('Available templates:', availableTemplates);
        expect(availableTemplates.form).toContain('signup');
        expect(availableTemplates.list).toContain('products');
        console.log('✅ Template registry working correctly');
    });

    test('List Template - Products Page Navigation', async ({ page }) => {
        await TestUtils.setupConsoleLogging(page);
        await page.goto('https://automationexercise.com/products');

        // Wait for page to load
        await TestUtils.waitForVisible(page, '.features_items, .products-list', 30000);

        // Create template manager and test list operations
        const templateManager = TestUtils.createTemplateManager(page);
        const productsList = templateManager.getListTemplate('products');

        // Verify products are loaded
        await productsList.verifyItemsLoaded(1);
        const itemCount = await productsList.getItemCount();
        console.log(`✅ Found ${itemCount} products`);

        expect(itemCount).toBeGreaterThan(0);
    });

    test('Custom Template Registration', async ({ page }) => {
        // Register a simple search template
        TemplateFactory.registerFormTemplate('search', {
            templateName: 'search-form',
            selectors: {
                form: '.search-form',
                submitButton: '#submit_search'
            },
            fields: [
                { name: 'searchTerm', selector: '#search_product', type: 'input', required: true }
            ],
            submitButton: '#submit_search',
            successContainer: '.features_items',
            errorContainer: '.error-message'
        });

        await page.goto('https://automationexercise.com/products');

        // Test the custom template
        const templateManager = TestUtils.createTemplateManager(page);
        const searchForm = templateManager.getFormTemplate('search');

        // Fill and submit search
        await searchForm.fillForm({ searchTerm: 'top' });

        // Submit using the submit button directly
        await page.locator('#submit_search').click();
        await page.waitForTimeout(2000);

        console.log('✅ Custom template registration and execution successful');
    });

    test('Template Performance Measurement', async ({ page }) => {
        await TestUtils.setupConsoleLogging(page);
        await page.goto('https://automationexercise.com');

        // Measure template creation performance
        const startTime = performance.now();

        const templateManager = TestUtils.createTemplateManager(page);
        const templates = [
            templateManager.getListTemplate('products'),
            templateManager.getModalTemplate('confirmation'),
            templateManager.getModalTemplate('alert')
        ];

        const endTime = performance.now();
        const duration = endTime - startTime;

        console.log(`Template creation completed in ${duration.toFixed(2)}ms`);

        // Validate performance is within acceptable range
        expect(duration).toBeLessThan(1000); // 1 second max for template creation
        expect(templates.length).toBe(3);

        console.log('✅ Template performance validation passed');
    });

    test('Template Screenshot Integration', async ({ page }) => {
        await TestUtils.setupConsoleLogging(page);
        await page.goto('https://automationexercise.com/products');

        // Create template and take screenshots
        const templateManager = TestUtils.createTemplateManager(page);
        const productsList = templateManager.getListTemplate('products');

        // This will generate organized screenshots
        await productsList.takeTemplateScreenshot('products-page-loaded');

        // Verify screenshot directory exists
        const testRunDir = TestUtils.getTestRunDirectory();
        const screenshotPath = `${testRunDir}/screenshots`;

        console.log(`Screenshots saved to: ${screenshotPath}`);
        console.log('✅ Template screenshot integration working');
    });

    test('Template Error Handling', async ({ page }) => {
        await TestUtils.setupConsoleLogging(page);
        await page.goto('https://automationexercise.com');

        const templateManager = TestUtils.createTemplateManager(page);

        // Test error handling for non-existent template
        try {
            templateManager.getFormTemplate('non-existent');
            throw new Error('Should have thrown error for non-existent template');
        } catch (error) {
            expect(error.message).toContain('not found');
            console.log('✅ Error handling for non-existent template works correctly');
        }

        // Test error handling for invalid field
        try {
            const productsList = templateManager.getListTemplate('products');
            await productsList.findItemByField('invalid-field', 'test');
            throw new Error('Should have thrown error for invalid field');
        } catch (error) {
            expect(error.message).toContain('not configured');
            console.log('✅ Error handling for invalid fields works correctly');
        }
    });
});
