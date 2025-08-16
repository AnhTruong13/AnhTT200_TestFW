# Playwright + TypeScript E2E Testing Framework

This project uses [Playwright](https://playwright.dev/) and TypeScript for end-to-end testing of [Automation Exercise](https://www.automationexercise.com/).

## Getting Started

### Install dependencies
```
npm install
```

### Run all tests
```
npx playwright test
```

### Run tests in UI mode
```
npx playwright test --ui
```

### Project Structure
- `tests/` - Contains E2E test files
- `playwright.config.ts` - Playwright configuration
- `.github/workflows/playwright.yml` - GitHub Actions CI workflow

## Sample Test
A sample test is provided in `tests/example.spec.ts`. You can create new test files in the `tests/` folder.

## Resources
- [Playwright Docs](https://playwright.dev/docs/intro)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)

---

Replace sample tests with your own scenarios for https://www.automationexercise.com/.
