# Prüfmatrix V8.2.2

Stand: 25.09.2026. „Lokal bestanden“ bezeichnet ausschließlich den Entwicklerlauf im bereitgestellten Container. Node 22.20.0/npm 10.9.3, GitHub, Jekyll, Browser und CMS bleiben externe Prüfstrecken.

| Bereich | Prüfung | Lokales Ergebnis | Externes Releasegate |
|---|---|---|---|
| Version | `package.json`/Lockfile | `8.2.2`, Lockfile synchron | unabhängiger Paket-/Hashvergleich |
| Inhalte | `npm run validate` | Exit 0; 120 Dateien, 38 Routen, 5 Gates, 9 Evidence, 0 Issues; erwartete Gate-2-Warnung | echter Jekyll-Vergleich |
| Security | `npm run test:security` | Exit 0; vollständige bisherige Regression plus V821-R01 positiv/negativ | unabhängiger Retest |
| Redaktionsbild negativ | Front Matter mit `/assets/images/llsg-logo.png` | Inhaltsvalidator und Preview-Builder weisen den Direktpfad ab | realer CMS-Versuch |
| Redaktionsbild positiv | echtes Optimiererderivat mit Manifest | Inhaltsvalidator und Preview-Builder akzeptieren `/assets/images/generated/audit-v822-1.webp` in isolierter Testkopie | reale Medienfreigabe |
| Markenassets | gemeinsame Inventarprüfung | 5/5 pfad-, hash-, decoder-, pixel- und metadatengeprüft | gestalterische Freigabe bei späterem Austausch |
| CMS-Schema | strukturierte YAML-Prüfung | 6/6 `image`-Felder erzwingen den Derivatpfad; Direktupload fehlt | Pages-CMS-E2E |
| Medienpipeline | `npm run media` | Exit 0; leere Baseline; positiver Derivat- und Rücknahmetest grün | reale Originalbilder |
| Dependencies | vollständiger Lockfile-Audit | 0 bekannte Advisories aller Schweregrade; 182 Dependencies | zeitpunktbezogene Wiederholung |
| Preview/Einzeldatei | Build und `validate:preview` | 38 Routen; HTML und Single-File ohne Issues | Browser-/Accessibility-/Lighthouse-Lauf |
| Produktion | `npm run validate:production` | erwartungsgemäß blockiert | reale fachliche, rechtliche und commitgenaue Freigaben |

## Beabsichtigte Grenzen

Feste Markenassets sind keine redaktionellen Bilder. Ihre Allowlist darf nur gemeinsam mit Datei, erwarteten Abmessungen und SHA-256 geändert werden. Redaktionelle Inhalte dürfen ausschließlich auf ein bereits manifestiertes Derivat verweisen. Das CMS-Pattern unterstützt die Eingabe, ersetzt aber nicht das verpflichtende Manifestgate.
