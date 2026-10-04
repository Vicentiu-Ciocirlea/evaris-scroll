import assert from 'node:assert/strict';
import fs from 'node:fs';
const ro = fs.readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
const en = fs.readFileSync(new URL('../dist/en/index.html', import.meta.url), 'utf8');
const css = fs.readFileSync(new URL('../dist/style.css', import.meta.url), 'utf8');
const riskCss = fs.readFileSync(new URL('../dist/seo-pages.css', import.meta.url), 'utf8');
const riskImage = new URL('../dist/evaris-risk-desk.png', import.meta.url);
// Ignore only translated metadata, text attributes, and language selection.
function structure(html) {
  return [...html.matchAll(/<[^>]+>/g)].map(([tag]) =>
    tag.replace(/(href|id)="(#?)(?:team|echipa)"/g, '$1="$2TEAM"')
      .replace(/ (?:lang|aria-label|alt|placeholder|name|data-service|content|aria-current)="[^"]*"/g, '')
      .replace(/href="\/(?:en\/examples|exemple)\/[^"]+"/g, 'href="LOCALIZED_EXAMPLE"')
      .replace(/href="\/(?:en\/)?(?:servicii-ssm-psi-bucuresti|ohs-fire-safety-bucharest)\/"/g, 'href="SERVICES_PAGE"')
      .replace(/href="\/(?:en\/)?(?:evaluare-riscuri-bucuresti|risk-assessment-bucharest)\/"/g, 'href="RISKS_PAGE"')
      .replace(/href="\/(?:en\/)?(?:preturi-servicii-ssm|ohs-service-pricing)\/"/g, 'href="PRICES_PAGE"')
      .replace(/href="\/(?:en\/)?(?:ghid-ssm-firma-noua|ohs-guide-new-business)\/"/g, 'href="GUIDE_PAGE"')
      .replace(/href="\/(?:en\/legislation|legislatie)\/"/g, 'href="LEGISLATION_PAGE"')
      .replace(/(<link rel="canonical" href=")[^"]+"/, '$1CANONICAL"'));
}
assert.deepEqual(structure(en), structure(ro), 'English must keep the complete Romanian DOM and layout attributes');
assert.ok(!/html\[lang=en\]/.test(css), 'Do not reintroduce separate English presentation rules');
assert.ok(en.includes('Less paperwork.<br><em>Better oversight.</em>'));
assert.ok(fs.existsSync(riskImage), 'Risk-assessment background image must be packaged');
assert.ok(riskCss.includes("url('/evaris-risk-desk.png')"), 'Risk image must use shared styling');
for (const route of ['evaluare-riscuri-bucuresti', 'en/risk-assessment-bucharest']) {
  const detail = fs.readFileSync(new URL('../dist/' + route + '/index.html', import.meta.url), 'utf8');
  assert.ok(detail.includes('class="seo-page risk-page"'), route + ': matching risk hero');
}
assert.ok(fs.existsSync(new URL('../dist/evaris-preturi.png', import.meta.url)), 'Pricing image must be packaged');
assert.ok(riskCss.includes("url('/evaris-preturi.png')"), 'Pricing image must use shared styling');
for (const route of ['preturi-servicii-ssm', 'en/ohs-service-pricing']) {
  const detail = fs.readFileSync(new URL('../dist/' + route + '/index.html', import.meta.url), 'utf8');
  assert.ok(detail.includes('class="seo-page pricing-page"'), route + ': matching pricing hero');
}
assert.ok(fs.existsSync(new URL('../dist/evaris-servicii-ssm-psi.png', import.meta.url)), 'Services image must be packaged');
assert.ok(riskCss.includes("url('/evaris-servicii-ssm-psi.png')"), 'Services image must use shared styling');
for (const route of ['servicii-ssm-psi-bucuresti', 'en/ohs-fire-safety-bucharest']) {
  const detail = fs.readFileSync(new URL('../dist/' + route + '/index.html', import.meta.url), 'utf8');
  assert.ok(detail.includes('class="seo-page services-page"'), route + ': matching services hero');
}
assert.ok(fs.existsSync(new URL('../dist/evaris-ghid-ssm-firma-noua.png', import.meta.url)), 'Guide image must be packaged');
assert.ok(riskCss.includes("url('/evaris-ghid-ssm-firma-noua.png')"), 'Guide image must use shared styling');
for (const route of ['ghid-ssm-firma-noua', 'en/ohs-guide-new-business']) {
  const detail = fs.readFileSync(new URL('../dist/' + route + '/index.html', import.meta.url), 'utf8');
  assert.ok(detail.includes('class="seo-page guide-page"'), route + ': matching guide hero');
}
assert.equal((en.match(/class="story-panel/g) || []).length, 2);
assert.equal((en.match(/data-parallax=/g) || []).length, 3);
assert.equal((en.match(/data-reveal/g) || []).length, (ro.match(/data-reveal/g) || []).length);
for (const [language, html] of [['ro', ro], ['en', en]]) {
  const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
  for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(target), language + ': missing anchor ' + target);
  for (const [, path] of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
    const relative = path.endsWith('/') ? path + 'index.html' : path;
    assert.ok(fs.existsSync(new URL('../dist' + relative, import.meta.url)), language + ': missing asset ' + path);
  }
  const services = [...html.matchAll(/<option>([^<]+)<\/option>/g)].map(m => m[1]);
  for (const [, service] of html.matchAll(/data-service="([^"]+)"/g)) assert.ok(services.includes(service), language + ': service selector mismatch');
}
console.log('PASS: full RO/EN structure, shared styling, images, animations, anchors, assets and service selections.');
