const fs = require('fs');

['frontend/challenges.html', 'frontend/fixed/challenges.html'].forEach(f => {
  if (fs.existsSync(f)) {
    let c = fs.readFileSync(f,'utf8');
    c = c.replace(/const isUnlocked = challenge\.level <= userLevel;/, 'const isUnlocked = challenge.status === "unlocked" || challenge.status === "completed";');
    fs.writeFileSync(f,c);
    console.log('Fixed', f);
  }
});
