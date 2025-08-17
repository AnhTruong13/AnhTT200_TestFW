import { test as base, expect } from '@playwright/test';
import { HomePage } from '../page-objects/HomePage';
import { ProductsPage } from '../page-objects/ProductsPage';
import { SignupPage } from '../page-objects/SignupPage';

// Define the fixtures interface
type Fixtures = {
    homePage: HomePage;
    productsPage: ProductsPage;
    signupPage: SignupPage;
};

// Create custom test with fixtures
export const test = base.extend<Fixtures>({
    // HomePage fixture
    homePage: async ({ page }, use) => {
        const homePage = new HomePage(page);
        await use(homePage);
    },

    // ProductsPage fixture
    productsPage: async ({ page }, use) => {
        const productsPage = new ProductsPage(page);
        await use(productsPage);
    },

    // SignupPage fixture
    signupPage: async ({ page }, use) => {
        const signupPage = new SignupPage(page);
        await use(signupPage);
    }
});

// Export expect for convenience
export { expect } from '@playwright/test';
