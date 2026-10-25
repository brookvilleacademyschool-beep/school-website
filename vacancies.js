document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  if (!localStorage.getItem('westbrook-vacancies')) {
    localStorage.setItem('westbrook-vacancies', JSON.stringify([
      {id:1,title:'Science Teacher',department:'Teaching',closing:'2026-11-20',status:'Open',summary:'Teach engaging science lessons and support students across Years 7–11.'},
      {id:2,title:'Student Support Assistant',department:'Pastoral',closing:'2026-11-27',status:'Open',summary:'Support students, families and pastoral staff across the school day.'},
      {id:3,title:'School Finance Officer',department:'Administration',closing:'2026-12-04',status:'Open',summary:'Provide accurate financial administration and support for the school office.'}
    ]));
  }
  const vacancies = JSON.parse(localStorage.getItem('westbrook-vacancies') || '[]').filter(v => v.status === 'Open');
  const list = document.querySelector('#vacancy-list');
  list.innerHTML = vacancies.length ? vacancies.map(v => `<article class="vacancy-card"><p class="vacancy-meta">${escapeHtml(v.department)} · Closing ${escapeHtml(v.closing)}</p><h2>${escapeHtml(v.title)}</h2><p>${escapeHtml(v.summary)}</p><footer><button data-apply="${v.id}" data-title="${escapeHtml(v.title)}">Apply for this role →</button></footer></article>`).join('') : '<div class="empty-state">There are currently no vacancies. Please check again soon.</div>';

  const modal=document.querySelector('#application-modal'), form=document.querySelector('#application-form'), success=document.querySelector('#application-success');
  document.querySelectorAll('[data-apply]').forEach(button=>button.addEventListener('click',()=>{modal.hidden=false;document.querySelector('#application-title').textContent='Apply: '+button.dataset.title;form.hidden=false;success.hidden=true;form.dataset.position=button.dataset.title;}));
  document.querySelector('#close-application').addEventListener('click',()=>modal.hidden=true);
  modal.addEventListener('click',event=>{if(event.target===modal)modal.hidden=true});
  form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form);const applications=JSON.parse(localStorage.getItem('westbrook-applications')||'[]');applications.unshift({id:Date.now(),name:data.get('name'),email:data.get('email'),phone:data.get('phone'),message:data.get('message'),position:form.dataset.position,status:'New',date:new Date().toLocaleDateString('en-GB')});localStorage.setItem('westbrook-applications',JSON.stringify(applications));form.hidden=true;success.hidden=false;success.className='application-success';success.textContent='Application submitted. Thank you for your interest in Westbrook Secondary School.';form.reset();});
  if (window.lucide) window.lucide.createIcons();
});
function escapeHtml(value){const element=document.createElement('div');element.textContent=value||'';return element.innerHTML}
