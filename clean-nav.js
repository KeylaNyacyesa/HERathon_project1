const fs = require('fs');

const filesToClean = [
  'frontend/contact.html',
  'frontend/mentorship.html',
  'frontend/scholarships.html',
  'frontend/submissions-review.html',
  'frontend/teams.html',
  'frontend/challenges.html'
];

filesToClean.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    
    // Pattern to look for the old navigation
    const navPattern = /<nav>\s*<a href="dashboard\.html">.*?Dashboard<\/a>\s*<button onclick="logout\(\)">Logout<\/button>\s*<\/nav>/s;
    if (navPattern.test(content)) {
      content = content.replace(navPattern, '');
      fs.writeFileSync(file, content, 'utf8');
      console.log('Cleaned old nav from ' + file);
    } else {
      console.log('Old nav not found or already cleaned in ' + file);
      // Let's try a simpler one just in case
      const navPattern2 = /<nav>[\s\S]*?logout\(\)[\s\S]*?<\/nav>/s;
      if (navPattern2.test(content) && !content.includes('class="main-nav"')) {
         content = content.replace(navPattern2, '');
         fs.writeFileSync(file, content, 'utf8');
         console.log('Cleaned fallback old nav from ' + file);
      }
    }
  }
});
