import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.name==='.git'?[]:e.isDirectory()?walk(path.join(d,e.name)):[path.join(d,e.name)]);
const files=walk(root), md=files.filter(f=>f.endsWith('.md')), errors=[];
const required=['title','difficulty','estimated_time','prerequisites','last_reviewed','standards'];
for(const f of md.filter(f=>f.includes(`${path.sep}docs${path.sep}`))){
 const s=fs.readFileSync(f,'utf8'); const fm=s.match(/^---\n([\s\S]*?)\n---/);
 if(!fm) errors.push(`${f}: missing front matter`); else for(const key of required)if(!new RegExp(`^${key}:`,'m').test(fm[1]))errors.push(`${f}: missing ${key}`);
 const heads=[...s.matchAll(/^#{1,6} (.+)$/gm)].map(x=>x[1]); const dup=heads.filter((h,i)=>heads.indexOf(h)!==i); if(dup.length)errors.push(`${f}: duplicate headings ${[...new Set(dup)].join(', ')}`);
 if(!s.includes('## Table of Contents'))errors.push(`${f}: missing TOC`);
 if(!s.includes('## Chapter Navigation'))errors.push(`${f}: missing navigation`);
}
for(const f of md){const s=fs.readFileSync(f,'utf8');for(const m of s.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){const u=m[1].split('#')[0];if(!u||/^(https?:|mailto:)/.test(u))continue;if(!fs.existsSync(path.resolve(path.dirname(f),u)))errors.push(`${f}: broken ${u}`)}}
for(const f of files.filter(f=>/wordlists.+\.txt$/.test(f))){const rows=fs.readFileSync(f,'utf8').split(/\r?\n/).filter(Boolean);if(new Set(rows).size!==rows.length)errors.push(`${f}: duplicate entries`)}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}console.log(`Quality OK: ${md.length} Markdown files, ${files.length} total files`);
