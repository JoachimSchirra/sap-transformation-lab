# SAP Transformation Lab · Website V8.5.1

Eine statische, redaktionell pflegbare GitHub-Pages-Website für das unabhängige SAP-Transformationslabor von Joachim Schirra und die fiktive Modellfirma **Long Life Sciences GmbH (LLSG)**.

## Architektur

- Inhalte: Markdown und strukturierte JSON-Dateien
- Darstellung: Jekyll-Layouts, Includes sowie `assets/css/main.css`
- Verhalten: progressives JavaScript in `assets/js/main.js`
- Redaktion: vorbereitete Pages-CMS-Konfiguration in `.pages.yml`
- Qualität: Inhalts- und Sicherheitsvalidator, HTML-Validierung, Linkprüfung, axe und Lighthouse CI
- Veröffentlichung: gesonderter, manuell gestarteter Produktionsworkflow
- Lieferkette: Lockfile, vollständiger Dependency-Audit und direkte GitHub Actions auf vollständigen Commit-SHAs; indirekte Hersteller-Container bleiben als externer Vertrauensanteil dokumentiert

Portfolio-Roadmap, Gate-Roadmap, Projektstatus, Nachweisregister, X-Ray und der Bereich „Neu im Lab“ besitzen jeweils zentrale Datenquellen unter `_data/`. Getestete Ergebnisse und öffentlicher Nachweisstatus werden getrennt geführt. V8.5.1 baut auf dem Sicherheitsstand V8.2.2 und der inhaltlichen Konsolidierung V8.4 auf. Das persönliche Profil ist bewusst über „Über das Lab“ erreichbar und wird nicht als konkurrierender Hauptnavigationspunkt geführt.

## Rollen und Fiktion

**Joachim Schirra** ist der reale Initiator, Builder, Autor und Ansprechpartner. Die LLSG, ihre Produkte und alle Figuren – einschließlich Matthias „Matze“ Reuter – gehören zur fiktiven Modellwelt. Dieser Unterschied ist auf der Website ausdrücklich gekennzeichnet.

## Lokale Qualitätsvorschau ohne Ruby

```bash
npm ci --ignore-scripts
npm run validate
npm run test:security
npm run preview
npm run validate:html
```

- `_preview/` enthält die strukturierte lokale Vorschau.
- V8.5.1 wird ausschließlich als strukturiertes GitHub-Quellpaket ausgeliefert; eine Ein-Datei-Gesamtvorschau ist nicht Bestandteil dieses Releases.
- Für die strukturierte Vorschau einen lokalen Webserver verwenden.

## GitHub-Pages-Build

Der Pages-Build verwendet in GitHub Actions eine auf einen vollständigen Commit-SHA fixierte Revision von `actions/jekyll-build-pages`. Deren internes Hersteller-Container-Tag ist nicht digestfixiert und wird deshalb ausdrücklich nicht als bitgenau reproduzierbar bezeichnet. Die lokale Vorschau wird mit `npm run preview` erzeugt; der echte Jekyll-Build und die Browserprüfungen laufen erst im Qualitätsworkflow.

Der Workflow `Website quality` baut und prüft jeden Push nach `main` und jeden Pull Request. Der Workflow `Deploy approved production site` ist ausschließlich manuell startbar, prüft den aktuellen `main`-Stand nochmals vollständig und bleibt durch den Produktionsvalidator gesperrt, bis Inhalt, Rechtstexte, Security-Review und Freigaben vollständig sind.

## Sichere Medienbearbeitung

Unbearbeitete Originale werden nur lokal in `_media-source/` abgelegt. Dieser Ordner wird weder committed noch von Jekyll veröffentlicht. `npm run media` validiert alle Quellen vorab und tauscht danach die veröffentlichungsfähigen WebP-/AVIF-Derivate unter `assets/images/generated/` atomar aus. Direkte CMS-Dateiuploads sind deaktiviert; das CMS referenziert nur bereits erzeugte Derivate.

## Aktueller fachlicher Stand

- Gate 1A – First Purchase Order: getestet am 15.09.2026
- Gate 2 – Goods Receipt & Quality: getestet am 19.09.2026; öffentliche Originalnachweise sind vorbereitet, aber noch nicht veröffentlicht
- Gate 3 – Negative Quality Case: als nächster Schritt vorgesehen
- Gate 4 – Invoice Verification: geplant
- Gate 5 – Payment & Clearing: geplant

Die verbindlichen Daten stehen in `_data/gates.json` und `_data/project_status.json`.

## Wichtige Betriebsdokumente

- `docs/AENDERUNGSNACHWEIS-V8.5.1.md`
- `docs/AENDERUNGSNACHWEIS-V8.5.md`
- `docs/AENDERUNGSNACHWEIS-V8.4.md`
- `docs/DEPLOYMENT-UND-ROLLBACK.md`
- `docs/ENTWICKLERABSCHLUSS-V8.2.2.md`
- `docs/PRUEFMATRIX-V8.2.2.md`
- `docs/AENDERUNGSNACHWEIS-V8.2.2.md`
- `docs/ENTWICKLERABSCHLUSS-V8.2.1.md`
- `docs/PRUEFMATRIX-V8.2.1.md`
- `docs/AENDERUNGSNACHWEIS-V8.2.1.md`
- `docs/ENTWICKLERABSCHLUSS-V8.2.md`
- `docs/PRUEFMATRIX-V8.2.md`
- `docs/AENDERUNGSNACHWEIS-V8.2.md`
- `docs/MIGRATION-V7-ZU-V8.md`
- `docs/PRUEFMATRIX-V8.md`
- `docs/REDAKTIONSSYSTEM.md`
- `docs/REDAKTIONSCHECKLISTE.md`
- `docs/MEDIENPROZESS.md`

## Verbindlicher Fiktionshinweis

Long Life Sciences GmbH is a fictional company created exclusively for a private SAP S/4HANA learning and demonstration project. It does not manufacture, market or sell any real products or services and is not affiliated with any real-world company of the same or a similar name.
