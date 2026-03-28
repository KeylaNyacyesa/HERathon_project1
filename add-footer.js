const fs = require('fs');
const glob = fs.readdirSync('frontend').filter(f => f.endsWith('.html'));
const footer = `
  <footer style="text-align: center; padding: 2rem 1rem; margin-top: 3rem; color: var(--text-faint, #9ca3af); font-size: 0.9rem; border-top: 1px solid var(--border-subtle, #374151);">
    &copy; 2026 HERathon. All rights reserved. Built with passion and purpose.
  </footer>
</body>`;

glob.forEach(f => {
  let p = 'frontend/' + f;
  let c = fs.readFileSync(p, 'utf8');
  if(!c.includes('Built with passion and purpose')) {
     c = c.replace(/<\/body>/i, footer);
     fs.writeFileSync(p, c);
     console.log('Added footer to: ' + f);
  }
});
