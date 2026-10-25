document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

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
