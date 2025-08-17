// Screenshot Utilities Usage Examples

import { TestUtils } from '../utils/TestUtils';

// Example 1: Standard screenshot with automatic fallback
await TestUtils.takeScreenshot(page, 'test-name');

// Example 2: Viewport-only screenshot (safe for responsive testing)
await TestUtils.takeViewportScreenshot(page, 'responsive-test');

// Example 3: Custom screenshot with specific options
await TestUtils.takeCustomScreenshot(page, 'test-name', {
    fullPage: false, // Use viewport only
    quality: 80      // Reduce file size
});

// Example 4: Handle very long pages with sectioned screenshots
await TestUtils.takeLongPageScreenshots(page, 'long-page-test', 25000);

// Example 5: Take screenshot of specific area
await TestUtils.takeCustomScreenshot(page, 'specific-area', {
    clip: { x: 0, y: 0, width: 800, height: 600 }
});

// Example 6: In test - handling screenshot errors gracefully
test('My test with screenshot handling', async ({ page }) => {
    // Your test code here...
    
    try {
        await TestUtils.takeScreenshot(page, 'my-test');
    } catch (error) {
        console.log('Screenshot failed:', error);
        // Test continues without failing due to screenshot issues
    }

    // For responsive testing, always use viewport screenshots
    await page.setViewportSize({ width: 375, height: 667 });
    await TestUtils.takeViewportScreenshot(page, 'mobile-view');
});
