import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const documents = [
  ['dist/exemple/evaluare-riscuri-mecanic-agricol.html', 'dist/en/examples/occupational-risk-assessment-agricultural-mechanic.html'],
  ['dist/exemple/instructiuni-ssm-mecanic-agricol.html', 'dist/en/examples/ohs-instructions-agricultural-mechanic.html'],
  ['dist/exemple/plan-prevenire-protectie-mecanic-agricol.html', 'dist/en/examples/prevention-protection-plan-agricultural-mechanic.html'],
];

const endpoint = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=ro&tl=en&dt=t';
const tagOrText = /<[^>]+>|[^<]+/g;
const polishOnly = process.argv.includes('--polish-only');

function polishEnglish(html) {
  const replacements = [
    [/THE POST FOR WORK MECHANIC AGRICULTURAL/gi, 'AGRICULTURAL MECHANIC JOB'],
    [/THE PREGNANCY FOR WORK/gi, 'WORK TASK'],
    [/Own instructions SSM - Agricultural mechanic/gi, 'Internal OSH instructions - Agricultural mechanic'],
    [/Instructions own safety and health at work/gi, 'Internal occupational safety and health instructions'],
    [/Mechanic agricultural/gi, 'Agricultural mechanic'],
    [/THE PLAN OF PREVENTION AND PROTECTION/gi, 'PREVENTION AND PROTECTION PLAN'],
    [/PLACE OF WORK \/ JOB AGRICULTURAL MECHANIC/gi, 'WORKPLACE / JOB: AGRICULTURAL MECHANIC'],
    [/PLACE OF WORK\/ POST OF WORK/gi, 'WORKPLACE / JOB'],
    [/MEASURES TECHNIQUES/gi, 'TECHNICAL MEASURES'],
    [/MEASURES ORGANIZATIONAL/gi, 'ORGANISATIONAL MEASURES'],
    [/MEASURES HYGIENIC- SANITATION/gi, 'HYGIENE AND HEALTH MEASURES'],
    [/ACT\. IN THE PURPOSE REALIZE MAS\./gi, 'ACTIONS TO IMPLEMENT THE MEASURE'],
    [/TER- MEN OF REAL- ZARE/gi, 'IMPLEMENTATION DEADLINE'],
    [/PERSIAN WHICH RASP\. OF REALIZE MAS\./gi, 'PERSON RESPONSIBLE FOR IMPLEMENTATION'],
    [/Car herbicide/gi, 'Crop sprayer'],
    [/\bSSM\b/g, 'OSH'],
    [/SU–PSI/g, 'EMERGENCY / FIRE SAFETY'],
  ];
  for (const [pattern, value] of replacements) html = html.replace(pattern, value);
  const notice = '<aside lang="en" style="max-width:1100px;margin:18px auto;padding:14px 18px;border-left:4px solid #8fb33f;background:#f3f7e9;color:#23312c;font:600 14px/1.5 Arial,sans-serif">English translation of the Romanian example. Informational sample only; it must be reviewed and adapted to the actual workplace, equipment and applicable legal requirements before use.</aside>';
  if (!html.includes('English translation of the Romanian example.')) html = html.replace(/<body([^>]*)>/i, `<body$1>${notice}`);
  return html;
}

function shouldTranslate(text) {
  const trimmed = text.trim();
  return /[A-Za-zĂÂÎȘŞȚŢăâîșşțţ]/.test(trimmed) && !/^https?:\/\//i.test(trimmed);
}

function tokenize(html) {
  const tokens = html.match(tagOrText) ?? [];
  let skippedElement = '';
  const translatable = [];
  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index];
    if (token.startsWith('<')) {
      const open = token.match(/^<(style|script|svg)\b/i);
      const close = token.match(/^<\/(style|script|svg)>/i);
      if (open) skippedElement = open[1].toLowerCase();
      if (close && close[1].toLowerCase() === skippedElement) skippedElement = '';
      continue;
    }
    if (!skippedElement && shouldTranslate(token)) translatable.push({ index, text: token });
  }
  return { tokens, translatable };
}

function splitWhitespace(text) {
  const leading = text.match(/^\s*/)?.[0] ?? '';
  const trailing = text.match(/\s*$/)?.[0] ?? '';
  return { leading, core: text.slice(leading.length, text.length - trailing.length), trailing };
}

function batches(items, maxLength = 3600) {
  const result = [];
  let current = [];
  let length = 0;
  for (const item of items) {
    const { core } = splitWhitespace(item.text);
    const wrappedLength = core.length + 48;
    if (current.length && length + wrappedLength > maxLength) {
      result.push(current);
      current = [];
      length = 0;
    }
    current.push(item);
    length += wrappedLength;
  }
  if (current.length) result.push(current);
  return result;
}

async function translateBatch(batch, attempt = 1) {
  const sourceText = batch.map((item, localIndex) => {
    const { core } = splitWhitespace(item.text);
    return `__EVARIS_SEGMENT_${String(localIndex).padStart(3, '0')}__\n${core}`;
  }).join('\n');
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams({ q: sourceText }),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json();
    const translatedText = payload?.[0]?.map(part => part?.[0] ?? '').join('') ?? '';
    const translated = new Map();
    const pattern = /__EVARIS_SEGMENT_(\d{3})__\s*([\s\S]*?)(?=__EVARIS_SEGMENT_\d{3}__|$)/g;
    for (const match of translatedText.matchAll(pattern)) translated.set(Number(match[1]), match[2].trim());
    if (translated.size !== batch.length) {
      console.error(translatedText.slice(0, 1200));
      throw new Error(`segment mismatch: ${translated.size}/${batch.length}`);
    }
    return batch.map((item, localIndex) => {
      const { leading, trailing } = splitWhitespace(item.text);
      return { index: item.index, text: leading + translated.get(localIndex) + trailing };
    });
  } catch (error) {
    if (attempt >= 3) throw error;
    await new Promise(resolve => setTimeout(resolve, attempt * 900));
    return translateBatch(batch, attempt + 1);
  }
}

for (const [sourceRelative, destinationRelative] of documents) {
  const source = path.join(root, sourceRelative);
  const destination = path.join(root, destinationRelative);
  if (polishOnly) {
    const existing = await fs.readFile(destination, 'utf8');
    await fs.writeFile(destination, polishEnglish(existing), 'utf8');
    console.log(`polished ${path.basename(destination)}`);
    continue;
  }
  const html = await fs.readFile(source, 'utf8');
  const { tokens, translatable } = tokenize(html);
  const groups = batches(translatable);
  console.log(`${path.basename(source)}: ${translatable.length} text segments in ${groups.length} batches`);
  for (let index = 0; index < groups.length; index += 1) {
    const translated = await translateBatch(groups[index]);
    for (const item of translated) tokens[item.index] = item.text;
    console.log(`  translated ${index + 1}/${groups.length}`);
  }
  let output = tokens.join('');
  output = output.replace(/<html([^>]*)\blang=["'][^"']*["']/i, '<html$1lang="en"');
  if (!/<html[^>]*\blang=/i.test(output)) output = output.replace(/<html([^>]*)>/i, '<html$1 lang="en">');
  output = polishEnglish(output);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.writeFile(destination, output, 'utf8');
}
