# Playwright + TypeScript E2E Testing Framework

This comprehensive test automation framework uses [Playwright](https://playwright.dev/) and TypeScript for end-to-end testing of [Automation Exercise](https://www.automationexercise.com/).

## 🚀 Features

- **Page Object Model (POM)** - Organized, maintainable test architecture
- **Playwright Fixtures** - Custom fixtures for enhanced test setup
- **Video Recording** - Automatic video capture on test failures (1280x720 WebM)
- **Smart Screenshots** - Viewport screenshots to avoid size limits (only on failure)
- **Allure + HTML Reporting** - Rich reports with visual evidence and interactive features
- **Evidence Collection** - Organized storage of test artifacts with automatic cleanup
- **Auto Cleanup** - Empty video directories automatically removed after test runs
- **Multi-Browser Support** - Chromium, Firefox, Safari, Edge, Chrome
- **Responsive Testing** - Mobile, tablet, and desktop viewport testing
- **Mixed Content Handling** - Graceful handling of HTTPS/HTTP warnings
- **Error Recovery** - Robust error handling and automatic fallbacks

## 🛠️ Getting Started

### Install dependencies
```bash
npm install
```

### Install Playwright browsers
```bash
npm run install:browsers
```

## 📋 Test Commands

### Basic Test Execution
```bash
# Run all tests (minimal screenshots)
npm test

# Run tests with full screenshot documentation  
npm run test:screenshots

# Run tests with minimal evidence collection
npm run test:minimal

# Run tests with video recording
npm run test:video

# Run tests in headed mode
npm run test:headed

# Debug tests
npm run test:debug

# Full video evidence recording (all tests)
npm run test:video:all

# Full video evidence recording (Chromium only)
npm run test:video:all:chromium

# Complete evidence collection (videos + screenshots)
npm run test:evidence:full

# Minimal evidence collection (no videos, minimal screenshots)  
npm run test:evidence:minimal
```

> **📋 Cross-Platform Compatibility**: All npm scripts now use `cross-env` for seamless environment variable handling across Windows, macOS, and Linux. No more platform-specific command issues!

> **🎥 Video Evidence Recording**: New optional video recording for all test steps. Use `VIDEO_MODE=all` to record comprehensive video evidence of all test executions.

### Specific Test Suites
```bash
# Run homepage tests only
npm run test:homepage

# Run signup tests only
npx playwright test tests/signup.spec.ts

# Run integration tests
npm run test:integration
```

### Reporting & Evidence
```bash
# Generate and serve Allure reports
npm run report

# Generate static Allure report
npm run report:generate

# Open static Allure report
npm run report:open

# Clean all evidence directories (videos, screenshots, traces, results)
npm run clean:evidence
```

## 📁 Project Structure
```
├── Evidence/                    # Test artifacts and evidence
│   ├── video/                   # Test execution videos (WebM format)
│   ├── screenshots/            # Test screenshots with fallback handling
│   ├── traces/                 # Playwright traces for debugging
│   └── README.md               # Evidence documentation
├── page-objects/               # Page Object Model classes
│   ├── BasePage.ts             # Base page with common functionality
│   ├── HomePage.ts             # Homepage specific methods and locators
│   ├── ProductsPage.ts         # Products page methods and locators
│   └── SignupPage.ts           # Signup/Login page methods and locators
├── tests/                      # Test specifications
│   ├── homepage.spec.ts        # Homepage functionality tests (11 tests)
│   ├── homepage-integration.spec.ts  # Integration tests (4 tests)
│   └── signup.spec.ts          # Signup/Login functionality tests (10 tests)
├── utils/                      # Utility functions and helpers
│   ├── TestUtils.ts            # Screenshot, evidence, and test utilities
│   ├── fixtures.ts             # Custom Playwright fixtures
│   └── screenshot-examples.md  # Screenshot utility documentation
├── allure-results/             # Raw Allure test results (JSON)
├── allure-report/              # Generated Allure HTML reports
├── manual-steps_AllTests.md    # Manual testing steps documentation
├── manual-steps_SignupTests.md # Signup manual testing procedures
├── HOMEPAGE_TESTS_README.md    # Detailed test documentation
└── playwright.config.ts       # Playwright configuration
```

## 🎯 Test Coverage

### Homepage Tests (11 tests)
- Homepage loading and title verification
- Navigation menu presence and functionality
- Main content sections visibility
- Carousel functionality with fallback handling
- Newsletter subscription testing
- Navigation links comprehensive verification
- Categories and brands section validation
- Responsive design testing (mobile, tablet, desktop)
- Scroll to top functionality with enhanced reliability
- Page performance and loading metrics
- Console error monitoring and handling

### Signup Tests (10 tests)
- Signup page elements visibility verification
- Complete user registration with valid data
- Error handling for existing email addresses
- Form validation with empty required fields
- Invalid email format validation and testing
- Login functionality with valid credentials
- Login error handling with invalid credentials
- Empty credentials validation testing
- Form field constraints and input validation
- UI navigation and responsive design testing

### Integration Tests (4 tests)
- Complete user journey (Homepage → Products → Product Details)
- Homepage responsiveness across viewports with performance monitoring
- Interactive elements comprehensive testing
- Navigation links verification with strict mode handling

## 🔧 Recent Enhancements (August 2025)

### Configuration Improvements
- **Dual Reporter Setup**: Both Allure and HTML reports generated simultaneously
- **Smart Screenshot Strategy**: Viewport screenshots only on failure to prevent size limit issues
- **Enhanced Video Recording**: 1280x720 resolution, retain-on-failure mode
- **Output Directory**: Centralized evidence collection in `Evidence/video/`
- **Cross-Browser Testing**: 5 browsers (Chromium, Firefox, Safari, Edge, Chrome)
- **Cross-Platform NPM Scripts**: All test commands now use `cross-env` for consistent environment variable handling across Windows, macOS, and Linux
- **Enhanced Timeout Configuration**: Optimized timeouts for complex web applications (60s test timeout, 15s action timeout, 10s assertion timeout)

### Signup Page Test Suite (NEW)
- **Complete POM Implementation**: SignupPage with comprehensive form interactions
- **10 Test Scenarios**: Registration, login, validation, error handling, UI testing
- **Enhanced Fixtures**: Added signupPage fixture for dependency injection
- **Modern Allure Integration**: Fixed deprecation warnings with allure-js-commons

### Video Recording System
- **Format**: WebM files at 1280x720 resolution
- **Mode**: Dynamic based on environment variables (`retain-on-failure`, `on`, `off`)
- **Location**: `Evidence/video/` with organized subdirectories
- **Auto Cleanup**: Empty video directories automatically removed after test runs
- **Integration**: Automatic attachment to Allure reports

### Optional Video Evidence Recording ⭐ NEW
- **Full Recording Mode**: `VIDEO_MODE=all` records all test steps for comprehensive evidence
- **Smart Recording**: Environment-controlled video capture (all/off/failure-only)
- **Step-by-Step Evidence**: `TestUtils.recordStepEvidence()` for granular video recording
- **Test Step Wrapper**: `TestUtils.testStep()` combines video and screenshot evidence
- **Performance Optimized**: Videos only recorded when explicitly requested
- **Evidence Modes**:
  - `VIDEO_MODE=all`: Record every test action
  - `VIDEO_MODE=off`: No video recording
  - `VIDEO_MODE=retain-on-failure`: Record only failed tests (default)

### Screenshot & Evidence Improvements
- **Smart Screenshots**: Conditional screenshot capture based on test status and environment
- **Viewport Screenshots**: Prevents 32,767px size limit issues with `fullPage: false`
- **Failure-Only Capture**: Automatic screenshots taken only on test failures by default
- **Critical Screenshots**: Important verification points always documented
- **Custom Screenshot Utils**: Enhanced TestUtils with multiple screenshot options
- **Global Teardown**: Automatic cleanup of empty directories to maintain clean workspace
- **Environment Control**: `SCREENSHOTS=all` for full documentation, default for minimal evidence
- **Evidence Cleanup**: Improved npm script for cleaning all test artifacts
- **Organized Storage**: Structured directories for videos, screenshots, traces, and reports

### Smart Screenshot System
- **Conditional Screenshots**: Only taken when tests fail or explicitly requested
- **Critical Screenshots**: Always taken for important verification points
- **Environment Control**: 
  - Default: Minimal screenshots (failures + critical points only)
  - `SCREENSHOTS=all`: Full documentation with all test steps
  - `SCREENSHOTS=off`: Absolute minimum (failures only)
- **Methods Available**:
  - `takeConditionalScreenshot()`: Smart conditional capture
  - `takeCriticalScreenshot()`: Always captures important steps  
  - `takeSmartScreenshot()`: Failure-aware capture
  - `recordStepEvidence()`: Records video evidence for specific steps
  - `testStep()`: Combines video and screenshot evidence for test steps
  - `getVideoRecordingInfo()`: Displays current video recording configuration
- **Benefits**: Reduced storage usage while maintaining debugging capability

### Test Stability Enhancements
- **Mixed Content Handling**: Graceful handling of HTTPS/HTTP warnings
- **Strict Mode Fixes**: Specific CSS selectors to avoid element ambiguity
- **Page Loading**: Improved from `networkidle` to `domcontentloaded` with fallbacks
- **Carousel Testing**: Multi-pattern selector matching for different implementations
- **Scroll Testing**: Enhanced reliability with position tolerance and JavaScript fallback

### Reporting & Documentation
- **Allure Integration**: Rich HTML reports with visual evidence
- **Evidence Organization**: Structured storage of test artifacts
- **Manual Steps**: Updated comprehensive testing procedures
- **Error Context**: Detailed failure information with markdown documentation

## 📊 Browser Support
- **Chromium** (Primary)
- **Firefox**
- **Safari** (WebKit)
- **Microsoft Edge**
- **Google Chrome**

## 🎪 Sample Test
Homepage tests demonstrate comprehensive coverage:

```typescript
test('Verify homepage loads successfully', async ({ homePage }) => {
    await allure.epic('Homepage');
    await allure.feature('Homepage Basic Functionality');
    await allure.story('Page Loading');
    
    await homePage.verifyHomePageIsVisible();
    await homePage.verifyPageTitle('Automation Exercise');
    await TestUtils.takeScreenshot(page, 'homepage-loaded');
});
```

## 📚 Documentation
- **[Manual Test Steps](manual-steps_AllTests.md)** - Comprehensive manual testing procedures  
- **[Homepage Tests Documentation](HOMEPAGE_TESTS_README.md)** - Detailed homepage test specifications
- **[Signup Tests Documentation](SIGNUP_TESTS_README.md)** - Complete signup/login test guide
- **[Signup Manual Steps](manual-steps_SignupTests.md)** - Manual signup testing procedures
- **[Evidence Directory Guide](Evidence/README.md)** - Test artifacts documentation
- **[Screenshot Utilities](utils/screenshot-examples.md)** - Screenshot handling examples

## 🚨 Known Issues & Solutions

### Configuration Optimizations
- **Viewport Screenshots**: Using `fullPage: false` prevents 32,767px size limit errors
- **Failure-Only Screenshots**: Captures screenshots only on test failures for efficiency
- **Video Storage**: Organized in `Evidence/video/` with automatic cleanup support

### NPM Script Compatibility ✅ RESOLVED
- **Issue**: Previous PowerShell-specific environment variable syntax caused configuration warnings when passing additional Playwright arguments
- **Solution**: Implemented `cross-env` package for consistent environment variable handling across all platforms
- **Benefits**: Eliminated platform-specific script limitations and improved argument passing compatibility

### Browser Compatibility
Framework handles mixed content warnings and HTTPS certificate issues automatically with `ignoreHTTPSErrors: true`.

### Evidence Management
Use `npm run clean:evidence` to clean all test artifacts (videos, screenshots, traces, results) between test runs.

## 🤝 Contributing
1. Follow the Page Object Model pattern
2. Add appropriate Allure annotations (@epic, @feature, @story)
3. Include error handling and recovery mechanisms
4. Document new utilities in the utils directory
5. Update manual steps for new test scenarios

---

## 🎯 Final Status Report - Smart Screenshots System

### ✅ **Mission Accomplished!**
The smart conditional screenshot system is now **fully operational** and tested! 

### 📊 **Validation Results**
Recent test runs confirm perfect functionality:

**Minimal Mode (`npm run test:minimal`)**:
- ✅ Conditional screenshots **skipped** for passing tests
- ✅ Critical verification points **always captured**
- ✅ Storage optimized (50 empty video directories auto-cleaned)
- ✅ Console feedback: `"📷 Conditional screenshot skipped for signup-page-elements-visible (test passing, no force flag)"`

**Full Mode (`npm run test:screenshots`)**:
- ✅ **All screenshots captured** for comprehensive documentation
- ✅ Initial page state documented
- ✅ Every form interaction recorded
- ✅ Complete test journey preserved

### 🎨 **Smart Features Active**
- **Automatic Test Status Detection**: Screenshots adapt based on pass/fail status
- **Environment Variable Control**: `SCREENSHOTS=all|off` for flexible modes
- **Critical Point Protection**: Important verification steps always documented
- **Intelligent Cleanup**: Empty video directories automatically removed
- **Cross-Platform Scripts**: PowerShell-based npm commands for Windows compatibility

### 🌟 **Achievement Unlocked**
**Smart Evidence Collection**: The framework now intelligently balances comprehensive documentation with storage efficiency, capturing evidence only when truly needed while preserving all critical debugging information!

*Perfect blend of automation intelligence and practical testing needs* 🚀

## 📝 License
This project is for educational and testing purposes.

---

*Framework last updated: August 17, 2025*
*Total tests: 15 (11 homepage + 4 integration)*
*Browsers supported: 5 (Chromium, Firefox, Safari, Edge, Chrome)*
*Evidence types: 3 (Videos, Screenshots, Traces)*
- [Playwright Docs](https://playwright.dev/docs/intro)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

Replace sample tests with your own scenarios for https://www.automationexercise.com/.
