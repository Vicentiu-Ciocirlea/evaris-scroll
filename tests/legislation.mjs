import assert from 'node:assert/strict';
import fs from 'node:fs';

const root = new URL('../', import.meta.url);
const data = JSON.parse(fs.readFileSync(new URL('data/legislation.json', root), 'utf8').replace(/^\uFEFF/, ''));
const counts = { ssm: 41, su: 33, conexe: 11 };
assert.equal(data.acts.length, 85);
assert.equal(new Set(data.acts.map(act => act.code)).size, 85);
assert.equal(new Set(data.acts.map(act => act.url)).size, 85);
for (const [group, count] of Object.entries(counts)) assert.equal(data.acts.filter(act => act.group === group).length, count);
for (const act of data.acts) {
  assert.match(act.url, /^https:\/\/legislatie\.just\.ro\/Public\/DetaliiDocument\/\d+$/);
  assert.ok(act.officialTitle?.length > 15, `Missing complete title: ${act.code}`);
}
const norms = data.acts.find(act => act.code === 'NORME1425-2006');
assert.equal(norms.url, 'https://legislatie.just.ro/Public/DetaliiDocument/252029');
assert.equal(norms.consolidationDate, '07.03.2022');
assert.equal(norms.amendingActUrl, 'https://legislatie.just.ro/Public/DetaliiDocument/252418');

for (const [lang, route] of [['ro', 'legislatie'], ['en', 'en/legislation']]) {
  const html = fs.readFileSync(new URL(`dist/${route}/index.html`, root), 'utf8');
  assert.match(html, new RegExp(`<html lang="${lang}"`));
  assert.equal((html.match(/class="leg-act"/g) || []).length, 85);
  for (const act of data.acts) {
    assert.ok(html.includes(`href="${act.url}"`), `${lang}: missing official link for ${act.code}`);
    assert.ok(html.includes(act.code), `${lang}: missing reference for ${act.code}`);
  }
  assert.ok(html.includes('07.03.2022'), `${lang}: missing consolidation date`);
  assert.ok(html.includes('259/2022'), `${lang}: missing amending act`);
  assert.ok(!html.includes('Lista și denumirile actelor provin din'));
  assert.ok(!html.includes('The list and act titles come from'));
  assert.ok(!html.includes('Legislatie-SSM-SU'));
  assert.ok(html.includes('ORD3-2007') || html.includes('Ordinul nr. 3/2007') || html.includes('Order no. 3/2007'));
}

for (const path of ['dist/index.html', 'dist/en/index.html',
  'dist/servicii-ssm-psi-bucuresti/index.html', 'dist/en/ohs-fire-safety-bucharest/index.html',
  'dist/evaluare-riscuri-bucuresti/index.html', 'dist/en/risk-assessment-bucharest/index.html',
  'dist/preturi-servicii-ssm/index.html', 'dist/en/ohs-service-pricing/index.html',
  'dist/ghid-ssm-firma-noua/index.html', 'dist/en/ohs-guide-new-business/index.html']) {
  const html = fs.readFileSync(new URL(path, root), 'utf8');
  assert.ok(html.includes(`href="${path.includes('/en/') ? '/en/legislation/' : '/legislatie/'}"`), `Missing legislation navigation in ${path}`);
}
console.log('PASS: 85 official links, complete titles, 3 source groups, both languages and navigation.');
