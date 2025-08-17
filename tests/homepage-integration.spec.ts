import { test, expect } from '../utils/fixtures';
import * as allure from 'allure-js-commons';
import { TestUtils } from '../utils/TestUtils';

test.describe('Homepage to Products Navigation Flow', () => {
    test.beforeEach(async ({ page }) => {
        await allure.epic('E2E User Journey');
        await allure.feature('Homepage to Products Navigation');

        // Ensure test data directories exist
        TestUtils.ensureTestDataDirectory();

        // Only take initial screenshot in CI or if SCREENSHOTS=all is set
        if (process.env.CI || process.env.SCREENSHOTS === 'all') {
            await allure.step('Take initial screenshot', async () => {
                await TestUtils.takeScreenshot(page, 'integration-test-initial');
            });
        }
    });

    test.afterEach(async ({ page }, testInfo) => {
        // Smart screenshot - only on failure or when explicitly requested
        if (testInfo.status === 'failed') {
            await TestUtils.takeScreenshot(page, `integration-failed-${testInfo.title.replace(/\s+/g, '-')}`);
        }
    });

    test('Complete user journey: Homepage -> Products -> Product Details', async ({
        homePage,
        productsPage,
        page
    }, testInfo) => {
        await allure.story('User Navigation Flow');
        await allure.description('Test complete user journey from homepage through product browsing');

        // Setup console logging
        TestUtils.setupConsoleLogging(page);

        // Step 1: Navigate to homepage and verify
        await allure.step('Navigate to homepage', async () => {
            await homePage.navigateToHomePage();
            await homePage.verifyHomePageIsVisible();
            await homePage.verifyPageTitle('Automation Exercise');
            await TestUtils.takeConditionalScreenshot(page, 'homepage-loaded', testInfo);
        });

        // Step 2: Navigate to products page
        await allure.step('Navigate to products page', async () => {
            await homePage.clickNavigationLink('products');
            await productsPage.verifyProductsPageLoaded();
            await TestUtils.takeConditionalScreenshot(page, 'products-page-loaded', testInfo);
        });

        // Step 3: Verify products are displayed
        await allure.step('Verify products are displayed', async () => {
            const productsCount = await productsPage.getProductsCount();
            expect(productsCount).toBeGreaterThan(0);
            console.log(`Found ${productsCount} products on the page`);
            await TestUtils.takeConditionalScreenshot(page, 'products-displayed', testInfo);
        });

        // Step 4: Search for a specific product
        await allure.step('Search for a product', async () => {
            await productsPage.searchProduct('Blue Top');

            // Wait for search results to load
            await TestUtils.waitForPageReady(page);

            const searchResults = await productsPage.getProductsCount();
            console.log(`Found ${searchResults} products matching search criteria`);
            await TestUtils.takeCriticalScreenshot(page, 'search-results');
        });

        // Step 5: View product details
        await allure.step('View product details', async () => {
            if (await productsPage.getProductsCount() > 0) {
                await productsPage.clickViewProduct(0);

                // Verify we're on a product details page
                await expect(page).toHaveURL(/.*product_details.*/);
                await TestUtils.takeCriticalScreenshot(page, 'product-details');
            }
        });
    });

    test('Test homepage responsiveness and performance', async ({ homePage, page }, testInfo) => {
        await allure.story('Performance and Responsiveness');
        await allure.description('Test homepage performance and responsive design');

        // Step 1: Measure page load time
        await allure.step('Measure page load performance', async () => {
            const startTime = Date.now();
            await homePage.navigateToHomePage();
            const loadTime = Date.now() - startTime;

            expect(loadTime).toBeLessThan(10000); // Should load within 10 seconds
            console.log(`Page load time: ${loadTime}ms`);

            await allure.attachment('Page Load Time', `${loadTime}ms`, 'text/plain');
        });

        // Step 2: Test different viewport sizes
        await allure.step('Test responsive design', async () => {
            // Test mobile viewport
            await page.setViewportSize({ width: 375, height: 667 });
            await homePage.verifyHomePageIsVisible();
            await TestUtils.takeConditionalScreenshot(page, 'mobile-viewport', testInfo);

            // Test tablet viewport
            await page.setViewportSize({ width: 768, height: 1024 });
            await homePage.verifyHomePageIsVisible();
            await TestUtils.takeConditionalScreenshot(page, 'tablet-viewport', testInfo);

            // Test desktop viewport
            await page.setViewportSize({ width: 1920, height: 1080 });
            await homePage.verifyHomePageIsVisible();
            await TestUtils.takeConditionalScreenshot(page, 'desktop-viewport', testInfo);
        });
    });

    test('Test homepage interactive elements', async ({ homePage, page }, testInfo) => {
        await allure.story('Interactive Elements');
        await allure.description('Test all interactive elements on the homepage');

        await homePage.navigateToHomePage();

        // Step 1: Test newsletter subscription
        await allure.step('Test newsletter subscription', async () => {
            const testEmail = TestUtils.generateRandomEmail('automation.test');
            await homePage.subscribeToNewsletter(testEmail);

            console.log(`Tested subscription with email: ${testEmail}`);
            await TestUtils.takeConditionalScreenshot(page, 'newsletter-subscription', testInfo);
        });

        // Step 2: Test carousel functionality
        await allure.step('Test carousel navigation', async () => {
            await homePage.verifyCarouselIsWorking();
            await TestUtils.takeConditionalScreenshot(page, 'carousel-interaction', testInfo);
        });

        // Step 3: Test scroll to top functionality
        await allure.step('Test scroll to top button', async () => {
            // Scroll to bottom
            await page.evaluate(() => {
                window.scrollTo(0, document.body.scrollHeight);
            });
            await page.waitForTimeout(1000);

            // Click scroll to top
            await homePage.scrollToTop();

            // Verify we're at or near the top (allow some tolerance for smooth scrolling)
            const scrollPosition = await page.evaluate(() => window.pageYOffset);
            expect(scrollPosition).toBeLessThanOrEqual(100); // Allow up to 100px from the top

            await TestUtils.takeCriticalScreenshot(page, 'scroll-to-top');
        });
    });

    test('Verify all navigation links work correctly', async ({ homePage, page }, testInfo) => {
        await allure.story('Navigation Links Validation');
        await allure.description('Verify all navigation links redirect to correct pages');

        await homePage.navigateToHomePage();

        const navigationTests = [
            { link: 'products', expectedUrlPattern: /.*products.*/ },
            { link: 'contact', expectedUrlPattern: /.*contact_us.*/ },
            { link: 'signup', expectedUrlPattern: /.*login.*/ },
            { link: 'testcases', expectedUrlPattern: /.*test_cases.*/ },
            { link: 'api', expectedUrlPattern: /.*api_list.*/ }
        ];

        for (const navTest of navigationTests) {
            await allure.step(`Test ${navTest.link} navigation`, async () => {
                await homePage.clickNavigationLink(navTest.link);
                await expect(page).toHaveURL(navTest.expectedUrlPattern);
                await TestUtils.takeConditionalScreenshot(page, `navigation-${navTest.link}`, testInfo);
                await page.goBack();
                await TestUtils.waitForPageReady(page);
            });
        }
    });
});
