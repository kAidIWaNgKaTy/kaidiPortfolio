import {vimeoEmbed,aspectRatio,loopBackground} from './vimeo.js?v=24';
import {loadProjects,el,asset} from './data.js?v=24';
const main=document.querySelector('#projects'), svg=document.querySelector('#connections');
const selected={formats:'',inquiries:''};let projects=[],pending=false;
const buttons={formats:new Map(),inquiries:new Map()};
for(const [group,names,all] of [['formats',['Installation','Image','Sculpture','Website'],'All Formats'],['inquiries',['Agency','Embodiment','Perception','Transformation'],'All Themes']]){
 for(const value of ['',...names]){const b=el('button','',value||all);b.type='button';b.setAttribute('aria-pressed',String(!value));b.onclick=()=>{selected.formats='';selected.inquiries='';selected[group]=value;render();window.scrollTo({top:0,behavior:'instant'});};buttons[group].set(value,b);document.getElementById(group).append(b);}
}
function render(){
 main.replaceChildren();for(const group in buttons)for(const [value,b] of buttons[group])b.setAttribute('aria-pressed',String(value===selected[group]));
 const visible=projects.filter(p=>(!selected.formats||p.formats.includes(selected.formats))&&(!selected.inquiries||p.inquiries.includes(selected.inquiries)));
 for(const p of visible){const article=el('article','project');article.dataset.slug=p.slug;const link=el('a','project-link');link.href=`project.html?slug=${encodeURIComponent(p.slug)}`;link.setAttribute('aria-label',p.title);const img=el('img');img.src=asset(p.cover);img.alt=p.coverAlt||p.title;img.loading=main.children.length?'lazy':'eager';img.onload=schedule;img.className='project-visual';
 let visual=img;
 if(p.coverVideo){
  const ratio=aspectRatio(p.videoAspectRatio).split('/').map(Number);link.style.width=`min(100%,calc(var(--cover-max-height) * ${ratio[0]/ratio[1]}))`;
  const frame=el('div','project-visual video-cover');frame.style.aspectRatio=aspectRatio(p.videoAspectRatio);frame.style.setProperty('--video-ratio',aspectRatio(p.videoAspectRatio));
  img.className='cover-poster';if(matchMedia('(prefers-reduced-motion: reduce)').matches)frame.append(img);
  if(!matchMedia('(prefers-reduced-motion: reduce)').matches){
   const video=el('iframe','cover-player');video.src=vimeoEmbed(p.coverVideo,true);const sourceRatio=aspectRatio(p.coverVideoAspectRatio||p.videoAspectRatio).split('/').map(Number);const height=Math.max(1,(ratio[0]/ratio[1])/(sourceRatio[0]/sourceRatio[1]));video.style.height=(height*100)+'%';video.style.top=((1-height)*50)+'%';video.title=p.title+' — silent preview';video.allow='autoplay; fullscreen; picture-in-picture';video.tabIndex=-1;video.setAttribute('aria-hidden','true');video.loading=main.children.length?'lazy':'eager';video.dataset.duration=p.coverVideoDuration||'';loopBackground(video);frame.append(video);
  }
  visual=frame;
 }
 link.append(visual,el('span','project-title',p.title));article.append(link);main.append(article);}
 const status=el('p',visible.length?'sr-status':'status',visible.length?`${visible.length} project${visible.length===1?'':'s'}`:'No projects match these categories.');status.setAttribute('role','status');if(visible.length){status.style.cssText='position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)'}main.append(status);schedule();
}
function scaleProjects(){
 const center=document.documentElement.clientHeight/2;
 const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
 for(const article of main.querySelectorAll('.project')){
  const rect=article.getBoundingClientRect();
  const distance=Math.min(1,Math.abs(rect.top+rect.height/2-center)/(center*1.25));
  const emphasis=(1-distance)*(1-distance);
  article.querySelector('.project-link').style.transform=`scale(${reduceMotion?1:.78+.22*emphasis})`;
 }
}
function schedule(){if(!pending){pending=true;requestAnimationFrame(()=>{pending=false;scaleProjects();draw();});}}
function draw(){
 const {width,height}=svg.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.replaceChildren();
 for(const article of main.querySelectorAll('.project')){const rect=article.querySelector('.project-visual').getBoundingClientRect();if(rect.bottom<0||rect.top>height||!rect.height)continue;const p=projects.find(p=>p.slug===article.dataset.slug);
 for(const [side,values] of [['formats',selected.formats?p.formats.filter(v=>v===selected.formats):p.formats],['inquiries',selected.inquiries?p.inquiries.filter(v=>v===selected.inquiries):p.inquiries]])for(const [index,value] of [...values].sort((a,b)=>buttons[side].get(a).getBoundingClientRect().top-buttons[side].get(b).getBoundingClientRect().top).entries()){
 const b=buttons[side].get(value).getBoundingClientRect();
 const x1=side==='formats'?b.right:b.left,y1=b.top+b.height/2;
 const x2=side==='formats'?rect.left+.5:rect.right-.5;
 // Ordered attachment points and shared horizontal handles keep curves calm.
 const y2=rect.top+rect.height*(.35+.3*(index+1)/(values.length+1));
 const dx=x2-x1;
 const handle=dx*.42;
 const path=document.createElementNS('http://www.w3.org/2000/svg','path');
 path.setAttribute('d',`M ${x1} ${y1} C ${x1+handle} ${y1},${x2-handle} ${y2},${x2} ${y2}`);
 path.dataset.side=side;path.dataset.category=value;path.dataset.project=p.slug;path.setAttribute('fill','none');path.setAttribute('stroke','var(--red)');path.setAttribute('stroke-width','1.3');path.setAttribute('stroke-linecap','round');svg.append(path);
 }}
}
addEventListener('scroll',schedule,{passive:true});addEventListener('resize',schedule);new ResizeObserver(schedule).observe(main);
try{projects=await loadProjects();render();}catch(error){main.replaceChildren(el('p','status',error.message+' Run the site with a local web server; see README.'));}
