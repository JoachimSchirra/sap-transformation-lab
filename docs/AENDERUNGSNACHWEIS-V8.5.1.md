# Änderungsnachweis V8.5.1

## Anlass

Der Installationsretest des V8.5-ZIP-Pakets hat drei Releaseprobleme sichtbar gemacht, die vor einem GitHub-Deployment behoben werden mussten.

## Korrekturen

- `_media-source/.gitkeep` ist Bestandteil des Pakets; der Security-Regressionstest kann deshalb auch nach einer frischen ZIP-Entpackung vollständig laufen.
- Die Produktionsfreigabe verlangt keinen kryptografisch unmöglichen Commit-Selbstverweis mehr. Der tatsächlich veröffentlichte Commit wird vom manuellen GitHub-Workflow sowie vom geschützten `github-pages`-Environment gebunden und als privates Release-Artefakt protokolliert.
- Die Pages-CMS-Commitkonfiguration verwendet die aktuelle dokumentierte Struktur `settings.commit.templates` und `identity: user`.
- Vorbereitete Bilder und SAP-Nachweise sind öffentlich korrekt als „in Vorbereitung“ bezeichnet und werden nicht länger als technische Rohplatzhalter behandelt.
- Das bestätigte Gate-2-Testdatum 19.09.2026 ist in der Releasebeschreibung nachgeführt.
- Paket- und Dokumentationsversion wurden auf 8.5.1 angehoben.

## Unveränderte Produktionssperren

Impressum, Datenschutzhinweise, tatsächliche externe Dienste sowie die Security- und Legal-Freigabe müssen vor der öffentlichen Veröffentlichung weiterhin vollständig und wahrheitsgemäß konfiguriert werden.
