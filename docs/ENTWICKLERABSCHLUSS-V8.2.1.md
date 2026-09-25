# Entwicklerabschluss V8.2.1 Security Hardening

Datum: 25.09.2026  
Ausgangsbasis: unabhängig geprüfter V8.2-Releasekandidat  
Zielversion: `8.2.1`  
Rolle: Entwicklernachweis, **keine unabhängige Release- oder Produktionsfreigabe**

## Ergebnis

Die fünf im unabhängigen V8.2-Retest verbliebenen Codefindings V82-R01 bis V82-R05 wurden an ihren Ursachen bearbeitet. Die Korrekturen gelten gemeinsam in Inhaltsvalidator, Preview-Builder, Medieninventar, Einzeldatei-Gate und Produktionspreflight. Für jede unabhängige Reproduktion existiert eine positive beziehungsweise negative End-to-End-Regression. Es wurden keine finalen ZIPs erzeugt und keine GitHub-, Rechts-, CMS-, Browser- oder Betreiberfreigaben behauptet.

Die genaue Zuordnung steht in `docs/AENDERUNGSNACHWEIS-V8.2.1.md`; die Laufresultate stehen in `docs/PRUEFMATRIX-V8.2.1.md`.

## Finding → Änderung → Test

| Finding | Änderung | Test |
|---|---|---|
| V82-R01 | vollständige Markdown-Tokenprüfung und dekodierende URL-Allowlist; Prüfung nach Template-Rendering | Referenzlink mit Entity-kodiertem aktivem Schema scheitert in Validator und Builder |
| V82-R02 | gemeinsames striktes Boolean-Schema für vier Publikations-/Indexfelder | vier einzelne Front-Matter-End-to-End-Fixtures scheitern in Validator und Builder |
| V82-R03 | Decoder-, Dimensions-, Metadaten- und Manifestpflicht für jedes Public-Derivat | direktes JPEG, defektes Derivat und Metadaten-WebP scheitern; Optimiererderivate bestehen |
| V82-R04 | CSS-`@import`-Sperre für String- und `url()`-Syntax | drei gebaute Einzeldateien mit Netzimport scheitern am Offline-Validator |
| V82-R05 | reale Kalenderdaten und exakte Bindung beider Reviews an erwarteten Releasecommit | unmögliches Datum, divergente SHAs und stale Commit scheitern; exakter Commit besteht |

## Lokale Abschlusskontrollen

- `npm ci --ignore-scripts`: Exit 0, 161 installierte Pakete; erwartete Engine-Warnung wegen lokaler Node-/npm-Version;
- `npm audit --include=dev --package-lock-only --ignore-scripts --json`: Exit 0, 0 bekannte Advisories, 182 Dependencies;
- `npm run media`: Exit 0, 0 Bildsätze in der Baseline;
- `npm run validate`: Exit 0, 117 Dateien, 38 Routen, 5 Gates, 9 Evidence, 0 Issues und eine erwartete Gate-2-Datumswarnung;
- `npm run test:security`: Exit 0 einschließlich der fünf neuen isolierten End-to-End-Negativstrecken;
- `npm run preview`: Exit 0, 38 Routen;
- `npm run preview:single`: Exit 0, 38 Routen, 1.007.497 Byte;
- `npm run validate:preview`: Exit 0, HTML ohne Meldung, Single-File-Validator 0 Issues;
- lokaler Linktest gegen den inhaltsgleichen Preview-Testbaum: 48 Dateien, 0 Issues;
- `node --check` für sämtliche Tool- und Website-JavaScriptdateien: bestanden;
- Strict-YAML-Parsing von CMS, Dependabot, beiden Workflows und beiden Jekyll-Konfigurationen: 6 Dateien bestanden;
- `npm run validate:production`: erwartungsgemäß Exit 1 mit 12 sachlichen Sperren.

## Ausschließlich externe Restgates

1. unabhängiger Retest des unveränderten V8.2.1-Quellstands und später der daraus erzeugten, neu gehashten Pakete;
2. echter GitHub-Actions-/Jekyll-Lauf unter Node 22.20.0/npm 10.9.3 einschließlich `_site`, Linktest, axe und Lighthouse;
3. Repository-Rules, Required Checks, CODEOWNERS-Wirkung, Admin-/App-Bypässe, Fork-/Dependabot-Verhalten und geschütztes `github-pages`-Environment;
4. semantischer Pages-CMS-Lebenszyklus sowie reale Medien-/Screenshotfreigabe;
5. Desktop-/iPhone-/Android-, 320-px-, 400-%-Zoom-, Tastatur- und Screenreadertests;
6. echte Rechtstexte, Datenschutz-, Analytics-, Kontakt-, Namens-, Evidence- und Gate-2-Datumsfreigaben;
7. Live-HTTPS-/Header-/CSP-/Framing-/Netzwerkprüfung und praktische Rollbackübung;
8. transitive Hersteller-/Action-Abhängigkeiten außerhalb des Root-Lockfiles.

Entwicklerstatus: **zur erneuten unabhängigen technischen Revision bereit; nicht produktionsfreigegeben**.
