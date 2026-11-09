import {loadProjects,el,asset} from './data.js';
import {vimeoEmbed,aspectRatio} from './vimeo.js';
const main=document.querySelector('#project-detail');
try{
 const projects=await loadProjects();const slug=new URLSearchParams(location.search).get('slug');const p=projects.find(p=>p.slug===slug);
 if(!p)throw new Error('Project not found.');document.title=p.title+' — KAIDI';
 main.replaceChildren(el('h1','',p.title));if(p.year)main.append(el('p','year',p.year));
 if(p.credits)main.append(el('p','credits',p.credits));
 const details=[p.dimensions,p.materials].filter(Boolean);if(details.length)main.append(el('p','project-facts',details.join(' · ')));
 const cover=el('img','detail-cover');cover.src=asset(p.cover);cover.alt=p.coverAlt||p.title;main.append(cover);
 if(p.description)main.append(el('p','description',p.description));
 for(const item of p.media||[]){
  if(item.type==='vimeo'){
   const wrap=el('div','video-embed');wrap.style.aspectRatio=aspectRatio(item.aspectRatio);
   const frame=el('iframe');frame.src=vimeoEmbed(item.src);frame.title=item.title||p.title+' — video';frame.loading='lazy';frame.allow='autoplay; fullscreen; picture-in-picture';frame.allowFullscreen=true;wrap.append(frame);main.append(wrap);
  }else{const media=el(item.type==='video'?'video':'img');media.src=asset(item.src);if(item.type==='video'){media.controls=true;media.preload='metadata';}else{media.alt=item.alt||p.title;media.loading='lazy';}main.append(media);}
 }

}catch(error){main.replaceChildren(el('h1','',error.message),el('p','','Use “KAIDI” to return to the homepage.'));}
