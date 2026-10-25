document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const newMenuButton = document.querySelector('.menu-toggle');
  const primaryNav = document.querySelector('.primary-nav');
  if (newMenuButton && primaryNav) {
    newMenuButton.addEventListener('click', () => {
      const open = primaryNav.classList.toggle('open');
      newMenuButton.setAttribute('aria-expanded', String(open));
      if (window.lucide) window.lucide.createIcons();
    });
    document.querySelectorAll('.nav-item>a').forEach(link => link.addEventListener('click', () => primaryNav.classList.remove('open')));
    document.querySelectorAll('.nav-item>button').forEach(button => button.addEventListener('click', () => button.parentElement.classList.toggle('open')));
  }

  const menuButton = document.querySelector('.menu-button');
  const mainNav = document.querySelector('.main-nav');
  if (menuButton && mainNav) {
    menuButton.addEventListener('click', () => {
      const open = mainNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.innerHTML = open
        ? '<i data-lucide="x"></i><span class="sr-only">Close menu</span>'
        : '<i data-lucide="menu"></i><span class="sr-only">Open menu</span>';
      if (window.lucide) window.lucide.createIcons();
    });

    mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      mainNav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.innerHTML = '<i data-lucide="menu"></i><span class="sr-only">Open menu</span>';
      if (window.lucide) window.lucide.createIcons();
    }));
  }

  const staffGrid = document.querySelector('.staff-grid');
  if (staffGrid) {
    const published = JSON.parse(localStorage.getItem('westbrook_directory') || '[]');
    const seeded = [
      {name:'Dr Eleanor Morris',role:'Headteacher',department:'Leadership',email:'e.morris@westbrookschool.edu',photo:''},
      {name:'Daniel Price',role:'Deputy Headteacher',department:'Leadership',email:'d.price@westbrookschool.edu',photo:''},
      {name:'Sarah Khan',role:'Pastoral Lead',department:'Pastoral',email:'s.khan@westbrookschool.edu',photo:''},
      {name:'James Walker',role:'English Department',department:'English',email:'j.walker@westbrookschool.edu',photo:''}
    ];
    const members = published.length ? published : seeded;
    staffGrid.innerHTML = members.length ? members.map(member => `<article class="staff-card">${member.photo ? `<img src="${member.photo}" alt="${member.name}">` : `<div class="avatar">${member.name.split(/\s+/).map(part => part[0]).join('').slice(0,2).toUpperCase()}</div>`}<h3>${member.name}</h3><p class="staff-role">${member.role}</p><p>${member.bio || member.department}</p><a href="mailto:${member.email}"><i data-lucide="mail"></i> ${member.email}</a></article>`).join('') : '<p class="empty-state">Staff information will appear here when profiles are published.</p>';
    if (window.lucide) window.lucide.createIcons();
  }

  const search = document.querySelector('#staff-search');
  if (search) {
    const cards = [...document.querySelectorAll('.staff-card')];
    const grid = document.querySelector('.staff-grid');
    search.addEventListener('input', () => {
      const term = search.value.trim().toLowerCase();
      let visible = 0;
      cards.forEach(card => {
        const matches = card.textContent.toLowerCase().includes(term);
        card.hidden = !matches;
        if (matches) visible++;
      });
      let empty = grid.querySelector('.no-results');
      if (!empty && visible === 0) {
        empty = document.createElement('p');
        empty.className = 'no-results';
        empty.textContent = 'No staff members match your search.';
        grid.appendChild(empty);
      }
      if (empty) empty.hidden = visible !== 0;
    });
  }
});
