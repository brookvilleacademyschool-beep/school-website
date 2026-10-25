document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) window.lucide.createIcons();
  if (!localStorage.getItem('westbrook_vacancies')) {
    localStorage.setItem('westbrook_vacancies', JSON.stringify([
      {id:'vac1',title:'Science Teacher',department:'Teaching',closing:'2026-11-20',status:'Open',summary:'Teach engaging science lessons across Years 7–11.',questions:['Why are you interested in Westbrook?','How do you support students with different learning needs?','Please describe a successful lesson you have taught.']},
      {id:'vac2',title:'Student Support Assistant',department:'Pastoral',closing:'2026-11-27',status:'Open',summary:'Support students, families and pastoral staff across the school day.',questions:['Why do you want to work in pastoral support?','Describe how you handle confidential information.']},
      {id:'vac3',title:'School Finance Officer',department:'Administration',closing:'2026-12-04',status:'Open',summary:'Provide accurate financial administration and support for the school office.',questions:['Describe your finance administration experience.','What systems have you used for financial records?']}
    ]));
  }
  const vacancies = JSON.parse(localStorage.getItem('westbrook_vacancies') || '[]').filter(v => v.status === 'Open');
  const list = document.querySelector('#vacancy-list');
  list.innerHTML = vacancies.length ? vacancies.map(v => `<article class="vacancy-card"><p class="vacancy-meta">${escapeHtml(v.department)} · Closing ${escapeHtml(v.closing)}</p><h2>${escapeHtml(v.title)}</h2><p>${escapeHtml(v.summary)}</p><footer><button data-apply="${v.id}" data-title="${escapeHtml(v.title)}">Apply for this role →</button></footer></article>`).join('') : '<div class="empty-state">There are currently no vacancies. Please check again soon.</div>';

  const modal=document.querySelector('#application-modal'), form=document.querySelector('#application-form'), success=document.querySelector('#application-success'), questions=document.querySelector('#application-questions');
  document.querySelectorAll('[data-apply]').forEach(button=>button.addEventListener('click',()=>{
    const vacancy=vacancies.find(v=>String(v.id)===button.dataset.apply);
    modal.hidden=false;document.querySelector('#application-title').textContent='Apply: '+button.dataset.title;form.hidden=false;success.hidden=true;form.dataset.position=button.dataset.title;form.dataset.vacancy=button.dataset.apply;
    questions.innerHTML=(vacancy?.questions||[]).map((question,index)=>`<div class="field"><label>${escapeHtml(question)}</label><textarea name="question_${index}" required></textarea></div>`).join('');
    if(window.lucide)window.lucide.createIcons();
  }));
  document.querySelector('#close-application').addEventListener('click',()=>modal.hidden=true);
  modal.addEventListener('click',event=>{if(event.target===modal)modal.hidden=true});
  form.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form),vacancy=vacancies.find(v=>String(v.id)===form.dataset.vacancy);const answers=(vacancy?.questions||[]).map((question,index)=>({question,answer:data.get('question_'+index)||''}));const applications=JSON.parse(localStorage.getItem('westbrook_applications')||'[]');applications.unshift({id:Date.now(),name:data.get('name'),email:data.get('email'),phone:data.get('phone'),message:data.get('message'),answers,position:form.dataset.position,status:'New',date:new Date().toLocaleDateString('en-GB')});localStorage.setItem('westbrook_applications',JSON.stringify(applications));form.hidden=true;success.hidden=false;success.className='application-success';success.textContent='Application submitted. Thank you for your interest in Westbrook Secondary School.';form.reset();questions.innerHTML='';});
  if (window.lucide) window.lucide.createIcons();
});
function escapeHtml(value){const element=document.createElement('div');element.textContent=value||'';return element.innerHTML}
