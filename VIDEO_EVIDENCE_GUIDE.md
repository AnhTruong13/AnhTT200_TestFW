# Video Evidence Recording Usage Examples

## Overview
This document provides examples of how to use the new optional video evidence recording features in the Playwright test framework.

## Environment Variables

### Video Recording Modes
```bash
# Record all test steps (comprehensive evidence)
VIDEO_MODE=all

# No video recording (performance mode)
VIDEO_MODE=off

# Record only failed tests (default)
VIDEO_MODE=retain-on-failure
```

### Screenshot Modes  
```bash
# Capture all screenshots
SCREENSHOTS=all

# Minimal screenshots (failures only)
SCREENSHOTS=off

# Default mode (failures + critical points)
# (no environment variable needed)
```

## NPM Scripts for Video Evidence

### Full Evidence Collection
```bash
# Record videos and screenshots for all tests
npm run test:evidence:full

# Record videos and screenshots for Chromium only
npm run test:video:all:chromium

# Record all videos (all browsers)
npm run test:video:all
```

### Minimal Evidence Collection
```bash
# No videos, minimal screenshots
npm run test:evidence:minimal

# Standard minimal mode
npm run test:minimal
```

### Direct Commands (No NPM Warnings)
```bash
# Full video evidence for specific test
npx cross-env VIDEO_MODE=all SCREENSHOTS=all npx playwright test tests/homepage-integration.spec.ts --grep "Complete user journey" --project=chromium

# Minimal evidence for quick testing
npx cross-env VIDEO_MODE=off SCREENSHOTS=off npx playwright test tests/signup.spec.ts --project=chromium
```

## Code Examples

### Using TestUtils.testStep() for Video Evidence
```typescript
// Combines video recording with screenshot evidence
await TestUtils.testStep(page, 'Login with valid credentials', async () => {
    await signupPage.performLogin('user@example.com', 'password123');
    await expect(page).toHaveURL(/.*login.*/);
}, { screenshot: true, critical: true });
```

### Using TestUtils.recordStepEvidence() for Granular Recording
```typescript
// Records before/after screenshots with video evidence
await TestUtils.recordStepEvidence(page, 'Complete checkout process', async () => {
    await cartPage.proceedToCheckout();
    await checkoutPage.fillBillingDetails(testData);
    await checkoutPage.confirmOrder();
});
```

### Checking Video Recording Configuration
```typescript
test('My test with video evidence', async ({ page }) => {
    // Display current video configuration
    if (process.env.VIDEO_MODE === 'all') {
        console.log(TestUtils.getVideoRecordingInfo());
    }
    
    // Your test steps here...
});
```

### Integration Test Example
```typescript
test('Complete user journey with video evidence', async ({ homePage, page }) => {
    // Log video recording status
    if (process.env.VIDEO_MODE === 'all') {
        console.log('🎥 Full video evidence recording enabled');
    }

    // Step 1: Navigate with video evidence
    await TestUtils.testStep(page, 'Navigate to homepage', async () => {
        await homePage.navigateToHomePage();
        await homePage.verifyHomePageIsVisible();
    }, { screenshot: true });

    // Step 2: Search with granular video evidence
    await TestUtils.recordStepEvidence(page, 'Search for products', async () => {
        await homePage.clickNavigationLink('products');
        await productsPage.searchProduct('Blue Top');
    });

    // Step 3: View details with critical evidence
    await TestUtils.testStep(page, 'View product details', async () => {
        await productsPage.clickViewProduct(0);
        await expect(page).toHaveURL(/.*product_details.*/);
    }, { critical: true });
});
```

## Video Output

### File Organization
```
Evidence/video/
├── test-name-browser-timestamp/
│   └── video.webm (1280x720, WebM format)
├── another-test-browser-timestamp/
│   └── video.webm
└── ...
```

### Video Features
- **Resolution**: 1280x720 HD quality
- **Format**: WebM (efficient compression)
- **Mode**: Environment-controlled (all/off/failure-only)
- **Auto-cleanup**: Empty directories removed automatically
- **Allure Integration**: Videos attached to test reports

## Performance Considerations

### When to Use Full Video Recording
```bash
# ✅ Good for:
- Debugging complex failures
- Documenting user journeys
- Creating training materials
- Compliance/audit requirements

# ❌ Avoid for:
- Regular CI/CD pipeline runs
- Performance testing
- Large test suites (storage concerns)
```

### Storage Impact
```bash
# Typical video sizes:
- Short test (30s): ~2-5MB
- Medium test (2min): ~8-15MB  
- Long test (5min): ~20-40MB

# Storage optimization:
VIDEO_MODE=retain-on-failure  # Default - only failed tests
VIDEO_MODE=off                # No videos for CI runs
```

## Best Practices

### 1. Environment-Specific Configuration
```bash
# Local development - full evidence
VIDEO_MODE=all SCREENSHOTS=all

# CI/CD pipeline - minimal evidence  
VIDEO_MODE=off SCREENSHOTS=off

# Staging testing - failure evidence
VIDEO_MODE=retain-on-failure SCREENSHOTS=all
```

### 2. Selective Video Evidence
```typescript
// Use testStep() for important user flows
await TestUtils.testStep(page, 'Critical payment flow', async () => {
    // Important business logic
}, { critical: true });

// Use recordStepEvidence() for complex interactions
await TestUtils.recordStepEvidence(page, 'Multi-step form submission', async () => {
    // Complex form interactions
});
```

### 3. Error Handling
```typescript
test('Test with error handling', async ({ page }) => {
    try {
        await TestUtils.testStep(page, 'Risky operation', async () => {
            // Operation that might fail
        });
    } catch (error) {
        // Video and screenshot automatically captured on failure
        console.log('Operation failed - evidence captured');
        throw error;
    }
});
```

## Configuration Summary

| Mode | Video Recording | Screenshot Capture | Use Case |
|------|-----------------|-------------------|----------|
| `VIDEO_MODE=all SCREENSHOTS=all` | ✅ All steps | ✅ All steps | Full documentation |
| `VIDEO_MODE=retain-on-failure SCREENSHOTS=all` | ❌ Failures only | ✅ All steps | Standard testing |
| `VIDEO_MODE=off SCREENSHOTS=off` | ❌ None | ❌ Failures only | CI/CD performance |

## Troubleshooting

### Common Issues
```bash
# Issue: Videos not recording
# Solution: Check VIDEO_MODE environment variable
echo $VIDEO_MODE  # Should be 'all' for full recording

# Issue: Large video files
# Solution: Use selective recording or reduce resolution
# Note: Resolution is configured in playwright.config.ts

# Issue: Storage space
# Solution: Use npm run clean:evidence between test runs
npm run clean:evidence
```

This comprehensive video evidence system provides flexible, performance-conscious test documentation while maintaining the ability to capture detailed evidence when needed.
