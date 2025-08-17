# Homepage Tests for Automation Exercise

This comprehensive test suite provides end-to-end testing for the [Automation Exercise](https://www.automationexercise.com/) homepage using Playwright with Page Object Model (POM) pattern, custom fixtures, and advanced evidence collection capabilities.

## 🚀 Recent Enhancements (August 2025)

### New Features Added:
- **Optional Video Evidence Recording**: Dynamic video capture with VIDEO_MODE environment variable (all/off/retain-on-failure)
- **Step-by-Step Evidence**: Comprehensive screenshot and video evidence for every test step
- **TestUtils Integration**: Enhanced utility methods for video evidence recording (recordStepEvidence, testStep)
- **Smart Screenshots**: Viewport screenshots to prevent size limit issues (before/after each step)
- **Dual Reporting**: Both Allure and HTML reports generated simultaneously with video evidence
- **Evidence Directory**: Organized storage for videos, screenshots, and traces with timestamp organization
- **Mixed Content Handling**: Graceful handling of HTTPS/HTTP warnings
- **Modern Allure Integration**: Updated to use allure-js-commons (no deprecation warnings)
- **Cross-Platform Compatibility**: Enhanced npm scripts with cross-env and rimraf support
- **Enhanced Timeout Configuration**: Optimized timeouts for complex web applications (60s test timeout, 15s action timeout, 10s assertion timeout)

## 📁 Project Structure

```
├── page-objects/
│   ├── BasePage.ts               # Base page class with common methods
│   ├── HomePage.ts               # Homepage POM with enhanced selectors
│   └── ProductsPage.ts           # Products page object model
├── utils/
│   ├── fixtures.ts               # Custom Playwright fixtures
│   ├── TestUtils.ts              # Enhanced utilities with screenshot handling
│   └── screenshot-examples.md    # Screenshot utility documentation
├── tests/
│   ├── homepage.spec.ts          # Homepage tests (11 comprehensive tests with video evidence)
│   └── homepage-integration.spec.ts # Integration tests (4 user journey tests with full video recording)
├── utils/
│   └── TestUtils.ts              # Enhanced utility methods with video evidence recording
├── Evidence/                     # Test artifacts and evidence with timestamp organization
│   ├── video/                    # Test execution videos (WebM) with step-by-step recording
│   ├── screenshots/              # Screenshots with before/after step evidence
│   ├── traces/                   # Playwright traces
│   └── README.md                 # Evidence documentation
├── allure-results/               # Raw Allure test results (JSON) with video attachments
├── allure-report/                # Generated Allure HTML reports with embedded video evidence
├── VIDEO_EVIDENCE_GUIDE.md       # Comprehensive guide for video evidence recording
└── manual-steps_AllTests.md      # Manual testing procedures
```

## ✨ Features

### Page Object Models (POMs)
- **BasePage**: Common functionality with enhanced navigation methods
- **HomePage**: Comprehensive homepage interactions with strict mode fixes
- **ProductsPage**: Full product page functionality with search capabilities

### Custom Fixtures
- Pre-configured page objects injected into tests
- Consistent setup and teardown across all test scenarios
- Enhanced error handling and recovery mechanisms

### Advanced Test Utilities
- **Smart Screenshot System**: Automatic fallback for large pages (>32,767px)
- **Viewport Screenshots**: Safe screenshot method for responsive testing
- **Long Page Screenshots**: Sectioned capture for extremely long pages
- **Custom Screenshot Options**: Clipping, quality, and format control
- **Random Data Generation**: Dynamic test data for realistic testing
- **Performance Monitoring**: Page load time measurement and analysis
- **Evidence Collection**: Organized storage with automatic cleanup
- **Allure Integration**: Rich reporting with step-by-step documentation

### Video Evidence Recording System
- **Dynamic VIDEO_MODE**: Environment-controlled video capture (all/off/retain-on-failure)
- **Step-by-Step Recording**: Complete video evidence for every test action with TestUtils.testStep()
- **Before/After Screenshots**: Comprehensive visual evidence with TestUtils.recordStepEvidence()
- **High Quality**: 1280x720 WebM format for clear debugging and documentation
- **Organized Storage**: Structured directories with timestamp organization and test context
- **Allure Integration**: Videos and screenshots automatically attached to detailed test reports
- **Performance Optimized**: Minimal impact on test execution with smart recording triggers

## 🎯 Test Coverage

### Homepage Tests (`homepage.spec.ts`) - 11 Comprehensive Tests with Video Evidence
1. ✅ **Homepage Loading**: Page load verification with performance metrics and video evidence
2. ✅ **Navigation Menu**: Enhanced validation with strict mode fixes and step recording
3. ✅ **Content Sections**: Complete visibility verification with before/after screenshots
4. ✅ **Carousel Functionality**: Multi-pattern selector matching with video evidence of interactions
5. ✅ **Newsletter Subscription**: Dynamic email testing with complete form interaction recording
6. ✅ **Navigation Links**: Comprehensive link verification with click evidence and error handling
7. ✅ **Categories Section**: Product category validation with interaction video evidence
8. ✅ **Brands Section**: Brand listing verification with click testing and visual evidence
9. ✅ **Responsive Design**: Multi-viewport testing with video evidence across devices
10. ✅ **Scroll to Top**: Enhanced scroll functionality with position tolerance and scroll evidence
11. ✅ **Performance Testing**: Load time monitoring with console error detection and performance evidence

### Integration Tests (`homepage-integration.spec.ts`) - 4 User Journey Tests with Full Video Recording
1. ✅ **Complete User Journey**: Homepage → Products → Product Details flow
2. ✅ **Responsive Performance**: Cross-viewport performance with metrics capture
3. ✅ **Interactive Elements**: Newsletter, carousel, scroll functionality testing
4. ✅ **Navigation Validation**: Comprehensive navigation link verification

### Test Enhancements & Fixes
- **Mixed Content Handling**: Graceful handling of HTTPS/HTTP font loading warnings
- **Screenshot Size Limits**: Automatic fallback when pages exceed 32,767px limit
- **Strict Mode Violations**: Specific CSS selectors for duplicate elements
- **Page Loading Stability**: Enhanced loading with `domcontentloaded` fallback
- **Carousel Testing**: Multiple selector patterns for different implementations
- **Error Recovery**: Comprehensive try-catch blocks preventing test failures

## 🚀 Running Tests

### Basic Test Execution
```bash
# Run all homepage tests
npm run test:homepage

# Run integration tests  
npm run test:integration

# Run all tests with video evidence recording (all steps)
npm run test:video:all

# Run all tests with video evidence (Chromium only)
npm run test:video:all:chromium

# Run tests in headed mode
npm run test:headed

# Debug tests interactively
npm run test:debug
```

### Video Evidence Options
```bash
# Full video evidence with comprehensive step recording
npm run test:evidence:full

# Minimal video evidence (failures only)
npm run test:evidence:minimal

# Clean all evidence before running tests
npm run test:clean:all
```

### Advanced Test Options
```bash
# Run specific test file
npx playwright test tests/homepage.spec.ts

# Run specific test by name
npx playwright test --grep "Verify homepage loads"

# Run tests on specific browser
npx playwright test --project=chromium

# Run tests with UI mode
npx playwright test --ui
```

### Evidence Management
```bash
# Clean all evidence directories
npm run clean:evidence

# View test artifacts
# Videos: Evidence/video/
# Screenshots: Evidence/screenshots/
# Traces: Evidence/traces/
```

## 📊 Reporting & Evidence

### Allure Reports
```bash
# Generate and serve interactive report
npm run report

# Generate static HTML report  
npm run report:generate

# Open static report in browser
npm run report:open
```

### Evidence Collection
- **Videos**: Automatic WebM recordings on test failures (1280x720)
- **Screenshots**: Smart capturing with size limit handling
- **Traces**: Playwright traces for detailed debugging
- **Error Context**: Markdown files with detailed failure information
- **Performance Metrics**: Page load times and console error logs

### Report Features
- **Interactive Dashboard**: Test results overview with pass/fail statistics
- **Test Steps**: Detailed step-by-step execution with Allure annotations
- **Visual Evidence**: Screenshots and videos embedded in reports
- **Error Analysis**: Stack traces and failure context
- **History Tracking**: Test execution trends over time
- **Browser Details**: Environment information and configurations

## 🔑 Key Features

### 🏗️ Enhanced Page Object Model
- Clean separation of test logic and page interactions with strict mode compliance
- Reusable page methods with comprehensive error handling
- Easy maintenance with centralized element locators
- Multi-selector patterns for different website implementations

### 🔧 Advanced Custom Fixtures
- Automatic page object initialization with dependency injection
- Consistent test setup with error recovery mechanisms
- Reduced boilerplate code with enhanced utility integration
- Pre-configured browser contexts with optimal settings

### 📊 Comprehensive Reporting & Video Evidence
- **Allure Integration**: Rich reports with step-by-step documentation and embedded videos
- **Optional Video Evidence**: Dynamic VIDEO_MODE control (all/off/retain-on-failure) for complete test recording
- **Step-by-Step Evidence**: TestUtils.testStep() and TestUtils.recordStepEvidence() for granular documentation
- **Smart Screenshots**: Before/after action screenshots with automatic fallback for large pages
- **Performance Metrics**: Load time measurement and console error tracking with video evidence
- **Error Context**: Detailed failure analysis with video playback and markdown documentation
- **Timestamp Organization**: Structured evidence storage with test execution timestamps

### 📱 Cross-Browser & Responsive Testing
- **Multi-Browser Support**: Chrome, Firefox, Edge, Safari, and branded browsers
- **Responsive Design**: Mobile (375x667), tablet (768x1024), desktop (1920x1080)
- **Viewport Testing**: Dedicated screenshot utilities for responsive validation
- **Performance Monitoring**: Cross-browser performance comparison

### 🚀 Enhanced Performance & Reliability
- **Mixed Content Handling**: Graceful handling of HTTPS/HTTP warnings
- **Page Load Optimization**: `domcontentloaded` with element visibility fallback
- **Screenshot Size Limits**: Automatic viewport fallback for large pages
- **Error Recovery**: Comprehensive try-catch blocks preventing test failures
- **Carousel Testing**: Multiple selector patterns with automatic fallbacks

## 💡 Example Usage

### Basic Test with Enhanced Features
```typescript
test('Verify homepage loads successfully', async ({ homePage, page }) => {
    await allure.epic('Homepage');
    await allure.feature('Basic Functionality');
    await allure.story('Page Loading');
    
    // Navigate with enhanced loading handling
    await homePage.navigateToHomePage();
    await homePage.verifyHomePageIsVisible();
    await homePage.verifyPageTitle('Automation Exercise');
    
    // Smart screenshot with automatic fallback
    await TestUtils.takeScreenshot(page, 'homepage-loaded');
});
```

### Responsive Testing with Viewport Screenshots
```typescript
test('Test responsive design', async ({ homePage, page }) => {
    await allure.step('Test mobile viewport', async () => {
        await page.setViewportSize({ width: 375, height: 667 });
        await homePage.verifyHomePageIsVisible();
        // Safe screenshot for responsive testing
        await TestUtils.takeViewportScreenshot(page, 'mobile-view');
    });
});
```

### Integration Test with Error Handling
```typescript
test('Complete user journey', async ({ homePage, productsPage, page }) => {
    await allure.story('User Journey');
    
    // Enhanced navigation with strict mode handling
    await homePage.navigateToHomePage();
    await homePage.clickNavigationLink('products');
    
    // Smart evidence collection
    await TestUtils.takeScreenshot(page, 'products-page');
    
    // Performance monitoring
    const loadTime = await TestUtils.measurePageLoadTime(page);
    await allure.attachment('Load Time', `${loadTime}ms`, 'text/plain');
});
```

## ⚙️ Configuration & Settings

### Playwright Configuration
- **Base URL**: `https://www.automationexercise.com`
- **Video Recording**: `retain-on-failure` mode at 1280x720 resolution
- **Screenshots**: Viewport mode by default to prevent size limit errors
- **HTTPS Handling**: `ignoreHTTPSErrors: true` for mixed content warnings
- **Timeouts**: Optimized timeouts with fallback mechanisms
- **Parallel Execution**: Multi-worker setup for faster test execution

### Browser Support
- **Chromium**: Primary testing browser with full feature support
- **Firefox**: Cross-browser compatibility verification
- **Safari/WebKit**: Apple ecosystem testing
- **Microsoft Edge**: Enterprise browser support
- **Google Chrome**: Branded Chrome testing

### Evidence Configuration
- **Video Output**: `Evidence/video/` with automatic cleanup
- **Screenshot Directory**: `Evidence/screenshots/` with organized naming
- **Trace Files**: `Evidence/traces/` for detailed debugging
- **Allure Reports**: `allure-report/` with rich HTML interface

## 🔧 Troubleshooting & Solutions

### Known Issues & Fixes

#### Screenshot Size Limits
- **Issue**: "Cannot take screenshot larger than 32767 pixels"
- **Solution**: Automatic viewport fallback implemented
- **Usage**: `TestUtils.takeViewportScreenshot()` for safe capture

#### Mixed Content Warnings
- **Issue**: HTTP resources on HTTPS pages (Google Fonts)
- **Solution**: Framework configured with `ignoreHTTPSErrors: true`
- **Impact**: Harmless console warnings, tests continue normally

#### Strict Mode Violations  
- **Issue**: Multiple elements with same selector
- **Solution**: Navbar-specific selectors (`.navbar-nav a[href="..."]`)
- **Result**: Reliable element targeting without ambiguity

#### Page Loading Timeouts
- **Issue**: Network timeout with `networkidle` state
- **Solution**: Changed to `domcontentloaded` with visibility fallback
- **Benefit**: Faster and more reliable test execution

## 🏆 Best Practices Implemented

1. **Enhanced Page Object Model**: Clean separation with strict mode compliance
2. **Advanced Custom Fixtures**: Dependency injection with error recovery
3. **Smart Utility Functions**: Screenshot handling with automatic fallbacks
4. **Comprehensive Assertions**: Thorough validation with error context
5. **Robust Error Handling**: Graceful handling of edge cases and failures
6. **Performance Monitoring**: Load time tracking and console error detection
7. **Cross-Browser & Responsive**: Multi-browser and viewport testing
8. **Rich Evidence Collection**: Videos, screenshots, traces, and reports
9. **CI/CD Ready**: Optimized for continuous integration pipelines
10. **Documentation Driven**: Comprehensive docs with examples and troubleshooting

## 📈 Framework Statistics

- **Total Tests**: 15 (11 homepage + 4 integration)
- **Browser Coverage**: 5 browsers (Chromium, Firefox, Safari, Edge, Chrome)
- **Viewport Coverage**: 3 responsive breakpoints (mobile, tablet, desktop)
- **Evidence Types**: 4 (videos, screenshots, traces, reports)
- **Page Objects**: 3 comprehensive POMs with 40+ methods
- **Utility Functions**: 15+ helper methods with error handling
- **Test Execution Time**: ~2-3 minutes for full suite
- **Report Generation**: <30 seconds for complete Allure reports

## 🔗 Related Documentation

- **[Manual Test Steps](manual-steps_AllTests.md)**: Comprehensive manual testing procedures
- **[Video Evidence Guide](VIDEO_EVIDENCE_GUIDE.md)**: Complete guide for video evidence recording and configuration
- **[Evidence Guide](Evidence/README.md)**: Test artifacts and video recording setup  
- **[Screenshot Examples](utils/screenshot-examples.md)**: Screenshot utility usage examples
- **[Main README](README.md)**: Project overview and setup instructions

---

*Framework last updated: August 17, 2025*  
*Comprehensive homepage testing with optional video evidence recording and enhanced step-by-step documentation*
