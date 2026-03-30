// shared-nav.js — injects the global header on every page
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  const navLinks = [
    { href: 'dashboard.html', label: ' Hub', id: 'dashboard.html' },
    { href: 'challenges.html', label: '⚔ Challenges', id: 'challenges.html' },
    { href: 'teams.html', label: ' Teams', id: 'teams.html' },
    { href: 'mentorship.html', label: ' Mentorship', id: 'mentorship.html' },
    { href: 'scholarships.html', label: ' Scholarships', id: 'scholarships.html' },
  ];

  const isLoggedIn = !!localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  // Skip nav on auth page
  if (currentPage === 'index.html' || currentPage === '') return;

  // Build header HTML
  const navLinksHtml = navLinks.map(l =>
    `<a href="${l.href}" class="${currentPage === l.id ? 'active' : ''}">${l.label}</a>`
  ).join('');

  const mobileLinksHtml = navLinks.map(l =>
    `<a href="${l.href}">${l.label}</a>`
  ).join('');

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : '?';
  const userName = user?.name || 'Profile';

  const headerHtml = `
    <header class="top-header" id="globalHeader">
      <a href="dashboard.html" class="header-brand">
         <span>HERathon</span>
      </a>
      <nav class="header-nav" aria-label="Main navigation">
        ${navLinksHtml}
      </nav>
      <div class="header-actions">
        <a href="profile.html" class="profile-pill">
          <span class="avatar-circle">${avatarLetter}</span>
          ${userName}
        </a>
        <button class="btn-logout" onclick="sharedLogout()">Sign out</button>
        <button class="nav-toggle" aria-label="Toggle menu" onclick="toggleMobileNav()">
          <span></span><span></span><span></span>
        </button>
      </div>
    </header>
    <nav class="mobile-nav" id="mobileNav" aria-label="Mobile navigation">
      ${mobileLinksHtml}
      <a href="profile.html"> Profile</a>
      <button onclick="sharedLogout()" style="color:#fca5a5;"> Sign out</button>
    </nav>
  `;

  // Insert before body content
  document.body.insertAdjacentHTML('afterbegin', headerHtml);

  window.toggleMobileNav = function () {
    document.getElementById('mobileNav').classList.toggle('open');
  };

  window.sharedLogout = function () {
    localStorage.clear();
    window.location.href = 'index.html';
  };
})();
