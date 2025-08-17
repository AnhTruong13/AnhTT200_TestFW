
# Manual Test Steps for All Automated Scenarios

## Test Suite Overview
This document provides manual testing procedures for all automated tests in the framework:
- **Homepage Tests**: 11 tests covering homepage functionality and navigation
- **Signup/Login Tests**: 10 tests covering user registration and authentication
- **Login Tests**: 15 tests covering POM + Fixtures + UI Templates approaches
- **UI Template Tests**: 30 tests covering complete template system (Forms, Lists, Modals)
- **Integration Tests**: 4 tests covering complete user journeys

## Quick Reference
- **Homepage Manual Steps**: See sections below for homepage testing
- **Signup Manual Steps**: See `manual-steps_SignupTests.md` for detailed signup/login procedures
- **Login Manual Steps**: See `manual-steps_LoginTests.md` for POM + Templates login testing
- **Integration Manual Steps**: See sections below for integration testing

## Recent Framework Improvements (August 2025)

### Major New Features Added:
- **UI Template System**: Complete template architecture with BaseTemplate, FormTemplate, ListTemplate, ModalTemplate
- **Template Factory**: Centralized template registration and management system
- **Login Test Suite**: Comprehensive 15-test suite demonstrating POM + Fixtures + UI Templates
- **Multiple Testing Approaches**: Traditional POM, modern UI Templates, and combined workflows
- **Enhanced Fixtures**: Clean dependency injection with loginPage and template support
- **Template Performance**: Form operations complete in < 3 seconds, validation in < 500ms

### Existing Features Enhanced:
- **Video Recording**: Tests now record videos on failure for debugging
- **Enhanced Screenshot Handling**: Automatic fallback for large pages (>32,767px limit)
- **Allure Reporting**: Comprehensive test reports with visual evidence
- **Evidence Directory**: Organized storage for test artifacts (videos, screenshots, traces)
- **Mixed Content Error Handling**: Graceful handling of HTTPS/HTTP mixed content warnings
- **Improved Test Stability**: Enhanced page loading and navigation reliability
- **Enhanced Timeout Configuration**: Optimized timeouts for complex web applications (60s test timeout, 15s action timeout, 30s navigation timeout)

### Test Artifacts Generated:
- **Videos**: Saved in `Evidence/video/` (WebM format, 1280x720 resolution)
- **Screenshots**: Saved in timestamped `Evidence/test-run-YYYY-MM-DD_HH-MM-SS/screenshots/`
- **Allure Reports**: Available via `npm run report` or `npm run report:open`
- **Error Context**: Detailed failure information in error-context.md files
- **Performance Metrics**: Template operation timing and optimization data

---

## HomePage Tests - Comprehensive Manual Steps

### Test 1: Verify homepage loads successfully
1. Open browser (Chrome, Firefox, Safari, Edge, or branded Chrome/Edge).
2. Navigate to https://www.automationexercise.com/
3. Verify that the homepage loads completely without errors.
   - **Note**: You may see mixed content console warnings (Google Fonts loaded over HTTP vs HTTPS). These are harmless and don't affect functionality.
4. Verify the page title is "Automation Exercise".
5. Verify all main elements are visible (header, navigation, main content, footer).
6. Take a screenshot for verification.
   - **Framework Enhancement**: Screenshots now automatically handle size limits with viewport fallback.
7. **Video Recording**: If test fails, a video recording will be automatically saved to `Evidence/video/`.

### Test 2: Verify navigation menu items are present
1. Open browser and navigate to https://www.automationexercise.com/
2. Locate the navigation menu at the top of the page.
3. Verify the following navigation links are visible and clickable:
   - Home
   - Products
   - Cart
   - Signup / Login
   - Contact us
   - Test Cases
   - API Testing
   - Video Tutorials
4. **Framework Enhancement**: Tests now use specific selectors (`.navbar-nav a[href="..."]`) to avoid strict mode violations when multiple identical links exist.
5. Take a screenshot of the navigation menu.
6. **Evidence Collection**: Screenshots are automatically attached to Allure reports with detailed metadata.

### Test 3: Verify main content sections are visible
1. Open browser and navigate to https://www.automationexercise.com/
2. Scroll through the entire homepage to verify all sections are present:
   - Hero/Banner section with carousel
   - Features section
   - Category section (left sidebar)
   - Featured Items section
   - Brands section (right sidebar)
3. Verify footer section contains:
   - Subscription area
   - Company information
   - Social media links
   - Copyright information
4. Take a screenshot of main content sections.

### Test 4: Verify carousel functionality
1. Open browser and navigate to https://www.automationexercise.com/
2. Locate the main carousel/banner section on the homepage.
3. Verify the carousel is displaying images/content.
4. Check if carousel has navigation controls (previous/next buttons or indicators).
5. If controls are present, test clicking them to navigate between slides.
   - **Framework Enhancement**: Tests now use multiple selector patterns to handle different carousel control implementations.
6. Wait and observe if carousel auto-advances (if applicable).
7. **Error Handling**: If carousel controls are not found, the test verifies the carousel section is visible as a fallback.
8. Take a screenshot of carousel functionality.
9. **Video Evidence**: Carousel interactions are recorded for debugging purposes.

### Test 5: Verify newsletter subscription
1. Open browser and navigate to https://www.automationexercise.com/
2. Scroll down to the footer section.
3. Locate the newsletter subscription area.
4. Enter a test email address (e.g., test@automation.com) in the subscription field.
5. Click the subscription button.
6. Verify if a success message appears (if implemented).
7. Take a screenshot of the subscription process.

### Test 6: Verify navigation links functionality
1. Open browser and navigate to https://www.automationexercise.com/
2. Test Products link:
   - Click on "Products" in the navigation menu
   - Verify you are redirected to a products page (URL should contain "products")
   - Navigate back to homepage
3. Test Contact Us link:
   - Click on "Contact us" in the navigation menu
   - Verify you are redirected to contact us page (URL should contain "contact_us")
   - Navigate back to homepage
4. Test Signup/Login link:
   - Click on "Signup / Login" in the navigation menu
   - Verify you are redirected to login page (URL should contain "login")
   - Navigate back to homepage
5. Take a screenshot after testing navigation links.

### Test 7: Verify categories section
1. Open browser and navigate to https://www.automationexercise.com/
2. Locate the categories section (typically in the left sidebar).
3. Verify that product categories are displayed.
4. Count and note down the available categories.
5. Verify categories are clickable (if applicable).
6. Take a screenshot of the categories section.

### Test 8: Verify brands section
1. Open browser and navigate to https://www.automationexercise.com/
2. Locate the brands section (typically in the right sidebar).
3. Verify that brand names are displayed.
4. Count and note down the available brands.
5. Verify brands are clickable (if applicable).
6. Take a screenshot of the brands section.

### Test 9: Verify responsive design on different viewports
1. Open browser and navigate to https://www.automationexercise.com/
2. Test desktop view (1920x1080):
   - Verify all elements are properly displayed
   - Check layout and spacing
3. Test tablet view (768x1024):
   - Resize browser window or use developer tools
   - Verify responsive layout adjustments
   - Check navigation menu behavior (may collapse to hamburger)
4. Test mobile view (375x667):
   - Resize browser window or use developer tools
   - Verify mobile-friendly layout
   - Test touch-friendly navigation
5. Take screenshots at different viewport sizes.

### Test 10: Verify scroll to top functionality
1. Open browser and navigate to https://www.automationexercise.com/
2. Scroll down to the bottom of the homepage.
3. Look for a "scroll to top" button (usually appears when scrolling down).
4. Click the scroll to top button.
5. Verify that the page scrolls back to the top smoothly.
6. **Framework Enhancement**: Tests now allow up to 100px tolerance from the top (instead of exact 0px) for more reliable verification.
7. **Improved Method**: The scroll function now includes:
   - Button visibility wait
   - JavaScript fallback scroll
   - Animation completion wait
8. Take a screenshot of the scroll to top functionality.
9. **Performance Note**: Scroll actions are recorded in video for visual verification.

### Test 11: Verify page performance and loading
1. Open browser and navigate to https://www.automationexercise.com/
2. Use browser developer tools to monitor:
   - Page load time (should be under 10 seconds)
   - Network requests
   - Console errors
3. Refresh the page multiple times to test consistency.
4. Check for any JavaScript errors in the browser console.
5. Verify images load properly without broken links.
6. Take a screenshot of the fully loaded page.
7. Note the page load time for performance reference.

---

## Signup/Login Tests (10 tests)

For comprehensive manual testing procedures for signup and login functionality, please refer to:

**📄 [manual-steps_SignupTests.md](manual-steps_SignupTests.md)**

This document covers:
- Complete user registration testing
- Login functionality verification
- Form validation testing
- Error handling scenarios
- Input constraint testing
- Responsive design verification
- UI/UX element testing

---

## Login Tests - POM + Fixtures + UI Templates (15 tests) 🆕

For comprehensive manual testing procedures for the new login test suite that demonstrates multiple testing approaches, please refer to:

**📄 [manual-steps_LoginTests.md](manual-steps_LoginTests.md)**

This document covers:

### **Login Functionality Testing (6 tests)**
- Valid login using Page Object Model (POM) approach
- Valid login using UI Template approach  
- Invalid login credentials testing (both POM and Template approaches)
- Empty login form validation with combined approaches
- Login form field interactions and template validation

### **Signup Functionality Testing (3 tests)**
- Initial signup form testing (both POM and Template approaches)
- Existing email signup error handling
- Form validation and user feedback

### **Combined Workflows Testing (3 tests)**
- Complete user journey combining POM + Templates approaches
- Form switching and validation with performance testing
- Cross-browser login consistency validation

### **Template Registration Testing (1 test)**
- Custom login template registration and execution
- Template factory integration and management

### **Advanced Features Tested**
- **Three Testing Approaches**: Traditional POM, modern UI Templates, combined workflows
- **Performance Monitoring**: Form operations complete in < 3 seconds
- **Cross-Browser Testing**: Consistent behavior across Chrome, Firefox, Edge, Safari, WebKit
- **Error Handling**: Comprehensive error detection and recovery mechanisms
- **Template Factory**: Dynamic template registration and customization
- **Evidence Collection**: Comprehensive screenshot and performance documentation

**Key Benefits**: This test suite demonstrates how to combine traditional Page Object Model approaches with modern UI Template automation for maximum testing flexibility and maintainability.

---

## UI Template System Tests (30 tests) 🆕

The framework now includes a comprehensive UI Template system for automated form, list, and modal testing across all browsers:

### **Form Templates (12 tests)**
- Login form automation and validation
- Signup form processing and error handling
- Contact form testing and submission
- Newsletter subscription form validation

### **List Templates (9 tests)**
- Product list navigation and interaction
- Category list management and filtering
- Search results list processing
- Navigation menu list validation

### **Modal Templates (9 tests)**
- Confirmation modal testing and interaction
- Information dialog validation
- Form modal processing and submission
- Alert modal handling and verification

---

## UI Template System Tests (30 tests) 🆕

For comprehensive manual testing procedures for the complete UI Template System, please refer to:

**📄 [manual-steps_UITemplates.md](manual-steps_UITemplates.md)**

This document covers:

### **Form Templates (12 tests)**
- Login form template automation and validation
- Signup form template processing and error handling
- Contact form template testing and submission
- Newsletter subscription template validation
- Form field validation and interaction testing
- Template performance benchmarking (< 3 seconds)
- Cross-browser form template consistency

### **List Templates (9 tests)**
- Product list template navigation and interaction
- Category list template management and filtering  
- Search results list template processing
- Navigation menu list template validation
- List item counting and boundary detection
- Template list performance optimization
- Multi-browser list template testing

### **Modal Templates (9 tests)**
- Confirmation modal template testing and interaction
- Information dialog template validation
- Form modal template processing and submission
- Alert modal template handling and verification
- Modal detection and state management
- Template modal performance validation
- Cross-browser modal template consistency

### **Advanced Template Features**
- **Template Factory Management**: Dynamic template registration and customization
- **Performance Optimization**: All template operations complete within defined thresholds
- **Cross-Browser Testing**: Templates validated across Chrome, Firefox, Edge, Safari, WebKit
- **Error Recovery**: Comprehensive error detection and graceful fallback mechanisms
- **Evidence Collection**: Detailed performance metrics and interaction documentation

**Key Benefits**: The UI Template System provides a modern, reusable approach to web element automation, offering significant advantages over traditional element-by-element automation for complex forms, lists, and modals.

---

## Integration Tests Manual Steps

### Integration Test 1: Complete user journey
1. Start at homepage: https://www.automationexercise.com/
2. Navigate to Products page via navigation menu
3. Select a specific product
4. Verify product details page loads
5. Navigate back to homepage
6. Verify all navigation works smoothly
7. Take screenshots at each step

### Integration Test 2: Responsive testing across viewports
1. Test homepage at desktop resolution (1280x720)
2. Test homepage at tablet resolution (768x1024)
3. Test homepage at mobile resolution (375x667)
4. Verify all elements adapt properly
5. Check navigation functionality at each resolution
6. Take screenshots for each viewport size

### Integration Test 3: Interactive elements testing
1. Test all clickable elements on homepage
2. Verify hover states work properly
3. Test form interactions (newsletter subscription)
4. Verify carousel controls respond correctly
5. Test scroll behaviors and animations
6. Document any non-functional elements

### Integration Test 4: Navigation verification
1. Test all navigation links from homepage
2. Verify proper page redirections
3. Check for any broken links
4. Test browser back/forward functionality
5. Verify consistent navigation behavior
6. Document navigation performance

---

## Test Execution Summary

### Total Test Coverage
- **Homepage Tests**: 11 tests
- **Signup/Login Tests**: 10 tests  
- **Integration Tests**: 4 tests
- **Total Manual Procedures**: 25 test scenarios

### Manual Testing Checklist
- [ ] All homepage functionality verified
- [ ] Signup and login processes tested (see signup manual steps)
- [ ] Integration scenarios completed
- [ ] Cross-browser testing performed
- [ ] Responsive design verified
- [ ] Performance metrics documented
- [ ] All screenshots captured
- [ ] Error scenarios tested

### Notes for Testers
- Use incognito/private browsing for clean test conditions
- Clear browser cache between test runs
- Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- Document any deviations from expected behavior
- Save screenshots for evidence and reporting
