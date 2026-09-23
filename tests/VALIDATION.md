# Validare Evaris — 19 septembrie 2026

Versiunea locală a fost verificată în Chromium 151 cu Playwright. Rezultat: PASS.

## Interfață RO/EN

- 18 cazuri: română și engleză la 320, 375, 390, 720, 760, 1000, 1024, 1280 și 1440 px.
- Fără depășirea orizontală a viewportului.
- Aceleași trei imagini, aceleași dimensiuni măsurate și aceleași reguli de decupare RO/EN la fiecare lățime.
- Fonturile locale sunt încărcate. Structura HTML și stilurile sunt comune; traducerile pot ocupa un număr diferit de rânduri.
- Capturi vizuale inspectate pentru prezentarea desktop, SSM digital RO/EN și mobil.

## Interacțiuni

- Apariția conținutului la scroll și efectele parallax.
- Două grupuri identice în banda animată; lățimea pistei este dublul unui grup. Pauza și reluarea funcționează.
- Meniul mobil se deschide, se închide cu Escape și la selectarea unui link și se resetează când ecranul trece la desktop; pagina de dedesubt redevine interactivă.
- Ancorele, schimbarea limbii și păstrarea cererii în lucru funcționează.
- Formularul respinge datele incomplete, pregătește textul și un mailto corect către office@evaris.ro; copierea a fost verificată. Nu a fost expediat niciun e-mail. Livrarea efectivă depinde de aplicația de e-mail a vizitatorului.
- Întrebările extensibile și dialogul de confidențialitate funcționează.
- Preferința de mișcare redusă oprește animațiile și lasă conținutul vizibil.
- Fără erori JavaScript în testele de browser.

## Conținut și acces

- Secțiunea „Exemple” publică în română și engleză evaluarea riscurilor, instrucțiunile proprii SSM și planul de prevenire și protecție pentru mecanic agricol. Fiecare pagină lingvistică deschide documentele în limba selectată. PDF-ul certificatului de abilitare nu este inclus.
- Evaluarea riscurilor este păstrată numai ca serviciu, nu ca exemplu de document.
- Politica de acces a fost restrânsă la proprietar. Accesul HTTP fără autentificare a returnat 401 înaintea încărcării versiunii noi.
- Domeniile și regulile de redirecționare existente nu au fost schimbate.

Verificări de cod: `node --check dist/app.js`, `node tests/language-parity.mjs`, `git diff --check`.
