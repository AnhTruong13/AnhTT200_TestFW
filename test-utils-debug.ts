import { TestUtils } from './utils/TestUtils';

// Simple test to verify TestUtils functionality
console.log('Testing TestUtils directory creation...');

try {
    // Test getting test run directory
    const testRunDir = TestUtils.getTestRunDirectory();
    console.log('✅ Test run directory created:', testRunDir);

    // Test getting screenshots directory
    const screenshotsDir = TestUtils.getScreenshotsDirectory();
    console.log('✅ Screenshots directory:', screenshotsDir);

    // Test getting videos directory
    const videosDir = TestUtils.getVideosDirectory();
    console.log('✅ Videos directory:', videosDir);

    console.log('🎉 All directory methods working correctly!');
} catch (error) {
    console.error('❌ Error testing TestUtils:', error);
}
