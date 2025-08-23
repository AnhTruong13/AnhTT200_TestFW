# GitHub Repository Configuration Guide

## Branch Protection Setup

To automatically prevent merging when tests fail, you need to configure branch protection rules in your GitHub repository.

### Step 1: Configure Branch Protection Rules

1. Go to your repository on GitHub: https://github.com/AnhTruong13/AnhTT200_TestFW
2. Click on **Settings** tab
3. Click on **Branches** in the left sidebar
4. Click **Add rule** or **Add branch protection rule**

### Step 2: Branch Protection Rule Configuration

Configure the following settings:

#### Branch name pattern:
```
main
```

#### Protection Settings (Check these boxes):

✅ **Require a pull request before merging**
- ✅ Require approvals: 1
- ✅ Dismiss stale PR approvals when new commits are pushed
- ✅ Require review from CODEOWNERS (optional)

✅ **Require status checks to pass before merging**
- ✅ Require branches to be up to date before merging
- **Status checks to require:**
  - `Run Playwright Tests (18.x)` 
  - `Run Playwright Tests (20.x)`
  - `Full Test Suite`
  - `Security & Quality Checks`

✅ **Require conversation resolution before merging**

✅ **Require signed commits** (optional, for additional security)

✅ **Require linear history** (optional, keeps history clean)

✅ **Include administrators** (applies rules to repository admins too)

✅ **Restrict pushes that create files** (optional)

#### Allow force pushes:
❌ **Never** (recommended for production)

#### Allow deletions:
❌ **Disabled** (recommended for protection)

### Step 3: Save Protection Rules

Click **Create** to save the branch protection rules.

## How It Works

### Automatic Test Execution:
1. **On Pull Request Creation/Update**: 
   - Triggers the GitHub Actions workflow
   - Runs all test suites (Homepage, Signup, Login, Templates, Integration)
   - Tests on multiple Node.js versions (18.x, 20.x)

2. **Test Results**:
   - ✅ **All tests pass**: PR can be merged
   - ❌ **Any test fails**: PR is blocked from merging
   - 📊 **Test reports**: Uploaded as artifacts for debugging

3. **Status Checks**:
   - GitHub automatically shows status checks on the PR
   - Merge button is disabled until all required checks pass
   - Clear feedback on which tests passed/failed

### Workflow Features:

#### Multi-Environment Testing:
- Tests on Node.js 18.x and 20.x for compatibility
- Cross-browser testing (Chromium, Firefox, WebKit)
- Ubuntu Linux environment (most common CI environment)

#### Evidence Collection:
- Screenshots on test failures
- Videos for failed test debugging
- Playwright HTML reports
- Allure reports for comprehensive analysis

#### Performance Optimized:
- Minimal screenshots and videos in CI (SCREENSHOTS=off, VIDEO_MODE=retain-on-failure)
- Concurrent test execution where possible
- Artifact uploads only on failures to save storage

#### Security & Quality:
- npm audit checks for security vulnerabilities
- TypeScript compilation checks
- Optional ESLint checks (if configured)

## Test Commands Used in CI:

```bash
# Individual test suites
npm run test:homepage      # Homepage tests (11 tests)
npm run test:signup        # Signup tests (10 tests) 
npm run test:login         # Login tests (15 tests)
npm run test:templates     # UI Template tests (30 tests)
npm run test:integration   # Integration tests (4 tests)

# Full test suite with evidence
npm test                   # All 70 tests with full evidence collection
```

## Manual Repository Setup Commands

If you prefer to set up branch protection via GitHub CLI:

```bash
# Install GitHub CLI if not already installed
# https://cli.github.com/

# Login to GitHub
gh auth login

# Enable branch protection (run this from your repository directory)
gh api repos/AnhTruong13/AnhTT200_TestFW/branches/main/protection \
  --method PUT \
  --field required_status_checks='{"strict":true,"contexts":["Run Playwright Tests (18.x)","Run Playwright Tests (20.x)","Full Test Suite","Security & Quality Checks"]}' \
  --field enforce_admins=true \
  --field required_pull_request_reviews='{"required_approving_review_count":1,"dismiss_stale_reviews":true}' \
  --field restrictions=null
```

## Troubleshooting

### Common Issues:

1. **Tests fail in CI but pass locally:**
   - Different environment (Linux vs Windows/Mac)
   - Use `npm run test:evidence:minimal` locally to simulate CI conditions
   - Check timezone/locale differences

2. **Timeouts in CI:**
   - CI environments can be slower than local development
   - Tests include appropriate timeouts for CI environments
   - Use `CI=true` environment variable for CI-specific configurations

3. **Branch protection not working:**
   - Ensure status check names match exactly
   - Wait for first workflow run to complete to see available status checks
   - Admin users might bypass protection rules (check "Include administrators")

### Status Check Names:
After the first workflow runs, you'll see these status checks available:
- `Run Playwright Tests (18.x)`
- `Run Playwright Tests (20.x)` 
- `Full Test Suite`
- `Security & Quality Checks`

Select all of these as required status checks in the branch protection settings.

## Benefits

✅ **Automatic Quality Gate**: No failing tests can reach main branch
✅ **Multi-Environment Validation**: Tests on multiple Node.js versions
✅ **Comprehensive Coverage**: All 70 tests must pass
✅ **Evidence Collection**: Debug information available for failures
✅ **Security Checks**: Vulnerability scanning and code quality validation
✅ **Team Collaboration**: PR reviews required before merge
✅ **History Protection**: Clean, linear commit history maintained
