import { test } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';

test.describe('Homepage - Major Browsers', () => {
    test('should load and display main elements', async ({ page }) => {
        const homePage = new HomePage(page);
        await homePage.goto();
        await homePage.expectTitle();
        await homePage.expectHomeVisible();
        await homePage.expectContactUsVisible();
        await homePage.expectSignupLoginVisible();
    });
});
