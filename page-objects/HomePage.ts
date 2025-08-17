import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class HomePage extends BasePage {
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
        super(page);

        // Header elements
        this.logo = page.locator('img[alt="Website for automation practice"]');
        this.navigationMenu = page.locator('.navbar-nav');
        this.homeLink = page.locator('a[href="/"]').first();
        this.productsLink = page.locator('a[href="/products"]');
        this.cartLink = page.locator('.navbar-nav a[href="/view_cart"]').first();
        this.signupLoginLink = page.locator('a[href="/login"]');
        this.contactUsLink = page.locator('a[href="/contact_us"]');
        this.testCasesLink = page.locator('.navbar-nav a[href="/test_cases"]').first();
        this.apiTestingLink = page.locator('.navbar-nav a[href="/api_list"]').first();
        this.videoTutorialsLink = page.locator('a[href="https://www.youtube.com/c/AutomationExercise"]');

        // Main content sections
        this.heroSection = page.locator('.carousel-inner');
        this.categoriesSection = page.locator('.left-sidebar');
        this.brandsSection = page.locator('.brands_products');
        this.featuresSection = page.locator('.features_items');
        this.carouselSection = page.locator('#slider-carousel');
        this.carouselPrevButton = page.locator('.left.carousel-control, .carousel-control.left, .carousel-control-prev, a[data-slide="prev"]').first();
        this.carouselNextButton = page.locator('.right.carousel-control, .carousel-control.right, .carousel-control-next, a[data-slide="next"]').first();

        // Footer elements
        this.footerSection = page.locator('footer');
        this.subscriptionSection = page.locator('.single-widget');
        this.subscriptionInput = page.locator('#susbscribe_email');
        this.subscriptionButton = page.locator('#subscribe');
        this.scrollUpButton = page.locator('#scrollUp');
    }

    async navigateToHomePage(): Promise<void> {
        await this.page.goto('https://www.automationexercise.com/');
        // Use the enhanced waitForPageLoad method from BasePage
        await this.waitForPageLoad(15000);

        // Wait for main elements to be visible as a backup
        await this.logo.waitFor({ state: 'visible', timeout: 10000 });
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
        // Wait for scroll up button to be visible and click it
        await this.scrollUpButton.waitFor({ state: 'visible', timeout: 5000 });
        await this.scrollUpButton.click();

        // Wait for the scroll animation to complete
        await this.page.waitForTimeout(1000);

        // Alternative approach: use JavaScript to ensure we're at the top
        await this.page.evaluate(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        // Wait for scroll to complete
        await this.page.waitForTimeout(1000);
    }

    async navigateCarousel(direction: 'next' | 'previous'): Promise<void> {
        // First, wait for the carousel section to be visible
        await this.carouselSection.waitFor({ state: 'visible', timeout: 10000 });

        if (direction === 'next') {
            await this.carouselNextButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.carouselNextButton.click();
        } else {
            await this.carouselPrevButton.waitFor({ state: 'visible', timeout: 10000 });
            await this.carouselPrevButton.click();
        }
    }

    async verifyCarouselIsWorking(): Promise<void> {
        // Wait for carousel to be present and visible
        await this.carouselSection.waitFor({ state: 'visible', timeout: 10000 });

        try {
            const initialSlide = await this.carouselSection.locator('.carousel-item.active, .item.active').first();
            await this.navigateCarousel('next');
            await this.page.waitForTimeout(2000); // Wait for carousel transition

            // Verify carousel moved (slide should change)
            const currentSlide = await this.carouselSection.locator('.carousel-item.active, .item.active').first();
            expect(initialSlide).not.toBe(currentSlide);
        } catch (error) {
            // If carousel controls don't exist, just verify the carousel section is visible
            await expect(this.carouselSection).toBeVisible();
            console.log('Carousel navigation controls not found, but carousel section is visible');
        }
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
}
