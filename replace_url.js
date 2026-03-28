const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend');
const oldString = 'http://localhost:5000';
const newString = 'https://herathonbackend.onrender.com';

function replaceInDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
            replaceInDirectory(filePath);
        } else if (filePath.endsWith('.html') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(oldString)) {
                content = content.replaceAll(oldString, newString);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated: ${filePath}`);
            }
        }
    }
}

replaceInDirectory(directoryPath);
console.log("Done updating frontend API URLs!");