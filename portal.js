document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();

  const on = document.querySelector('#staff-login');
  if (on) {
    on.addEventListener('submit', event => {
      event.preventEvent?.();
      event.preventDefault();
      const formData = new FormData(on);
      const username = formData.get('username').trim();
      const password = formData.get('password');
      const error = document.querySelector('#login-error');
      if (username.toLowerCase() === 'lukekelly' && password === 'Luke*') {
        sessionStorage.setItem('westbrook-demo-session', JSON.stringify({username:'lukekelly',name:'Luke Kelly',role:'Administrator',permissions:['view_staff','manage_staff','manage_vacancies','view_applications','manage_applications','manage_permissions']}));
        location.href = 'portal.html';
      } else {
        error.textContent = 'The username or password is incorrect.';
      }
    });
  }

  const session = JSON.parse(sessionStorage.getItem('westbrook-demo-session') || 'null');
  if (document.querySelector('.portal-shell')) {
    if (!session) { location.href = 'login.html'; return; }
    document.querySelector('#current-user').textContent = session.name;
    seedData();
    bindNavigation();
    bindForms();
    renderAll();
    if (!session.permissions.includes('manage_vacancies')) {
      document.querySelector('#new-vacancy').hidden = true;
    }
    if (!session.permissions.includes('manage_permissions') && !session.permissions.includes('manage_staff')) {
      document.querySelector('#new-staff').hidden = true;
    }
  }

  document.querySelector('#logout')?.addEventListener('click', () => {
    sessionStorage.removeItem('westbrook-demo-session'); location.href = 'login.html';
  });

  function seedData() {
    if (!localStorage.getItem('westbrook-vacancies')) {
      localStorage.setItem('westbrook-vacancies', JSON.stringify([
        {id:1,title:'Science Teacher',department:'Teaching',closing:'2026-11-20',status:'Open',summary:'Teach engaging science lessons and support students across Years 7–11.'},
        {id:2,title:'Student Support Assistant',department:'Pastoral',closing:'2026-11-27',status:'Open',summary:'Support students, families and pastoral staff across the school day.'},
        {id:3,title:'School Finance Officer',department:'Administration',closing:'2026-12-04',status:'Open',summary:'Provide accurate financial administration and support for the school office.'}
      ]));
    }
    if (!localStorage.getItem('westbrook-staff')) {
      localStorage.setItem('westbrook-staff', JSON.stringify([
        {id:1,name:'Eleanor Morris',role:'Headteacher',department:'Leadership',email:'e.morris@westbrookschool.edu',permissions:['view_staff','manage_staff','manage_vacancies','view_applications','manage_applications','manage_permissions']},
        {id:2,name:'Daniel Price',role:'Deputy Headteacher',department:'Leadership',email:'d.price@westbrookschool.edu',permissions:['view_staff','manage_staff','manage_vacancies','view_applications','manage_applications']},
        {id:3,name:'Sarah Khan',role:'Pastoral Lead',department:'Pastoral',email:'s.khan@westbrookschool.edu',permissions:['view_staff','view_applications']}
      ]));
    }
    if (!localStorage.getItem('westbrook-applications')) localStorage.setItem('westbrook-applications', JSON.stringify([]));
  }

  function get(key) { return JSON.parse(localStorage.getItem(key) || '[]'); }
  function set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  function escapeHtml(value) { const el=document.createElement('div'); el.textContent=value; return el.innerHTML; }

  function bindNavigation() {
    document.querySelectorAll('.portal-sidebar nav button[data-view]').forEach(button => {
      button.addEventListener('click', () => {
        const view = button.dataset.view;
        const required = {applications:'view_applications',hr:'view_staff',vacancies:'manage_vacancies'}[view];
        if (required && !session.permissions.includes(required) && view !== 'hr') return;
        document.querySelectorAll('.portal-view').forEach(item => item.hidden = true);
        document.querySelector('#view-' + view).hidden = false;
        document.querySelectorAll('.portal-sidebar nav button').forEach(item => item.classList.remove('active'));
        button.classList.add('active');
        document.querySelector('#portal-title').textContent = button.textContent.trim();
      });
    });
    document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => document.querySelector(`[data-view="${button.dataset.go}"]`).click()));
  }

  function bindForms() {
    document.querySelector('#new-vacancy')?.addEventListener('click', () => { document.querySelector('#vacancy-form-panel').hidden=false; document.querySelector('#vacancy-form').reset(); });
    document.querySelector('#vacancy-form')?.addEventListener('submit', event => {
      event.preventDefault(); const data=new FormData(event.currentTarget); const list=get('westbrook-vacancies');
      list.unshift({id:Date.now(),title:data.get('title'),department:data.get('department'),closing:data.get('closing'),status:data.get('status'),summary:data.get('summary')});
      set('westbrook-vacancies',list); event.currentTarget.reset(); document.querySelector('#vacancy-form-panel').hidden=true; renderAll();
    });
    document.querySelector('#new-staff')?.addEventListener('click', () => { document.querySelector('#staff-form-panel').hidden=false; document.querySelector('#staff-form').reset(); });
    document.querySelector('#staff-form')?.addEventListener('submit', event => {
      event.preventDefault(); const data=new FormData(event.currentTarget); const list=get('westbrook-staff');
      list.push({id:Date.now(),name:data.get('name'),role:data.get('role'),department:data.get('department'),email:data.get('email'),permissions:data.getAll('permission')});
      set('westbrook-staff',list); event.currentTarget.reset(); document.querySelector('#staff-form-panel').hidden=true; renderAll();
    });
  }

  function renderAll() {
    const vacancies=get('westbrook-vacancies'), applications=get('westbrook-applications'), staff=get('westbrook-staff');
    document.querySelector('#stat-vacancies').textContent=vacancies.filter(v=>v.status==='Open').length;
    document.querySelector('#stat-applications').textContent=applications.length;
    document.querySelector('#stat-staff').textContent=staff.length;
    document.querySelector('#vacancy-table').innerHTML=vacancies.length ? vacancies.map(v=>`<tr><td><strong>${escapeHtml(v.title)}</strong></td><td>${escapeHtml(v.department)}</td><td>${escapeHtml(v.closing)}</td><td><span class="status ${v.status==='Closed'?'closed':v.status==='Draft'?'review':''}">${escapeHtml(v.status)}</span></td><td><button class="portal-button secondary" data-delete-vacancy="${v.id}" aria-label="Delete vacancy">Delete</button></td></tr>`).join('') : '<tr><td colspan="5" class="empty-state">No vacancies added.</td></tr>';
    document.querySelector('#application-table').innerHTML=applications.length ? applications.map(a=>`<tr><td><strong>${escapeHtml(a.name)}</strong></td><td>${escapeHtml(a.email)}</td><td>${escapeHtml(a.position)}</td><td><span class="status review">${escapeHtml(a.status||'New')}</span></td><td>${escapeHtml(a.date)}</td><td><button class="portal-button secondary" data-delete-application="${a.id}">Remove</button></td></tr>`).join('') : '<tr><td colspan="6" class="empty-state">No applications received.</td></tr>';
    document.querySelector('#recent-applications').innerHTML=applications.length ? applications.slice(0,4).map(a=>`<tr><td><strong>${escapeHtml(a.name)}</strong></td><td>${escapeHtml(a.position)}</td><td><span class="status review">New</span></td><td>${escapeHtml(a.date)}</td></tr>`).join('') : '<tr><td colspan="4" class="empty-state">No applications received.</td></tr>';
    document.querySelector('#staff-table').innerHTML=staff.length ? staff.map(s=>`<tr><td><strong>${escapeHtml(s.name)}</strong><br><small>${escapeHtml(s.email)}</small></td><td>${escapeHtml(s.role)}</td><td>${escapeHtml(s.department)}</td><td>${s.permissions.length} permissions</td><td><button class="portal-button secondary" data-delete-staff="${s.id}">Remove</button></td></tr>`).join('') : '<tr><td colspan="5" class="empty-state">No staff profiles added.</td></tr>';
    document.querySelectorAll('[data-delete-vacancy]').forEach(button=>button.addEventListener('click',()=>{set('westbrook-vacancies',get('westbrook-vacancies').filter(v=>String(v.id)!==button.dataset.deleteVacancy));renderAll();}));
    document.querySelectorAll('[data-delete-staff]').forEach(button=>button.addEventListener('click',()=>{set('westbrook-staff',get('westbrook-staff').filter(s=>String(s.id)!==button.dataset.deleteStaff));renderAll();}));
    document.querySelectorAll('[data-delete-application]').forEach(button=>button.addEventListener('click',()=>{set('westbrook-applications',get('westbrook-applications').filter(a=>String(a.id)!==button.dataset.deleteApplication));renderAll();}));
  }
});
