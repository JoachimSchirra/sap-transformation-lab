# Entwicklerabschluss V8.2 Security Hardening

Datum: 25.09.2026  
Ausgangsbasis: eingefrorene V8.1-Quelle  
Zielversion: `8.2.0`  
Rolle: Entwicklernachweis, **keine unabhängige Releasefreigabe**

## Ergebnis

Alle lokal behebbaren Ursachen der Drittprüfungsfindings S-01 bis S-15 wurden bearbeitet und mit positiven beziehungsweise negativen Regressionen versehen. Das bestehende Design und die fachlichen Inhalte wurden nicht neu konzipiert. V8.1 und seine Lieferpakete wurden nicht verändert. Es wurden bewusst noch keine finalen V8.2-ZIP-Pakete erzeugt.

Die detaillierte Finding-Zuordnung steht in `docs/AENDERUNGSNACHWEIS-V8.2.md`, die aktuelle Evidenz in `docs/PRUEFMATRIX-V8.2.md`.

## Wesentliche technische Änderungen

1. gemeinsame strikte YAML-/Konfigurationsgrenze mit Duplicate-/Alias-/Prototype-Sperren, Overlay-Allowlist und exakten Typen;
2. dedizierte Ausgabeverzeichnisse, Realpfad-/Symlink-Kontrolle, sichere Routen und Layout-Allowlist mit Zyklus-/Tiefengrenze;
3. keine Liquid-Ausführung und kein rohes HTML in untrusted redaktionellen Seiten, URL-Allowlist sowie Escape der strukturierten Ausgaben;
4. konsistente `published`, `noindex`, Suche, Sitemap und abgeleitete Permalinks;
5. vollständiger Gate-/Latest-/X-Ray-/Evidence-Referenzgraph;
6. CMS-Direktupload deaktiviert und atomare, bereinigende Medienpipeline mit Format-/Datei-/Ressourcenkontrolle;
7. strukturierte Pinningkontrolle über alle Workflows, enger fixierte Laufzeiten, sichere Installation, Timeouts und lokaler Linkchecker statt eines unkontrollierten Release-Binary-Downloads;
8. Single-File-Prüfung auf dem tatsächlichen Data-Attribute-Format einschließlich AVIF und Offline-Ressourcen;
9. sichtbare Fehlerfallbacks für defekte interaktive Daten und erweiterte Betriebs-/Rollbackdokumentation.

## Finding → Änderung → Test

| Findings | Änderung | Testbeleg |
|---|---|---|
| S-01/S-02 | `content-security.mjs`, Escapes, Runtime-Config, Analyticsliteral | aktive Gate-Daten, Entity-URL, Liquid/HTML, String-Boolean |
| S-03 | `safe-paths.mjs`, Layoutgrenzen | Root/Elternpfad/Traversal/Symlink-Sentinel |
| S-04/S-11 | `secure-config.mjs`, Produktionspreflight | `__proto__`, Duplicate Keys, unbekannter Key, synthetisch gültige Freigabe, reale Sperre |
| S-05/S-06 | `.pages.yml`, `optimize-images.mjs` | Kollision vor Ausgabe, atomarer Austausch, Rücknahme, Symlink-/Formatsperre |
| S-07/S-08 | Workflowparser, CODEOWNERS, Credentials/Permissions, Laufzeitfixierung | alle YAML-`uses`, Kurzform `@main`, statische Workflowprüfung |
| S-09/S-10 | gemeinsamer Routen-/Publikationspfad | echte `published:false`-Fixture fehlt in Preview; Permalinkableitung |
| S-12 | Limits, Zyklen, Timeouts, sichtbare JS-Fallbacks | Sicherheitsregression, Syntaxprüfung; Browserverhalten extern |
| S-13 | vollständige Referenzprüfung | UNKNOWN-99 und tote Routen scheitern |
| S-14 | ehrliche Plattform-/Headergrenze | Dokumentationskontrolle; Liveheader extern |
| S-15 | Preview-/Single-/Link-/Rollback-/Betriebsnachweise | HTML, Single-File, Audit, Syntax; GitHub/Browser/Rollback extern |

## Lokal ausgeführte Abschlusskontrollen

Abschlusslauf am 25.09.2026 in der bereitgestellten Umgebung:

- `npm ci --ignore-scripts`: Exit 0, 161 Pakete installiert; lokaler Lauf unter Node 24.19.0/npm 11.9.0 meldete erwartungsgemäß eine Engine-Warnung, weil CI bewusst Node 22.20.0/npm 10.9.3 verlangt;
- vollständiger Lockfile-Audit einschließlich Dev-Abhängigkeiten: Exit 0, **0** bekannte info/low/moderate/high/critical Advisories zum Prüfzeitpunkt, 182 Dependencies;
- `npm run validate`: Exit 0, 113 geprüfte Projektdateien, 38 Routen, 5 Gates, 9 Evidence-Einträge, 0 Issues, 1 erwartete Warnung zum noch unbestätigten Gate-2-Testdatum;
- `npm run test:security`: Exit 0; positive Baseline und negative Fixtures für aktive Gate-Daten, Entity-/aktive URLs, redaktionelles Liquid/HTML, `published:false`, unbekannte Evidence, `__proto__`, Duplicate Keys, String-Booleans, unbekannte Overlaykeys, Workflow-Kurzsyntax, Traversal/Symlink-Sentinel sowie Medienkollision/Atomarität/Rücknahme;
- `npm run media`: Exit 0, 0 Quellbilder in der Baseline, atomarer leerer Manifeststand;
- `npm run preview`: Exit 0, 38 Routen;
- `npm run preview:single`: Exit 0, 38 Routen, 1.007.497 Bytes;
- `npm run validate:preview`: Exit 0; `html-validate` ohne Meldung, Single-File-Validator 0 Issues;
- lokaler Linkchecker gegen den inhaltsgleichen Preview-Testbaum: 48 Dateien, 0 Issues;
- `node --check` für sämtliche Tool- und Website-JavaScriptdateien sowie YAML-Parsing der CMS-, Jekyll-, Dependabot- und Workflowkonfiguration: bestanden;
- `npm run validate:production`: erwartungsgemäß blockiert; 11 Sperren für Freigaben/Reviewdaten, Gate-2-Testdatum und sichtbare Platzhalter.

SHA-256 des lokal erzeugten, **nicht final ausgelieferten** Ein-Datei-Testartefakts: `3551e9655c2be11cc0aa094645f365306225734c0d4b14b2ca100da316ce0a99`. Nach jeder weiteren Änderung ist dieser Wert hinfällig. Der echte Node-22-/Jekyll-/axe-/Lighthouse-Lauf bleibt extern.

## Ausschließlich externe Restgates

- unabhängiger Retest des unveränderten V8.2-Quellstands und spätere Prüfung der daraus erzeugten Pakete;
- echter GitHub-Actions-Lauf unter Node 22.20.0 mit offiziellem Jekyll-Container, `_site`-Linkprüfung, axe und Lighthouse;
- tatsächliche Repository Rules, Required Checks, CODEOWNERS-Wirkung, Admin-/App-Bypässe, Fork-/Dependabot-Verhalten, Pages-Quelle und `github-pages`-Environment-Reviewer;
- semantischer Pages-CMS-Lebenszyklus: Anlage, Änderung, Rücknahme, Löschung und Medienreferenz;
- Desktop/iPhone/Android, 320 px, 400 % Zoom, Tastatur, VoiceOver/NVDA und reale Kerninteraktionen;
- echte Rechtstexte, Datenschutz-/Analytics-/Kontaktfreigabe, Namensabgrenzung, Gate-2-Testdatum sowie veröffentlichungsfähige Screenshots;
- Live-HTTPS-/Header-/CSP-/Framingprüfung auf der gewählten Hostingstrecke;
- Rollbackübung auf einen weiterhin sicherheitskonformen Commit;
- bewusste Betreiberentscheidung zum nicht digestfixierten internen Herstellercontainer von `actions/jekyll-build-pages`.

Bis diese Gates nachgewiesen und die unabhängige Schlussprüfung positiv ist, lautet der Entwicklerstatus: **technisch zur unabhängigen Revision bereit, nicht produktionsfreigegeben**.
