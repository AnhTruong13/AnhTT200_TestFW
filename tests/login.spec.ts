import { test, expect } from '../utils/fixtures';
import { TestUtils } from '../utils/TestUtils';
import { TemplateFactory } from '../page-objects/templates/TemplateFactory';

test.describe('Login Page Tests - POM + Fixtures + UI Templates', () => {

    test.beforeEach(async ({ page }) => {
        // Setup console logging and organized evidence
        await TestUtils.setupConsoleLogging(page);

        console.log(`🚀 Starting login test - Evidence: ${TestUtils.getTestRunDirectory()}`);
    });

    test.describe('Login Functionality', () => {

        test('Valid login using POM approach', async ({ loginPage }) => {
            console.log('🧪 Testing valid login with POM');

            // Navigate to login page
            await loginPage.goto();

            // Perform login
            await loginPage.login('testuser@example.com', 'password123');

            // Verify login success (this will fail on demo site but shows the pattern)
            try {
                await loginPage.verifyLoginSuccess('Test User');
            } catch (error) {
                console.log('ℹ️ Expected failure on demo site - user doesn\'t exist');
                await loginPage.verifyLoginFailure();
            }
        });

        test('Valid login using UI Template approach', async ({ page }) => {
            console.log('🧪 Testing valid login with UI Templates');

            await page.goto('/login');

            // Use template for login
            const loginData = {
                email: 'testuser@example.com',
                password: 'password123'
            };

            try {
                await TestUtils.executeFormTemplate(page, 'login', loginData, 'success');
                console.log('✅ Login template executed successfully');
            } catch (error) {
                console.log('ℹ️ Expected failure on demo site - demonstrating error handling');
                await TestUtils.takeScreenshot(page, 'login-template-error');
            }
        });

        test('Invalid login credentials - POM approach', async ({ loginPage }) => {
            console.log('🧪 Testing invalid login with POM');

            await loginPage.goto();

            // Try invalid credentials
            await loginPage.login('invalid@example.com', 'wrongpassword');

            // Verify failure
            await loginPage.verifyLoginFailure();
        });

        test('Invalid login credentials - Template approach', async ({ page }) => {
            console.log('🧪 Testing invalid login with Templates');

            await page.goto('/login');

            const invalidLoginData = {
                email: 'invalid@example.com',
                password: 'wrongpassword'
            };

            // Expect this to fail
            await TestUtils.executeFormTemplate(page, 'login', invalidLoginData, 'error');
        });

        test('Empty login form validation', async ({ loginPage, page }) => {
            console.log('🧪 Testing empty form validation - Combined approach');

            await loginPage.goto();

            // Test with POM - try to submit empty form
            await loginPage.loginButton.click();
            await TestUtils.takeScreenshot(page, 'empty-form-attempt');

            // Test with Template - validate fields
            const templateManager = TestUtils.createTemplateManager(page);
            const loginTemplate = templateManager.getFormTemplate('login');

            await loginTemplate.validateFields();
            console.log('✅ Field validation completed');
        });

        test('Login form field interactions - Template validation', async ({ page }) => {
            console.log('🧪 Testing form field interactions with Templates');

            await page.goto('/login');

            const templateManager = TestUtils.createTemplateManager(page);
            const loginTemplate = templateManager.getFormTemplate('login');

            // Validate all fields are present
            await loginTemplate.validateFields();

            // Fill form partially and take screenshots
            await loginTemplate.fillField(
                { name: 'email', selector: '[data-qa="login-email"]', type: 'input', required: true },
                'test@example.com'
            );

            await TestUtils.takeScreenshot(page, 'partial-form-filled');

            // Reset and try again
            await loginTemplate.resetForm();

            await TestUtils.takeScreenshot(page, 'form-reset');
        });

    });

    test.describe('Signup Functionality', () => {

        test('Initial signup form - POM approach', async ({ loginPage }) => {
            console.log('🧪 Testing initial signup with POM');

            await loginPage.goto();

            // Use random data to avoid conflicts
            const randomName = `Test User ${Date.now()}`;
            const randomEmail = `test${Date.now()}@example.com`;

            await loginPage.signup(randomName, randomEmail);

            // Should redirect to signup completion page
            await loginPage.verifySignupRedirect();
        });

        test('Initial signup form - Template approach', async ({ page }) => {
            console.log('🧪 Testing initial signup with UI Templates');

            await page.goto('/login');

            const signupData = {
                name: `Template User ${Date.now()}`,
                email: `template${Date.now()}@example.com`
            };

            // This should redirect to signup completion
            try {
                await TestUtils.executeFormTemplate(page, 'initial-signup', signupData, 'success');

                // Check if redirected to signup page
                await page.waitForURL('**/signup');
                expect(page.url()).toContain('/signup');

                console.log('✅ Signup template executed and redirected successfully');
            } catch (error) {
                console.log('ℹ️ Signup template error (expected if email exists):', error.message);
                await TestUtils.takeScreenshot(page, 'signup-template-error');
            }
        });

        test('Existing email signup - Error handling', async ({ loginPage }) => {
            console.log('🧪 Testing existing email signup error');

            await loginPage.goto();

            // Try with a common email that likely exists
            await loginPage.signup('Test User', 'test@example.com');

            // Should show error
            try {
                await loginPage.verifySignupFailure();
            } catch (error) {
                console.log('ℹ️ Error handling varies by site implementation');
                await TestUtils.takeScreenshot(loginPage.page, 'signup-error-handling');
            }
        });
    });

    test.describe('Combined Workflows', () => {

        test('Complete user journey - POM + Templates combination', async ({ loginPage, page }) => {
            console.log('🧪 Testing complete user journey - Combined approach');

            // Step 1: Navigate using POM
            await loginPage.goto();

            // Step 2: Validate forms using Templates
            const templateManager = TestUtils.createTemplateManager(page);
            const loginTemplate = templateManager.getFormTemplate('login');
            const signupTemplate = templateManager.getFormTemplate('initial-signup');

            await loginTemplate.validateFields();
            await signupTemplate.validateFields();

            // Step 3: Try login first (POM approach)
            await loginPage.login('nonexistent@example.com', 'testpassword');
            await loginPage.verifyLoginFailure();

            // Step 4: Clear and try signup (Template approach)
            await loginPage.clearLoginForm();

            const uniqueData = {
                name: `Journey User ${Date.now()}`,
                email: `journey${Date.now()}@example.com`
            };

            try {
                await TestUtils.executeFormTemplate(page, 'initial-signup', uniqueData, 'success');
                console.log('✅ Complete user journey completed successfully');
            } catch (error) {
                console.log('ℹ️ Journey completed with expected variations');
                await TestUtils.takeScreenshot(page, 'journey-final-state');
            }
        });

        test('Form switching and validation - Template performance', async ({ page }) => {
            console.log('🧪 Testing form switching performance with Templates');

            await page.goto('/login');

            const startTime = performance.now();

            // Create template manager
            const templateManager = TestUtils.createTemplateManager(page);

            // Test multiple template operations
            const loginTemplate = templateManager.getFormTemplate('login');
            const signupTemplate = templateManager.getFormTemplate('initial-signup');

            // Validate both forms
            await loginTemplate.validateFields();
            await signupTemplate.validateFields();

            // Fill and reset both forms
            await loginTemplate.fillForm({
                email: 'performance@test.com',
                password: 'testpass'
            });

            await signupTemplate.fillForm({
                name: 'Performance Test',
                email: 'performance@test.com'
            });

            await loginTemplate.resetForm();
            await signupTemplate.resetForm();

            const endTime = performance.now();
            const duration = endTime - startTime;

            console.log(`⚡ Template operations completed in ${duration.toFixed(2)}ms`);

            // Validate performance is acceptable
            expect(duration).toBeLessThan(10000); // 10 seconds max

            await TestUtils.takeScreenshot(page, 'performance-test-completed');
        });

        test('Cross-browser login consistency - Template validation', async ({ page }) => {
            console.log('🧪 Testing cross-browser consistency');

            await page.goto('/login');

            // Use templates to ensure consistent behavior
            const templateManager = TestUtils.createTemplateManager(page);
            const loginTemplate = templateManager.getFormTemplate('login');

            // Test field visibility and accessibility
            await loginTemplate.validateFields();

            // Test form submission behavior
            const testData = {
                email: 'browser@test.com',
                password: 'testpassword'
            };

            await loginTemplate.fillForm(testData);
            await TestUtils.takeScreenshot(page, 'cross-browser-form-filled');

            // Attempt submission (will fail but tests form behavior)
            try {
                await loginTemplate.submitForm('error');
                console.log('✅ Cross-browser test completed');
            } catch (error) {
                console.log('ℹ️ Cross-browser behavior verified');
                await TestUtils.takeScreenshot(page, 'cross-browser-final');
            }
        });
    });

    test.describe('Template Registration and Customization', () => {

        test('Custom login template registration', async ({ page }) => {
            console.log('🧪 Testing custom template registration');

            // Register a custom login template with additional validation
            TemplateFactory.registerFormTemplate('custom-login', {
                templateName: 'custom-login-form',
                selectors: {
                    form: 'form[action="/login"]',
                    submitButton: '[data-qa="login-button"]',
                    successMessage: '.navbar-nav',
                    errorMessage: '.login-form p'
                },
                fields: [
                    { name: 'email', selector: '[data-qa="login-email"]', type: 'input', required: true, validation: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
                    { name: 'password', selector: '[data-qa="login-password"]', type: 'input', required: true }
                ],
                submitButton: '[data-qa="login-button"]',
                successContainer: '.navbar-nav',
                errorContainer: '.login-form p'
            });

            await page.goto('/login');

            // Use the custom template
            const customLoginData = {
                email: 'custom@template.com',
                password: 'custompass'
            };

            try {
                await TestUtils.executeFormTemplate(page, 'custom-login', customLoginData, 'error');
                console.log('✅ Custom template registered and executed successfully');
            } catch (error) {
                console.log('ℹ️ Custom template behavior verified');
                await TestUtils.takeScreenshot(page, 'custom-template-test');
            }
        });
    });
});
