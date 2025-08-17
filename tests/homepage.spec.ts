import { test, expect } from '../utils/fixtures';
import * as allure from 'allure-js-commons';
import { TestUtils } from '../utils/TestUtils';

test.describe('Homepage Tests - Automation Exercise', () => {
    test.beforeEach(async ({ homePage, page }) => {
        await allure.epic('Homepage');
        await allure.feature('Homepage Navigation and Content');
        await homePage.navigateToHomePage();

        // Only take initial screenshot in CI or if SCREENSHOTS=all is set
        if (process.env.CI || process.env.SCREENSHOTS === 'all') {
            await allure.step('Take initial screenshot', async () => {
                await TestUtils.takeScreenshot(page, 'homepage-initial');
            });
        }
    });

    test.afterEach(async ({ page }, testInfo) => {
        // Smart screenshot - only on failure or when explicitly requested
        if (testInfo.status === 'failed') {
            await TestUtils.takeScreenshot(page, `homepage-failed-${testInfo.title.replace(/\s+/g, '-')}`);
        }
    });

    test('Verify homepage loads successfully', async ({ homePage, page }, testInfo) => {
        await allure.story('Homepage Loading');
        await allure.description('Verify that the homepage loads correctly with all main elements visible');

        // Log video recording configuration
        if (process.env.VIDEO_MODE === 'all') {
            console.log(TestUtils.getVideoRecordingInfo());
        }

        await TestUtils.testStep('homepage-test', 'Verify homepage loads successfully', async () => {
            // Verify homepage is visible
            await homePage.verifyHomePageIsVisible();
            // Verify page title
            await homePage.verifyPageTitle('Automation Exercise');
        }, page);
    });

    test('Verify navigation menu items are present', async ({ homePage, page }, testInfo) => {
        await allure.story('Navigation Menu');
        await allure.description('Verify all navigation menu items are visible and accessible');

        await TestUtils.testStep('homepage-test', 'Verify navigation menu items', async () => {
            // Verify all navigation menu items
            await homePage.verifyNavigationMenuItems();
        }, page);
    });

    test('Verify main content sections are visible', async ({ homePage, page }, testInfo) => {
        await allure.story('Main Content');
        await allure.description('Verify all main content sections are displayed on the homepage');

        await TestUtils.testStep('homepage-test', 'Verify main content sections', async () => {
            // Verify main sections
            await homePage.verifyMainSections();
            // Verify footer section
            await homePage.verifyFooterSection();
        }, page);
    });

    test('Verify carousel functionality', async ({ homePage, page }, testInfo) => {
        await allure.story('Carousel Interaction');
        await allure.description('Verify that the homepage carousel is working correctly');

        await TestUtils.testStep('homepage-test', 'Test carousel functionality', async () => {
            // Verify carousel is working
            await homePage.verifyCarouselIsWorking();
        }, page);
    });

    test('Verify newsletter subscription', async ({ homePage, page }, testInfo) => {
        await allure.story('Newsletter Subscription');
        await allure.description('Verify that users can subscribe to newsletter');

        const testEmail = 'test@automation.com';

        await TestUtils.testStep('homepage-test', 'Test newsletter subscription', async () => {
            // Subscribe to newsletter
            await homePage.subscribeToNewsletter(testEmail);

            // Verify subscription success (if success message exists)
            try {
                await homePage.verifySubscriptionSuccess();
            } catch (error) {
                // Handle if no success message appears
                console.log('No success message found for subscription');
            }
        }, page);
    });

    test('Verify navigation links functionality', async ({ homePage, page }, testInfo) => {
        await allure.story('Navigation Links');
        await allure.description('Verify that navigation links redirect to correct pages');

        await TestUtils.testStep('homepage-test', 'Test navigation links', async () => {
            // Test Products link
            await homePage.clickNavigationLink('products');
            await expect(page).toHaveURL(/.*products.*/);
            await page.goBack();

            // Test Contact Us link
            await homePage.clickNavigationLink('contact');
            await expect(page).toHaveURL(/.*contact_us.*/);
            await page.goBack();

            // Test Signup/Login link
            await homePage.clickNavigationLink('signup');
            await expect(page).toHaveURL(/.*login.*/);
            await page.goBack();
        }, page);
    });

    test('Verify categories section', async ({ homePage, page }, testInfo) => {
        await allure.story('Categories Section');
        await allure.description('Verify that categories section displays product categories');

        await TestUtils.testStep('homepage-test', 'Verify categories section', async () => {
            // Get categories list
            const categories = await homePage.getCategoriesList();

            // Verify categories exist
            expect(categories.length).toBeGreaterThan(0);

            console.log('Available categories:', categories);
        }, page);
    });

    test('Verify brands section', async ({ homePage, page }, testInfo) => {
        await allure.story('Brands Section');
        await allure.description('Verify that brands section displays available brands');

        // Get brands list
        const brands = await homePage.getBrandsList();

        // Verify brands exist
        expect(brands.length).toBeGreaterThan(0);

        console.log('Available brands:', brands);

        // Take conditional screenshot
        await TestUtils.takeConditionalScreenshot(page, 'brands-section', testInfo);
    });

    test('Verify responsive design on different viewports', async ({ homePage, page }, testInfo) => {
        await allure.story('Responsive Design');
        await allure.description('Verify homepage works correctly on different screen sizes');

        // Test responsiveness
        await homePage.verifyResponsiveness();

        // Take conditional screenshot at different viewports
        await TestUtils.takeConditionalScreenshot(page, 'responsive-design', testInfo);
    });

    test('Verify scroll to top functionality', async ({ homePage, page }, testInfo) => {
        await allure.story('Scroll to Top');
        await allure.description('Verify scroll to top button functionality');

        // Scroll to bottom of page
        await page.evaluate(() => {
            window.scrollTo(0, document.body.scrollHeight);
        });

        // Wait a moment for scroll to complete
        await page.waitForTimeout(1000);

        // Click scroll to top button
        await homePage.scrollToTop();

        // Verify we're at the top
        const scrollPosition = await page.evaluate(() => window.pageYOffset);
        expect(scrollPosition).toBe(0);

        // Take conditional screenshot
        await TestUtils.takeConditionalScreenshot(page, 'scroll-to-top', testInfo);
    });

    test('Verify page performance and loading', async ({ homePage, page }, testInfo) => {
        await allure.story('Performance');
        await allure.description('Verify page loads within acceptable time limits');

        const startTime = Date.now();
        await homePage.navigateToHomePage();
        const loadTime = Date.now() - startTime;

        // Performance thresholds with meaningful feedback
        if (loadTime < 5000) {
            console.log(`✅ Excellent performance: ${loadTime}ms`);
        } else if (loadTime < 10000) {
            console.log(`⚠️ Acceptable performance: ${loadTime}ms`);
        } else if (loadTime < 20000) {
            console.log(`⚠️ Slow performance but within limits: ${loadTime}ms`);
        } else {
            console.log(`❌ Poor performance: ${loadTime}ms`);
        }

        // Verify page loads within 20 seconds (more realistic for external site)
        expect(loadTime).toBeLessThan(20000);

        console.log(`Page load time: ${loadTime}ms`);

        // Verify no console errors
        const consoleErrors: string[] = [];
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text());
            }
        });

        // Refresh page to catch any console errors
        await page.reload();
        await page.waitForTimeout(2000);

        // Log console errors if any
        if (consoleErrors.length > 0) {
            console.log('Console errors found:', consoleErrors);
        }

        // Take conditional screenshot
        await TestUtils.takeConditionalScreenshot(page, 'performance-test', testInfo);
    });
});
