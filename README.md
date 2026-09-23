# evaris-scroll

Site Evaris Consulting în română și engleză. Versiunea de pe domeniul temporar este accesibilă public; conectarea domeniului evaris.ro este încă în așteptare.

URL de previzualizare: https://evaris.vicentiu-cio-9987.chatgpt.site
Versiunea EN: https://evaris.vicentiu-cio-9987.chatgpt.site/en/

Cele trei zone principale sunt prezentarea, serviciile SSM și SU/PSI, respectiv colaborarea și contactul. Imaginile, fonturile și componentele de interfață sunt comune ambelor limbi. Fonturile sunt găzduite local; licențele sunt în `dist/fonts`.

## Structură și funcționare

- `dist/index.html`, `dist/en/index.html`: paginile RO/EN.
- Paginile noi din `dist/`: servicii SSM și PSI în București, evaluarea riscurilor, prețuri și ghid SSM pentru firme noi, fiecare și în engleză.
- `dist/exemple/`, `dist/en/examples/`: versiunile în română și engleză ale celor trei exemple pentru postul de mecanic agricol.
- `dist/style.css`, `dist/app.js`: stiluri și comportamente comune.
- Trei imagini originale WebP, descrise în `ASSETS.md`.
- Meniu adaptat ecranului, închidere cu Escape, gestionarea focusului și resetare la redimensionare.
- Animații de apariție și parallax, bandă continuă cu pauză și respectarea preferinței pentru mișcare redusă.
- Formularul validează datele și pregătește un mesaj verificabil, cu deschidere în e-mail sau copiere. Nu trimite automat e-mailuri și nu pretinde că mesajul a fost expediat. Cererea în lucru se transferă temporar în aceeași filă când se schimbă limba.
- Întrebări extensibile și dialog de confidențialitate.

Sunt incluse evaluarea riscurilor profesionale, instrucțiunile proprii SSM și planul de prevenire și protecție pentru postul de mecanic agricol. PDF-ul certificatului de abilitare nu este inclus; mențiunea abilitării este păstrată fără descărcare.

Site static fără compilare. `.openai/hosting.json` indică directorul publicabil `dist`. Directiva `noindex` rămâne activă până la conectarea evaris.ro și lansarea oficială; altfel Google nu poate indexa paginile noi. Domeniile și redirecționările existente nu au fost modificate în această actualizare.

## Verificare

```sh
node --check dist/app.js
node tests/language-parity.mjs
python3 -m http.server 4173 --directory dist
# În alt terminal, cu Playwright și Chromium disponibile:
node tests/browser-validation.cjs
```

Testul de browser acceptă `EVARIS_TEST_URL`, `EVARIS_QA_DIR` și `EVARIS_BROWSER_PATH`. Verifică ambele limbi la lățimi de 320–1440 px, navigarea mobilă, animațiile, imaginile, formularul, copierea și mișcarea redusă. Nu expediază mesaje. Identitatea pixel cu pixel a textelor traduse nu este necesară: lungimea traducerii poate schimba rândurile.
