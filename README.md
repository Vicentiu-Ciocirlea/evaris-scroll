# evaris-scroll

Site Evaris Consulting în română și engleză. Versiunea de pe adresa temporară are acces privat pentru proprietar și persoanele invitate; conectarea domeniului evaris.ro este încă în așteptare.

URL de previzualizare: https://evaris.vicentiu-cio-9987.chatgpt.site
Versiunea EN: https://evaris.vicentiu-cio-9987.chatgpt.site/en/

Cele trei zone principale sunt prezentarea, serviciile SSM și SU/PSI, respectiv colaborarea și contactul. Imaginile, fonturile și componentele de interfață sunt comune ambelor limbi. Fonturile sunt găzduite local; licențele sunt în `dist/fonts`.

## Structură și funcționare

- `dist/index.html`, `dist/en/index.html`: paginile RO/EN.
- Paginile noi din `dist/`: servicii SSM și PSI în București, evaluarea riscurilor, prețuri și ghid SSM pentru firme noi, fiecare și în engleză.
- `dist/exemple/`, `dist/en/examples/`: versiunile în română și engleză ale celor trei exemple pentru postul de mecanic agricol.
- `dist/style.css`, `dist/app.js`: stiluri și comportamente comune.
- Trei imagini originale WebP, descrise în `ASSETS.md`.
- Imaginea originală de fundal pentru pagina de evaluare a riscurilor, cu strat de contrast identic în RO și EN.
- Imaginea originală pentru pagina de prețuri, cu ofertă, calculator și bancnote, comună RO/EN.
- Imaginea originală pentru pagina de servicii SSM și PSI, comună RO/EN.
- Imaginea originală pentru ghidul SSM al unei firme noi, comună RO/EN.
- Imaginea originală de fundal pentru biblioteca legislativă, comună RO/EN.
- Meniu adaptat ecranului, închidere cu Escape, gestionarea focusului și resetare la redimensionare.
- Animații de apariție și parallax, bandă continuă cu pauză și respectarea preferinței pentru mișcare redusă.
- Formularul validează datele și pregătește un mesaj verificabil, cu deschidere în e-mail sau copiere. Nu trimite automat e-mailuri și nu pretinde că mesajul a fost expediat. Cererea în lucru se transferă temporar în aceeași filă când se schimbă limba.
- Întrebări extensibile și dialog de confidențialitate.
- Chat bilingv cu răspunsuri prestabilite, trimiteri către paginile Evaris și redimensionare prin tragerea marginilor. Întrebările sunt procesate local în browser, fără AI.

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

## Platforma de instruire — verificare 04/10/2026

Meniurile RO/EN includ „Platforma de instruire SSM/SU” / „OHS/Fire Safety Training Platform”, cu starea „În pregătire” / „In preparation”, fără href. Repository-ul `Vicentiu-Ciocirlea/platforma-instruire-ssm`, main `1035eb463e3994058da349aa2cd7747f6d742588`, nu conține o adresă publică de acces verificabilă; configurația Vite/API indică localhost, iar GitHub nu raportează deployments. Platforma este încă în lucru în chat-ul „Construiește platforma SSM/SU/PSI”. Lipsește publicarea platformei și confirmarea URL-ului HTTPS funcțional. După confirmare, înlocuiți intrarea indisponibilă în ambele limbi și în cele două generatoare de pagini cu un link către acea adresă.
