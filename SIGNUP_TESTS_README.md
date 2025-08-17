# Signup Page Tests Documentation

## Overview
This document provides detailed information about the signup page test suite for the Automation Exercise website. The tests cover comprehensive user registration, login functionality, form validation, and UI/UX verification.

## Test Suite Statistics
- **Total Tests**: 10
- **Page Object**: SignupPage.ts
- **Test File**: tests/signup.spec.ts
- **Manual Steps**: manual-steps_SignupTests.md

## Test Environment
- **Target URL**: https://www.automationexercise.com/login
- **Browsers**: Chromium, Firefox, Safari (WebKit), Microsoft Edge, Google Chrome
- **Viewport Screenshots**: Enabled to prevent size limit issues (only on failure)
- **Video Recording**: 1280x720 WebM format, retain-on-failure mode
- **Reporting**: Dual reporters (Allure + HTML) with visual evidence
- **Modern Allure**: Uses allure-js-commons (no deprecation warnings)

## Test Architecture

### Page Object Model (SignupPage.ts)
The SignupPage class extends BasePage and provides:

#### Form Elements
- **Signup Form**: Name input, email input, signup button
- **Login Form**: Email input, password input, login button
- **Account Information**: Title selection, password, date of birth, newsletters
- **Address Information**: Personal details, company, address, country, state, city, zipcode, mobile

#### Key Methods
- `navigateToSignupPage()`: Navigate to login/signup page
- `verifySignupPageIsVisible()`: Verify all form elements are visible
- `performSignup(name, email)`: Complete initial signup step
- `fillAccountInformation(data)`: Fill detailed account form
- `fillAddressInformation(data)`: Fill address details
- `performLogin(email, password)`: Complete login process
- `completeSignupFlow(userData)`: End-to-end registration
- `verifyAccountCreated()`: Verify successful account creation
- `verifyLoginError()` / `verifySignupError()`: Error validation

## Test Cases

### TC_SIGNUP_001: Verify signup page elements are visible
**Purpose**: Ensure all form elements are properly displayed
**Tags**: smoke, critical
**Steps**:
1. Navigate to signup page
2. Verify signup form elements visibility
3. Verify login form elements visibility
4. Take screenshot for documentation

**Expected Results**: All signup and login form elements visible

### TC_SIGNUP_002: Successful user registration with valid data
**Purpose**: Test complete registration flow with valid data
**Tags**: regression, critical
**Test Data**:
```javascript
{
    name: `TestUser${uniqueId}`,
    email: `testuser${uniqueId}@example.com`,
    password: 'TestPassword123!',
    firstName: 'John',
    lastName: 'Doe',
    company: 'Test Company',
    address: '123 Test Street',
    state: 'California',
    city: 'Los Angeles',
    zipcode: '90210',
    mobileNumber: '+1234567890',
    title: 'Mr',
    day: '15',
    month: 'January',
    year: '1990',
    country: 'United States'
}
```
**Steps**:
1. Fill initial signup form with unique data
2. Submit initial signup
3. Fill detailed account information
4. Fill address information
5. Submit account creation
6. Verify account created message

**Expected Results**: 
- Account successfully created
- "Account Created!" message displayed
- User can continue to homepage

### TC_SIGNUP_003: Signup with existing email address
**Purpose**: Verify error handling for duplicate email registration
**Tags**: negative, high
**Test Data**: Common existing email (test@example.com)
**Steps**:
1. Attempt signup with existing email
2. Verify error message appears
3. Ensure user remains on signup page

**Expected Results**: 
- "Email Address already exist!" error message
- No account information page displayed

### TC_SIGNUP_004: Signup with empty required fields
**Purpose**: Test form validation for required fields
**Tags**: negative, high
**Steps**:
1. Leave name and email fields empty
2. Attempt to submit signup form
3. Verify validation behavior

**Expected Results**: 
- HTML5 validation prevents submission OR
- Server-side error message displayed

### TC_SIGNUP_005: Signup with invalid email format
**Purpose**: Verify email format validation
**Tags**: negative, medium
**Test Data**: Various invalid formats:
- invalidemail (no @)
- invalid@ (missing domain)
- @invalid.com (missing local part)

**Steps**:
1. Test each invalid email format
2. Check HTML5 browser validation
3. Verify server-side validation if applicable

**Expected Results**: 
- Browser validation catches obvious errors
- Server rejects remaining invalid formats

### TC_SIGNUP_006: Login with valid credentials
**Purpose**: Test login functionality with valid data
**Tags**: smoke, critical
**Test Data**: Valid test account credentials
**Steps**:
1. Fill login form with valid credentials
2. Submit login attempt
3. Verify login result (success/error)

**Expected Results**: 
- Successful login OR expected error for test credentials
- Appropriate response based on credential validity

### TC_SIGNUP_007: Login with invalid credentials
**Purpose**: Test login error handling
**Tags**: negative, high
**Test Data**: 
```javascript
{
    email: 'nonexistent@example.com',
    password: 'wrongpassword'
}
```
**Steps**:
1. Fill login form with invalid credentials
2. Submit login attempt
3. Verify error message display

**Expected Results**: 
- Login error message displayed
- User remains on login page

### TC_SIGNUP_008: Login with empty credentials
**Purpose**: Test login form validation for empty fields
**Tags**: negative, medium
**Steps**:
1. Leave email and password fields empty
2. Attempt login submission
3. Check for validation response

**Expected Results**: 
- HTML5 validation for required fields OR
- Server-side error message

### TC_SIGNUP_009: Verify signup form field constraints
**Purpose**: Test input field limitations and special character handling
**Tags**: validation, medium
**Tests**:
- Long name input (100+ characters)
- Long email input
- Special characters in name field
- Special characters in email field

**Steps**:
1. Test various input lengths and formats
2. Verify field acceptance/rejection
3. Test special character handling

**Expected Results**: 
- Reasonable field length limits
- Proper special character handling
- Graceful handling of edge cases

### TC_SIGNUP_010: Verify page navigation and UI elements
**Purpose**: Test page properties, navigation, and responsive design
**Tags**: ui, low
**Tests**:
- Page title and URL verification
- Tab navigation between fields
- Responsive design at different viewport sizes
- UI element interactions

**Steps**:
1. Verify page properties (title, URL)
2. Test keyboard navigation
3. Test responsive behavior
4. Verify UI interactions

**Expected Results**: 
- Proper page title and URL
- Functional tab navigation
- Responsive design adaptation
- Smooth UI interactions

## Test Data Management

### Dynamic Test Data
All tests use timestamp-based unique identifiers:
```javascript
let uniqueId: string = Date.now().toString();
```

This ensures:
- No data conflicts between test runs
- Fresh data for each execution
- Avoidance of "already exists" errors

### Test Data Patterns
- **Names**: TestUser{uniqueId}
- **Emails**: testuser{uniqueId}@example.com
- **Passwords**: TestPassword123! (consistent for testing)

## Error Handling & Recovery

### Enhanced Error Selectors
The SignupPage POM includes multiple error message selectors:
```typescript
this.errorMessage = page.locator('.alert-danger, .text-danger, p:has-text("Email Address already exist!")');
this.loginErrorMessage = page.locator('.alert-danger, .text-danger, p:has-text("Your email or password is incorrect!")');
this.signupErrorMessage = page.locator('.alert-danger, .text-danger, p:has-text("Email Address already exist!")');
```

### Timeout Management
- Default timeout: 30 seconds (Playwright configuration)
- Error verification: 10 seconds primary, 5 seconds fallback
- Page load states: domcontentloaded with 10-second timeout

### Screenshot Strategy
- Initial page screenshots for all tests
- Screenshots at key interaction points
- Failure screenshots with descriptive names
- Viewport screenshots if full-page fails

## Known Issues & Workarounds

### Issue 1: Error Message Timing
**Problem**: Some error messages appear with delay
**Solution**: Implemented timeout-based error checking with fallbacks

### Issue 2: Page Load Variability
**Problem**: Page loading inconsistency
**Solution**: Using domcontentloaded with visibility fallbacks

### Issue 3: Browser Validation Differences
**Problem**: Different browsers handle HTML5 validation differently
**Solution**: Testing both browser and server-side validation

## Test Execution

### Running Signup Tests
```bash
# Run all signup tests
npx playwright test tests/signup.spec.ts

# Run with specific browser
npx playwright test tests/signup.spec.ts --project=chromium

# Run with video recording
npx playwright test tests/signup.spec.ts --project=chromium --headed

# Run specific test
npx playwright test tests/signup.spec.ts -g "TC_SIGNUP_001"
```

### Debug Mode
```bash
# Debug mode with inspector
npx playwright test tests/signup.spec.ts --debug

# Trace mode
npx playwright test tests/signup.spec.ts --trace=on
```

## Test Results Analysis

### Current Status (Last Run)
- **Total Tests**: 10
- **Passed**: 7
- **Failed**: 3
- **Success Rate**: 70%

### Common Failure Patterns
1. **Timeout Issues**: Page loading or element interaction delays
2. **Error Message Detection**: Variations in error message display
3. **Form State Management**: Browser caching or state persistence

### Performance Metrics
- Average test execution: ~5 seconds per test
- Total suite execution: ~50 seconds
- Screenshot generation: ~200ms average

## Maintenance & Updates

### Regular Maintenance Tasks
1. **Update Test Data**: Refresh email addresses if needed
2. **Selector Updates**: Monitor for webpage changes
3. **Error Message Updates**: Adjust error detection for site changes
4. **Performance Monitoring**: Track execution times

### Selector Maintenance
Key selectors to monitor:
- `input[data-qa="signup-name"]` - Signup name field
- `input[data-qa="signup-email"]` - Signup email field
- `button[data-qa="signup-button"]` - Signup submit button
- `input[data-qa="login-email"]` - Login email field
- `button[data-qa="login-button"]` - Login submit button

## Integration with Framework

### Allure Reporting Integration
Each test includes:
- Test descriptions and severity
- Step-by-step documentation
- Screenshot attachments
- Video recordings on failure
- Feature and tag organization

### Evidence Collection
- Screenshots: `Evidence/screenshots/`
- Videos: `Evidence/video/signup-*`
- Traces: Available for debugging
- Error contexts: Markdown files for failures

## Manual Testing Reference
For manual testing procedures, see: `manual-steps_SignupTests.md`

## Conclusion
The signup test suite provides comprehensive coverage of user registration and login functionality, with robust error handling, responsive design testing, and thorough validation coverage. The tests are designed for reliability and maintainability, with clear documentation and evidence collection for debugging and reporting purposes.
