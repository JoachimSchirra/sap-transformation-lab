# Prüfmatrix V8

| Bereich | Prüfung | Automatisiert | Aktueller Stand |
|---|---|---:|---|
| Inhalte | JSON, Front Matter, Permalinks, Claims, Gate-/Evidence-Referenzen | ja | lokal bestanden |
| HTML | semantische und ARIA-Regeln | ja | lokale Vorschau bestanden |
| Links | interne Links und Ressourcen im Jekyll-Build | ja | lokal für Vorschau bestanden; CI für Jekyll ausstehend |
| JavaScript | Navigation, Suche, Filter, Tabs, Lightbox | teilweise | Struktur geprüft; Browserlauf in CI ausstehend |
| Accessibility | axe auf Kernrouten | ja | GitHub-Workflow ausstehend |
| Performance/SEO | Lighthouse, je drei Läufe auf neun Routen | ja | GitHub-Workflow ausstehend |
| Responsive | 320, 375, 768, 1024, 1440 px | manuell | finale Zielgeräteprüfung ausstehend |
| iPhone/iPad | Safari, Navigation, Gate-Scroller, Zoom | manuell | auf entpackter/gehosteter Site ausstehend |
| Tastatur | Skip-Link, Menü, Suche, Filter, X-Ray, Lightbox | manuell + axe | finale Prüfung ausstehend |
| Screenreader | VoiceOver/NVDA: Struktur, Namen, Statusmeldungen | manuell | ausstehend |
| Produktion | Recht, Testdaten, Platzhalter, Freigabeschalter | ja | absichtlich blockiert |

## Abnahmekriterium

Eine öffentliche Freigabe erfolgt erst, wenn alle automatisierten Prüfungen grün sind, die manuellen Kernprüfungen keine blockierenden Befunde enthalten und `npm run validate:production` erfolgreich ist.

## Lighthouse-Schwellen

- Performance ≥ 0,92
- Accessibility ≥ 0,95
- Best Practices ≥ 0,95
- SEO ≥ 0,95

Die Schwellen sind Mindestwerte, keine Garantie für perfekte reale Nutzung.

