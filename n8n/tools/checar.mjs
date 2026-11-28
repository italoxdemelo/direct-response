// Confere a sintaxe de todos os nós Code e as ligações dos workflows gerados.
import { readdirSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'workflows');
let erros = 0;
for (const f of readdirSync(dir).filter(f => f.endsWith('.json') && f !== 'ids.json')) {
  const wf = JSON.parse(readFileSync(join(dir, f), 'utf8'));
  const nomes = new Set(wf.nodes.map(n => n.name));
  if (nomes.size !== wf.nodes.length) { console.log(f, 'NOMES DUPLICADOS'); erros++; }
  for (const n of wf.nodes) {
    if (n.type === 'n8n-nodes-base.code') {
      try { new Function('$', '$input', '$json', `return (async () => {\n${n.parameters.jsCode}\n})()`); }
      catch (e) { console.log(f, '::', n.name, '::', e.message); erros++; }
    }
    // referências $('Nome') precisam existir
    const txt = JSON.stringify(n.parameters);
    for (const m of txt.matchAll(/\$\(\\?['"]([^'"\\]+)\\?['"]\)/g)) if (!nomes.has(m[1])) { console.log(f, '::', n.name, ':: referência inexistente', m[1]); erros++; }
  }
  for (const [a, tipos] of Object.entries(wf.connections)) {
    if (!nomes.has(a)) { console.log(f, 'conexão de nó inexistente', a); erros++; }
    for (const saidas of Object.values(tipos)) for (const s of saidas) for (const c of s) if (!nomes.has(c.node)) { console.log(f, 'conexão para nó inexistente', c.node); erros++; }
  }
  console.log('ok', f, wf.nodes.length, 'nós');
}
process.exit(erros ? 1 : 0);
