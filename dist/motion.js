/* Motion inventory and timings are documented in ANIMACOES.md. */
(() => {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ease = 'cubic-bezier(.22,1,.36,1)';
  let revealObserver, loopObserver, guideObserver, closeTimer;
  const animations = new Set();
  const run = (element, frames, options = {}) => {
    if (!element || media.matches || !element.animate) return null;
    const animation = element.animate(frames, { duration: 420, easing: ease, ...options });
    animations.add(animation);
    animation.finished.catch(() => {}).finally(() => animations.delete(animation));
    return animation;
  };
  function cleanup() {
    revealObserver?.disconnect();loopObserver?.disconnect();guideObserver?.disconnect();
    animations.forEach(animation => animation.cancel());animations.clear();
    document.querySelectorAll('.motion-pending').forEach(el => el.classList.remove('motion-pending'));
  }
  function mount() {
    cleanup();
    if (!window.IntersectionObserver || media.matches) return;
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        target.classList.remove('motion-pending');
        let transform = 'translateY(24px)';
        if (target.matches('.account-main')) transform = 'translateX(-20px)';
        if (target.matches('.stock')) transform = 'translateX(20px)';
        if (target.matches('.economy-visual')) transform = 'scale(.88)';
        if (target.matches('.landing-tutorial')) transform = 'translateY(24px) scale(.98)';
        if (target.matches('.landing-product')) transform = 'translateY(30px)';
        if (target.matches('.landing-step')) transform = 'translateY(18px)';
        if (target.matches('.landing-orbit-scene')) transform = 'scale(.9)';
        const frames = [{ opacity: 0, transform }, { opacity: 1, transform: 'none' }];
        if (target.matches('.guide-heading,.landing-how-top h2')) {frames[0].filter='blur(6px)';frames[1].filter='blur(0px)';}
        run(target, frames, { duration: target.matches('.account-main,.stock') ? 650 : 600, delay: Number(target.dataset.motionDelay || 0) });
        revealObserver.unobserve(target);
      });
    }, { threshold: .06, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('#app section > .wrap > h2, .faq > h2, .guide article, .game, .account-main, .stock, .economy-visual, .saving-copy, .calculator, .cta h2, .cta p, .cta .button, .cta-orbits, .catalog-section h2, .product, .catalog-hero > *, .guide-heading, .landing-how-top h2, .landing-how-top p, .landing-tutorial, .landing-step, .landing-product, .landing-community-symbol, .landing-community p, .landing-community .button, .landing-faq details, .landing-orbit-scene, .rx-visual, .rx-config h1, .rx-intro, .rx-price-panel, .rx-presets, .rx-trust, .pdp-visual, .pdp-config h1, .pdp-price-box, .pdp-trust, .pdp-buy, .pdp-detail-card, .pdp-related-grid > a, .rx-buy, .rx-product, .gc-page > .eyebrow, .gc-page > h1, .gc-page > .sc-intro, .gc-card, .gc-benefits > div, .sc-hero h1, .sc-hero p, .sc-catalog > h2, .sc-toolbar, .sc-account, .sc-guide > h2').forEach((el, i) => {
      const siblings = el.parentElement?.matches('.games,.product-grid,.landing-steps,.landing-products,.landing-faq .faq,.gc-grid,.gc-benefits,.sc-grid') ? [...el.parentElement.children].filter(child=>child.tagName===el.tagName) : [];
      el.dataset.motionDelay = siblings.length ? Math.min(siblings.indexOf(el) % 4 * 65, 195) : 0;
      el.classList.add('motion-pending');revealObserver.observe(el);
    });
    loopObserver = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => target.classList.toggle('in-view',isIntersecting)), {threshold:0});
    document.querySelectorAll('.rw-wall,.economy-visual,.cta,.live,.landing-hero,.landing-community,.landing-products,.landing-tutorial').forEach(el=>loopObserver.observe(el));
    guideObserver = new IntersectionObserver(entries => entries.forEach(({target,isIntersecting}) => {
      if (!isIntersecting) return;
      document.querySelectorAll('.guide aside a').forEach(a=>a.classList.toggle('reading',a.hash==='#'+target.id));
    }),{rootMargin:'-15% 0px -60% 0px'});
    document.querySelectorAll('.guide article[id]').forEach(el=>guideObserver.observe(el));
    document.querySelectorAll('.hero .breadcrumb,.hero h1,.hero p,.hero .search').forEach((el,i)=>run(el,[{opacity:0,transform:'translateY(20px)'},{opacity:1,transform:'none'}],{duration:650,delay:i*85}));
  }
  function showDialog(kind = 'product', replacing = false) {
    const dialog = document.querySelector('#modal');clearTimeout(closeTimer);
    dialog.classList.remove('dialog-closing');
    const wasCart = dialog.classList.contains('dialog-cart');
    dialog.classList.toggle('dialog-cart',kind==='cart');
    if (replacing && wasCart === (kind==='cart')) {
      run(document.querySelector('#modal-body'),[{opacity:.45,transform:'translateY(5px)'},{opacity:1,transform:'none'}],{duration:180});
    } else {
      run(dialog,kind==='cart'?[{opacity:.7,transform:'translateX(100%)'},{opacity:1,transform:'translateX(0)'}]:[{opacity:0,transform:'translateY(18px) scale(.96)'},{opacity:1,transform:'none'}],{duration:kind==='cart'?500:260});
    }
  }
  function closeDialog(immediate = false) {
    const dialog=document.querySelector('#modal');
    clearTimeout(closeTimer);
    if(!dialog.open)return;
    if (media.matches || immediate) {dialog.close();dialog.classList.remove('dialog-closing');return;}
    dialog.classList.add('dialog-closing');
    const cart=dialog.classList.contains('dialog-cart');
    const animation=run(dialog,cart?[{transform:'translateX(0)',opacity:1},{transform:'translateX(100%)',opacity:.7}]:[{transform:'none',opacity:1},{transform:'translateY(12px) scale(.97)',opacity:0}],{duration:cart?300:180,fill:'forwards'});
    closeTimer=setTimeout(()=>{dialog.close();dialog.classList.remove('dialog-closing');animation?.cancel();},cart?300:180);
  }
  function price() {run(document.querySelector('#robux-price'),[{opacity:.35,transform:'translateY(7px)'},{opacity:1,transform:'none'}],{duration:200});run(document.querySelector('#economized'),[{opacity:.3},{opacity:1}],{duration:240});}
  function cart() {run(document.querySelector('#count'),[{transform:'scale(.65)'},{transform:'scale(1.25)'},{transform:'scale(1)'}],{duration:300});}
  function revealResults() {
    document.querySelectorAll('#catalog-list .product,.games .game:not(.hide)').forEach((el,i)=>run(el,[{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:240,delay:Math.min(i%4*35,105)}));
  }
  const faqAnimations=new WeakMap();
  document.addEventListener('click',event=>{
    const summary=event.target.closest('summary');if(!summary)return;
    const details=summary.parentElement;
    if(!details.matches('.faq details')||media.matches)return;
    event.preventDefault();
    const answer=details.querySelector('.faq-answer');if(!answer)return;
    const old=faqAnimations.get(details);const start=details.getBoundingClientRect().height;
    const opening=old? !old.opening:!details.open;
    old?.animation?.cancel();details.open=true;
    const end=opening?summary.getBoundingClientRect().height+answer.getBoundingClientRect().height:summary.getBoundingClientRect().height;
    summary.setAttribute('aria-expanded',String(opening));details.classList.toggle('faq-expanded',opening);
    const animation=run(details,[{height:start+'px'},{height:end+'px'}],{duration:240,easing:'cubic-bezier(.4,0,.2,1)'});
    faqAnimations.set(details,{animation,opening});
    animation?.finished.then(()=>{details.open=opening;faqAnimations.delete(details);}).catch(()=>{});
  });
  document.querySelector('#modal').addEventListener('cancel',event=>{event.preventDefault();closeDialog();});
  media.addEventListener('change',()=>{cleanup();clearTimeout(closeTimer);document.querySelector('#modal')?.classList.remove('dialog-closing');mount();});
  window.addEventListener('pagehide',()=>{cleanup();clearTimeout(closeTimer);});
  window.lojaMotion={mount,showDialog,closeDialog,price,cart,revealResults};
})();
