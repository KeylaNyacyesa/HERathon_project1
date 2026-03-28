const fs = require('fs');
const content = \// shared-nav.js - injects the global header on every page
(function () {
  let currentPage = window.location.pathname.split('/').pop() || 'index.html';
  if (currentPage === '') currentPage = 'index.html';

  const isLocalHtml = window.location.pathname.endsWith('.html') || window.location.protocol === 'file:';
  
  function getLink(page) {
    if (page === 'index' || page === 'index.html') return isLocalHtml ? 'index.html' : '/';
    return isLocalHtml ? page + '.html' : '/' + page;
  }

  const navLinks = [
    { page: 'dashboard', label: '??? Hub' },
    { page: 'challenges', label: '?? Challenges' },
    { page: 'teams', label: '?? Teams' },
    { page: 'mentorship', label: '?? Mentorship' },
    { page: 'scholarships', label: '?? Scholarships' }
  ];

  const isLoggedIn = !!localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (currentPage === 'index.html' || currentPage === 'index') return;

  const navLinksHtml = navLinks.map(l => {
    const isActive = currentPage === l.page || currentPage === l.page + '.html';
    return '<a href="' + getLink(l.page) + '" class="' + (isActive ? 'active' : '') + '">' + l.label + '</a>';
  }).join('');

  const mobileLinksHtml = navLinks.map(l =>
    '<a href="' + getLink(l.page) + '">' + l.label + '</a>'
  ).join('');

  const avatarLetter = user && user.name ? user.name.charAt(0).toUpperCase() : '?';
  const userName = user && user.name ? user.name : 'Profile';

  const headerHtml = '<header class="top-header" id="globalHeader">' +
      '<a href="' + getLink('dashboard') + '" class="header-brand">' +
        '?? <span>HERathon</span>' +
      '</a>' +
      '<nav class="header-nav" aria-label="Main navigation" style="display:flex; align-items:center; gap:0.25rem;">' +
        navLinksHtml +
      '</nav>' +
      '<div class="header-actions">' +
        '<a href="' + getLink('profile') + '" class="profile-pill">' +
          '<span class="avatar-circle">' + avatarLetter + '</span>' +
          userName +
        '</a>' +
        '<button class="btn-logout" onclick="sharedLogout()" style="padding: 0.45rem 1rem;">Sign out</button>' +
        '<button class="nav-toggle" aria-label="Toggle menu" onclick="toggleMobileNav()">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</header>' +
    '<nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">' +
      mobileLinksHtml +
      '<a href="' + getLink('profile') + '">?? Profile</a>' +
      '<button onclick="sharedLogout()" style="color:#fca5a5;">?? Sign out</button>' +
    '</nav>';

  try {
    document.body.insertAdjacentHTML('afterbegin', headerHtml);
  } catch(e) {}

  window.toggleMobileNav = function () {
    document.getElementById('mobileNav').classList.toggle('open');
  };

  window.sharedLogout = function () {
    localStorage.clear();
    window.location.href = getLink('index');
  };
})();\

try {
  fs.writeFileSync('frontend/shared-nav.js', content, 'utf8');
} catch (err) {
  try {
     fs.unlinkSync('frontend/shared-nav.js');
     fs.writeFileSync('frontend/shared-nav.js', content, 'utf8');
  } catch(e) {
     console.error(e);
  }
}
