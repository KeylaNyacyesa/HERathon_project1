const fs = require('fs');
const glob = fs.readdirSync('frontend').filter(f => f.endsWith('.html'));

const newFooter = `
<footer style="text-align: center; padding: 2rem 1rem; margin-top: 3rem; background: var(--bg-dark, #0f172a); border-top: 1px solid var(--border-subtle, #374151); margin-top: auto;">
  <div style="margin-bottom: 1rem; display: flex; justify-content: center; gap: 1.5rem; flex-wrap: wrap;">
    <a href="qa.html" style="color: var(--primary-light, #818cf8); text-decoration: none; font-size: 0.95rem; font-weight: 500;">Help</a>
    <a href="qa.html" style="color: var(--primary-light, #818cf8); text-decoration: none; font-size: 0.95rem; font-weight: 500;">Frequently Asked Questions</a>
    <a href="contact.html" style="color: var(--primary-light, #818cf8); text-decoration: none; font-size: 0.95rem; font-weight: 500;">Contact Us</a>
  </div>
  <div style="color: var(--text-faint, #6b7280); font-size: 0.85rem;">
    &copy; 2026 HERathon. All rights reserved. Built with passion and purpose.
  </div>
</footer>
</body>`;

glob.forEach(f => {
  let p = 'frontend/' + f;
  let c = fs.readFileSync(p, 'utf8');
  
  // Replace the previously injected old footer and the closing body tag
  const footerRegex = /<footer[^>]*>[\s\S]*?<\/footer>\s*<\/body>/i;
  
  if (footerRegex.test(c)) {
     c = c.replace(footerRegex, newFooter.trim());
     fs.writeFileSync(p, c);
     console.log('Updated footer in: ' + f);
  } else {
     // Fallback if not found for some reason
     c = c.replace(/<\/body>/i, '\n' + newFooter.trim());
     fs.writeFileSync(p, c);
     console.log('Appended new footer to: ' + f);
  }
});
