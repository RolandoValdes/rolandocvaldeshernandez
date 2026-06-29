class ProjectXWorkspace{
  constructor(targetId){this.target=document.getElementById(targetId)}
  render(html){if(this.target)this.target.innerHTML=html}
  card(title,description,status='Workspace'){return `<div class="projectx-card"><span class="projectx-status">${this.escape(status)}</span><h3>${this.escape(title)}</h3><p>${this.escape(description)}</p></div>`}
  dashboard(title,subtitle,cards=[]){return `<div class="workspace-toolbar"><div class="workspace-title"><h2>${this.escape(title)}</h2><p>${this.escape(subtitle)}</p></div><div class="workspace-actions"><button class="projectx-button" type="button">New Item</button></div></div><div class="projectx-grid">${cards.map(c=>this.card(c.title,c.description,c.status)).join('')}</div>`}
  escape(value){return String(value||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]))}
}
window.ProjectXWorkspace=ProjectXWorkspace;
