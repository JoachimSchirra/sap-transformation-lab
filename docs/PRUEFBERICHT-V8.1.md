# Prüfbericht V8.1 Security Hardening

Prüfdatum: 21.09.2026

## Urteil

Die lokal prüfbaren Sicherheitsbefunde des V8-Nachlaufs sind geschlossen. V8.1 ist bereit für einen isolierten GitHub-Review-Branch. Eine öffentliche Produktionsfreigabe ist weiterhin absichtlich blockiert.

## Lokal erfolgreich geprüft

- `npm ci --ignore-scripts`
- vollständiges `npm audit --audit-level=high`: **0 bekannte Schwachstellen**
- `npm run validate`: **0 Fehler**, 38 Routen, 5 Gates, 9 Evidence-Einträge
- `npm run test:security`: Pfad-, Traversal-, Action-Pinning-, Medien- und DOM-Sink-Regressionen bestanden
- `npm run preview`
- `npm run preview:single`
- `npm run validate:preview`: HTML- und Ein-Datei-Prüfung ohne Fehler
- JavaScript-Syntaxprüfung aller Laufzeit- und Build-Skripte
- YAML-Parsing von Jekyll-, CMS-, Dependabot- und Workflow-Konfiguration
- Prüfung aller Workflow-`uses` auf vollständige 40-stellige Commit-SHAs
- Negativtest: Dateisystemwurzel als Vorschau-Ausgabe wird vor jeder Löschung abgewiesen
- Negativtest: Traversal-Permalink `/../../escape/` wird abgewiesen
- Produktionsvalidator blockiert erwartungsgemäß fehlende Rechtstexte, Testdatum, Platzhalter sowie Content- und Security-Freigabe

## Nicht lokal simulierbar

In der bereitgestellten Umgebung stehen weder Ruby/Container-Runtime noch ein vollständiger Browser zur Verfügung. Der offizielle Jekyll-Containerbuild, axe und Lighthouse müssen deshalb beim ersten Push des Review-Branches im Workflow `Website quality` grün abgeschlossen werden. Diese offene Ausführungsprüfung ist im Paket sichtbar dokumentiert und keine stillschweigende Freigabe.

## Releasekriterium

V8.1 darf erst nach GitHub-Installation als abgenommen gelten, wenn:

1. `Website quality` vollständig grün ist;
2. die erzeugten Lighthouse-Artefakte geprüft sind;
3. Navigation, Suche, Gate Roadmap, X-Ray und responsive Darstellung im Desktop- und iPhone-Browser manuell funktionieren;
4. die Repository- und Environment-Schutzregeln gesetzt sind.
