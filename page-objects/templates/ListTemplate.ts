import { Page, Locator, expect } from '@playwright/test';
import { BaseTemplate, TemplateConfig } from './BaseTemplate';

export interface ListItem {
    selector: string;
    fields: Record<string, string>; // field name -> selector within item
}

export interface ListTemplateConfig extends TemplateConfig {
    containerSelector: string;
    itemSelector: string;
    itemFields: Record<string, string>;
    loadMoreButton?: string;
    paginationSelector?: string;
    searchSelector?: string;
    filterSelector?: string;
    sortSelector?: string;
    emptyStateSelector?: string;
}

/**
 * Reusable list/grid template for handling collections of items
 */
export class ListTemplate extends BaseTemplate {
    protected listConfig: ListTemplateConfig;

    constructor(page: Page, listConfig: ListTemplateConfig) {
        super(page, listConfig);
        this.listConfig = listConfig;
    }

    /**
     * Get all items in the list
     */
    async getItems(): Promise<Locator[]> {
        const container = this.page.locator(this.listConfig.containerSelector);
        await this.waitForElement(container);

        const items = await container.locator(this.listConfig.itemSelector).all();
        console.log(`📋 Found ${items.length} items in ${this.listConfig.templateName}`);

        return items;
    }

    /**
     * Get item count
     */
    async getItemCount(): Promise<number> {
        const items = await this.getItems();
        return items.length;
    }

    /**
     * Get item by index
     */
    async getItemByIndex(index: number): Promise<Locator> {
        const items = await this.getItems();
        if (index >= items.length) {
            throw new Error(`Item index ${index} out of range. Only ${items.length} items available.`);
        }
        return items[index];
    }

    /**
     * Find item by field value
     */
    async findItemByField(fieldName: string, value: string): Promise<Locator | null> {
        const fieldSelector = this.listConfig.itemFields[fieldName];
        if (!fieldSelector) {
            throw new Error(`Field '${fieldName}' not configured in template`);
        }

        const items = await this.getItems();
        for (const item of items) {
            const fieldElement = item.locator(fieldSelector);
            const fieldText = await fieldElement.textContent();
            if (fieldText?.trim() === value.trim()) {
                console.log(`🎯 Found item with ${fieldName}: ${value}`);
                return item;
            }
        }

        console.log(`❌ Item with ${fieldName}: ${value} not found`);
        return null;
    }

    /**
     * Get all values for a specific field across all items
     */
    async getFieldValues(fieldName: string): Promise<string[]> {
        const fieldSelector = this.listConfig.itemFields[fieldName];
        if (!fieldSelector) {
            throw new Error(`Field '${fieldName}' not configured in template`);
        }

        const items = await this.getItems();
        const values: string[] = [];

        for (const item of items) {
            const fieldElement = item.locator(fieldSelector);
            const value = await fieldElement.textContent();
            if (value) {
                values.push(value.trim());
            }
        }

        console.log(`📊 Retrieved ${values.length} values for field '${fieldName}'`);
        return values;
    }

    /**
     * Click item by index
     */
    async clickItemByIndex(index: number): Promise<void> {
        const item = await this.getItemByIndex(index);
        await this.takeTemplateScreenshot(`before-click-item-${index}`);
        await item.click();
        await this.takeTemplateScreenshot(`after-click-item-${index}`);
        console.log(`👆 Clicked item at index ${index}`);
    }

    /**
     * Click item by field value
     */
    async clickItemByField(fieldName: string, value: string): Promise<void> {
        const item = await this.findItemByField(fieldName, value);
        if (!item) {
            throw new Error(`Cannot click item - not found with ${fieldName}: ${value}`);
        }

        await this.takeTemplateScreenshot(`before-click-item-${fieldName}-${value}`);
        await item.click();
        await this.takeTemplateScreenshot(`after-click-item-${fieldName}-${value}`);
        console.log(`👆 Clicked item with ${fieldName}: ${value}`);
    }

    /**
     * Search items (if search functionality is available)
     */
    async searchItems(searchTerm: string): Promise<void> {
        if (!this.listConfig.searchSelector) {
            throw new Error('Search functionality not configured for this template');
        }

        const searchInput = this.page.locator(this.listConfig.searchSelector);
        await this.waitForElement(searchInput);

        await this.takeTemplateScreenshot('before-search');
        await searchInput.clear();
        await searchInput.fill(searchTerm);
        await searchInput.press('Enter');

        // Wait for search results to load
        await this.page.waitForTimeout(2000);
        await this.takeTemplateScreenshot('after-search');

        console.log(`🔍 Searched for: ${searchTerm}`);
    }

    /**
     * Sort items (if sort functionality is available)
     */
    async sortItems(sortOption: string): Promise<void> {
        if (!this.listConfig.sortSelector) {
            throw new Error('Sort functionality not configured for this template');
        }

        const sortSelect = this.page.locator(this.listConfig.sortSelector);
        await this.waitForElement(sortSelect);

        await this.takeTemplateScreenshot('before-sort');
        await sortSelect.selectOption(sortOption);

        // Wait for sorting to complete
        await this.page.waitForTimeout(2000);
        await this.takeTemplateScreenshot('after-sort');

        console.log(`📊 Sorted by: ${sortOption}`);
    }

    /**
     * Load more items (if pagination/load more is available)
     */
    async loadMoreItems(): Promise<void> {
        if (!this.listConfig.loadMoreButton) {
            throw new Error('Load more functionality not configured for this template');
        }

        const loadMoreButton = this.page.locator(this.listConfig.loadMoreButton);
        const isVisible = await loadMoreButton.isVisible();

        if (!isVisible) {
            console.log('📄 No more items to load');
            return;
        }

        const itemCountBefore = await this.getItemCount();
        await this.takeTemplateScreenshot('before-load-more');
        await loadMoreButton.click();

        // Wait for new items to load
        await this.page.waitForTimeout(3000);
        const itemCountAfter = await this.getItemCount();

        await this.takeTemplateScreenshot('after-load-more');
        console.log(`📄 Loaded more items: ${itemCountBefore} → ${itemCountAfter}`);
    }

    /**
     * Verify empty state
     */
    async verifyEmptyState(): Promise<void> {
        if (!this.listConfig.emptyStateSelector) {
            const itemCount = await this.getItemCount();
            expect(itemCount).toBe(0);
        } else {
            const emptyState = this.page.locator(this.listConfig.emptyStateSelector);
            await expect(emptyState).toBeVisible();
        }

        await this.takeTemplateScreenshot('empty-state');
        console.log('✅ Empty state verified');
    }

    /**
     * Verify items are loaded
     */
    async verifyItemsLoaded(minCount: number = 1): Promise<void> {
        const itemCount = await this.getItemCount();
        expect(itemCount).toBeGreaterThanOrEqual(minCount);

        await this.takeTemplateScreenshot('items-loaded');
        console.log(`✅ Items loaded: ${itemCount} (minimum expected: ${minCount})`);
    }
}

// Example: Products List Template Configuration
export const productsListTemplate: ListTemplateConfig = {
    templateName: 'products-list',
    selectors: {
        container: '.features_items, .products-list, .product-grid',
        loadMoreButton: '.load-more, .pagination .next',
        searchInput: '#search_product, .search-box input',
        sortSelect: '.sort-dropdown, select[name="sort"]'
    },
    containerSelector: '.features_items, .products-list',
    itemSelector: '.productinfo, .product-item, .col-sm-4',
    itemFields: {
        name: 'p, .product-name, h2',
        price: '.price, .product-price',
        image: 'img',
        addToCartButton: '.add-to-cart, .btn-cart',
        viewProductButton: '.view-product, .btn-view'
    },
    searchSelector: '#search_product, .search-box input',
    sortSelector: '.sort-dropdown, select[name="sort"]',
    loadMoreButton: '.load-more, .pagination .next',
    emptyStateSelector: '.no-products, .empty-state'
};
