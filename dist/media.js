(() => {
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  let observer;let videos=[];
  const label=video=>{
    const button=document.querySelector(`[data-video-toggle="${video.id}"]`);if(!button)return;
    const paused=video.paused;
    button.setAttribute('aria-label',paused?'Reproduzir vídeo de fundo':'Pausar vídeo de fundo');
    button.innerHTML=paused?'▶ <span>Reproduzir vídeo</span>':'Ⅱ <span>Pausar vídeo</span>';
  };
  const update=video=>{
    const shouldPlay=!reduced.matches&&!document.hidden&&video.dataset.visible==='true';
    if(shouldPlay){video.muted=true;video.play().then(()=>label(video)).catch(()=>label(video));}
    else {video.pause();label(video);}
  };
  function mount(){
    observer?.disconnect();videos.forEach(v=>v.pause());
    videos=[...document.querySelectorAll('.original-video')];
    document.documentElement.classList.toggle('media-reduced',reduced.matches);
    if(!window.IntersectionObserver){videos.forEach(v=>{v.dataset.visible='true';update(v)});return;}
    observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{target.dataset.visible=String(isIntersecting);update(target)}),{threshold:.05});
    videos.forEach(video=>{video.muted=true;video.addEventListener('play',()=>label(video));video.addEventListener('pause',()=>label(video));video.addEventListener('error',()=>{video.style.visibility='hidden';const b=document.querySelector(`[data-video-toggle="${video.id}"]`);if(b){b.disabled=true;b.textContent='Imagem de capa'}});observer.observe(video)});
  }
  document.addEventListener('error',event=>{const img=event.target;if(img.tagName==='IMG'&&img.dataset.fallback){const fallback=img.dataset.fallback;delete img.dataset.fallback;img.src=fallback;img.alt+=' — ilustração alternativa (original indisponível)'}},true);
  document.addEventListener('visibilitychange',()=>videos.forEach(update));
  reduced.addEventListener('change',()=>{document.documentElement.classList.toggle('media-reduced',reduced.matches);videos.forEach(update)});
  window.addEventListener('pagehide',()=>{observer?.disconnect();videos.forEach(v=>v.pause())});
  window.lojaMedia={mount};
})();
