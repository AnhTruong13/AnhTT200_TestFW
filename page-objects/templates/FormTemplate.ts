import { Page, expect } from '@playwright/test';
import { BaseTemplate, TemplateConfig } from './BaseTemplate';
import { TestUtils } from '../../utils/TestUtils';

export interface FormField {
    name: string;
    selector: string;
    type: 'input' | 'select' | 'checkbox' | 'radio' | 'textarea';
    required?: boolean;
    validation?: RegExp | string;
}

export interface FormTemplateConfig extends TemplateConfig {
    fields: FormField[];
    submitButton: string;
    resetButton?: string;
    errorContainer?: string;
    successContainer?: string;
}

/**
 * Reusable form template for consistent form handling across the application
 */
export class FormTemplate extends BaseTemplate {
    protected formConfig: FormTemplateConfig;

    constructor(page: Page, formConfig: FormTemplateConfig) {
        super(page, formConfig);
        this.formConfig = formConfig;
    }

    /**
     * Fill form with provided data
     */
    async fillForm(formData: Record<string, any>): Promise<void> {
        const startTime = performance.now();
        console.log(`📝 Filling form: ${this.formConfig.templateName}`);

        // Take screenshot before filling
        await this.takeTemplateScreenshot('before-fill');

        for (const field of this.formConfig.fields) {
            const value = formData[field.name];
            if (value !== undefined && value !== null && value !== '') {
                await this.fillField(field, value);
            } else if (field.required) {
                throw new Error(`Required field '${field.name}' is missing in form data`);
            }
        }

        // Take screenshot after filling
        await this.takeTemplateScreenshot('after-fill');

        const duration = performance.now() - startTime;
        console.log(`✅ Form filled in ${duration.toFixed(2)}ms`);
    }

    /**
     * Fill individual field based on its type
     */
    async fillField(field: FormField, value: any): Promise<void> {
        const element = this.page.locator(field.selector);
        await this.waitForElement(element);

        switch (field.type) {
            case 'input':
            case 'textarea':
                await element.clear();
                await element.fill(String(value));
                break;
            case 'select':
                await element.selectOption(String(value));
                break;
            case 'checkbox':
                if (value) {
                    await element.check();
                } else {
                    await element.uncheck();
                }
                break;
            case 'radio':
                await this.page.locator(`${field.selector}[value="${value}"]`).check();
                break;
        }

        console.log(`🔹 Filled ${field.name}: ${value}`);
    }

    /**
     * Submit the form
     */
    async submitForm(expectedOutcome: 'success' | 'error' = 'success'): Promise<void> {
        const startTime = performance.now();
        console.log(`🚀 Submitting form: ${this.formConfig.templateName}`);

        // Take screenshot before submit
        await this.takeTemplateScreenshot('before-submit');

        const submitButton = this.page.locator(this.formConfig.submitButton);
        await this.waitForElement(submitButton);
        await submitButton.click();

        // Wait for response and validate
        await this.page.waitForTimeout(2000); // Allow for processing

        // Take screenshot after submit
        await this.takeTemplateScreenshot('after-submit');

        if (expectedOutcome === 'success' && this.formConfig.successContainer) {
            await expect(this.page.locator(this.formConfig.successContainer)).toBeVisible();
            console.log('✅ Form submission successful');
        } else if (expectedOutcome === 'error' && this.formConfig.errorContainer) {
            await expect(this.page.locator(this.formConfig.errorContainer)).toBeVisible();
            console.log('❌ Form submission failed as expected');
        }

        const duration = performance.now() - startTime;
        console.log(`📊 Form submission completed in ${duration.toFixed(2)}ms`);
    }

    /**
     * Validate form fields
     */
    async validateFields(): Promise<void> {
        console.log(`🔍 Validating form fields: ${this.formConfig.templateName}`);

        for (const field of this.formConfig.fields) {
            const element = this.page.locator(field.selector);
            await expect(element).toBeVisible();

            if (field.required) {
                const requiredAttribute = await element.getAttribute('required');
                const hasRequiredClass = await element.evaluate(el =>
                    el.classList.contains('required') ||
                    el.parentElement?.classList.contains('required')
                );

                if (!requiredAttribute && !hasRequiredClass) {
                    console.warn(`⚠️ Required field '${field.name}' may not have proper validation indicators`);
                }
            }
        }

        await this.takeTemplateScreenshot('field-validation');
        console.log('✅ Field validation completed');
    }

    /**
     * Reset form to initial state
     */
    async resetForm(): Promise<void> {
        if (this.formConfig.resetButton) {
            const resetButton = this.page.locator(this.formConfig.resetButton);
            await this.waitForElement(resetButton);
            await resetButton.click();
            console.log(`🔄 Form reset: ${this.formConfig.templateName}`);
        } else {
            // Manual reset by clearing all fields
            for (const field of this.formConfig.fields) {
                if (field.type === 'input' || field.type === 'textarea') {
                    await this.page.locator(field.selector).clear();
                } else if (field.type === 'checkbox') {
                    await this.page.locator(field.selector).uncheck();
                }
            }
            console.log(`🔄 Manual form reset: ${this.formConfig.templateName}`);
        }

        await this.takeTemplateScreenshot('after-reset');
    }
}

// Example: Signup Form Template Configuration
export const signupFormTemplate: FormTemplateConfig = {
    templateName: 'signup-form',
    selectors: {
        form: 'form[action="/signup"]',
        submitButton: '[data-qa="create-account"]',
        successMessage: '[data-qa="account-created"]',
        errorMessage: '.alert-danger, .error-message'
    },
    fields: [
        { name: 'name', selector: '[data-qa="signup-name"]', type: 'input', required: true },
        { name: 'email', selector: '[data-qa="signup-email"]', type: 'input', required: true },
        { name: 'password', selector: '[data-qa="password"]', type: 'input', required: true },
        { name: 'confirmPassword', selector: '[data-qa="confirm-password"]', type: 'input' },
        { name: 'firstName', selector: '[data-qa="first_name"]', type: 'input' },
        { name: 'lastName', selector: '[data-qa="last_name"]', type: 'input' },
        { name: 'company', selector: '[data-qa="company"]', type: 'input' },
        { name: 'address', selector: '[data-qa="address"]', type: 'input' },
        { name: 'country', selector: '[data-qa="country"]', type: 'select' },
        { name: 'state', selector: '[data-qa="state"]', type: 'input' },
        { name: 'city', selector: '[data-qa="city"]', type: 'input' },
        { name: 'zipcode', selector: '[data-qa="zipcode"]', type: 'input' },
        { name: 'mobile', selector: '[data-qa="mobile_number"]', type: 'input' }
    ],
    submitButton: '[data-qa="create-account"]',
    successContainer: '[data-qa="account-created"]',
    errorContainer: '.alert-danger, .error-message'
};

// Login Form Template Configuration
export const loginFormTemplate: FormTemplateConfig = {
    templateName: 'login-form',
    selectors: {
        form: 'form[action="/login"]',
        submitButton: '[data-qa="login-button"]',
        successMessage: '.navbar-nav',
        errorMessage: '.login-form p'
    },
    fields: [
        { name: 'email', selector: '[data-qa="login-email"]', type: 'input', required: true },
        { name: 'password', selector: '[data-qa="login-password"]', type: 'input', required: true }
    ],
    submitButton: '[data-qa="login-button"]',
    successContainer: '.navbar-nav',
    errorContainer: '.login-form p'
};

// Initial Signup Form Template (just name and email)
export const initialSignupFormTemplate: FormTemplateConfig = {
    templateName: 'initial-signup-form',
    selectors: {
        form: 'form[action="/signup"]',
        submitButton: '[data-qa="signup-button"]',
        successMessage: '[data-qa="account-created"]',
        errorMessage: '.signup-form p'
    },
    fields: [
        { name: 'name', selector: '[data-qa="signup-name"]', type: 'input', required: true },
        { name: 'email', selector: '[data-qa="signup-email"]', type: 'input', required: true }
    ],
    submitButton: '[data-qa="signup-button"]',
    successContainer: '[data-qa="account-created"]',
    errorContainer: '.signup-form p'
};
