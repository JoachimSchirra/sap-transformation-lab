# Prüfmatrix V8.2.1

Stand: 25.09.2026. „Lokal bestanden“ bezeichnet nur den Entwicklerlauf im bereitgestellten Container unter Node 24.19.0/npm 11.9.0. Das Projekt fordert für CI Node 22.20.0/npm 10.9.3; der echte GitHub-/Jekyll-/Browserlauf bleibt extern.

| Bereich | Prüfung | Lokales Ergebnis | Externes Releasegate |
|---|---|---|---|
| Version | `package.json`/Lockfile | `8.2.1`, Lockfile synchron | unabhängiger Paket-/Hashvergleich |
| Inhalte | `npm run validate` | Exit 0; 117 Dateien, 38 Routen, 5 Gates, 9 Evidence, 0 Issues; erwartete Gate-2-Datumswarnung | echter Jekyll-Vergleich |
| Security | `npm run test:security` | Exit 0; alte Regressionen und V82-R01 bis V82-R05 positiv/negativ abgedeckt | unabhängiger Retest |
| Markdown-URLs | Referenzlink-Repro | Validator und Builder weisen Entity-kodiertes aktives Schema ab | echter Jekyll-Output erneut prüfen |
| Front Matter | vier Typfixtures | Stringwerte für `published`, `noindex`, `search_exclude`, `sitemap` jeweils abgewiesen | Pages-CMS-Lebenszyklus |
| Medien | `npm run media`, Inventar- und Pipelinefixtures | Exit 0; leere Baseline; Decoder-, Metadaten- und Manifestgrenze positiv/negativ grün | reale Bilder/CMS-Ablauf |
| Einzeldatei | drei CSS-Importformen sowie `validate:preview` | Offline-Negativfixtures abgewiesen; Baseline 38 Routen, 1.007.497 Byte, 0 Issues | Desktop-/iPhone-Funktionstest |
| Freigabebindung | Configregression/Produktionspreflight | Kalender- und SHA-Negativtests grün; reale Baseline erwartungsgemäß mit 12 Sperren blockiert | echte Security-/Legal-Freigabe für Releasecommit |
| Dependencies | vollständiger Lockfile-Audit | 0 bekannte Advisories aller Schweregrade; 182 Dependencies | zeitpunktbezogene Wiederholung/Dependabot |
| Syntax | `node --check` und YAML-Parsing | alle Tool-/Website-JavaScriptdateien und 6 maßgebliche YAML-Dateien bestanden | GitHub-Lauf unter geforderter Toolchain |
| Preview/HTML | `preview`, `preview:single`, `validate:preview` | 38 Routen; HTML ohne Meldung; Single-File 0 Issues | Browser-/Accessibility-/Lighthouse-Lauf |
| Links | lokaler Linktest auf inhaltsgleichem Preview-Testbaum | 48 Dateien, 0 Issues | echter `_site`-Linktest im GitHub-Workflow |

## Beabsichtigte Produktionssperre

`npm run validate:production` endet im Prototyp mit Exit 1. Offen sind Freigabeflags, ein expliziter erwarteter Releasecommit, Security-/Legal-Commit und reale Reviewdaten, das Gate-2-Testdatum sowie 20 sichtbare Platzhalter. Diese Sperren dürfen nicht durch erfundene Werte aufgehoben werden.
