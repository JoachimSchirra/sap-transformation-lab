# Prüfbericht V8

Prüfdatum: 21.09.2026

## Ergebnis

Der lokal ausführbare V8-Stand ist inhaltlich und technisch konsistent. Es wurden keine blockierenden Fehler in Inhaltsmodell, Routen, gerendertem HTML, Ein-Datei-Navigation oder Paketabhängigkeiten gefunden.

## Erfolgreich ausgeführt

- `npm run validate`
- `npm run media`
- `npm run preview`
- `npm run preview:single`
- `npm run validate:preview`
- zusätzliche Ressourcen- und Linkprüfung über alle 39 Vorschau-HTML-Dateien
- JavaScript-Syntaxprüfung der Laufzeit- und Build-Skripte
- YAML-Parsing von CMS-, Jekyll- und Workflow-Konfiguration
- JSON-LD-Parsing für Startseite und reales Profil
- `npm audit --omit=dev`: 0 bekannte Schwachstellen

## Geprüfte Größen

- 38 Inhaltsrouten
- 39 Vorschau-HTML-Dateien einschließlich Einstieg
- 5 Gates
- 9 Evidence-Einträge
- 38 Routen in der portablen Ein-Datei-Vorschau

## Beabsichtigte Produktionssperren

Die Produktionsprüfung schlägt derzeit korrekt fehl wegen:

- fehlender finaler Produktionsfreigabe;
- noch nicht freigegebener Rechtstexte;
- fehlendem bestätigtem Gate-2-Testdatum;
- sichtbarer Bild- und Evidence-Platzhalter.

Diese Punkte werden nicht durch erfundene Daten oder Scheinfreigaben geschlossen.

## Externe Schlussprüfung

In der lokalen Ausführungsumgebung standen Ruby/Jekyll und ein realer Browser nicht zur Verfügung. Deshalb werden der originale Jekyll-Build, axe und Lighthouse verbindlich durch den GitHub-Workflow ausgeführt. VoiceOver/NVDA und die reale iPhone-/Desktop-Darstellung bleiben manuelle Abnahmepunkte.

## Revisionsurteil

Der Stand ist **bereit für einen Review-Branch**, nicht für eine öffentliche Produktionsfreigabe. Die Architektur und Schutzmechanismen sind so ausgelegt, dass offene Betreiberaufgaben sichtbar bleiben und eine versehentliche Veröffentlichung blockiert wird.

