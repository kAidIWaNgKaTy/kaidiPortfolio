import {loadProjects,el,asset} from './data.js?v=24';
import {vimeoEmbed,aspectRatio} from './vimeo.js?v=24';
const main=document.querySelector('#project-detail');
try{
 const projects=await loadProjects();const slug=new URLSearchParams(location.search).get('slug');const p=projects.find(p=>p.slug===slug);
 if(!p)throw new Error('Project not found.');document.title="KAIDI's "+p.title;
 const text=el('section','project-info');text.setAttribute('aria-label','Project information');
 const gallery=el('section','project-media');gallery.setAttribute('aria-label','Project documentation');
 main.replaceChildren(text,gallery);text.append(el('h1','',p.title));if(p.year)text.append(el('p','year',p.year));
 if(p.credits)text.append(el('p','credits',p.credits));
 const details=[p.dimensions,p.materials].filter(Boolean);if(details.length)text.append(el('p','project-facts',details.join(' · ')));
 const cover=el('img','detail-cover');cover.src=asset(p.cover);cover.alt=p.coverAlt||p.title;gallery.append(cover);
 if(p.description)text.append(el('p','description',p.description));
 for(const item of p.media||[]){
  if(item.type==='vimeo'){
   const wrap=el('div','video-embed');wrap.style.aspectRatio=aspectRatio(item.aspectRatio);
   const frame=el('iframe');frame.src=vimeoEmbed(item.src);frame.title=item.title||p.title+' — video';frame.loading='lazy';frame.allow='autoplay; fullscreen; picture-in-picture';frame.allowFullscreen=true;wrap.append(frame);gallery.append(wrap);
  }else{const media=el(item.type==='video'?'video':'img');media.src=asset(item.src);if(item.type==='video'){media.controls=true;media.preload='metadata';}else{media.alt=item.alt||p.title;media.loading='lazy';}gallery.append(media);}
 }

}catch(error){main.replaceChildren(el('h1','',error.message),el('p','','Use “KAIDI’s works” to return to the homepage.'));}
