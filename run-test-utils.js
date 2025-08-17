const { execSync } = require('child_process');

// Compile and run the test
try {
    console.log('Testing TestUtils directory creation...');

    // Use tsc to compile and run
    execSync('npx tsc test-utils-debug.ts --outDir temp --target es2017 --moduleResolution node --esModuleInterop', { stdio: 'inherit' });
    execSync('node temp/test-utils-debug.js', { stdio: 'inherit' });

    console.log('✅ TestUtils test completed successfully!');
} catch (error) {
    console.error('❌ Error running TestUtils test:', error.message);
}
