const site=document.getElementById('site');
const overlay=document.getElementById('overlay');
let lastFocus=null;
let activeDrawer=null;
let plan='once';
const bag=[];
const products={discovery:{name:'Discovery Pack (concept)',image:'lychee.jpg'},lychee:{name:'Lychee',image:'lychee.jpg'},peach:{name:'Peach',image:'peach.png'},strawberry:{name:'Strawberry',image:'strawberry.png'}};
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(n);
function openDrawer(id){
  lastFocus=document.activeElement;
  if(activeDrawer){activeDrawer.classList.remove('open');activeDrawer.setAttribute('aria-hidden','true');activeDrawer.inert=true;}
  activeDrawer=document.getElementById(id+'-drawer');
  activeDrawer.inert=false;activeDrawer.classList.add('open');activeDrawer.setAttribute('aria-hidden','false');
  overlay.classList.add('open');site.inert=true;document.body.style.overflow='hidden';
  activeDrawer.querySelector('.close-btn').focus();
}
function closeDrawer(){
  if(!activeDrawer)return;
  activeDrawer.classList.remove('open');activeDrawer.setAttribute('aria-hidden','true');activeDrawer.inert=true;
  overlay.classList.remove('open');site.inert=false;document.body.style.overflow='';activeDrawer=null;
  if(lastFocus)lastFocus.focus();
}
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{
  site.classList.toggle('mobile',button.dataset.view==='mobile');
  document.querySelectorAll('[data-view]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}));
document.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.open==='cart')renderBag();openDrawer(b.dataset.open);}));
document.querySelectorAll('.close-btn').forEach(b=>b.addEventListener('click',closeDrawer));
overlay.addEventListener('click',closeDrawer);
document.getElementById('continue-shopping').addEventListener('click',closeDrawer);
function addDiscovery(){
  const existing=bag.find(item=>item.product==='discovery');
  if(existing)existing.quantity++;else bag.push({product:'discovery',plan:'once',quantity:1,price:19});
  if(activeDrawer)closeDrawer();
  renderBag();openDrawer('cart');
}
document.getElementById('offer-explore').addEventListener('click',addDiscovery);
document.querySelectorAll('.add-discovery').forEach(b=>b.addEventListener('click',addDiscovery));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape')closeDrawer();
  if(event.key==='Tab'&&activeDrawer){
    const els=[...activeDrawer.querySelectorAll('a[href],button:not([disabled]),input,summary')].filter(e=>e.offsetParent!==null);
    const first=els[0],last=els[els.length-1];
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  }
});
document.querySelectorAll('[data-plan]').forEach(button=>button.addEventListener('click',()=>{
  plan=button.dataset.plan;
  document.querySelectorAll('[data-plan]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  const price=plan==='once'?68:59.99;
  document.querySelectorAll('.product-card .price').forEach(e=>e.textContent=money(price));
  document.querySelectorAll('.per-can').forEach(e=>e.textContent=money(price/24)+' / can');
  document.querySelectorAll('.add-product').forEach(e=>{e.childNodes[0].textContent=plan==='once'?'Add to Bag ':'Subscribe Monthly ';});
  document.getElementById('purchase-note').textContent=plan==='once'?'One-time purchase. No subscription required. Shipping and taxes calculated at checkout.':'$59.99 per 24-can delivery, billed monthly and renewing automatically. Modify or cancel anytime under current store terms. Shipping and taxes calculated at checkout.';
}));
document.querySelectorAll('[data-product]').forEach(button=>button.addEventListener('click',()=>{
  const key=button.dataset.product;
  const existing=bag.find(item=>item.product===key&&item.plan===plan);
  if(existing)existing.quantity++;else bag.push({product:key,plan,quantity:1,price:plan==='once'?68:59.99});
  renderBag();openDrawer('cart');
}));
function renderBag(){
  document.getElementById('bag-count').textContent=bag.reduce((sum,item)=>sum+item.quantity,0);
  const items=document.getElementById('cart-items');
  items.innerHTML='';
  if(!bag.length)items.innerHTML='<p class="empty-bag">Your preview bag is empty.<br>Find a flavor to get started.</p>';
  bag.forEach((item,index)=>{
    const p=products[item.product];
    const el=document.createElement('article');el.className='cart-item';
    el.innerHTML=`<img src="assets/${p.image}" alt="Tatsu ${p.name} tea"><div><h3>${p.name}</h3><small>${item.product==='discovery'?'6 cans · Proposed offer · Shipping included':`24 cans · ${item.plan==='once'?'One-time purchase':'Monthly subscription'}`}</small><div class="cart-item-bottom"><div class="quantity"><button aria-label="Remove one ${p.name} pack" data-change="-1">−</button><span>${item.quantity}</span><button aria-label="Add one ${p.name} pack" data-change="1">+</button></div><strong>${money(item.price*item.quantity)}</strong></div></div>`;
    el.querySelectorAll('[data-change]').forEach(b=>b.addEventListener('click',()=>{item.quantity+=Number(b.dataset.change);if(item.quantity===0)bag.splice(index,1);renderBag();}));
    items.appendChild(el);
  });
  document.getElementById('cart-summary').hidden=!bag.length;
  document.getElementById('cart-total').textContent=money(bag.reduce((sum,item)=>sum+item.quantity*item.price,0));
}
document.getElementById('menu-button').addEventListener('click',()=>{
  const open=document.getElementById('navigation').classList.toggle('mobile-menu-open');
  document.getElementById('menu-button').setAttribute('aria-expanded',String(open));
});
document.querySelectorAll('.nav-links a').forEach(a=>a.addEventListener('click',()=>{document.getElementById('navigation').classList.remove('mobile-menu-open');document.getElementById('menu-button').setAttribute('aria-expanded','false');}));
const benefitRibbon=document.querySelector('.benefits-ribbon');
const ribbonPause=document.querySelector('.ribbon-pause');
if(benefitRibbon && ribbonPause){
  ribbonPause.addEventListener('click',()=>{
    const paused=benefitRibbon.classList.toggle('is-paused');
    ribbonPause.setAttribute('aria-pressed',String(paused));
    ribbonPause.setAttribute('aria-label',paused?'Resume scrolling benefits':'Pause scrolling benefits');
    ribbonPause.innerHTML=paused?'<span aria-hidden="true">▶</span>':'<span aria-hidden="true">Ⅱ</span>';
  });
}
