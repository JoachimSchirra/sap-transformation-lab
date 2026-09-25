# Änderungsnachweis V8.2.1 Security Hardening

Stand: 25.09.2026. Basis ist ausschließlich der unabhängig geprüfte, eingefrorene V8.2-Quellstand. V8.2 und V8.1 wurden nicht überschrieben. V8.2.1 verändert weder Gestaltung noch fachliche Gate-Aussagen.

| Retest-Finding | Ursachenbehebung in V8.2.1 | End-to-End-Nachweis | Entwicklerstatus |
|---|---|---|---|
| V82-R01 (High) | `marked` tokenisiert sämtliche Markdown-Link- und Bildformen. Inline-, Referenz- und Autolinks erreichen dieselbe Entity-dekodierende URL-Allowlist; der Builder prüft auch das nach Liquid gerenderte Markdown vertrauenswürdiger Templates. | Untrusted Referenzlink `[Text][audit]` mit `java&#x73;cript:` muss in Inhaltsvalidator und Preview-Builder scheitern. | lokal umgesetzt |
| V82-R02 (Medium) | Gemeinsames Front-Matter-Schema erzwingt echte Booleans für `published`, `noindex`, `search_exclude` und `sitemap` in Validator und Builder. | Jeder der vier Stringwerte wird einzeln in einer realen Markdown-Seite gegen beide Gates geprüft und abgewiesen. | lokal umgesetzt |
| V82-R03 (Medium) | Gemeinsamer Public-Medienvalidator bindet `assets/images/generated` vollständig an `manifest.json`, erlaubt nur reguläre WebP-/AVIF-Derivate, decodiert jedes Bild mit Pixelgrenzen und verbietet EXIF-, ICC-, IPTC- und XMP-Metadaten. Validator und Builder verwenden dieselbe Schranke. | Direktes JPEG mit Metadaten und Front-Matter-Referenz, nicht decodierbares Manifestderivat sowie manifestiertes WebP mit EXIF/ICC müssen in beiden Gates scheitern; echte Optimiererderivate bestehen dieselbe Prüfung. | lokal umgesetzt |
| V82-R04 (Medium) | Der verpflichtende Einzeldatei-Validator erkennt CSS-`@import` zusätzlich zu `url(...)`, externen Stylesheets, Skripten und Medienquellen. | String-, quoted-`url()`- und unquoted-`url()`-Import werden jeweils in Preview und Einzeldatei gebaut und anschließend vom Offline-Gate abgewiesen. | lokal umgesetzt |
| V82-R05 (Medium) | Produktionsfreigaben verlangen reale UTC-Kalenderdaten. Security- und Legal-SHA müssen übereinstimmen und exakt dem explizit übergebenen `GITHUB_SHA` beziehungsweise `LLSG_EXPECTED_RELEASE_COMMIT` entsprechen. | Gültige commitgenaue Konfiguration besteht; `2026-02-31`, voneinander abweichende Review-SHAs und ein anderer erwarteter Releasecommit scheitern. | lokal umgesetzt; echte Freigabe extern |

Die Regressionen verändern für die neuen End-to-End-Fälle ausschließlich eine temporäre Projektkopie und entfernen diese nach erfolgreichem Lauf. Damit bleiben Quellbaum, Public-Medienbestand und Vorschauartefakte frei von Testfixtures.

Dieser Nachweis ist eine Entwicklererklärung, keine unabhängige Freigabe.
