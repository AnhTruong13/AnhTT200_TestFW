# Homepage Tests for Automation Exercise

This test suite provides comprehensive testing for the [Automation Exercise](https://www.automationexercise.com/) homepage using Playwright with Page Object Model (POM) pattern and custom fixtures.

## Project Structure

```
├── page-objects/
│   ├── BasePage.ts          # Base page class with common methods
│   ├── HomePage.ts          # Homepage page object model
│   └── ProductsPage.ts      # Products page object model
├── utils/
│   ├── fixtures.ts          # Custom Playwright fixtures
│   └── TestUtils.ts         # Test utility functions
├── tests/
│   ├── homepage.spec.ts     # Homepage-specific tests
│   └── homepage-integration.spec.ts # Integration tests
├── test-results/
│   └── screenshots/         # Test screenshots
└── allure-results/          # Allure test results
```

## Features

### Page Object Models (POMs)
- **BasePage**: Common functionality shared across all pages
- **HomePage**: Specific methods for homepage interactions
- **ProductsPage**: Methods for products page functionality

### Custom Fixtures
- Pre-configured page objects injected into tests
- Consistent setup and teardown
- Easy test maintenance

### Test Utils
- Screenshot capture with Allure integration
- Random data generation
- Performance utilities
- Console logging setup

## Test Coverage

### Homepage Tests (`homepage.spec.ts`)
1. ✅ Homepage loading verification
2. ✅ Navigation menu validation
3. ✅ Main content sections visibility
4. ✅ Carousel functionality
5. ✅ Newsletter subscription
6. ✅ Navigation links functionality
7. ✅ Categories and brands sections
8. ✅ Responsive design testing
9. ✅ Scroll to top functionality
10. ✅ Performance and loading tests

### Integration Tests (`homepage-integration.spec.ts`)
1. ✅ Complete user journey (Homepage → Products → Product Details)
2. ✅ Performance and responsiveness testing
3. ✅ Interactive elements testing
4. ✅ Navigation links validation

## Running Tests

### Run all homepage tests:
```bash
npx playwright test tests/homepage.spec.ts
```

### Run integration tests:
```bash
npx playwright test tests/homepage-integration.spec.ts
```

### Run all tests:
```bash
npx playwright test
```

### Run tests in headed mode:
```bash
npx playwright test --headed
```

### Run tests with UI mode:
```bash
npx playwright test --ui
```

## Reporting

### Generate Allure Report:
```bash
npx allure generate allure-results --clean
npx allure open
```

### View Playwright HTML Report:
```bash
npx playwright show-report
```

## Key Features

### 🏗️ Page Object Model
- Clean separation of test logic and page interactions
- Reusable page methods
- Easy maintenance and updates

### 🔧 Custom Fixtures
- Automatic page object initialization
- Consistent test setup
- Reduced boilerplate code

### 📊 Comprehensive Reporting
- Allure integration with steps and attachments
- Screenshots on failure
- Performance metrics

### 📱 Cross-Browser Testing
- Chrome, Firefox, Edge, and Safari support
- Mobile and tablet viewport testing
- Responsive design validation

### 🚀 Performance Testing
- Page load time measurements
- Console error detection
- Network idle state verification

## Example Usage

```typescript
test('Verify homepage loads successfully', async ({ homePage }) => {
    await homePage.navigateToHomePage();
    await homePage.verifyHomePageIsVisible();
    await homePage.verifyPageTitle('Automation Exercise');
});
```

## Configuration

The tests are configured to:
- Use `https://www.automationexercise.com` as base URL
- Capture screenshots on failure
- Generate Allure reports
- Run in parallel for faster execution
- Retry failed tests on CI

## Best Practices Implemented

1. **Page Object Model**: Clean separation of concerns
2. **Custom Fixtures**: Dependency injection for page objects
3. **Utility Functions**: Reusable helper methods
4. **Comprehensive Assertions**: Thorough validation of page elements
5. **Error Handling**: Graceful handling of edge cases
6. **Performance Testing**: Load time and responsiveness checks
7. **Cross-Browser Support**: Testing across multiple browsers
8. **Detailed Reporting**: Rich test reports with screenshots
