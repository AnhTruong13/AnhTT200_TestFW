import { Page, Locator, expect } from '@playwright/test';
import { BaseTemplate, TemplateConfig } from './BaseTemplate';

export interface ModalTemplateConfig extends TemplateConfig {
    modalSelector: string;
    titleSelector?: string;
    contentSelector?: string;
    closeButtonSelector?: string;
    confirmButtonSelector?: string;
    cancelButtonSelector?: string;
    overlaySelector?: string;
}

/**
 * Reusable modal/dialog template for consistent modal handling
 */
export class ModalTemplate extends BaseTemplate {
    protected modalConfig: ModalTemplateConfig;

    constructor(page: Page, modalConfig: ModalTemplateConfig) {
        super(page, modalConfig);
        this.modalConfig = modalConfig;
    }

    /**
     * Wait for modal to appear
     */
    async waitForModal(timeout: number = 10000): Promise<void> {
        const modal = this.page.locator(this.modalConfig.modalSelector);
        await this.waitForElement(modal, timeout);
        await this.takeTemplateScreenshot('modal-opened');
        console.log(`🔲 Modal opened: ${this.modalConfig.templateName}`);
    }

    /**
     * Wait for modal to disappear
     */
    async waitForModalClose(timeout: number = 10000): Promise<void> {
        const modal = this.page.locator(this.modalConfig.modalSelector);
        await modal.waitFor({ state: 'detached', timeout });
        await this.takeTemplateScreenshot('modal-closed');
        console.log(`🔳 Modal closed: ${this.modalConfig.templateName}`);
    }

    /**
     * Check if modal is visible
     */
    async isModalVisible(): Promise<boolean> {
        const modal = this.page.locator(this.modalConfig.modalSelector);
        return await modal.isVisible();
    }

    /**
     * Get modal title
     */
    async getModalTitle(): Promise<string> {
        if (!this.modalConfig.titleSelector) {
            throw new Error('Title selector not configured for this modal template');
        }

        const titleElement = this.page.locator(this.modalConfig.titleSelector);
        const title = await titleElement.textContent();
        console.log(`📋 Modal title: ${title}`);
        return title?.trim() || '';
    }

    /**
     * Get modal content
     */
    async getModalContent(): Promise<string> {
        if (!this.modalConfig.contentSelector) {
            throw new Error('Content selector not configured for this modal template');
        }

        const contentElement = this.page.locator(this.modalConfig.contentSelector);
        const content = await contentElement.textContent();
        console.log(`📄 Modal content: ${content?.substring(0, 100)}...`);
        return content?.trim() || '';
    }

    /**
     * Close modal using close button
     */
    async closeModal(): Promise<void> {
        if (!this.modalConfig.closeButtonSelector) {
            throw new Error('Close button selector not configured for this modal template');
        }

        await this.takeTemplateScreenshot('before-close');
        const closeButton = this.page.locator(this.modalConfig.closeButtonSelector);
        await this.waitForElement(closeButton);
        await closeButton.click();
        await this.waitForModalClose();
        console.log(`❌ Modal closed using close button`);
    }

    /**
     * Confirm modal action
     */
    async confirmModal(): Promise<void> {
        if (!this.modalConfig.confirmButtonSelector) {
            throw new Error('Confirm button selector not configured for this modal template');
        }

        await this.takeTemplateScreenshot('before-confirm');
        const confirmButton = this.page.locator(this.modalConfig.confirmButtonSelector);
        await this.waitForElement(confirmButton);
        await confirmButton.click();
        console.log(`✅ Modal confirmed`);
    }

    /**
     * Cancel modal action
     */
    async cancelModal(): Promise<void> {
        if (!this.modalConfig.cancelButtonSelector) {
            throw new Error('Cancel button selector not configured for this modal template');
        }

        await this.takeTemplateScreenshot('before-cancel');
        const cancelButton = this.page.locator(this.modalConfig.cancelButtonSelector);
        await this.waitForElement(cancelButton);
        await cancelButton.click();
        await this.waitForModalClose();
        console.log(`❌ Modal cancelled`);
    }

    /**
     * Close modal by clicking overlay
     */
    async closeByOverlay(): Promise<void> {
        if (!this.modalConfig.overlaySelector) {
            throw new Error('Overlay selector not configured for this modal template');
        }

        await this.takeTemplateScreenshot('before-overlay-close');
        const overlay = this.page.locator(this.modalConfig.overlaySelector);
        await overlay.click();
        await this.waitForModalClose();
        console.log(`🔳 Modal closed by clicking overlay`);
    }

    /**
     * Close modal using Escape key
     */
    async closeByEscape(): Promise<void> {
        await this.takeTemplateScreenshot('before-escape-close');
        await this.page.keyboard.press('Escape');
        await this.waitForModalClose();
        console.log(`⌨️ Modal closed using Escape key`);
    }

    /**
     * Verify modal title
     */
    async verifyTitle(expectedTitle: string): Promise<void> {
        const actualTitle = await this.getModalTitle();
        expect(actualTitle).toBe(expectedTitle);
        console.log(`✅ Modal title verified: ${expectedTitle}`);
    }

    /**
     * Verify modal content contains text
     */
    async verifyContentContains(expectedText: string): Promise<void> {
        const actualContent = await this.getModalContent();
        expect(actualContent).toContain(expectedText);
        console.log(`✅ Modal content verified to contain: ${expectedText}`);
    }

    /**
     * Verify modal buttons are present
     */
    async verifyButtons(buttons: string[]): Promise<void> {
        for (const button of buttons) {
            let selector = '';
            switch (button.toLowerCase()) {
                case 'close':
                    selector = this.modalConfig.closeButtonSelector || '';
                    break;
                case 'confirm':
                case 'ok':
                case 'yes':
                    selector = this.modalConfig.confirmButtonSelector || '';
                    break;
                case 'cancel':
                case 'no':
                    selector = this.modalConfig.cancelButtonSelector || '';
                    break;
            }

            if (selector) {
                const buttonElement = this.page.locator(selector);
                await expect(buttonElement).toBeVisible();
                console.log(`✅ ${button} button is present`);
            }
        }

        await this.takeTemplateScreenshot('buttons-verified');
    }
}

// Example: Confirmation Modal Template Configuration
export const confirmationModalTemplate: ModalTemplateConfig = {
    templateName: 'confirmation-modal',
    selectors: {
        modal: '.modal, .dialog, [role="dialog"]',
        title: '.modal-title, .dialog-title, h2, h3',
        content: '.modal-body, .dialog-content, .modal-content p',
        closeButton: '.modal-close, .close, [aria-label="Close"]',
        confirmButton: '.btn-confirm, .btn-primary, .btn-yes, .confirm',
        cancelButton: '.btn-cancel, .btn-secondary, .btn-no, .cancel',
        overlay: '.modal-backdrop, .overlay, .modal-overlay'
    },
    modalSelector: '.modal, .dialog, [role="dialog"]',
    titleSelector: '.modal-title, .dialog-title, h2, h3',
    contentSelector: '.modal-body, .dialog-content, .modal-content p',
    closeButtonSelector: '.modal-close, .close, [aria-label="Close"]',
    confirmButtonSelector: '.btn-confirm, .btn-primary, .btn-yes, .confirm',
    cancelButtonSelector: '.btn-cancel, .btn-secondary, .btn-no, .cancel',
    overlaySelector: '.modal-backdrop, .overlay, .modal-overlay'
};

// Example: Alert Modal Template Configuration
export const alertModalTemplate: ModalTemplateConfig = {
    templateName: 'alert-modal',
    selectors: {
        modal: '.alert-modal, .notification, .toast',
        title: '.alert-title, .notification-title',
        content: '.alert-message, .notification-content',
        closeButton: '.alert-close, .notification-close'
    },
    modalSelector: '.alert-modal, .notification, .toast',
    titleSelector: '.alert-title, .notification-title',
    contentSelector: '.alert-message, .notification-content',
    closeButtonSelector: '.alert-close, .notification-close'
};
