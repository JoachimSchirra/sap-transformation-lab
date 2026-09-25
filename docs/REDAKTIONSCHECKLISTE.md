# Redaktionscheckliste

## Vor dem Speichern

- Ist klar, ob der Inhalt real, fiktiv, geplant, konfiguriert oder getestet ist?
- Stimmen Titel, Kurzbeschreibung und individuelle SEO-Beschreibung?
- Verwendet die Seite ausschließlich freigegebene Begriffe und Produktnamen?
- Ist Joachim Schirra eindeutig die reale Person und keine Figur der LLSG?
- Haben alle Bilder Alternativtexte und einen nachweisbaren Nutzungsrecht-Status?
- Wurde jedes neue Bild lokal über `_media-source` und `npm run media` erzeugt, statt ein Rohoriginal öffentlich hochzuladen?
- Enthält redaktioneller Markdown-Text weder Liquid-Ausdrücke noch rohes HTML?
- Verweisen Evidence-IDs auf vorhandene Registereinträge?
- Sind Datums- und Gate-Angaben in den zentralen Datendateien gepflegt?

## Vor Veröffentlichung

- Vorschau visuell auf Desktop und Mobilgerät prüfen.
- Tastaturbedienung und Links prüfen.
- `npm run validate` ausführen.
- `npm run test:security` ausführen.
- Pull Request und Workflow `Website quality` abwarten.
- Keine Platzhalter als Beleg darstellen.
- Bei rechtlichen, Tracking- oder Kontaktänderungen Datenschutz und Impressum erneut prüfen.

## Sprachstandard

Kurze, konkrete Aussagen bevorzugen. Nicht behaupten, etwas sei produktiv, vollständig, zertifiziert oder öffentlich nachgewiesen, wenn lediglich ein Laboraufbau oder ein vorbereiteter Nachweis vorliegt.
