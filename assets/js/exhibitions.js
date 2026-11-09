import {el,asset} from './data.js';
const gallery=document.querySelector('.poster-grid');
try{
 const response=await fetch(new URL('../../content/site.json',import.meta.url));if(!response.ok)throw new Error('Could not load exhibitions.');
 const content=await response.json();gallery.replaceChildren();
 for(const [index,poster] of content.exhibitions.entries()){
  const figure=el('figure','exhibition-poster');const image=el('img');image.src=asset(poster.image);image.alt=poster.alt;image.loading=index<2?'eager':'lazy';image.decoding='async';figure.append(image);gallery.append(figure);
 }
}catch(error){gallery.replaceChildren(el('p','',error.message));}
