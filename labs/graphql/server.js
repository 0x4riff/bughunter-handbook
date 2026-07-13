const http=require('http');
const mode=process.env.LAB_MODE||'vulnerable';
const records={A:{owner:'A',note:'A-private'},B:{owner:'B',note:'B-private'}};
http.createServer((req,res)=>{
 const user=req.headers['x-lab-user']||'A'; const id=new URL(req.url,'http://localhost').searchParams.get('id')||'A';
 if(req.url.startsWith('/health')) return res.end('ok');
 if(req.url.startsWith('/demo')){const item=records[id]; if(mode==='fixed'&&item&&item.owner!==user){res.writeHead(403);return res.end(JSON.stringify({error:'forbidden'}));} res.setHeader('content-type','application/json');return res.end(JSON.stringify({lab:'graphql',mode,item}));}
 res.writeHead(404);res.end('not found');
}).listen(8080,'0.0.0.0');
