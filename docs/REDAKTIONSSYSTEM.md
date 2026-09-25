# Redaktionssystem

Der Prototyp ist für Pages CMS vorbereitet. Das CMS bearbeitet die Inhaltsdateien direkt im GitHub-Repository; eine eigene Inhaltsdatenbank ist nicht erforderlich.

## Bewusste Trennung

- Redaktionszugriff: `.pages.yml`, Markdown-Front-Matter und strukturierte JSON-Daten
- Design: `_layouts`, `_includes`, `assets/css` und `assets/js`
- veröffentlichungsfertige Medien: `assets/images/generated` nach lokalem Import; direkte CMS-Uploads sind deaktiviert
- lokale, unveröffentlichte Originale: `_media-source/` (gitignored)

Damit können Texte, Status, Zuordnungen, Bilder, Alternativtexte und Evidence-IDs gepflegt werden, ohne das Layout zu öffnen.

## Aktivierung

Die Konfiguration ist vorbereitet, aber nicht mit einem externen Konto verbunden. Die spätere Aktivierung erfolgt bewusst über die gehostete Pages-CMS-Anwendung und die GitHub-App-Berechtigung für genau das gewünschte Repository. Vorher wird ein Repository-Backup beziehungsweise Release angelegt. Bis dahin bleibt das private Repository unverändert zugänglich wie bisher.

## Inhaltstypen

- Personen und Personas
- Produkte
- Projekte und Gates
- LLSG-Gesamtroadmap
- Business Episodes
- Off-Duty-Geschichten
- Build-Journal-Einträge
- Evidence Register
- Gate-2-X-Ray-Schritte

Die Felder für Layout, Navigation und technische Darstellung sind verborgen oder werden vom System vorgegeben. Verborgene CMS-Felder sind keine Sicherheitsgrenze: Jeder Pull Request durchläuft deshalb Schema-, Inhalts-, Pfad- und Ausgabetests. Neu angelegte redaktionelle Seiten dürfen weder Liquid noch rohes HTML enthalten; Markdown-Links werden nur mit freigegebenen internen beziehungsweise HTTPS-Zielen akzeptiert. Die wenigen bestehenden komponierten Hubseiten sind als technische Templates explizit allowgelistet und über CODEOWNERS geschützt.

Bildfelder sind reine Pfadfelder. Neue Bilder werden außerhalb des CMS in `_media-source/` abgelegt, mit `npm run media` verarbeitet und erst danach unter ihrem generierten Pfad referenziert.

## Zentrale Quellen

- `_data/gates.json`: Gate-Titel, Phasen, Testdaten und Evidence-Verweise
- `_data/portfolio_roadmap.json`: Vorhaben und Entwicklungsrichtungen nach Zeithorizont
- `_data/project_status.json`: aktueller Projektstand und nächster Schritt
- `_data/evidence.json`: Nachweisregister
- `_data/xray_gate_2.json`: erklärende Gate-2-X-Ray-Schritte
- `_data/latest.json`: kuratierte Meldungen auf der Startseite

Gate-, Evidence- und X-Ray-Referenzen werden durch einen gemeinsamen Referenzgraph geprüft. Unbekannte Evidence-IDs und tote Gate-/Latest-Routen stoppen den Build. Ein Gate-Testdatum gehört ausschließlich in `_data/gates.json`; noch vorhandene erzählerische Wiederholungen dürfen keine abweichenden Statusbehauptungen enthalten.

## Sichere redaktionelle Änderung

Nach jeder Änderung wird ein Vorschau-Branch verwendet. Der Pull Request muss den Workflow `Website quality` bestehen. Die kurze Prüffolge steht in `docs/REDAKTIONSCHECKLISTE.md`.
