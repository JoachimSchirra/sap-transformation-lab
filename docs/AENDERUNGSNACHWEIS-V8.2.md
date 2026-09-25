# Änderungsnachweis V8.2 Security Hardening

Basis ist das eingefrorene V8.1-Quellpaket. V8.1 wurde nicht überschrieben. V8.2 verändert keine fachliche Gate-Aussage und kein Grunddesign.

| Finding | Ursachenbehebung in V8.2 | Automatischer Nachweis | Status Entwickler |
|---|---|---|---|
| S-01 / H02 | Strukturierte Redaktionsdaten dürfen kein aktives Markup/Liquid enthalten; untrusted Markdown führt kein Liquid aus; Textsinks escaped; interne/HTTPS-URL-Allowlist | Gate-Script-, Entity-URL-, Liquid- und HTML-Negativtests in `security-regression.mjs`; Preview-/Single-File-Prüfung | lokal umgesetzt |
| S-02 / M03 | Analyticswerte streng typisiert, Provider/Token schematisiert, Template schreibt nur literales `true`/`false` | Configtyp-, URL- und Attributregression; Produktionspreflight | lokal umgesetzt; Aktivierung extern gesperrt |
| S-03 / H01 | Ausschließlich vier explizite Ausgabeziele; jede existierende Pfadkomponente symlink-/realpathgeprüft; Layout-Allowlist, Zyklen- und Tiefengrenze | Traversal-, Root-, Dateiendungs- und Symlink-Sentineltests | lokal umgesetzt |
| S-04 / H03 | Strict-YAML ohne Aliase/Duplikate/Sonderkeys; Null-Prototyp-Kopie, Overlay-Allowlist und eigene boolesche Freigabewerte | `__proto__`, Duplicate-Key, String-Boolean und unbekannter Overlaykey | lokal umgesetzt |
| S-05 / H04 | Direkte CMS-Uploads entfernt; CMS speichert nur Derivatpfade; öffentliche redaktionelle SVGs verboten; Magic-Byte-, Größe-, Datei- und Symlinkprüfung | Inhaltsvalidator und Medienregression | lokal umgesetzt |
| S-06 / M07 | Vollständige Medienvorprüfung, Staging, kontrollierter Austausch und Entfernung zurückgezogener Derivate | Kollisions-, Atomaritäts- und Rücknahmetest | lokal umgesetzt |
| S-07 / H06 | Alle Workflowdateien strukturiert geparst; direkte Actions SHA-gepinnt; Lychee-Release-Download durch lokalen Linkchecker ersetzt; Node/Runner fixiert | YAML-Kurzform `- uses: ...@main` muss scheitern; Audit | lokal soweit kontrollierbar; Jekyll-Herstellercontainer extern |
| S-08 / H05 | CODEOWNERS auf Security-, Template-, Config-, Daten- und Paketdateien erweitert; Checkout-Credentials deaktiviert; Schreibrechte nur Deployjob | Workflow-YAML und Pinningtest | Quellanteil umgesetzt; GitHub-Regeln extern |
| S-09 / M01/M04 | `published:false` aus Preview, `site.pages` und Single-File entfernt; `noindex` auch aus Suche, mit `sitemap:false`-Pflicht | echte unveröffentlichte Fixture wird gebaut und auf Abwesenheit geprüft | lokal umgesetzt |
| S-10 / M02 | Builder und Validator leiten fehlenden Permalink identisch aus Dateipfad ab; neue redaktionelle Seiten ohne Liquid/HTML | Preview und Inhaltsvalidator | lokal umgesetzt; echtes CMS-E2E extern |
| S-11 / M06 | Freigaben besitzen strikte Typen, Datum und geprüften Commit; Platzhalter/Testdatum bleiben harte Produktionssperren | positiver synthetischer Configtest und realer blockierter Produktionspreflight | lokal umgesetzt; Rechtsprüfung extern |
| S-12 | Limits für Datei-/Inhaltsanzahl, Einzelgröße, Medienpixel, Layouttiefe sowie CI-/Serverzeit; sichtbare Komponentenfehler | Zyklus-/Größenlogik, Syntax- und Regressionstests | lokal umgesetzt |
| S-13 | Gate-/Latest-Routen und X-Ray-Evidence-IDs werden gegen vollständigen Referenzbestand validiert; Suche nutzt Seiteninhalt | UNKNOWN-99-Negativtest und Baselinevalidator | lokal umgesetzt |
| S-14 | Plattformgrenze und notwendige Live-Headerprüfung wahrheitsgetreu dokumentiert; kein unwirksamer Meta-Header behauptet | Dokumentationsreview | externes Hostinggate |
| S-15 / M05 | Single-File-Validator prüft aktuelle Datenattribute, alle Medienressourcen und AVIF; lokaler Linkchecker, sichere Installation, Timeouts, Rollbackregeln und Releaseevidenz dokumentiert | Preview-/Single-File-/Syntax-/Auditstrecke | lokaler Anteil umgesetzt; GitHub/Browser/Rollback extern |

## H01–H06 und M01–M07

Die technischen Ursachen von H01–H04, M01–M05 und M07 wurden lokal bearbeitet. H05/H06 und M06 enthalten zusätzlich unvermeidbare Betreiber- beziehungsweise Herstellergrenzen. Diese werden nicht als geschlossen behauptet, bevor Branch-/Environment-Schutz, echter Jekyll-/Browserlauf, Rechtstexte, CMS-Lebenszyklus und unabhängiger Retest belegt sind.

## Originalauftrag A–N

- A/I/J: gemeinsames Veröffentlichungsmodell, sichere CMS-Textgrenze, konsistenter Permalink und Medienprozess.
- B/C/L: Referenzgraph und Status-/Evidence-Prüfungen verschärft; fachliche Abnahmen bleiben Betreiberaufgabe.
- D/M: vorhandenes progressives und responsives Design bewahrt; sichtbare JS-Fehlerfallbacks ergänzt; reale WCAG-/Geräteprüfung bleibt offen.
- E/F/K: `noindex`/Suche/Sitemap synchronisiert, Analytics und Produktion streng gesperrt; Recht/Datenschutz bleiben extern.
- G/H/N: CI-, Pfad-, Config-, Supply-Chain-, Ressourcen-, Rollback- und Nachweisdokumentation gehärtet.

Dieser Änderungsnachweis ist ein Entwicklernachweis, keine unabhängige Freigabe.
