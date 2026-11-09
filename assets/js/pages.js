import {el} from './data.js';
const main=document.querySelector('[data-page]');
try{
 const response=await fetch(new URL('../../content/site.json',import.meta.url));if(!response.ok)throw new Error('Could not load page content.');
 const content=await response.json();const page=main.dataset.page;
 main.replaceChildren(el('h1','page-heading',page==='about'?'About':'Contact'));
 if(page==='about'){
  const text=el('div','about-statement');for(const [index,paragraph] of content.about.paragraphs.entries())text.append(el('p',index===0?'statement-opening':'',paragraph));main.append(text);
 }else{
  const list=el('dl','contact-list');
  for(const [label,text,href] of [['Email',content.contact.email,'mailto:'+content.contact.email],['Instagram','@'+content.contact.instagram,'https://www.instagram.com/'+encodeURIComponent(content.contact.instagram)+'/']]){
   const row=el('div','contact-row');const value=el('dd');const link=el('a','',text);link.href=href;
   if(label==='Instagram'){link.target='_blank';link.rel='noopener noreferrer';}value.append(link);row.append(el('dt','',label),value);list.append(row);
  }main.append(list);
 }
}catch(error){main.replaceChildren(el('p','',error.message));}
