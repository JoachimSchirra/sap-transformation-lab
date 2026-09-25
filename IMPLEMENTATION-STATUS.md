# Implementierungsstatus V8.5.1

Letzte Aktualisierung: 25.09.2026

## Stand

V8.5.1 übernimmt die in V8.4 konsolidierte Informationsarchitektur und ergänzt die zurückhaltende persönliche Einordnung des Initiators sowie eine eindeutige Impressumssperre. Prozesse und Lösungsdesign, Build und Roadmap sowie Test und Nachweise bleiben als eigenständige Besucheraufgaben getrennt. Eine unabhängige Releasefreigabe und die öffentliche Produktionsfreigabe sind nicht Bestandteil dieses Entwicklerstands.

## Umgesetzt

- Joachim Schirra als realer Initiator, Builder, Autor und Ansprechpartner
- LLSG und ihre Figuren klar als fiktive Modellwelt gekennzeichnet
- Matthias „Matze“ Reuter ersetzt die missverständliche Persona „Aktivrentner Joachim“
- eigenständige Seiten für Profil, Kontakt, Impressum und Datenschutz
- zentraler Projektstatus, Gate-Roadmap, Evidence Register, X-Ray und „Neu im Lab“
- verlinkte Kompetenzkacheln auf der Startseite mit eindeutigen Zielseiten
- eigenständiger Bereich Business & Process Design
- getrennte LLSG-Gesamtroadmap und interaktive P2P-Gate-Roadmap
- eigenständiger Navigationsbereich Test & Nachweise
- Build Journal mit datierten Arbeits-, Korrektur- und Meilensteineinträgen
- scroll- und tastaturbedienbarer Gate-Navigator mit statischem Fallback
- projektbezogene Kompetenzdarstellung und Glaubwürdigkeitsstreifen ohne Karriere-CTA
- kompaktes Autorenmodul auf „Über das Lab“ mit verlinkter, redaktionell pflegbarer Profilseite
- datengetriebene Listen für Personen, Produkte, Stories, Journal und Evidence
- Pages-CMS-Schema mit redaktionellen Feldern; direkte Medienuploads sind gesperrt und technische Templatepfade über CODEOWNERS gekennzeichnet
- suchmaschinenlesbare Metadaten, Open Graph, strukturierte Daten, Sitemap und Robots-Steuerung
- zugängliche Navigation, Suche, Filter, Tabs und Lightbox
- responsive Darstellung ohne globales Verbergen horizontaler Layoutfehler
- Bildoptimierer mit WebP-/AVIF-Derivaten und Größenstufen
- Inhalts-, HTML-, Link-, Accessibility- und Lighthouse-Prüfstrecke
- dynamischer strukturierter Vorschaubuilder ohne fest verdrahtete Routen; der vorhandene Ein-Datei-Builder gehört nicht zum V8.5.1-Lieferumfang
- manuelle, hart gesperrte Produktionsveröffentlichung
- dedizierte Ausgabe-Allowlist sowie Symlink-/Realpfadgrenzen für Vorschau-, Ein-Datei-, Medien- und Serve-Builder
- nicht veröffentlichter und nicht versionierter Quellordner für Originalmedien
- keine Liquid-Ausführung und kein rohes HTML in untrusted redaktionellen Seiten; URL-Allowlist und kontextsichere Ausgabe
- konsequentes Escaping redaktionell pflegbarer Metadaten und Datenfelder
- vollständiger lokaler `npm audit` vom 25.09.2026 ohne zu diesem Zeitpunkt bekannte Registry-Advisories
- auf vollständige Commit-SHAs fixierte GitHub Actions
- lokale Preview-/Single-File-/Security-Gates zusätzlich im Quality- und Deployworkflow
- getrennte Least-Privilege-Berechtigungen für Build und Deploy

## Lokal validiert

- 42 automatisch entdeckte Inhaltsrouten
- 42 gerenderte Routen plus Vorschau-Einstieg
- keine lokalen Inhaltsmodell-, Vorschau-HTML- oder Linkfehler; Jekyll-Linkprüfung bleibt bis GitHub extern offen
- JavaScript- und CSS-Grundprüfungen erfolgreich
- keine veralteten öffentlichen Nutrition-, Nahrungsergänzungs- oder Rejuvena-Inhalte

## Bewusst blockiert oder offen

- Gate-2-Testdatum ist mit 19.09.2026 bestätigt
- Originale SAP-Screenshots und Medien müssen redaktionell freigegeben werden
- das Impressum ist noch nicht vollständig; die Datenschutzhinweise müssen vor einer öffentlichen Freigabe gegen das tatsächliche Betriebsmodell abschließend bestätigt werden
- öffentliche Freigabe ist nicht erteilt
- Pages CMS, Analytics und Kontaktformular sind nicht aktiviert
- echter Jekyll-/GitHub-Actions-Lauf, CMS-Lebenszyklus sowie reale Browser-, Screenreader-, axe-, Lighthouse- und Zielgeräteprüfungen sind extern offen
- Branch-/Environment-/Pages-Regeln und unabhängiger Retest sind extern offen
- der transitive, tagbasierte Container der gepinnten Jekyll-Action bleibt ein dokumentierter Hersteller-Vertrauensanteil

`npm run validate:production` muss deshalb derzeit fehlschlagen. Das ist eine beabsichtigte Schutzfunktion, kein Defekt.

## Fortsetzungspunkt

1. `npm ci --ignore-scripts`
2. `npm run validate`
3. `npm run preview && npm run validate:html && LLSG_LINK_SITE=_preview npm run check:links`
4. visuellen und unabhängigen Retest des V8.5.1-Stands durchführen
5. GitHub-Qualitätsworkflow prüfen
6. Repository-Regeln und `github-pages`-Environment gemäß Sicherheitsdokument aktivieren
7. erst nach Abarbeitung der Produktionssperren `_config.production.yml` einschließlich der commitbezogenen Security-/Legal-Nachweise freigeben
