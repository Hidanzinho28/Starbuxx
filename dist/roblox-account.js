(() => {
  const storageKey='selected-roblox-profile';
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const usernameOK=name=>/^[A-Za-z0-9_]{1,20}$/.test(name);
  const clean=profile=>{
    if(!profile||!Number.isSafeInteger(profile.id)||profile.id<1||!usernameOK(profile.username))return null;
    let avatarUrl=null;try{const u=new URL(profile.avatarUrl);if(u.protocol==='https:'&&(u.hostname==='rbxcdn.com'||u.hostname.endsWith('.rbxcdn.com')))avatarUrl=u.href}catch{}
    return {description:typeof profile.description==='string'?profile.description.slice(0,10000):null,friendsCount:Number.isSafeInteger(profile.friendsCount)?profile.friendsCount:null,followersCount:Number.isSafeInteger(profile.followersCount)?profile.followersCount:null,followingCount:Number.isSafeInteger(profile.followingCount)?profile.followingCount:null,publicDetailsAt:profile.publicDetailsAt||null,id:profile.id,username:profile.username,displayName:String(profile.displayName||profile.username).slice(0,100),avatarUrl,profileUrl:`https://www.roblox.com/users/${profile.id}/profile`};
  };
  let selected=null;try{selected=clean(JSON.parse(localStorage.getItem(storageKey)))}catch{}
  let candidate=null,controller=null,requestId=0,lastUsername='';
  const modal=()=>document.querySelector('#roblox-modal');
  function avatar(profile){return `<div class="rb-avatar">${profile.avatarUrl?`<img src="${esc(profile.avatarUrl)}" alt="Avatar de ${esc(profile.username)}" referrerpolicy="no-referrer">`:`<span aria-label="Avatar indisponível">${esc(profile.displayName.slice(0,1).toUpperCase())}</span>`}</div>`}
  function page(){return `<section class="page wrap rb-auth-page"><div class="rb-auth-art" aria-hidden="true"><img src="${window.originalMedia?.logo||'/assets/coin.svg'}" alt=""><h2>Sua próxima<br><em>aventura</em><br>começa aqui.</h2></div><div class="info-box rb-auth-card"><span class="eyebrow">SUA CONTA ROBLOX</span><h1>${selected?'Sua conta selecionada':'Encontre sua conta'}</h1><p>Conecte seu perfil Roblox para preencher os dados da sua conta na loja.</p><div id="rb-selected">${selected?`${avatar(selected)}<h3>${esc(selected.displayName)}</h3><p>@${esc(selected.username)}</p><a class="rb-profile-link" href="${selected.profileUrl}" target="_blank" rel="noopener noreferrer">Ver perfil Roblox ↗</a>`:'<div class="rb-connect-icon">◇</div>'}</div><button class="button rb-connect" data-rb-open>${selected?'Trocar conta Roblox':'Encontrar minha conta Roblox'} →</button>${selected?'<button class="rb-secondary" data-rb-remove>Remover conta deste navegador</button>':''}<p id="rb-save-status" class="rb-save-status" role="status"></p><div class="rb-security">♢ Nunca solicitamos sua senha Roblox</div><p class="rb-explanation">A busca identifica um perfil público e salva sua seleção neste navegador. Não faz login nem comprova que a conta pertence a você.</p></div></section>`}
  function shell(content){const media=window.originalMedia||{};return `<div class="rb-dialog-header"><img src="${media.logo||'/assets/coin.svg'}" alt="StarBuxx"><span>SINCRONIZAÇÃO</span><i></i><img class="rb-wordmark" src="/assets/roblox-wordmark.svg?v=2" alt="Roblox"><button class="rb-close" data-rb-close aria-label="Fechar busca de conta">×</button></div><div class="rb-dialog-content">${content}</div><div class="rb-dialog-footer"><img src="/assets/roblox-wordmark.svg?v=2" alt="Roblox"><strong>♢ NUNCA SOLICITAMOS SUA SENHA ROBLOX</strong><small>Seleção de perfil público · sem acesso à conta</small></div>`}
  function searchScreen(message=''){
    candidate=null;modal().innerHTML=shell(`<h2 id="rb-title">Encontre sua conta Roblox</h2><p>Digite seu nome de usuário para buscar seu perfil.</p><form id="roblox-search"><label for="roblox-username">NOME DE USUÁRIO ROBLOX</label><div class="rb-input"><span>@</span><input id="roblox-username" name="username" maxlength="21" autocomplete="off" autocapitalize="none" spellcheck="false" placeholder="Seu nome de usuário" value="${esc(lastUsername)}" required aria-describedby="rb-search-help rb-error"></div><small id="rb-search-help">Use o @usuário, não o nome de exibição.</small><p id="rb-error" class="rb-error" role="alert">${esc(message)}</p><button class="button rb-search-submit" type="submit">Buscar conta Roblox →</button></form>`);
    modal().querySelector('input')?.focus();
  }
  function open(){controller?.abort();requestId++;searchScreen();modal().showModal();modal().querySelector('input')?.focus()}
  function close(){controller?.abort();requestId++;modal().close();document.querySelector('[data-rb-open]')?.focus()}
  async function search(form){
    const username=form.elements.username.value.trim().replace(/^@/,'');lastUsername=username;
    if(!usernameOK(username)){document.querySelector('#rb-error').textContent='Digite um @usuário válido: letras, números ou sublinhado, até 20 caracteres.';return}
    controller?.abort();controller=new AbortController();const token=++requestId;
    const button=form.querySelector('button[type="submit"]');button.disabled=true;button.innerHTML='<span class="rb-spinner"></span> Buscando conta…';form.setAttribute('aria-busy','true');document.querySelector('#rb-error').textContent='';
    try{
      const response=await fetch('/api/roblox/user?username='+encodeURIComponent(username),{signal:controller.signal,headers:{Accept:'application/json'}});
      if(!response.headers.get('content-type')?.includes('application/json'))throw new Error('Reinicie o servidor para ativar a busca Roblox. Depois atualize esta página.');
      const data=await response.json();if(token!==requestId||!modal().open)return;
      if(!response.ok)throw new Error(data.error||'Não foi possível consultar o Roblox.');
      candidate=clean(data);if(!candidate)throw new Error('Não foi possível validar o perfil retornado. Tente novamente.');
      confirmScreen();
    }catch(error){if(error.name==='AbortError'||token!==requestId||!modal().open)return;document.querySelector('#rb-error').textContent=error.message==='Failed to fetch'?'Falha de conexão. Confira se o servidor está aberto e tente novamente.':error.message;}
    finally{if(token===requestId&&form.isConnected){button.disabled=false;button.textContent='Buscar conta Roblox →';form.removeAttribute('aria-busy')}}
  }
  function confirmScreen(){const p=candidate;modal().innerHTML=shell(`<h2 id="rb-title">Confirme sua conta Roblox</h2><p>Confira se essa é a conta correta antes de salvar.</p><div class="rb-confirm-profile">${avatar(p)}<h3>${esc(p.displayName)}</h3><p>@${esc(p.username)}</p><a class="rb-profile-link" href="${p.profileUrl}" target="_blank" rel="noopener noreferrer">VER PERFIL ROBLOX ↗</a></div><button class="button rb-confirm" data-rb-save>⊙ CONFIRMAR E SALVAR</button><button class="rb-secondary" data-rb-another>← BUSCAR OUTRO USUÁRIO</button>`);modal().querySelector('[data-rb-save]')?.focus()}
  function refresh(){if(location.pathname.replace(/\/$/,'')==='/auth'){document.querySelector('#app').innerHTML=page();window.lojaMotion?.mount()}}
  document.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-rb-open'))open();
    if(button.hasAttribute('data-rb-close'))close();
    if(button.hasAttribute('data-rb-another')){controller?.abort();requestId++;searchScreen()}
    if(button.hasAttribute('data-rb-save')&&candidate){try{localStorage.setItem(storageKey,JSON.stringify(candidate));selected=candidate;close();refresh();window.accountUI?.mount();const status=document.querySelector('#rb-save-status');if(status)status.textContent='Conta Roblox salva neste navegador.'}catch{button.textContent='Não foi possível salvar. Tente novamente.'}}
    if(button.hasAttribute('data-rb-remove')){try{localStorage.removeItem(storageKey);selected=null;refresh()}catch{}}
  });
  document.addEventListener('submit',event=>{if(event.target.id==='roblox-search'){event.preventDefault();search(event.target)}});
  document.addEventListener('error',event=>{const img=event.target;if(img.tagName==='IMG'&&img.closest('.rb-avatar')){const span=document.createElement('span');span.textContent='◇';span.setAttribute('aria-label','Avatar indisponível');img.replaceWith(span)}},true);
  modal().addEventListener('cancel',event=>{event.preventDefault();close()});
  modal().addEventListener('click',event=>{if(event.target!==modal())return;const r=modal().getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)close()});
  window.addEventListener('popstate',()=>{if(modal().open)close()});
  window.robloxAccount={page};
})();
