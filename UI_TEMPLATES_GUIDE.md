# UI Template System Documentation

## Overview

The UI Template System provides a powerful, reusable way to interact with common UI patterns in your Playwright tests. This system integrates seamlessly with your existing organized evidence collection framework.

## Template Types

### 1. Form Templates
Handle form interactions consistently across your application.

**Features:**
- Automatic field validation
- Type-aware input handling (input, select, checkbox, radio, textarea)
- Built-in screenshot capture at key steps
- Success/error outcome validation
- Form reset capabilities

**Usage:**
```typescript
import { TestUtils } from '../utils/TestUtils';

// Simple form execution
await TestUtils.executeFormTemplate(page, 'signup', {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'secure123'
}, 'success');

// Advanced form interaction
const templateManager = TestUtils.createTemplateManager(page);
const signupForm = templateManager.getFormTemplate('signup');
await signupForm.validateFields();
await signupForm.fillForm(formData);
await signupForm.submitForm('success');
```

### 2. List Templates
Interact with lists, grids, and collections of items.

**Features:**
- Item counting and validation
- Search and filter functionality
- Sorting capabilities
- Click actions by index or field value
- Load more/pagination support
- Empty state verification

**Usage:**
```typescript
// Quick list operations
const itemCount = await TestUtils.executeListTemplate(page, 'products', 'count');
await TestUtils.executeListTemplate(page, 'products', 'search', 'smartphone');
await TestUtils.executeListTemplate(page, 'products', 'clickFirst');

// Advanced list interaction
const productsList = templateManager.getListTemplate('products');
await productsList.verifyItemsLoaded();
const item = await productsList.findItemByField('name', 'iPhone');
await productsList.clickItemByField('name', 'iPhone');
```

### 3. Modal Templates
Handle modals, dialogs, and popups consistently.

**Features:**
- Modal visibility detection
- Title and content verification
- Multiple close methods (button, overlay, escape key)
- Confirm/cancel actions
- Button presence validation

**Usage:**
```typescript
// Modal interaction
await TestUtils.executeModalTemplate(page, 'confirmation', 'verify', {
    title: 'Confirm Delete',
    content: 'Are you sure',
    buttons: ['confirm', 'cancel']
});
await TestUtils.executeModalTemplate(page, 'confirmation', 'confirm');

// Advanced modal handling
const confirmModal = templateManager.getModalTemplate('confirmation');
await confirmModal.waitForModal();
const title = await confirmModal.getModalTitle();
await confirmModal.confirmModal();
```

## Template Configuration

### Creating Custom Templates

#### Form Template Configuration
```typescript
import { TemplateFactory } from '../page-objects/templates/TemplateFactory';

TemplateFactory.registerFormTemplate('contact', {
    templateName: 'contact-form',
    selectors: {
        form: '.contact-form',
        submitButton: '.btn-send'
    },
    fields: [
        { name: 'name', selector: '#name', type: 'input', required: true },
        { name: 'email', selector: '#email', type: 'input', required: true },
        { name: 'subject', selector: '#subject', type: 'select' },
        { name: 'message', selector: '#message', type: 'textarea', required: true }
    ],
    submitButton: '.btn-send',
    successContainer: '.success-alert',
    errorContainer: '.error-alert'
});
```

#### List Template Configuration
```typescript
TemplateFactory.registerListTemplate('orders', {
    templateName: 'orders-list',
    selectors: {
        container: '.orders-container'
    },
    containerSelector: '.orders-container',
    itemSelector: '.order-item',
    itemFields: {
        orderNumber: '.order-number',
        date: '.order-date',
        status: '.order-status',
        total: '.order-total'
    },
    searchSelector: '.search-orders',
    sortSelector: '.sort-orders',
    emptyStateSelector: '.no-orders'
});
```

#### Modal Template Configuration
```typescript
TemplateFactory.registerModalTemplate('delete-confirmation', {
    templateName: 'delete-modal',
    selectors: {
        modal: '.delete-modal'
    },
    modalSelector: '.delete-modal',
    titleSelector: '.modal-title',
    contentSelector: '.modal-body',
    confirmButtonSelector: '.btn-delete',
    cancelButtonSelector: '.btn-cancel',
    closeButtonSelector: '.modal-close'
});
```

## Integration with Organized Evidence

The template system automatically integrates with your organized evidence collection:

- **Screenshots**: Captured at key interaction points
- **Directory Structure**: Saved to `Evidence/test-run-YYYY-MM-DD_HH-MM-SS/screenshots/`
- **Naming Convention**: `{templateType}-{templateName}-{action}-{timestamp}.png`
- **Performance Tracking**: Execution times logged and validated

## Best Practices

### 1. Template Organization
```typescript
// Group related templates by feature area
const authTemplates = {
    login: loginFormTemplate,
    signup: signupFormTemplate,
    resetPassword: resetPasswordFormTemplate
};

// Register all templates at once
Object.entries(authTemplates).forEach(([name, config]) => {
    TemplateFactory.registerFormTemplate(name, config);
});
```

### 2. Test Structure
```typescript
test.describe('Feature Tests', () => {
    let templateManager: TemplateManager;

    test.beforeEach(async ({ page }) => {
        templateManager = TestUtils.createTemplateManager(page);
        await TestUtils.setupConsoleLogging(page);
    });

    test('should complete user journey', async ({ page }) => {
        // Use templates consistently throughout test
        await TestUtils.executeFormTemplate(page, 'signup', userData);
        await TestUtils.executeListTemplate(page, 'products', 'search', 'laptop');
        await TestUtils.executeModalTemplate(page, 'confirmation', 'confirm');
    });
});
```

### 3. Error Handling
```typescript
try {
    await TestUtils.executeFormTemplate(page, 'signup', formData, 'success');
} catch (error) {
    // Template already captures error screenshot
    console.log('Signup failed:', error.message);
    
    // Additional error handling if needed
    await page.goto('/signup'); // Retry navigation
    throw error; // Re-throw to fail test
}
```

## Template Validation

### Performance Validation
Templates automatically validate execution time:
```typescript
// Automatic performance tracking in TestUtils methods
const startTime = performance.now();
// ... template execution ...
const duration = performance.now() - startTime;
console.log(`Template executed in ${duration.toFixed(2)}ms`);
```

### Field Validation
Form templates validate field requirements:
```typescript
// Automatic validation in FormTemplate
for (const field of this.formConfig.fields) {
    if (field.required && !formData[field.name]) {
        throw new Error(`Required field '${field.name}' is missing`);
    }
}
```

## Available Templates

### Pre-configured Templates

1. **signup**: Complete signup form handling
2. **products**: Product list interactions
3. **confirmation**: Standard confirmation modals
4. **alert**: Alert/notification modals

### Template Registry
View available templates:
```typescript
const availableTemplates = TemplateFactory.getAvailableTemplates();
console.log(availableTemplates);
// Output: { form: ['signup'], list: ['products'], modal: ['confirmation', 'alert'] }
```

## Advanced Features

### Template Manager
Manage multiple templates in a single test:
```typescript
const templateManager = TestUtils.createTemplateManager(page);

// Templates are cached for performance
const form1 = templateManager.getFormTemplate('signup');
const form2 = templateManager.getFormTemplate('signup'); // Returns cached instance

// Clear cache when needed
templateManager.clearAllTemplates();
```

### Dynamic Template Configuration
Modify templates at runtime:
```typescript
const config = TemplateFactory.getTemplateConfig('form', 'signup');
config.fields.push({
    name: 'newsletter',
    selector: '#newsletter',
    type: 'checkbox'
});
```

## Troubleshooting

### Common Issues

1. **Element Not Found**
   - Verify selectors in template configuration
   - Check if page has loaded completely
   - Use browser dev tools to inspect elements

2. **Template Not Registered**
   - Ensure template is registered before use
   - Check template name spelling
   - Verify template type (form/list/modal)

3. **Performance Issues**
   - Check network conditions
   - Verify element visibility timeouts
   - Review page load performance

### Debug Mode
Enable verbose logging:
```typescript
// Set environment variable
process.env.DEBUG_TEMPLATES = 'true';

// Or add to your test
console.log('Template execution details:', templateManager.getActiveTemplateKeys());
```

## Migration Guide

### From Manual Selectors to Templates

**Before (Manual):**
```typescript
await page.fill('#name', 'John Doe');
await page.fill('#email', 'john@example.com');
await page.click('.btn-submit');
await expect(page.locator('.success')).toBeVisible();
```

**After (Template):**
```typescript
await TestUtils.executeFormTemplate(page, 'signup', {
    name: 'John Doe',
    email: 'john@example.com'
}, 'success');
```

**Benefits:**
- Consistent error handling
- Automatic screenshots
- Performance tracking
- Reusable configurations
- Better test maintenance
