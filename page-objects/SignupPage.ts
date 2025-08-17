import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class SignupPage extends BasePage {
    // Signup form elements
    readonly signupSection: Locator;
    readonly signupNameInput: Locator;
    readonly signupEmailInput: Locator;
    readonly signupButton: Locator;
    readonly signupFormTitle: Locator;

    // Login form elements
    readonly loginSection: Locator;
    readonly loginEmailInput: Locator;
    readonly loginPasswordInput: Locator;
    readonly loginButton: Locator;
    readonly loginFormTitle: Locator;

    // Account information form elements (after signup)
    readonly accountInfoSection: Locator;
    readonly titleRadioMr: Locator;
    readonly titleRadioMrs: Locator;
    readonly accountNameInput: Locator;
    readonly accountEmailInput: Locator;
    readonly accountPasswordInput: Locator;
    readonly dayDropdown: Locator;
    readonly monthDropdown: Locator;
    readonly yearDropdown: Locator;
    readonly newsletterCheckbox: Locator;
    readonly specialOffersCheckbox: Locator;

    // Address information elements
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly companyInput: Locator;
    readonly addressInput: Locator;
    readonly address2Input: Locator;
    readonly countryDropdown: Locator;
    readonly stateInput: Locator;
    readonly cityInput: Locator;
    readonly zipcodeInput: Locator;
    readonly mobileNumberInput: Locator;
    readonly createAccountButton: Locator;

    // Success/Error messages
    readonly successMessage: Locator;
    readonly errorMessage: Locator;
    readonly accountCreatedMessage: Locator;
    readonly continueButton: Locator;
    readonly loginErrorMessage: Locator;
    readonly signupErrorMessage: Locator;

    constructor(page: Page) {
        super(page);

        // Signup form
        this.signupSection = page.locator('.signup-form');
        this.signupFormTitle = page.locator('h2:has-text("New User Signup!")');
        this.signupNameInput = page.locator('input[data-qa="signup-name"]');
        this.signupEmailInput = page.locator('input[data-qa="signup-email"]');
        this.signupButton = page.locator('button[data-qa="signup-button"]');

        // Login form
        this.loginSection = page.locator('.login-form');
        this.loginFormTitle = page.locator('h2:has-text("Login to your account")');
        this.loginEmailInput = page.locator('input[data-qa="login-email"]');
        this.loginPasswordInput = page.locator('input[data-qa="login-password"]');
        this.loginButton = page.locator('button[data-qa="login-button"]');

        // Account information form
        this.accountInfoSection = page.locator('.login-form');
        this.titleRadioMr = page.locator('input[id="id_gender1"]');
        this.titleRadioMrs = page.locator('input[id="id_gender2"]');
        this.accountNameInput = page.locator('input[data-qa="name"]');
        this.accountEmailInput = page.locator('input[data-qa="email"]');
        this.accountPasswordInput = page.locator('input[data-qa="password"]');
        this.dayDropdown = page.locator('select[data-qa="days"]');
        this.monthDropdown = page.locator('select[data-qa="months"]');
        this.yearDropdown = page.locator('select[data-qa="years"]');
        this.newsletterCheckbox = page.locator('input[id="newsletter"]');
        this.specialOffersCheckbox = page.locator('input[id="optin"]');

        // Address information
        this.firstNameInput = page.locator('input[data-qa="first_name"]');
        this.lastNameInput = page.locator('input[data-qa="last_name"]');
        this.companyInput = page.locator('input[data-qa="company"]');
        this.addressInput = page.locator('input[data-qa="address"]');
        this.address2Input = page.locator('input[data-qa="address2"]');
        this.countryDropdown = page.locator('select[data-qa="country"]');
        this.stateInput = page.locator('input[data-qa="state"]');
        this.cityInput = page.locator('input[data-qa="city"]');
        this.zipcodeInput = page.locator('input[data-qa="zipcode"]');
        this.mobileNumberInput = page.locator('input[data-qa="mobile_number"]');
        this.createAccountButton = page.locator('button[data-qa="create-account"]');

        // Messages and confirmations
        this.successMessage = page.locator('.alert-success, .text-success');
        this.errorMessage = page.locator('.alert-danger, .text-danger, p:has-text("Email Address already exist!")');
        this.loginErrorMessage = page.locator('.alert-danger, .text-danger, p:has-text("Your email or password is incorrect!")');
        this.signupErrorMessage = page.locator('.alert-danger, .text-danger, p:has-text("Email Address already exist!")');
        this.accountCreatedMessage = page.locator('h2[data-qa="account-created"]');
        this.continueButton = page.locator('a[data-qa="continue-button"]');
    }

    async navigateToSignupPage(): Promise<void> {
        await this.page.goto('/login');
        try {
            await this.page.waitForLoadState('domcontentloaded', { timeout: 15000 });
        } catch (error) {
            console.log('Page load timeout - continuing with loaded DOM');
        }

        // Wait for main elements to be visible as a backup
        await this.signupSection.waitFor({ state: 'visible', timeout: 10000 });
    }

    async verifySignupPageIsVisible(): Promise<void> {
        await expect(this.signupFormTitle).toBeVisible();
        await expect(this.loginFormTitle).toBeVisible();
        await expect(this.signupNameInput).toBeVisible();
        await expect(this.signupEmailInput).toBeVisible();
        await expect(this.signupButton).toBeVisible();
        await expect(this.loginEmailInput).toBeVisible();
        await expect(this.loginPasswordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }

    async fillSignupForm(name: string, email: string): Promise<void> {
        await this.signupNameInput.fill(name);
        await this.signupEmailInput.fill(email);
    }

    async clickSignupButton(): Promise<void> {
        await this.signupButton.click();
    }

    async performSignup(name: string, email: string): Promise<void> {
        await this.fillSignupForm(name, email);
        await this.clickSignupButton();
    }

    async fillLoginForm(email: string, password: string): Promise<void> {
        await this.loginEmailInput.fill(email);
        await this.loginPasswordInput.fill(password);
    }

    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async performLogin(email: string, password: string): Promise<void> {
        await this.fillLoginForm(email, password);
        await this.clickLoginButton();
    }

    async fillAccountInformation(accountData: {
        title?: 'Mr' | 'Mrs';
        name?: string;
        email?: string;
        password: string;
        day?: string;
        month?: string;
        year?: string;
        newsletter?: boolean;
        specialOffers?: boolean;
    }): Promise<void> {
        // Select title
        if (accountData.title === 'Mr') {
            await this.titleRadioMr.check();
        } else if (accountData.title === 'Mrs') {
            await this.titleRadioMrs.check();
        }

        // Fill basic account information
        if (accountData.name) {
            await this.accountNameInput.fill(accountData.name);
        }

        await this.accountPasswordInput.fill(accountData.password);

        // Select date of birth
        if (accountData.day) {
            await this.dayDropdown.selectOption(accountData.day);
        }
        if (accountData.month) {
            await this.monthDropdown.selectOption(accountData.month);
        }
        if (accountData.year) {
            await this.yearDropdown.selectOption(accountData.year);
        }

        // Handle checkboxes
        if (accountData.newsletter) {
            await this.newsletterCheckbox.check();
        }
        if (accountData.specialOffers) {
            await this.specialOffersCheckbox.check();
        }
    }

    async fillAddressInformation(addressData: {
        firstName: string;
        lastName: string;
        company?: string;
        address: string;
        address2?: string;
        country?: string;
        state: string;
        city: string;
        zipcode: string;
        mobileNumber: string;
    }): Promise<void> {
        await this.firstNameInput.fill(addressData.firstName);
        await this.lastNameInput.fill(addressData.lastName);

        if (addressData.company) {
            await this.companyInput.fill(addressData.company);
        }

        await this.addressInput.fill(addressData.address);

        if (addressData.address2) {
            await this.address2Input.fill(addressData.address2);
        }

        if (addressData.country) {
            await this.countryDropdown.selectOption(addressData.country);
        }

        await this.stateInput.fill(addressData.state);
        await this.cityInput.fill(addressData.city);
        await this.zipcodeInput.fill(addressData.zipcode);
        await this.mobileNumberInput.fill(addressData.mobileNumber);
    }

    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }

    async verifyAccountCreated(): Promise<void> {
        await expect(this.accountCreatedMessage).toBeVisible();
    }

    async clickContinueAfterAccountCreation(): Promise<void> {
        await this.continueButton.click();
    }

    async verifyLoginError(): Promise<void> {
        try {
            await expect(this.loginErrorMessage).toBeVisible({ timeout: 10000 });
        } catch (error) {
            // Try alternative error message selectors
            await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
        }
    }

    async verifySignupError(): Promise<void> {
        try {
            await expect(this.signupErrorMessage).toBeVisible({ timeout: 10000 });
        } catch (error) {
            // Try alternative error message selectors
            await expect(this.errorMessage).toBeVisible({ timeout: 5000 });
        }
    }

    async getErrorMessage(): Promise<string> {
        try {
            const errorText = await this.errorMessage.first().textContent({ timeout: 5000 });
            return errorText || '';
        } catch (error) {
            return '';
        }
    }

    async verifyEmailAlreadyExistsError(): Promise<void> {
        try {
            // Wait for the page to load after signup attempt
            await this.page.waitForLoadState('domcontentloaded', { timeout: 10000 });

            // Try to find specific error message
            await expect(this.signupErrorMessage).toBeVisible({ timeout: 10000 });
        } catch (error) {
            // Try to find any error message and check its content
            const errorText = await this.getErrorMessage();
            if (errorText.includes('Email Address already exist') || errorText.includes('already exist')) {
                console.log(`Found error message: ${errorText}`);
            } else {
                throw new Error(`Expected email already exists error, but got: ${errorText}`);
            }
        }
    }

    async verifyRequiredFieldsValidation(): Promise<void> {
        // Check if form validation messages appear for required fields
        await expect(this.signupNameInput).toHaveAttribute('required');
        await expect(this.signupEmailInput).toHaveAttribute('required');
    }

    async completeSignupFlow(userData: {
        name: string;
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        company?: string;
        address: string;
        state: string;
        city: string;
        zipcode: string;
        mobileNumber: string;
        title?: 'Mr' | 'Mrs';
        day?: string;
        month?: string;
        year?: string;
        country?: string;
    }): Promise<void> {
        // Step 1: Initial signup
        await this.performSignup(userData.name, userData.email);

        // Step 2: Fill account information
        await this.fillAccountInformation({
            title: userData.title,
            password: userData.password,
            day: userData.day,
            month: userData.month,
            year: userData.year,
            newsletter: true,
            specialOffers: true
        });

        // Step 3: Fill address information
        await this.fillAddressInformation({
            firstName: userData.firstName,
            lastName: userData.lastName,
            company: userData.company,
            address: userData.address,
            state: userData.state,
            city: userData.city,
            zipcode: userData.zipcode,
            mobileNumber: userData.mobileNumber,
            country: userData.country || 'United States'
        });

        // Step 4: Create account
        await this.clickCreateAccountButton();
    }
}
