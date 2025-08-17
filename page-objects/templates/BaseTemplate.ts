import { Page, Locator } from '@playwright/test';
import { BasePage } from '../BasePage';

export interface TemplateConfig {
    templateName: string;
    selectors: Record<string, string>;
    actions?: Record<string, (...args: any[]) => Promise<void>>;
    validations?: Record<string, (...args: any[]) => Promise<void>>;
}

/**
 * Base template class that provides reusable UI patterns
 * Can be extended for specific template types (forms, lists, modals, etc.)
 */
export abstract class BaseTemplate extends BasePage {
    protected config: TemplateConfig;
    protected templateElements: Record<string, Locator> = {};

    constructor(page: Page, config: TemplateConfig) {
        super(page);
        this.config = config;
        this.initializeElements();
    }

    /**
     * Initialize all template elements based on configuration
     */
    protected initializeElements(): void {
        Object.entries(this.config.selectors).forEach(([elementName, selector]) => {
            this.templateElements[elementName] = this.page.locator(selector);
        });
    }

    /**
     * Get a template element by name
     */
    getElement(elementName: string): Locator {
        const element = this.templateElements[elementName];
        if (!element) {
            throw new Error(`Element '${elementName}' not found in template '${this.config.templateName}'`);
        }
        return element;
    }

    /**
     * Execute a template action by name
     */
    async executeAction(actionName: string, ...args: any[]): Promise<void> {
        const action = this.config.actions?.[actionName];
        if (!action) {
            throw new Error(`Action '${actionName}' not found in template '${this.config.templateName}'`);
        }
        await action.apply(this, args);
    }

    /**
     * Execute a template validation by name
     */
    async executeValidation(validationName: string, ...args: any[]): Promise<void> {
        const validation = this.config.validations?.[validationName];
        if (!validation) {
            throw new Error(`Validation '${validationName}' not found in template '${this.config.templateName}'`);
        }
        await validation.apply(this, args);
    }

    /**
     * Take screenshot with template-specific naming
     */
    async takeTemplateScreenshot(stepName: string): Promise<void> {
        const screenshotName = `${this.config.templateName}-${stepName}`;
        await this.takeScreenshot(screenshotName);
    }
}
