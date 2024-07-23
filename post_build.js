const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, 'assets');
const destDir = path.join(__dirname, 'dist', 'assets');
const htmlFilePath = path.join(__dirname, 'dist', 'index.html');

// Ensure destination directory exists
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Function to copy files from source to destination
const copyAssets = (source, dest) => {
    fs.readdir(source, (err, files) => {
        if (err) {
            console.error(`Error reading source directory: ${err}`);
            return;
        }

        files.forEach(file => {
            const sourceFile = path.join(source, file);
            const destFile = path.join(dest, file);

            fs.copyFile(sourceFile, destFile, (err) => {
                if (err) {
                    console.error(`Error copying file ${file}: ${err}`);
                } else {
                    console.log(`Copied ${file} to ${destFile}`);
                }
            });
        });
    });
};

// Function to update import paths
const fixHtml = (filePath) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err}`);
            return;
        }

        // Replace paths
        const updatedData = data
            .replace(/\/assets\//g, 'assets/');

        // Write the updated content back to the file
        fs.writeFile(filePath, updatedData, 'utf8', (err) => {
            if (err) {
                console.error(`failed to fix index.html imports: ${err}`);
            } else {
                console.log('index.html imports fixed successfully.');
            }
        });
    });
};

copyAssets(sourceDir, destDir);
fixHtml(htmlFilePath);
