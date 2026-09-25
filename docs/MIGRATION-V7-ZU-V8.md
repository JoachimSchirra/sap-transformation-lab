# Migration V7 zu V8

## Nicht überschreiben, bevor gesichert wurde

Vor der Migration einen Tag oder ein Release des aktuellen `main`-Stands anlegen. V7 bleibt dadurch jederzeit reproduzierbar.

## Ersetzen

Das V8-Quellpaket wird ab Repositorywurzel eingespielt. Insbesondere werden ersetzt:

- `_layouts/`, `_includes/`, `assets/css/`, `assets/js/`
- `_data/`
- die vorhandenen Markdown-Seiten
- `.pages.yml`, `_config.yml` und in V8 ursprünglich `Gemfile`; ab Sicherheitsnachlauf V8.1 wird stattdessen das unveränderlich referenzierte offizielle Pages-Build-Image verwendet
- `package.json`, `package-lock.json`, `lighthouserc.json`
- `.github/workflows/`

## Entfernen

Dateien, die nur in V7 existierten und im V8-Paket keinen Nachfolger haben, werden im Review-Branch gelöscht. Nicht im Repository ablegen:

- lokale ZIP-Dateien;
- `node_modules/`;
- `_preview/`, `_site/`, `_artifacts/`, `artifacts/`;
- Betriebssystem-Metadaten.

## Medien und Inhalte

Eigene, bereits freigegebene Originalmedien werden nicht blind überschrieben. Vorhandene Bilder werden gegen die V8-Pfade und Alternativtexte abgeglichen. Der alte Persona-Pfad `inside-llsg/people/aktivrentner-joachim/` darf nicht neben `inside-llsg/people/matze-reuter/` bestehen bleiben.

## Prüfpunkte nach dem Kopieren

- Es gibt genau eine Startseite und keine doppelten Permalinks.
- Keine öffentliche Seite nennt Nutrition, Nahrungsergänzungsmittel oder Rejuvena.
- Joachim Schirra erscheint nur als reale Person; Matze Reuter nur als fiktive Figur.
- Gate-Daten stammen aus `_data/gates.json`.
- `npm run validate` und der GitHub-Qualitätsworkflow sind grün.
- Der Produktionsworkflow bleibt bis zur Freigabe gesperrt.
