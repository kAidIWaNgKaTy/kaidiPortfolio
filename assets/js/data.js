export async function loadProjects(){
 const response=await fetch(new URL('../../content/projects.json',import.meta.url));
 if(!response.ok)throw new Error('Could not load projects.');
 const projects=await response.json();
 const formats=['Installation','Image','Sculpture','Website'], themes=['Agency','Embodiment','Perception','Transformation'];
 const slugs=new Set();
 for(const p of projects){
  if(!p.title||!p.slug||!p.cover||slugs.has(p.slug)||!p.formats?.length||!p.inquiries?.length||p.formats.some(v=>!formats.includes(v))||p.inquiries.some(v=>!themes.includes(v)))throw new Error('Check project content and category names.');
  slugs.add(p.slug);
 }
 return projects;
}
export function el(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
export function asset(path){const url=new URL(path,new URL('../../',import.meta.url));if(!['http:','https:'].includes(url.protocol))throw new Error('Unsupported media URL');return url.href;}
