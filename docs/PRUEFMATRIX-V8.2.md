# Prüfmatrix V8.2

Stand: 25.09.2026. „Lokal bestanden“ bezeichnet ausschließlich den Entwicklerlauf im bereitgestellten Container. Nicht ausgeführte GitHub-, Browser-, CMS-, Rechts- oder Betreiberprüfungen bleiben offen.

| Bereich | Prüfung | Lokales Ergebnis | Externes Releasegate |
|---|---|---|---|
| Paketbasis | Version/Lockfile | 8.2.0, Lockfile aktualisiert | unabhängiger Paket-/Hashvergleich |
| Inhalte | `npm run validate` | 38 Routen, 5 Gates, 9 Evidence, 0 Issues; 1 erwartete Gate-2-Datumswarnung | echter Jekyll-Vergleich |
| Security | `npm run test:security` | positiv; aktive Daten, Liquid, Referenzen, Symlink, Config, Workflow und Medien negativ getestet | unabhängiger Retest |
| Dependencies | `npm audit --include=dev --package-lock-only --ignore-scripts` | 0 bekannte Advisories in allen Schweregraden am Prüftag | Dependabot/Updateowner |
| Medien | `npm run media` und isolierte Kollisions-/Rücknahmetests | 0 Quellen in Baseline; atomarer Nullsatz; Negativtests grün | reale Bilder/CMS-Lebenszyklus |
| Preview | `npm run preview` | 38 Routen | visueller Browservergleich |
| Ein-Datei | Build und `validate-single-file` | 38 Routen, eingebettete Ressourcen und Datenattribute valide | Desktop/iPhone-Funktionstest |
| HTML | `html-validate '_preview/**/*.html'` | ohne Meldung | Jekyll-HTML erneut |
| JavaScript/YAML | `node --check`, Strict-YAML-Parsing | bestanden | GitHub-Lauf unter Node 22.20.0 |
| Produktion | `npm run validate:production` | erwartungsgemäß blockiert: Freigaben, Reviewdaten, Gate-2-Datum und Platzhalter fehlen | reale Freigaben |
| CI/Deploy | statische YAML-/Permissions-/Pinprüfung | direkte Actions SHA-gepinnt, Least Privilege und Timeouts vorhanden | tatsächlicher Actions-/Environmentlauf |
| Accessibility | Quellmaßnahmen und Fallbacks | statisch vorhanden | axe, Tastatur, 320 px/400 %, VoiceOver/NVDA |
| Performance/SEO | lokale Struktur | nicht als Browserergebnis geprüft | Lighthouse dreifach je Route, Live-Crawl/Headers |
| Rollback | Verfahren dokumentiert | nicht praktisch ausgeführt | Rückrollübung auf sicherheitskonformen Commit |

## Erwartete Produktionssperre

Der Entwicklerstand darf nicht durch Setzen einzelner Flags veröffentlicht werden. Rechtstexte, Gate-2-Datum, sichtbare Platzhalter, Security-/Legal-Reviewdaten und externe Schutzregeln müssen tatsächlich abgearbeitet sein. Ein fehlschlagender Produktionsvalidator ist im gelieferten Prototyp der korrekte Zustand.
