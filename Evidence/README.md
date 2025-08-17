# Test Evidence Directory

This directory contains test artifacts generated during test execution, including videos, screenshots, and traces.

## Directory Structure

```
Evidence/
├── video/          # Test execution videos
├── screenshots/    # Test screenshots
├── traces/         # Playwright traces
└── README.md       # This file
```

## 📷 Screenshots

Screenshots are automatically captured during test failures and can be manually captured using TestUtils.

### Screenshot Features

- **Automatic Fallback**: If full-page screenshot fails due to size limits (>32,767px), automatically falls back to viewport screenshot
- **Custom Options**: Support for clipping, quality settings, and full-page vs viewport capture
- **Large Page Handling**: Special method for very long pages that splits them into sections
- **Allure Integration**: Screenshots are automatically attached to Allure reports

### Screenshot Size Limit Fix

If you encounter "Cannot take screenshot larger than 32767 pixels" error:

```typescript
// Method 1: Use TestUtils with automatic fallback
await TestUtils.takeScreenshot(page, 'test-name');

// Method 2: Use viewport-only screenshots
await TestUtils.takeCustomScreenshot(page, 'test-name', { 
    fullPage: false 
});

// Method 3: For very long pages, use sectioned screenshots
await TestUtils.takeLongPageScreenshots(page, 'long-page-test');
```

### Screenshot Configuration

The playwright.config.ts now uses viewport screenshots by default to avoid size limits and includes enhanced timeout configurations:

```typescript
// Screenshot configuration
screenshot: {
  mode: 'only-on-failure',
  fullPage: false // Prevents size limit errors
},

// Enhanced timeout configurations for complex web applications
timeout: 60000,           // 60 seconds per test (vs 30s default)
actionTimeout: 15000,     // 15 seconds per action
navigationTimeout: 30000, // 30 seconds for page loads
expect: { timeout: 10000 } // 10 seconds for assertions
```

## Video Recording

### Configuration
Video recording is configured in `playwright.config.ts` with the following settings:
- **Mode**: `retain-on-failure` - Videos are only saved when tests fail
- **Resolution**: 1280x720 (HD quality)
- **Output Directory**: `Evidence/video/`

### Video Recording Modes Available
You can change the video recording mode by modifying the `video.mode` setting in `playwright.config.ts`:

1. **`'off'`** - No video recording
2. **`'on'`** - Record video for all tests
3. **`'retain-on-failure'`** - Record video only when tests fail (current setting)
4. **`'on-first-retry'`** - Record video only on first retry

### Example Configuration
```typescript
use: {
  video: {
    mode: 'retain-on-failure',
    size: { width: 1280, height: 720 }
  }
}
```

### Changing Video Recording Mode

#### Record All Tests
```typescript
video: {
  mode: 'on',
  size: { width: 1920, height: 1080 }
}
```

#### Record Only Failed Tests (Default)
```typescript
video: {
  mode: 'retain-on-failure',
  size: { width: 1280, height: 720 }
}
```

#### Disable Video Recording
```typescript
video: 'off'
```

## Screenshots
- Screenshots are automatically taken and saved to `Evidence/screenshots/`
- Screenshots are attached to Allure reports
- Naming convention: `{testName}-{timestamp}.png`

## Traces
- Playwright traces are saved to `Evidence/traces/`
- Traces are generated on first retry by default
- Use `npx playwright show-trace [trace-file]` to view traces

## File Management
- All directories in `Evidence/` are included in `.gitignore`
- Files are automatically cleaned up between test runs
- Large video files are compressed automatically by Playwright

## Viewing Test Evidence

### Videos
- Videos are saved as WebM format
- Can be viewed in any modern browser or video player
- File naming includes test name, browser, and timestamp

### Screenshots
- Screenshots are saved as PNG format
- Full page screenshots are captured by default
- Accessible through Allure reports or directly from filesystem

### Traces
- Open traces with: `npx playwright show-trace Evidence/traces/[trace-file.zip]`
- Traces include DOM snapshots, network activity, and console logs
- Interactive debugging with timeline and network panels

## Best Practices
1. Use `retain-on-failure` for CI/CD to save storage space
2. Use `on` mode during test development and debugging
3. Regularly clean up old evidence files
4. Review videos to understand test failures
5. Use screenshots for documentation and bug reports
