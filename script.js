'use strict';
/* ═══════════════════════════════════════════════════════════
   NAGURVALI SHAIK — script.js
   Clean, professional, no excess effects
═══════════════════════════════════════════════════════════ */

// ─── 1. CANVAS — subtle indigo/slate particles ──────────────
const canvas = document.getElementById('bg');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
resize();
window.addEventListener('resize', () => { resize(); });

// Only theme-matching colors
const COLS = ['rgba(99,102,241,', 'rgba(129,140,248,', 'rgba(30,30,50,'];
let mx = W/2, my = H/2;
window.addEventListener('mousemove', e => { mx=e.clientX; my=e.clientY; });

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random()*W;
    this.y  = Math.random()*H;
    this.vx = (Math.random()-.5)*.28;
    this.vy = (Math.random()-.5)*.28;
    this.r  = Math.random()*1.4+.4;
    this.c  = COLS[Math.floor(Math.random()*COLS.length)];
    this.a  = Math.random()*.35+.06;
  }
  step() {
    // gentle mouse nudge only
    const dx=this.x-mx, dy=this.y-my, d=Math.sqrt(dx*dx+dy*dy);
    if(d<110){ const f=(110-d)/110*.009; this.vx+=dx/d*f; this.vy+=dy/d*f; }
    this.vx*=.996; this.vy*=.996;
    this.x+=this.vx; this.y+=this.vy;
    if(this.x<0)this.x=W; if(this.x>W)this.x=0;
    if(this.y<0)this.y=H; if(this.y>H)this.y=0;
  }
  draw() {
    ctx.beginPath(); ctx.arc(this.x,this.y,this.r,0,Math.PI*2);
    ctx.fillStyle=this.c+this.a+')'; ctx.fill();
  }
}
const pts = Array.from({length:60},()=>new Particle());

function drawEdges() {
  const D=130;
  for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
    const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y, d=Math.sqrt(dx*dx+dy*dy);
    if(d<D){
      ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
      ctx.strokeStyle=`rgba(99,102,241,${(1-d/D)*.14})`; ctx.lineWidth=.7; ctx.stroke();
    }
  }
}
(function loop(){ ctx.clearRect(0,0,W,H); pts.forEach(p=>{p.step();p.draw();}); drawEdges(); requestAnimationFrame(loop); })();

// very gentle parallax
window.addEventListener('scroll',()=>{ canvas.style.transform=`translateY(${window.scrollY*.018}px)`; });


// ─── 2. CUSTOM CURSOR ───────────────────────────────────────
const cd=document.getElementById('cd'), cr=document.getElementById('cr');
let cx=0,cy=0,rx=0,ry=0;
window.addEventListener('mousemove',e=>{cx=e.clientX;cy=e.clientY;});
(function cl(){
  rx+=(cx-rx)*.12; ry+=(cy-ry)*.12;
  cd.style.left=cx+'px'; cd.style.top=cy+'px';
  cr.style.left=rx+'px'; cr.style.top=ry+'px';
  requestAnimationFrame(cl);
})();
document.querySelectorAll('a,button,input,textarea,.card').forEach(el=>{
  el.addEventListener('mouseenter',()=>cr.classList.add('on'));
  el.addEventListener('mouseleave',()=>cr.classList.remove('on'));
});
window.addEventListener('mouseleave',()=>{cd.style.opacity='0';cr.style.opacity='0';});
window.addEventListener('mouseenter',()=>{cd.style.opacity='1';cr.style.opacity='1';});


// ─── 3. NAVBAR ──────────────────────────────────────────────
const nav    = document.getElementById('nav');
const burger = document.getElementById('burger');
const navMenu= document.getElementById('navMenu');

window.addEventListener('scroll',()=>{
  nav.classList.toggle('stuck', window.scrollY>50);
  setActive();
});

burger.addEventListener('click',()=> navMenu.classList.toggle('open'));
document.querySelectorAll('.nav-link').forEach(a => a.addEventListener('click',()=> navMenu.classList.remove('open')));

function setActive(){
  const links = document.querySelectorAll('.nav-link');
  document.querySelectorAll('section[id]').forEach(s=>{
    if(window.scrollY >= s.offsetTop-160)
      links.forEach(a=>a.classList.toggle('on', a.getAttribute('href')==='#'+s.id));
  });
}


// ─── 4. ROLE TICKER — smooth slide-up word swap ────────────
const roles = [
  'Full Stack Developer',
  'Freelancer & Consultant',
  'Web Dev Intern @ Jalenthra',
  'Data Analyst',
  'React & Node.js Engineer',
  'Power BI Builder',
  'Flutter App Developer',
];
let ri = 0;
const rw = document.getElementById('roleWord');

function nextRole() {
  // slide current word out upwards
  rw.classList.add('slide-out');
  setTimeout(() => {
    ri = (ri + 1) % roles.length;
    rw.textContent = roles[ri];
    rw.classList.remove('slide-out');
    rw.classList.add('slide-in');
    // clean up after animation
    setTimeout(() => rw.classList.remove('slide-in'), 400);
  }, 380);
}
setInterval(nextRole, 2800);


// ─── 5. SCROLL REVEAL ───────────────────────────────────────
const revObs = new IntersectionObserver(ens=>{
  ens.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('vis'); });
},{threshold:.1, rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('[data-r]').forEach(el=>revObs.observe(el));


// ─── 6. SKILL BAR FILL (no percentages shown) ───────────────
const skObs = new IntersectionObserver(ens=>{
  ens.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('.bar-fill').forEach(f=>{ f.style.width=f.dataset.w+'%'; });
      skObs.disconnect();
    }
  });
},{threshold:.2});
const skillSec = document.getElementById('skills');
if(skillSec) skObs.observe(skillSec);


// ─── 7. HERO STATS COUNT-UP ─────────────────────────────────
function countUp(el, target){
  let v=0;
  const step=Math.max(1,Math.ceil(target/40));
  const iv=setInterval(()=>{
    v=Math.min(v+step,target);
    el.textContent=v;
    if(v>=target)clearInterval(iv);
  },36);
}
const statsObs = new IntersectionObserver(ens=>{
  ens.forEach(e=>{
    if(e.isIntersecting){
      document.querySelectorAll('.stat-n').forEach(el=>countUp(el,parseInt(el.dataset.n)));
      statsObs.disconnect();
    }
  });
},{threshold:.5});
const heroStats = document.querySelector('.hero-stats');
if(heroStats) statsObs.observe(heroStats);


// ─── 8. PHOTO CARD — hover tilt ONLY when mouse is on it ────
const photoCard = document.getElementById('photoCard');
const photoScene = document.querySelector('.photo-scene');
if(photoCard && photoScene){
  photoScene.addEventListener('mousemove', e=>{
    const r  = photoCard.getBoundingClientRect();
    const xP = ((e.clientX-r.left)/r.width  - .5);
    const yP = ((e.clientY-r.top) /r.height - .5);
    photoCard.style.transform  = `rotateY(${xP*8}deg) rotateX(${-yP*8}deg)`;
    photoCard.style.transition = 'transform 0.07s';
    photoCard.style.willChange = 'transform';
  });
  photoScene.addEventListener('mouseleave',()=>{
    photoCard.style.transform  = '';
    photoCard.style.transition = 'transform 0.55s ease';
  });
}


// ─── 9. CONTACT FORM ────────────────────────────────────────
const cForm = document.getElementById('cForm');
const fBtn  = document.getElementById('fBtn');
const fBtnT = document.getElementById('fBtnTxt');
const fOk   = document.getElementById('fOk');

if(cForm){
  cForm.addEventListener('submit', e=>{
    e.preventDefault();
    fBtn.disabled=true; fBtnT.textContent='Sending…';
    setTimeout(()=>{
      cForm.reset();
      fBtn.disabled=false; fBtnT.textContent='Send Message';
      fOk.style.display='flex';
      setTimeout(()=>fOk.style.display='none',5000);
    },1200);
  });
}


// ─── 10. SMOOTH SCROLL ──────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    if(id&&id.length>1){ e.preventDefault(); document.querySelector(id)?.scrollIntoView({behavior:'smooth',block:'start'}); }
  });
});

console.log('%c Nagurvali Shaik — Portfolio','color:#6366f1;font-size:14px;font-weight:800;font-family:monospace');
console.log('%c nagurvali219@gmail.com  ·  github.com/NAGURVALI42','color:#818cf8;font-size:11px;font-family:monospace');
