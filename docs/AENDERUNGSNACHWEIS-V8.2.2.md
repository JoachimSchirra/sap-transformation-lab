# Änderungsnachweis V8.2.2 Security Hardening

Stand: 25.09.2026. Basis ist ausschließlich der unabhängig geprüfte V8.2.1-Quellstand. V8.2.1 und ältere Releases wurden nicht überschrieben. V8.2.2 bearbeitet ausschließlich V821-R01 und verändert weder Gestaltung noch fachliche Gate-Aussagen.

| Finding | Ursachenbehebung | End-to-End-Nachweis | Entwicklerstatus |
|---|---|---|---|
| V821-R01 (Medium) | Redaktionelle `image`-Felder akzeptieren nur WebP-/AVIF-Derivate unter `/assets/images/generated/`, die im verwalteten Manifest enthalten sind. Validator und Preview-Builder verwenden dieselbe Policy für Markdown-Front-Matter und Evidence-Daten. | Ein Front-Matter-Verweis auf `/assets/images/llsg-logo.png` wird trotz Markenasset-Allowlist von Validator und Builder abgewiesen. Ein real durch `npm run media` erzeugtes und manifestiertes WebP besteht beide Gates. | lokal umgesetzt |
| V821-R01 – feste Assets | Favicon, Logos und Social Preview liegen in einer unveränderlichen Pfad-/Format-/Abmessungs-/SHA-256-Allowlist. Jedes Asset wird vollständig decodiert, auf Pixelgrenzen und auf EXIF/ICC/IPTC/XMP geprüft. Nicht erlaubte Dateien unmittelbar unter `assets/images/` stoppen Validator und Builder. | Die fünf freigegebenen Assets bestehen die gemeinsame Inventarprüfung. Das zuvor nicht vollständig decodierbare, ungenutzte `llsg-logo.optimized.png` wurde aus der intakten Logoquelle deterministisch neu erzeugt und mit neuem SHA-256 gepinnt. | lokal umgesetzt |
| V821-R01 – CMS | Sämtliche sechs redaktionellen `image`-Felder in `.pages.yml` besitzen denselben Derivatpfad-Regex; direkter CMS-Upload bleibt deaktiviert. Die Manifestmitgliedschaft wird nach jeder Änderung durch Validator und Builder erzwungen. | Strukturierter CMS-Schematest prüft Anzahl, Feldtyp und exaktes Pattern. | lokal umgesetzt; realer CMS-Lebenszyklus extern |

Dieser Änderungsnachweis ist eine Entwicklererklärung und keine unabhängige Freigabe.
