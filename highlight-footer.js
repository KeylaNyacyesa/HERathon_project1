const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'frontend');

const newFooter = `
<footer style="text-align: center; padding: 2.5rem 1rem; margin-top: 3rem; background: var(--bg-dark, #0f172a); border-top: 1px solid var(--border-subtle, #374151); margin-top: auto;">
  <div style="margin-bottom: 1.5rem; display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
    <a href="qa.html" style="color: #ffffff; background: var(--bg-card, #1e293b); border: 1px solid var(--primary-light, #818cf8); padding: 0.5rem 1.25rem; border-radius: 9999px; text-decoration: none; font-size: 0.95rem; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">💡 Help</a>
    <a href="qa.html" style="color: #ffffff; background: var(--bg-card, #1e293b); border: 1px solid var(--primary-light, #818cf8); padding: 0.5rem 1.25rem; border-radius: 9999px; text-decoration: none; font-size: 0.95rem; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">❓ Frequently Asked Questions</a>
    <a href="contact.html" style="color: #ffffff; background: linear-gradient(135deg, var(--primary, #6366f1), var(--accent, #ec4899)); padding: 0.5rem 1.25rem; border-radius: 9999px; text-decoration: none; font-size: 0.95rem; font-weight: 600; box-shadow: 0 4px 6px rgba(0,0,0,0.3); border: none;">✉️ Contact Us</a>
  </div>
  <div style="color: var(--text-faint, #6b7280); font-size: 0.85rem;">
    &copy; 2026 HERathon. All rights reserved. Built with passion and purpose.
  </div>
</footer>
`;

function processDir(dir) {
    if(!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));
    files.forEach(file => {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf8');
        
        const footerRegex = /<footer[\s\S]*?<\/footer>/i;
        
        if (footerRegex.test(content)) {
            content = content.replace(footerRegex, newFooter.trim());
        } else {
            content = content.replace(/<\/body>/i, `\n${newFooter.trim()}\n</body>`);
        }

        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated footer in ${filePath}`);
    });
}

processDir(directoryPath);
processDir(path.join(directoryPath, 'fixed'));
