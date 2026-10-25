document.addEventListener('DOMContentLoaded',()=>{
  if(!localStorage.getItem('westbrook_accounts')){
    localStorage.setItem('westbrook_accounts',JSON.stringify([{id:'account1',name:'Luke Kelly',username:'lukekelly',password:'Luke*',role:'Administrator',permissions:['view_staff','manage_staff','view_leave','manage_leave','manage_conduct','manage_termination','manage_vacancies','view_applications','manage_accounts']}]))
  }
  const form=document.querySelector('#hr-login');form?.addEventListener('submit',event=>{event.preventDefault();const data=new FormData(form),accounts=JSON.parse(localStorage.getItem('westbrook_accounts')||'[]'),account=accounts.find(item=>item.username.toLowerCase()===String(data.get('username')).trim().toLowerCase()&&item.password===String(data.get('password')));const error=document.querySelector('#login-error');if(!account){error.textContent='The username or password is incorrect.';return}sessionStorage.setItem('westbrook-hr-session',JSON.stringify(account));location.href='hr.html'});if(window.lucide)window.lucide.createIcons()
});
