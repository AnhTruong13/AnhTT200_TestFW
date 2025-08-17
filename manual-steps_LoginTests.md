# Manual Test Steps - Login Page Testing

## Overview
This document provides comprehensive manual test steps for the Login Page functionality, covering all test scenarios implemented in the automated test suite. These steps can be executed manually to validate the login and signup functionality across different browsers and environments.

## Test Environment Setup

### Prerequisites
1. **Browser**: Chrome, Firefox, Safari, or Edge (latest version)
2. **Test Site**: https://www.automationexercise.com
3. **Screen Resolution**: 1920x1080 or higher recommended
4. **Network**: Stable internet connection

### Test Data Preparation
```
Valid Test Users:
- Email: valid.user@example.com | Password: ValidPassword123! | Name: Valid User
- Email: admin@example.com | Password: AdminPass2024! | Name: Admin User

Invalid Test Users:
- Email: nonexistent@example.com | Password: AnyPassword123!
- Email: valid.user@example.com | Password: WrongPassword!
- Email: invalid.email | Password: ValidPassword123!

Dynamic Users (Generate unique):
- Name: Test User [timestamp] | Email: test[timestamp]@example.com
```

---

## Test Suite 1: Login Functionality

### Test Case 1.1: Valid Login - Page Object Model Approach
**Objective**: Verify successful login with valid credentials using structured page interactions

#### Manual Steps:
1. **Navigate to Login Page**
   - Open browser and go to `https://www.automationexercise.com/login`
   - Verify page loads completely
   - Confirm both "Login" and "New User Signup" sections are visible

2. **Login Form Validation**
   - Locate login form on the left side of the page
   - Verify "Email Address" field is present and enabled
   - Verify "Password" field is present and enabled
   - Verify "Login" button is present and enabled

3. **Perform Valid Login**
   - Enter valid email: `testuser@example.com`
   - Enter valid password: `password123`
   - Click "Login" button
   - Take screenshot: `valid-login-attempt.png`

4. **Verify Login Result**
   - **Expected Result**: Login will fail (user doesn't exist on demo site)
   - Verify error message appears or page remains on login
   - Confirm no navigation to dashboard/home page
   - Take screenshot: `valid-login-result.png`

**Expected Outcome**: ✅ Test demonstrates login process - failure expected on demo site

---

### Test Case 1.2: Valid Login - UI Template Approach
**Objective**: Verify login functionality using template-driven form automation

#### Manual Steps:
1. **Navigate to Login Page**
   - Open browser and go to `https://www.automationexercise.com/login`
   - Wait for complete page load (all elements visible)

2. **Template Form Validation**
   - Verify login form structure matches template expectations
   - Check form selector: `form[action="/login"]`
   - Verify email field: `[data-qa="login-email"]`
   - Verify password field: `[data-qa="login-password"]`
   - Verify submit button: `[data-qa="login-button"]`

3. **Execute Template Login**
   - Fill email field with: `testuser@example.com`
   - Fill password field with: `password123`
   - Monitor form filling speed (should be < 500ms)
   - Take screenshot: `template-login-filled.png`

4. **Submit and Validate**
   - Click login button
   - Monitor submission time (should complete in < 3 seconds)
   - Verify template error handling
   - Take screenshot: `template-login-result.png`

**Expected Outcome**: ✅ Template execution successful with proper error handling

---

### Test Case 1.3: Invalid Login Credentials - POM Approach
**Objective**: Verify error handling for invalid login credentials

#### Manual Steps:
1. **Navigate to Login Page**
   - Go to `https://www.automationexercise.com/login`
   - Ensure fresh page load (clear any previous data)

2. **Invalid Credentials Test**
   - Enter invalid email: `invalid@example.com`
   - Enter wrong password: `wrongpassword`
   - Click "Login" button
   - Take screenshot: `invalid-credentials-attempt.png`

3. **Verify Error Handling**
   - Check for error message display
   - Verify message content (should indicate login failure)
   - Confirm user remains on login page
   - Verify form fields retain entered values
   - Take screenshot: `invalid-credentials-error.png`

**Expected Outcome**: ✅ Appropriate error message displayed

---

### Test Case 1.4: Invalid Login Credentials - Template Approach
**Objective**: Verify template-based error handling for invalid credentials

#### Manual Steps:
1. **Setup Template Test**
   - Navigate to `https://www.automationexercise.com/login`
   - Prepare invalid test data set

2. **Template Execution**
   - Use template to fill invalid email: `invalid@example.com`
   - Use template to fill wrong password: `wrongpassword`
   - Execute form submission through template
   - Monitor template error detection

3. **Validate Template Response**
   - Verify template correctly identifies submission failure
   - Check template error reporting mechanism
   - Confirm template captures error state
   - Take screenshot: `template-invalid-login.png`

**Expected Outcome**: ✅ Template properly handles and reports login failure

---

### Test Case 1.5: Empty Login Form Validation
**Objective**: Test form validation with empty fields using combined approaches

#### Manual Steps:
1. **Navigate and Setup**
   - Go to `https://www.automationexercise.com/login`
   - Ensure all form fields are empty

2. **Empty Form Submission - POM**
   - Click "Login" button without entering any data
   - Observe browser validation behavior
   - Take screenshot: `empty-form-pom-attempt.png`

3. **Template Field Validation**
   - Use template to validate required fields
   - Verify email field marked as required
   - Verify password field marked as required
   - Check template validation warnings

4. **Combined Validation**
   - Test template field validation accuracy
   - Verify browser and template validation alignment
   - Take screenshot: `empty-form-validation.png`

**Expected Outcome**: ✅ Proper validation prevents empty form submission

---

### Test Case 1.6: Login Form Field Interactions
**Objective**: Verify individual field behaviors and interactions

#### Manual Steps:
1. **Field Interaction Testing**
   - Navigate to `https://www.automationexercise.com/login`
   - Test email field focus behavior
   - Test password field masking
   - Verify tab navigation between fields

2. **Partial Form Filling**
   - Enter email only: `test@example.com`
   - Leave password empty
   - Take screenshot: `partial-form-filled.png`
   - Observe field validation states

3. **Form Reset Testing**
   - Fill both fields with test data
   - Clear fields manually (Ctrl+A, Delete)
   - Verify form reset behavior
   - Take screenshot: `form-reset.png`

**Expected Outcome**: ✅ Fields behave correctly with proper validation

---

## Test Suite 2: Signup Functionality

### Test Case 2.1: Initial Signup Form - POM Approach
**Objective**: Test new user registration using page object methods

#### Manual Steps:
1. **Navigate to Signup Section**
   - Go to `https://www.automationexercise.com/login`
   - Locate "New User Signup!" section on right side
   - Verify signup form elements are present

2. **Unique User Registration**
   - Generate unique name: `Test User [current_timestamp]`
   - Generate unique email: `test[current_timestamp]@example.com`
   - Example: `Test User 1692264123` and `test1692264123@example.com`

3. **Perform Signup**
   - Enter unique name in "Name" field
   - Enter unique email in "Email Address" field
   - Click "Signup" button
   - Take screenshot: `signup-attempt.png`

4. **Verify Signup Redirect**
   - Check for navigation to signup completion page
   - Verify URL contains `/signup`
   - Confirm new page loads with account creation form
   - Take screenshot: `signup-redirect.png`

**Expected Outcome**: ✅ Successful redirect to account creation page

---

### Test Case 2.2: Initial Signup Form - Template Approach
**Objective**: Test signup functionality using UI templates

#### Manual Steps:
1. **Template Signup Setup**
   - Navigate to `https://www.automationexercise.com/login`
   - Prepare unique signup data

2. **Template Execution**
   - Use template to fill name: `Template User [timestamp]`
   - Use template to fill email: `template[timestamp]@example.com`
   - Execute signup template
   - Monitor template execution time

3. **Validate Template Results**
   - Verify template detects successful signup
   - Check for proper page transition
   - Confirm template completion status
   - Take screenshot: `template-signup-success.png`

**Expected Outcome**: ✅ Template successfully executes signup flow

---

### Test Case 2.3: Existing Email Signup - Error Handling
**Objective**: Verify error handling when attempting to register with existing email

#### Manual Steps:
1. **Existing Email Test**
   - Go to `https://www.automationexercise.com/login`
   - Use common email: `test@example.com`
   - Use any name: `Test User`

2. **Attempt Duplicate Signup**
   - Enter existing email address
   - Enter any name
   - Click "Signup" button
   - Take screenshot: `duplicate-email-attempt.png`

3. **Verify Error Response**
   - Check for error message indicating email already exists
   - Verify no navigation occurs
   - Confirm form remains accessible for correction
   - Take screenshot: `duplicate-email-error.png`

**Expected Outcome**: ✅ Appropriate error message for existing email

---

## Test Suite 3: Combined Workflows

### Test Case 3.1: Complete User Journey - POM + Templates
**Objective**: Test comprehensive user flow combining multiple approaches

#### Manual Steps:
1. **Journey Initialization**
   - Navigate to login page using standard browser navigation
   - Verify both login and signup sections are loaded

2. **Multi-Approach Validation**
   - Use POM approach to inspect page structure
   - Use template approach to validate form fields
   - Verify both approaches identify same elements

3. **Failed Login Attempt**
   - Try login with non-existent credentials
   - Use POM method: email `nonexistent@example.com`, password `testpassword`
   - Verify failure is properly handled
   - Take screenshot: `journey-login-failure.png`

4. **Transition to Signup**
   - Clear login form fields
   - Switch to signup approach
   - Use template method for signup form

5. **Complete Signup Flow**
   - Generate unique user data
   - Execute signup using template approach
   - Verify successful transition or expected behavior
   - Take screenshot: `journey-final-state.png`

**Expected Outcome**: ✅ Smooth transition between different approaches

---

### Test Case 3.2: Form Switching and Validation - Performance
**Objective**: Measure performance of template operations and form switching

#### Manual Steps:
1. **Performance Test Setup**
   - Navigate to `https://www.automationexercise.com/login`
   - Prepare stopwatch or timing tool
   - Clear browser cache for consistent results

2. **Template Operations Timing**
   - **Start Timer**
   - Validate login form fields (note time)
   - Validate signup form fields (note time)
   - Fill login form with test data (note time)
   - Fill signup form with test data (note time)
   - Reset both forms (note time)
   - **End Timer**

3. **Performance Validation**
   - Total time should be < 10 seconds
   - Individual operations should be < 2 seconds each
   - Form validation should be < 500ms each
   - Take screenshot: `performance-test-completed.png`

4. **Record Results**
   - Document timing for each operation
   - Note any performance issues
   - Verify all operations completed successfully

**Expected Outcome**: ✅ All template operations complete within acceptable timeframes

---

### Test Case 3.3: Cross-Browser Login Consistency
**Objective**: Verify consistent behavior across different browsers

#### Manual Steps:
1. **Browser Test Matrix**
   - **Chrome**: Perform login test with `browser@test.com` / `testpassword`
   - **Firefox**: Repeat same test
   - **Edge**: Repeat same test
   - **Safari** (if available): Repeat same test

2. **Consistency Validation** (For each browser):
   - Navigate to login page
   - Fill login form with test credentials
   - Take screenshot: `[browser]-form-filled.png`
   - Attempt login submission
   - Verify error handling consistency
   - Take screenshot: `[browser]-result.png`

3. **Cross-Browser Comparison**
   - Compare form layouts between browsers
   - Verify field behavior consistency
   - Check error message display consistency
   - Document any browser-specific differences

**Expected Outcome**: ✅ Consistent behavior and appearance across all browsers

---

## Test Suite 4: Template Registration and Customization

### Test Case 4.1: Custom Login Template Registration
**Objective**: Verify ability to create and use custom login templates

#### Manual Steps:
1. **Custom Template Concept**
   - Understand that custom templates extend base functionality
   - Note custom validation rules and selectors
   - Prepare custom test data: `custom@template.com` / `custompass`

2. **Custom Template Testing**
   - Navigate to `https://www.automationexercise.com/login`
   - Execute login using custom template approach
   - Note any enhanced validation or behavior
   - Verify custom error handling

3. **Template Customization Validation**
   - Test custom email validation (if implemented)
   - Verify custom success/error containers
   - Check custom template performance
   - Take screenshot: `custom-template-test.png`

**Expected Outcome**: ✅ Custom template functions correctly with enhanced features

---

## Test Execution Guidelines

### General Testing Tips:
1. **Screenshots**: Take screenshots at key moments for evidence
2. **Timing**: Record operation times for performance analysis
3. **Consistency**: Use same test data across approaches when comparing
4. **Documentation**: Note any unexpected behavior or deviations
5. **Environment**: Test in consistent environment conditions

### Expected Behaviors:
- **Demo Site Limitation**: Many login attempts will fail as test users don't exist
- **Error Handling**: Focus on proper error detection and handling
- **Performance**: Template operations should complete quickly
- **Consistency**: Behavior should be similar across browsers and approaches

### Success Criteria:
- ✅ All form interactions work properly
- ✅ Error handling functions correctly
- ✅ Performance requirements are met
- ✅ Cross-browser consistency maintained
- ✅ Both POM and Template approaches function as expected

---

## Troubleshooting Guide

### Common Issues:
1. **Slow Loading**: Wait for complete page load before starting tests
2. **Element Not Found**: Verify selectors match current page structure  
3. **Timing Issues**: Allow sufficient time for page transitions
4. **Browser Differences**: Note and document any browser-specific behaviors

### Validation Points:
- Form elements are properly identified
- User interactions complete successfully
- Error states are properly detected
- Performance metrics meet requirements
- Screenshots capture key test moments

---

## Test Results Template

```
Test Execution Summary:
Date: ___________
Browser: ___________
Environment: ___________

Test Suite 1 - Login Functionality:
□ Test 1.1: Valid Login - POM ✅/❌
□ Test 1.2: Valid Login - Template ✅/❌
□ Test 1.3: Invalid Login - POM ✅/❌
□ Test 1.4: Invalid Login - Template ✅/❌
□ Test 1.5: Empty Form Validation ✅/❌
□ Test 1.6: Field Interactions ✅/❌

Test Suite 2 - Signup Functionality:
□ Test 2.1: Signup - POM ✅/❌
□ Test 2.2: Signup - Template ✅/❌
□ Test 2.3: Existing Email Error ✅/❌

Test Suite 3 - Combined Workflows:
□ Test 3.1: Complete Journey ✅/❌
□ Test 3.2: Performance Test ✅/❌
□ Test 3.3: Cross-Browser Test ✅/❌

Test Suite 4 - Template Customization:
□ Test 4.1: Custom Templates ✅/❌

Overall Result: ✅/❌
Notes: ___________
```

---

*This manual test guide complements the automated test suite and provides comprehensive coverage of all login page functionality using both Page Object Model and UI Template approaches.*
