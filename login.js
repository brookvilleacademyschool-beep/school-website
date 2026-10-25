document.addEventListener('DOMContentLoaded',()=>{
  const admin={id:'account1',name:'Luke Kelly',username:'lukekelly',password:'Luke*',role:'Administrator',permissions:['view_staff','manage_staff','view_leave','manage_leave','manage_conduct','manage_termination','manage_vacancies','view_applications','manage_accounts']};
  let accounts=[];
  try{accounts=JSON.parse(localStorage.getItem('westbrook_accounts')||'[]')}catch(error){accounts=[]}
  if(!accounts.some(account=>String(account.username||'').trim().toLowerCase()==='lukekelly')) accounts.unshift(admin);
  localStorage.setItem('westbrook_accounts',JSON.stringify(accounts));

  const form=document.querySelector('#hr-login');
  form?.addEventListener('submit',event=>{
    event.preventDefault();
    const data=new FormData(form);
    const username=String(data.get('username')||'').trim().toLowerCase();
    const password=String(data.get('password')||'');
    const stored=JSON.parse(localStorage.getItem('westbrook_accounts')||'[]');
    const account=stored.find(item=>String(item.username||'').trim().toLowerCase()===username&&String(item.password||'')===password);
    const error=document.querySelector('#login-error');
    if(!account){error.textContent='The username or password is incorrect. Check the exact password entered when the account was created.';return}
    sessionStorage.setItem('westbrook-hr-session',JSON.stringify(account));
    location.href='hr.html';
  });
  if(window.lucide)window.lucide.createIcons();
});
