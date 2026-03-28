const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend');

const newFooter = `
<footer style="text-align: center; padding: 2rem 1rem; margin-top: 3rem; background: var(--bg-dark, #0f172a); border-top: 1px solid var(--border-subtle, #374151); margin-top: auto;">
  <div style="margin-bottom: 1rem; display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
    <a href="qa.html" style="color: var(--primary-light, #818cf8); text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: color 0.2s;">Help</a>
    <a href="qa.html" style="color: var(--primary-light, #818cf8); text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: color 0.2s;">Frequently Asked Questions</a>
    <a href="contact.html" style="color: var(--primary-light, #818cf8); text-decoration: none; font-size: 0.95rem; font-weight: 500; transition: color 0.2s;">Contact Us</a>
  </div>
  <div style="color: var(--text-faint, #6b7280); font-size: 0.85rem;">
    &copy; 2026 HERathon. All rights reserved. Built with passion and purpose.
  </div>
</footer>
`;

const files = fs.readdirSync(directoryPath).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(directoryPath, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const footerRegex = /<footer[\s\S]*?<\/footer>/i;
    
    if (footerRegex.test(content)) {
        content = content.replace(footerRegex, newFooter.trim());
    } else {
        content = content.replace(/<\/body>/i, `\n${newFooter.trim()}\n</body>`);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated footer in ${file}`);
});
