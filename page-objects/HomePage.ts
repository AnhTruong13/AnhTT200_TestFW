import { Page, Locator, expect } from '@playwright/test';

export class HomePage {
    readonly page: Page;
    readonly logo: Locator;
    readonly navigationMenu: Locator;
    readonly homeLink: Locator;
    readonly productsLink: Locator;
    readonly cartLink: Locator;
    readonly signupLoginLink: Locator;
    readonly contactUsLink: Locator;
    readonly testCasesLink: Locator;
    readonly apiTestingLink: Locator;
    readonly videoTutorialsLink: Locator;
    readonly heroSection: Locator;
    readonly categoriesSection: Locator;
    readonly brandsSection: Locator;
    readonly featuresSection: Locator;
    readonly subscriptionSection: Locator;
    readonly footerSection: Locator;
    readonly subscriptionInput: Locator;
    readonly subscriptionButton: Locator;
    readonly scrollUpButton: Locator;
    readonly carouselSection: Locator;
    readonly carouselPrevButton: Locator;
    readonly carouselNextButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Header elements
        this.logo = page.locator('img[alt="Website for automation practice"]');
        this.navigationMenu = page.locator('.navbar-nav');
        this.homeLink = page.locator('a[href="/"]').first();
        this.productsLink = page.locator('a[href="/products"]');
        this.cartLink = page.locator('a[href="/view_cart"]');
        this.signupLoginLink = page.locator('a[href="/login"]');
        this.contactUsLink = page.locator('a[href="/contact_us"]');
        this.testCasesLink = page.locator('a[href="/test_cases"]');
        this.apiTestingLink = page.locator('a[href="/api_list"]');
        this.videoTutorialsLink = page.locator('a[href="https://www.youtube.com/c/AutomationExercise"]');

        // Main content sections
        this.heroSection = page.locator('.carousel-inner');
        this.categoriesSection = page.locator('.left-sidebar');
        this.brandsSection = page.locator('.brands_products');
        this.featuresSection = page.locator('.features_items');
        this.carouselSection = page.locator('#slider-carousel');
        this.carouselPrevButton = page.locator('.carousel-control-prev');
        this.carouselNextButton = page.locator('.carousel-control-next');

        // Footer elements
        this.footerSection = page.locator('footer');
        this.subscriptionSection = page.locator('.single-widget');
        this.subscriptionInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.scrollUpButton = page.locator('#scrollUp');
    }

    async navigateToHomePage(): Promise<void> {
        await this.page.goto('https://www.automationexercise.com/');
        await this.page.waitForLoadState('networkidle');
    }

    async verifyHomePageIsVisible(): Promise<void> {
        await expect(this.page).toHaveURL('https://www.automationexercise.com/');
        await expect(this.logo).toBeVisible();
        await expect(this.navigationMenu).toBeVisible();
    }

    async verifyNavigationMenuItems(): Promise<void> {
        await expect(this.homeLink).toBeVisible();
        await expect(this.productsLink).toBeVisible();
        await expect(this.cartLink).toBeVisible();
        await expect(this.signupLoginLink).toBeVisible();
        await expect(this.contactUsLink).toBeVisible();
        await expect(this.testCasesLink).toBeVisible();
        await expect(this.apiTestingLink).toBeVisible();
        await expect(this.videoTutorialsLink).toBeVisible();
    }

    async verifyMainSections(): Promise<void> {
        await expect(this.carouselSection).toBeVisible();
        await expect(this.categoriesSection).toBeVisible();
        await expect(this.featuresSection).toBeVisible();
    }

    async verifyFooterSection(): Promise<void> {
        await expect(this.footerSection).toBeVisible();
        await expect(this.subscriptionSection).toBeVisible();
        await expect(this.subscriptionInput).toBeVisible();
        await expect(this.subscriptionButton).toBeVisible();
    }

    async clickNavigationLink(linkName: string): Promise<void> {
        const linkMap: { [key: string]: Locator } = {
            'home': this.homeLink,
            'products': this.productsLink,
            'cart': this.cartLink,
            'signup': this.signupLoginLink,
            'contact': this.contactUsLink,
            'testcases': this.testCasesLink,
            'api': this.apiTestingLink,
            'videos': this.videoTutorialsLink
        };

        const link = linkMap[linkName.toLowerCase()];
        if (link) {
            await link.click();
        } else {
            throw new Error(`Navigation link "${linkName}" not found`);
        }
    }

    async subscribeToNewsletter(email: string): Promise<void> {
        await this.subscriptionInput.fill(email);
        await this.subscriptionButton.click();
    }

    async verifySubscriptionSuccess(): Promise<void> {
        await expect(this.page.locator('.alert-success')).toBeVisible();
    }

    async scrollToTop(): Promise<void> {
        await this.scrollUpButton.click();
    }

    async navigateCarousel(direction: 'next' | 'previous'): Promise<void> {
        if (direction === 'next') {
            await this.carouselNextButton.click();
        } else {
            await this.carouselPrevButton.click();
        }
    }

    async verifyCarouselIsWorking(): Promise<void> {
        const initialSlide = await this.carouselSection.locator('.active').first();
        await this.navigateCarousel('next');
        await this.page.waitForTimeout(1000); // Wait for carousel transition

        // Verify carousel moved (slide should change)
        const currentSlide = await this.carouselSection.locator('.active').first();
        expect(initialSlide).not.toBe(currentSlide);
    }

    async getPageTitle(): Promise<string> {
        return await this.page.title();
    }

    async verifyPageTitle(expectedTitle: string): Promise<void> {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    async getCategoriesList(): Promise<string[]> {
        const categories = await this.categoriesSection.locator('.panel-title').allTextContents();
        return categories;
    }

    async getBrandsList(): Promise<string[]> {
        const brands = await this.brandsSection.locator('li a').allTextContents();
        return brands;
    }

    async verifyResponsiveness(): Promise<void> {
        // Test mobile viewport
        await this.page.setViewportSize({ width: 375, height: 667 });
        await expect(this.logo).toBeVisible();
        await expect(this.navigationMenu).toBeVisible();

        // Test tablet viewport
        await this.page.setViewportSize({ width: 768, height: 1024 });
        await expect(this.logo).toBeVisible();
        await expect(this.navigationMenu).toBeVisible();

        // Reset to desktop
        await this.page.setViewportSize({ width: 1920, height: 1080 });
    }

    async takeScreenshot(name: string): Promise<void> {
        await this.page.screenshot({
            path: `test-results/screenshots/${name}.png`,
            fullPage: true
        });
    }
}
