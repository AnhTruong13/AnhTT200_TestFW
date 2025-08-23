# GitHub Actions CI/CD Pipeline

This repository includes a comprehensive GitHub Actions workflow for automated testing and quality assurance.

## 🚀 Automated Workflows

### playwright-tests.yml
- **Triggers**: Pull requests and pushes to main branch
- **Tests**: All 70 tests across 5 test suites
- **Environments**: Node.js 18.x and 20.x on Ubuntu
- **Browsers**: Chromium, Firefox, WebKit cross-browser testing

## 📋 Test Execution Flow

1. **Individual Test Suites**:
   - Homepage Tests (11 tests)
   - Signup Tests (10 tests) 
   - Login Tests (15 tests)
   - UI Template Tests (30 tests)
   - Integration Tests (4 tests)

2. **Full Test Suite**: Complete 70-test run with evidence collection

3. **Quality Checks**: Security audit and TypeScript validation

## 🛡️ Branch Protection

See [BRANCH_PROTECTION_SETUP.md](BRANCH_PROTECTION_SETUP.md) for detailed configuration instructions.

**Key Protection Features**:
- ✅ All tests must pass before merge
- ✅ Pull request reviews required
- ✅ Branch must be up to date
- ❌ Direct pushes to main blocked

## 📊 Test Results

- **Artifacts**: Test reports, screenshots, videos uploaded on failures
- **Reports**: Playwright HTML and Allure reports generated
- **Comments**: Automatic PR comments with test results summary

## 🔧 Environment Variables

```yaml
CI: true                          # Enables CI mode
SCREENSHOTS: 'off'               # Minimal screenshots in CI
VIDEO_MODE: 'retain-on-failure'  # Videos only for failed tests
```

## 🏃‍♂️ Manual Workflow Trigger

You can manually trigger the workflow from the GitHub Actions tab for testing purposes.

---

*This CI/CD pipeline ensures code quality and prevents broken code from reaching the main branch.*
