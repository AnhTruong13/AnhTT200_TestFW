import { Page } from '@playwright/test';
import { FormTemplate, FormTemplateConfig, signupFormTemplate, loginFormTemplate, initialSignupFormTemplate } from './FormTemplate';
import { ListTemplate, ListTemplateConfig, productsListTemplate } from './ListTemplate';
import { ModalTemplate, ModalTemplateConfig, confirmationModalTemplate, alertModalTemplate } from './ModalTemplate';

export type TemplateType = 'form' | 'list' | 'modal';

export interface TemplateRegistry {
    form: Record<string, FormTemplateConfig>;
    list: Record<string, ListTemplateConfig>;
    modal: Record<string, ModalTemplateConfig>;
}

/**
 * Factory for creating and managing UI templates
 * Provides centralized access to all available templates
 */
export class TemplateFactory {
    private static registry: TemplateRegistry = {
        form: {
            'signup': signupFormTemplate,
            'login': loginFormTemplate,
            'initial-signup': initialSignupFormTemplate,
            // Add more form templates here
        },
        list: {
            'products': productsListTemplate,
            // Add more list templates here
        },
        modal: {
            'confirmation': confirmationModalTemplate,
            'alert': alertModalTemplate,
            // Add more modal templates here
        }
    };

    /**
     * Create a form template instance
     */
    static createFormTemplate(page: Page, templateName: string): FormTemplate {
        const config = this.registry.form[templateName];
        if (!config) {
            throw new Error(`Form template '${templateName}' not found. Available templates: ${Object.keys(this.registry.form).join(', ')}`);
        }
        return new FormTemplate(page, config);
    }

    /**
     * Create a list template instance
     */
    static createListTemplate(page: Page, templateName: string): ListTemplate {
        const config = this.registry.list[templateName];
        if (!config) {
            throw new Error(`List template '${templateName}' not found. Available templates: ${Object.keys(this.registry.list).join(', ')}`);
        }
        return new ListTemplate(page, config);
    }

    /**
     * Create a modal template instance
     */
    static createModalTemplate(page: Page, templateName: string): ModalTemplate {
        const config = this.registry.modal[templateName];
        if (!config) {
            throw new Error(`Modal template '${templateName}' not found. Available templates: ${Object.keys(this.registry.modal).join(', ')}`);
        }
        return new ModalTemplate(page, config);
    }

    /**
     * Register a new form template
     */
    static registerFormTemplate(name: string, config: FormTemplateConfig): void {
        this.registry.form[name] = config;
        console.log(`📝 Registered form template: ${name}`);
    }

    /**
     * Register a new list template
     */
    static registerListTemplate(name: string, config: ListTemplateConfig): void {
        this.registry.list[name] = config;
        console.log(`📋 Registered list template: ${name}`);
    }

    /**
     * Register a new modal template
     */
    static registerModalTemplate(name: string, config: ModalTemplateConfig): void {
        this.registry.modal[name] = config;
        console.log(`🔲 Registered modal template: ${name}`);
    }

    /**
     * Get all available template names by type
     */
    static getAvailableTemplates(type?: TemplateType): Record<string, string[]> | string[] {
        if (type) {
            return Object.keys(this.registry[type]);
        }

        return {
            form: Object.keys(this.registry.form),
            list: Object.keys(this.registry.list),
            modal: Object.keys(this.registry.modal)
        };
    }

    /**
     * Check if a template exists
     */
    static hasTemplate(type: TemplateType, name: string): boolean {
        return name in this.registry[type];
    }

    /**
     * Remove a template from registry
     */
    static unregisterTemplate(type: TemplateType, name: string): boolean {
        if (this.hasTemplate(type, name)) {
            delete this.registry[type][name];
            console.log(`🗑️ Unregistered ${type} template: ${name}`);
            return true;
        }
        return false;
    }

    /**
     * Get template configuration without creating instance
     */
    static getTemplateConfig(type: TemplateType, name: string): FormTemplateConfig | ListTemplateConfig | ModalTemplateConfig {
        const config = this.registry[type][name];
        if (!config) {
            throw new Error(`${type} template '${name}' not found`);
        }
        return config;
    }
}

/**
 * Template Manager for handling multiple templates in a single test
 */
export class TemplateManager {
    private page: Page;
    private activeTemplates: Map<string, FormTemplate | ListTemplate | ModalTemplate> = new Map();

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Get or create a form template
     */
    getFormTemplate(templateName: string): FormTemplate {
        const key = `form-${templateName}`;
        if (!this.activeTemplates.has(key)) {
            const template = TemplateFactory.createFormTemplate(this.page, templateName);
            this.activeTemplates.set(key, template);
        }
        return this.activeTemplates.get(key) as FormTemplate;
    }

    /**
     * Get or create a list template
     */
    getListTemplate(templateName: string): ListTemplate {
        const key = `list-${templateName}`;
        if (!this.activeTemplates.has(key)) {
            const template = TemplateFactory.createListTemplate(this.page, templateName);
            this.activeTemplates.set(key, template);
        }
        return this.activeTemplates.get(key) as ListTemplate;
    }

    /**
     * Get or create a modal template
     */
    getModalTemplate(templateName: string): ModalTemplate {
        const key = `modal-${templateName}`;
        if (!this.activeTemplates.has(key)) {
            const template = TemplateFactory.createModalTemplate(this.page, templateName);
            this.activeTemplates.set(key, template);
        }
        return this.activeTemplates.get(key) as ModalTemplate;
    }

    /**
     * Clear all active templates
     */
    clearAllTemplates(): void {
        this.activeTemplates.clear();
        console.log('🧹 Cleared all active templates');
    }

    /**
     * Get count of active templates
     */
    getActiveTemplateCount(): number {
        return this.activeTemplates.size;
    }

    /**
     * List all active template keys
     */
    getActiveTemplateKeys(): string[] {
        return Array.from(this.activeTemplates.keys());
    }
}
