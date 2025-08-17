
# Manual Test Steps for All Automated Scenarios

## HomePage Tests - Comprehensive Manual Steps

### Test 1: Verify homepage loads successfully
1. Open browser (Chrome, Firefox, Safari, Edge, or branded Chrome/Edge).
2. Navigate to https://www.automationexercise.com/
3. Verify that the homepage loads completely without errors.
4. Verify the page title is "Automation Exercise".
5. Verify all main elements are visible (header, navigation, main content, footer).
6. Take a screenshot for verification.

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
4. Take a screenshot of the navigation menu.

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
6. Wait and observe if carousel auto-advances (if applicable).
7. Take a screenshot of carousel functionality.

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
6. Verify that the top of the page is visible.
7. Take a screenshot of the scroll to top functionality.

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

## Signup Test
1. Open browser (Chrome, Firefox, Safari, Edge, or branded Chrome/Edge).
2. Go to https://www.automationexercise.com/
3. Click on "Signup / Login".
4. Enter a random user name and email address in the signup form.
5. Click "Signup".
6. Fill in all required account information fields (gender, password, date of birth, first name, last name, address, country, state, city, zipcode, mobile number).
7. Click "Create Account".
8. Verify that "Account Created!" message appears.

## Login/Logout Test
1. Open browser (Chrome, Firefox, Safari, Edge, or branded Chrome/Edge).
2. Go to https://www.automationexercise.com/
3. Click on "Signup / Login".
4. Enter the registered email and password in the login form.
5. Click "Login".
6. Verify that "Logged in as <username>" is visible.
7. Click "Logout".
8. Verify that you are redirected to the login page and "Signup / Login" link is visible.

## Delete Account Test
1. Open browser (Chrome, Firefox, Safari, Edge, or branded Chrome/Edge).
2. Go to https://www.automationexercise.com/
3. Click on "Signup / Login".
4. Enter a random user name and email address in the signup form.
5. Click "Signup".
6. Fill in all required account information fields (gender, password, date of birth, first name, last name, address, country, state, city, zipcode, mobile number).
7. Click "Create Account".
8. Verify that "Account Created!" message appears.
9. Click on "Signup / Login" again and log in with the newly created account.
10. Verify that "Logged in as <username>" is visible.
11. Click "Delete Account".
12. Verify that "Account Deleted!" message appears.
