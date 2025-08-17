import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
    readonly productsTitle: Locator;
    readonly searchBox: Locator;
    readonly searchButton: Locator;
    readonly productsList: Locator;
    readonly brandsList: Locator;
    readonly categoriesList: Locator;
    readonly viewProductButtons: Locator;
    readonly addToCartButtons: Locator;
    readonly continueShoppingButton: Locator;
    readonly viewCartButton: Locator;

    constructor(page: Page) {
        super(page);

        // Products page specific elements
        this.productsTitle = page.locator('h2.title').filter({ hasText: 'All Products' });
        this.searchBox = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.productsList = page.locator('.features_items .productinfo');
        this.brandsList = page.locator('.brands_products ul li');
        this.categoriesList = page.locator('.left-sidebar .panel-group');
        this.viewProductButtons = page.locator('a[href*="/product_details/"]');
        this.addToCartButtons = page.locator('.add-to-cart');
        this.continueShoppingButton = page.locator('.btn-success').filter({ hasText: 'Continue Shopping' });
        this.viewCartButton = page.locator('a[href="/view_cart"]');
    }

    async navigateToProducts(): Promise<void> {
        await this.page.goto('https://www.automationexercise.com/products');
        await this.waitForPageLoad();
    }

    async verifyProductsPageLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/.*products.*/);
        await expect(this.productsTitle).toBeVisible();
    }

    async searchProduct(productName: string): Promise<void> {
        await this.searchBox.fill(productName);
        await this.searchButton.click();
        await this.waitForPageLoad();
    }

    async getProductsCount(): Promise<number> {
        return await this.productsList.count();
    }

    async clickViewProduct(index: number = 0): Promise<void> {
        await this.viewProductButtons.nth(index).click();
        await this.waitForPageLoad();
    }

    async addProductToCart(index: number = 0): Promise<void> {
        await this.addToCartButtons.nth(index).click();
        await this.waitForElement(this.continueShoppingButton);
    }

    async continueShopping(): Promise<void> {
        await this.continueShoppingButton.click();
    }

    async viewCart(): Promise<void> {
        await this.viewCartButton.click();
        await this.waitForPageLoad();
    }
}
