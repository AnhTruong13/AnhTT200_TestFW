# Signup Page Tests - Manual Test Steps

## Test Suite Overview
This document provides manual testing steps for the Signup Page functionality of the Automation Exercise website (https://www.automationexercise.com/login).

## Prerequisites
- Browser: Chrome, Firefox, Safari, or Edge
- Internet connection
- Access to https://www.automationexercise.com/
- **Note**: Automated tests are configured with enhanced timeouts (60s test timeout, 15s action timeout) to handle complex form submissions and page transitions

---

## TC_SIGNUP_001: Verify signup page elements are visible

### Test Objective
Verify that all signup and login form elements are visible on the page

### Manual Steps
1. Navigate to https://www.automationexercise.com/login
2. Wait for the page to load completely
3. Verify the following elements are visible:
   - "New User Signup!" header text
   - Name input field in signup section
   - Email input field in signup section
   - "Signup" button
   - "Login to your account" header text
   - Email input field in login section
   - Password input field in login section
   - "Login" button

### Expected Results
- All listed elements should be visible and properly positioned
- Both signup and login forms should be displayed on the same page

---

## TC_SIGNUP_002: Successful user registration with valid data

### Test Objective
Test successful user registration with valid data through complete signup flow

### Test Data
- Name: TestUserManual[timestamp]
- Email: testuserManual[timestamp]@example.com
- Password: TestPassword123!
- Title: Mr/Mrs
- Date of Birth: Any valid date
- First Name: John
- Last Name: Doe
- Company: Test Company (optional)
- Address: 123 Test Street
- Country: United States
- State: California
- City: Los Angeles
- Zipcode: 90210
- Mobile Number: +1234567890

### Manual Steps
1. Navigate to https://www.automationexercise.com/login
2. In the "New User Signup!" section:
   - Enter unique name in the Name field
   - Enter unique email address
   - Click "Signup" button
3. On the Account Information page:
   - Select title (Mr/Mrs)
   - Password field should be filled automatically
   - Enter password: TestPassword123!
   - Select date of birth
   - Check "Sign up for our newsletter!" (optional)
   - Check "Receive special offers from our partners!" (optional)
4. Fill Address Information:
   - Enter First Name: John
   - Enter Last Name: Doe
   - Enter Company: Test Company
   - Enter Address: 123 Test Street
   - Select Country: United States
   - Enter State: California
   - Enter City: Los Angeles
   - Enter Zipcode: 90210
   - Enter Mobile Number: +1234567890
5. Click "Create Account" button
6. Verify account creation success message
7. Click "Continue" button

### Expected Results
- User should be able to complete the entire signup flow
- "Account Created!" message should be displayed
- User should be redirected to homepage after clicking Continue

---

## TC_SIGNUP_003: Signup with existing email address

### Test Objective
Verify error message when trying to signup with existing email address

### Test Data
- Name: TestUserExisting
- Email: test@example.com (use a known existing email)

### Manual Steps
1. Navigate to https://www.automationexercise.com/login
2. In the "New User Signup!" section:
   - Enter name: TestUserExisting
   - Enter existing email address: test@example.com
   - Click "Signup" button
3. Observe the response

### Expected Results
- Error message should be displayed stating "Email Address already exist!"
- User should remain on the login/signup page
- No account information page should be displayed

---

## TC_SIGNUP_004: Signup with empty required fields

### Test Objective
Verify validation when submitting signup form with empty required fields

### Manual Steps
1. Navigate to https://www.automationexercise.com/login
2. In the "New User Signup!" section:
   - Leave Name field empty
   - Leave Email field empty
   - Click "Signup" button
3. Observe browser validation or server response

### Expected Results
- Browser should show HTML5 validation messages for required fields
- OR server should return validation errors
- Form should not be submitted successfully

---

## TC_SIGNUP_005: Signup with invalid email format

### Test Objective
Verify validation when submitting signup form with invalid email format

### Test Data - Invalid Email Formats
1. invalidemail (no @ symbol)
2. invalid@ (missing domain)
3. @invalid.com (missing local part)
4. invalid..email@example.com (double dots)
5. invalid email@example.com (space in email)

### Manual Steps
For each invalid email format:
1. Navigate to https://www.automationexercise.com/login
2. In the "New User Signup!" section:
   - Enter name: TestUserInvalid
   - Enter invalid email address
   - Click "Signup" button
3. Observe browser validation or server response
4. Refresh page for next test

### Expected Results
- Browser should show HTML5 validation for obviously invalid formats
- Server should reject invalid email formats that pass browser validation
- User should not be able to proceed with invalid email addresses

---

## TC_SIGNUP_006: Login with valid credentials

### Test Objective
Test login functionality with valid credentials

### Prerequisites
- Have a valid registered account OR use demo credentials if available

### Test Data
- Email: [valid registered email]
- Password: [corresponding password]

### Manual Steps
1. Navigate to https://www.automationexercise.com/login
2. In the "Login to your account" section:
   - Enter valid email address
   - Enter corresponding password
   - Click "Login" button
3. Observe the result

### Expected Results
- User should be successfully logged in
- Should be redirected to homepage or dashboard
- Username should be visible in the navigation bar

---

## TC_SIGNUP_007: Login with invalid credentials

### Test Objective
Test login functionality with invalid credentials

### Test Data
- Email: nonexistent@example.com
- Password: wrongpassword

### Manual Steps
1. Navigate to https://www.automationexercise.com/login
2. In the "Login to your account" section:
   - Enter email: nonexistent@example.com
   - Enter password: wrongpassword
   - Click "Login" button
3. Observe the error message

### Expected Results
- Error message should be displayed
- Common messages: "Your email or password is incorrect!" or similar
- User should remain on the login page

---

## TC_SIGNUP_008: Login with empty credentials

### Test Objective
Test login functionality with empty credentials

### Manual Steps
1. Navigate to https://www.automationexercise.com/login
2. In the "Login to your account" section:
   - Leave email field empty
   - Leave password field empty
   - Click "Login" button
3. Observe validation response

### Expected Results
- Browser should show HTML5 validation for required fields
- OR server should return appropriate error messages
- Login should not be processed

---

## TC_SIGNUP_009: Verify signup form field constraints

### Test Objective
Verify field constraints and validation on signup form

### Manual Steps

#### Test Name Field Constraints
1. Navigate to https://www.automationexercise.com/login
2. In the Name field, enter a very long name (100+ characters)
3. Observe if there's a character limit
4. Try entering special characters: Test!@#$%^&*()User
5. Verify the input is accepted or rejected

#### Test Email Field Constraints
1. In the Email field, enter a very long email
2. Try entering special but valid email characters: test+special@example-site.co.uk
3. Verify behavior with different email formats

#### Test Special Characters
1. Test various special characters in both fields
2. Verify which characters are accepted/rejected
3. Check if there are any input sanitization measures

### Expected Results
- Fields should have reasonable length limits
- Valid special characters should be accepted
- Invalid characters should be rejected or sanitized
- Form should handle edge cases gracefully

---

## TC_SIGNUP_010: Verify page navigation and UI elements

### Test Objective
Verify page navigation, links, and UI element interactions

### Manual Steps

#### Verify Page Properties
1. Navigate to https://www.automationexercise.com/login
2. Check page title in browser tab
3. Verify URL is correct
4. Check that page loads completely

#### Test Form Interactions
1. Click in the Name field - verify it gets focus
2. Press Tab key - verify focus moves to Email field
3. Press Tab key again - verify focus moves to Signup button
4. Test same for login form fields

#### Test Responsive Design
1. Resize browser window to different sizes:
   - Desktop view (1200px+ width)
   - Tablet view (768px width)
   - Mobile view (375px width)
2. Verify form elements remain usable and properly positioned
3. Check if layout adapts appropriately

#### Test Navigation Elements
1. Verify any navigation links work correctly
2. Check if there are breadcrumbs or back buttons
3. Test any footer or header links

### Expected Results
- Page should have appropriate title and URL
- Tab navigation should work properly
- Form should be responsive across different screen sizes
- All navigation elements should function correctly
- UI should be consistent and user-friendly

---

## Test Execution Notes

### Test Environment Setup
1. Clear browser cache and cookies before testing
2. Use incognito/private browsing mode for clean tests
3. Test on multiple browsers (Chrome, Firefox, Safari, Edge)
4. Test on different devices/screen sizes

### Data Management
- Use unique timestamps for test data to avoid conflicts
- Keep track of created test accounts for cleanup
- Document any permanent test accounts created

### Issue Reporting
When reporting issues, include:
- Browser version and operating system
- Steps to reproduce
- Expected vs actual results
- Screenshots or screen recordings
- Console errors (if applicable)

### Test Coverage Summary
- ✅ UI element visibility verification
- ✅ Complete signup flow testing
- ✅ Error handling and validation
- ✅ Login functionality testing
- ✅ Field constraint testing
- ✅ Responsive design verification
- ✅ Navigation and usability testing

This manual test suite provides comprehensive coverage of the signup page functionality and should be executed regularly to ensure quality and reliability.
