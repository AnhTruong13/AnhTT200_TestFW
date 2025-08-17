import fs from 'fs';
import path from 'path';

/**
 * Global teardown function to clean up empty video directories
 * This runs after all tests have completed
 */
async function globalTeardown() {
    const videoDir = path.join(__dirname, '..', 'Evidence', 'video');

    try {
        if (!fs.existsSync(videoDir)) {
            console.log('📁 Video directory does not exist, nothing to clean up');
            return;
        }

        const entries = fs.readdirSync(videoDir, { withFileTypes: true });
        let cleanedCount = 0;

        for (const entry of entries) {
            if (entry.isDirectory()) {
                const dirPath = path.join(videoDir, entry.name);

                try {
                    const dirContents = fs.readdirSync(dirPath);

                    // If directory is empty, delete it
                    if (dirContents.length === 0) {
                        fs.rmdirSync(dirPath);
                        console.log(`🗑️  Cleaned up empty video directory: ${entry.name}`);
                        cleanedCount++;
                    }
                } catch (error) {
                    console.log(`⚠️  Could not process directory ${entry.name}: ${error}`);
                }
            }
        }

        if (cleanedCount > 0) {
            console.log(`✨ Cleanup complete: removed ${cleanedCount} empty video directories`);
        } else {
            console.log('📹 No empty video directories found - all videos retained or no tests failed');
        }

    } catch (error) {
        console.log(`⚠️  Error during video directory cleanup: ${error}`);
    }
}

export default globalTeardown;
