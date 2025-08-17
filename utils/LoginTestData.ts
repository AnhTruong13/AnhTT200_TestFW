export interface UserCredentials {
    email: string;
    password: string;
    name?: string;
}

export interface TestUser extends UserCredentials {
    name: string;
    expectedUserName?: string;
    isValid: boolean;
    description: string;
}

/**
 * Test data for login and signup scenarios
 */
export class LoginTestData {

    /**
     * Generate a unique email with timestamp
     */
    static generateUniqueEmail(prefix: string = 'test'): string {
        const timestamp = Date.now();
        return `${prefix}${timestamp}@example.com`;
    }

    /**
     * Generate a unique username with timestamp
     */
    static generateUniqueName(prefix: string = 'Test User'): string {
        const timestamp = Date.now();
        return `${prefix} ${timestamp}`;
    }

    /**
     * Valid test users for login scenarios
     */
    static readonly validUsers: TestUser[] = [
        {
            email: 'valid.user@example.com',
            password: 'ValidPassword123!',
            name: 'Valid User',
            expectedUserName: 'Valid User',
            isValid: true,
            description: 'Standard valid user with proper credentials'
        },
        {
            email: 'admin@example.com',
            password: 'AdminPass2024!',
            name: 'Admin User',
            expectedUserName: 'Admin User',
            isValid: true,
            description: 'Admin user with elevated privileges'
        }
    ];

    /**
     * Invalid test users for login failure scenarios
     */
    static readonly invalidUsers: TestUser[] = [
        {
            email: 'nonexistent@example.com',
            password: 'AnyPassword123!',
            name: 'Nonexistent User',
            isValid: false,
            description: 'User that does not exist in the system'
        },
        {
            email: 'valid.user@example.com',
            password: 'WrongPassword!',
            name: 'Valid User',
            isValid: false,
            description: 'Existing user with incorrect password'
        },
        {
            email: 'invalid.email',
            password: 'ValidPassword123!',
            name: 'Invalid Email',
            isValid: false,
            description: 'Invalid email format'
        },
        {
            email: '',
            password: 'ValidPassword123!',
            name: 'Empty Email',
            isValid: false,
            description: 'Empty email field'
        },
        {
            email: 'valid.user@example.com',
            password: '',
            name: 'Valid User',
            isValid: false,
            description: 'Empty password field'
        }
    ];

    /**
     * Dynamic users for signup scenarios (generated at runtime)
     */
    static generateSignupUser(): TestUser {
        return {
            email: this.generateUniqueEmail('signup'),
            password: 'NewUser123!',
            name: this.generateUniqueName('New User'),
            isValid: true,
            description: 'Dynamically generated signup user'
        };
    }

    /**
     * Edge case test data
     */
    static readonly edgeCases: TestUser[] = [
        {
            email: 'very.long.email.address.that.should.still.work@example.com',
            password: 'LongEmailTest123!',
            name: 'Long Email User',
            isValid: false,
            description: 'Very long email address'
        },
        {
            email: 'special.chars+test@example.com',
            password: 'SpecialChars123!',
            name: 'Special Chars User',
            isValid: false,
            description: 'Email with special characters'
        },
        {
            email: 'case.sensitive@EXAMPLE.COM',
            password: 'CaseTest123!',
            name: 'Case Test User',
            isValid: false,
            description: 'Mixed case email address'
        }
    ];

    /**
     * Get a valid user for successful login tests
     */
    static getValidUser(): TestUser {
        return this.validUsers[0];
    }

    /**
     * Get an invalid user for failure tests
     */
    static getInvalidUser(): TestUser {
        return this.invalidUsers[0];
    }

    /**
     * Get user with wrong password
     */
    static getUserWithWrongPassword(): TestUser {
        return this.invalidUsers[1];
    }

    /**
     * Get user with invalid email format
     */
    static getUserWithInvalidEmail(): TestUser {
        return this.invalidUsers[2];
    }

    /**
     * Get empty credentials for validation tests
     */
    static getEmptyCredentials(): TestUser {
        return this.invalidUsers[3];
    }

    /**
     * Get random invalid user
     */
    static getRandomInvalidUser(): TestUser {
        const randomIndex = Math.floor(Math.random() * this.invalidUsers.length);
        return this.invalidUsers[randomIndex];
    }

    /**
     * Get multiple users for data-driven tests
     */
    static getUsersForDataDrivenTest(count: number = 3): TestUser[] {
        const users: TestUser[] = [];

        // Add some valid users
        users.push(...this.validUsers.slice(0, Math.min(count / 2, this.validUsers.length)));

        // Add some invalid users
        const remainingCount = count - users.length;
        users.push(...this.invalidUsers.slice(0, Math.min(remainingCount, this.invalidUsers.length)));

        return users.slice(0, count);
    }

    /**
     * Generate test data for performance tests
     */
    static generatePerformanceTestUsers(count: number = 10): TestUser[] {
        const users: TestUser[] = [];

        for (let i = 0; i < count; i++) {
            users.push({
                email: this.generateUniqueEmail(`perf${i}`),
                password: `PerfTest${i}123!`,
                name: this.generateUniqueName(`Perf User ${i}`),
                isValid: false, // These users don't actually exist
                description: `Performance test user ${i + 1}`
            });
        }

        return users;
    }

    /**
     * Common password patterns for testing
     */
    static readonly commonPasswords = [
        '123456',
        'password',
        'password123',
        'admin',
        'qwerty',
        'letmein',
        'welcome',
        '123456789'
    ];

    /**
     * Strong password examples
     */
    static readonly strongPasswords = [
        'MyStrongP@ssw0rd2024!',
        'SecureLogin#123$',
        'C0mpl3x&P@ssw0rd!',
        'Ungu3ss@bl3P@ss2024!'
    ];

    /**
     * Get weak password for negative testing
     */
    static getWeakPassword(): string {
        const randomIndex = Math.floor(Math.random() * this.commonPasswords.length);
        return this.commonPasswords[randomIndex];
    }

    /**
     * Get strong password for positive testing
     */
    static getStrongPassword(): string {
        const randomIndex = Math.floor(Math.random() * this.strongPasswords.length);
        return this.strongPasswords[randomIndex];
    }
}
