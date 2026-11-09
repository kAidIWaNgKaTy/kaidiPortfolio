export function vimeoEmbed(link,background=false){
 const source=new URL(link);
 if(!['vimeo.com','www.vimeo.com','player.vimeo.com'].includes(source.hostname))throw new Error('Use a Vimeo video link.');
 const parts=source.pathname.split('/').filter(Boolean);
 const index=parts.findIndex(p=>/^\d+$/.test(p));
 if(index<0)throw new Error('Missing Vimeo video ID.');
 const url=new URL('https://player.vimeo.com/video/'+parts[index]);
 const hash=source.searchParams.get('h')||parts[index+1];
 if(hash)url.searchParams.set('h',hash);
 url.searchParams.set('dnt','1');url.searchParams.set('title','0');url.searchParams.set('byline','0');url.searchParams.set('portrait','0');
 if(background){url.searchParams.set('background','1');url.searchParams.set('autoplay','1');url.searchParams.set('muted','1');url.searchParams.set('loop','1');url.searchParams.set('keyboard','0');}
 return url.href;
}
export function aspectRatio(value){return /^\d+(?:\.\d+)?\s*\/\s*\d+(?:\.\d+)?$/.test(value||'')?value:'16 / 9';}

// Vimeo's public postMessage API reinforces looping for background covers.
const backgrounds=new Set();
function send(frame,method,value){frame.contentWindow?.postMessage(JSON.stringify({method,...(value===undefined?{}:{value})}),'https://player.vimeo.com');}
function start(frame){
 for(const event of ['ready','ended','timeupdate'])send(frame,'addEventListener',event);
 send(frame,'getDuration');send(frame,'setLoop',true);send(frame,'setMuted',true);send(frame,'play');
}
export function loopBackground(frame){
 backgrounds.add(frame);
 frame.addEventListener('load',()=>start(frame));
 const timer=setInterval(()=>{if(!frame.isConnected){clearInterval(timer);backgrounds.delete(frame);return;}send(frame,'getCurrentTime');},800);
}
addEventListener('message',event=>{
 if(event.origin!=='https://player.vimeo.com')return;
 let data;try{data=typeof event.data==='string'?JSON.parse(event.data):event.data;}catch{return;}
 for(const frame of backgrounds){
  if(!frame.isConnected){backgrounds.delete(frame);continue;}
  if(event.source!==frame.contentWindow)continue;
  if(data.method==='getDuration'&&data.value>0)frame.dataset.duration=data.value;
  if(data.event==='ready')start(frame);
  if((data.method==='getCurrentTime'&&data.value>Number(frame.dataset.duration)-.35&&Number(frame.dataset.duration)>0)||data.event==='ended'||(data.event==='timeupdate'&&data.data?.duration>0&&data.data.duration-data.data.seconds<.16)){
   send(frame,'setCurrentTime',0);send(frame,'play');
  }
 }
});
