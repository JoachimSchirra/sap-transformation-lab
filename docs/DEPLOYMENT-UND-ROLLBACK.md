# Deployment und Rollback · V8.5.1

## Grundsatz

V8.5.1 wird nicht direkt über die bestehende Website kopiert. Zuerst wird ein Sicherungsstand der bisherigen `main`-Version angelegt, anschließend V8.5.1 in einem eigenen Branch geprüft und erst nach Abnahme zusammengeführt.

## Empfohlener Ablauf

1. Aktuellen freigegebenen Stand von `main` als unveränderlichen Release oder Tag sichern.
2. V8.5.1-Quellpaket lokal entpacken.
3. Branch `website-v8.5-release-candidate` anlegen.
4. Den **Inhalt** des Quellpakets in das Repository kopieren. Bestehende Dateien mit gleichem Pfad werden ersetzt; das nicht mehr benötigte `Gemfile` und der alte öffentliche Upload-Ordner werden entfernt.
5. `npm ci --ignore-scripts && npm run validate && npm run test:security` lokal ausführen.
6. Committen und Branch zu GitHub pushen.
7. Pull Request gegen `main` öffnen und den Workflow `Website quality` vollständig grün abwarten.
8. GitHub-Artifact `website-quality-reports` prüfen und die Testmatrix auf realen Zielgeräten ergänzen.
9. Erst nach inhaltlicher Abnahme mergen.

## Produktionsfreigabe

**V8.5.1 wird mit einem bewusst unvollständigen Impressum ausgeliefert.** Die Installation in einem privaten Repository und die Prüfung im Review-Branch sind zulässig; die öffentliche Produktionsveröffentlichung ist dagegen bis zur Vervollständigung und Freigabe des Impressums gesperrt.

Vor der öffentlichen Veröffentlichung müssen mindestens erledigt sein:

- Gate-2-Testdatum bestätigt;
- öffentlich als „in Vorbereitung“ bezeichnete Nachweise und Visualisierungen fachlich akzeptiert oder durch freigegebene Inhalte ersetzt;
- Impressum und Datenschutzerklärung mit realen, geprüften Angaben vollständig;
- Fiktionshinweise und Namensabgrenzung abgenommen;
- `production_ready: true`, `security.review_approved: true` sowie die drei Legal-Schalter gesetzt und Security-/Legal-Abnahme mit Datum dokumentiert;
- `npm run validate:production` erfolgreich.

Danach wird **Actions → Deploy approved production site → Run workflow** manuell für `main` gestartet. Der Workflow zeichnet den tatsächlich ausgeführten Commit und die Hashliste der veröffentlichten Dateien als privates Release-Artefakt auf. Die Freigabe des unveränderten Build-Artefakts erfolgt anschließend über das geschützte Environment `github-pages`.

## Einmalige GitHub-Schutzkonfiguration

- Unter **Settings → Pages** muss „GitHub Actions“ als Quelle ausgewählt sein.
- Für den Branch `main` ist eine Repository Rule mit Pull-Request-Pflicht, erfolgreichem Check `Website quality`, Codeowner-Review, Verwerfen alter Reviews nach Änderungen und ohne unkontrollierten Admin-/App-Bypass erforderlich.
- Für das Environment `github-pages` wird mindestens ein Required Reviewer gesetzt. Bei einem allein betriebenen persönlichen Repository kann Joachim Schirra selbst Reviewer sein; „Prevent self-review“ bleibt dann deaktiviert. Ein unabhängiger Reviewer ist vorzuziehen, sobald ein geeigneter zweiter Beteiligter vorhanden ist.
- Unter **Settings → Actions** sind ausschließlich benötigte Actions zuzulassen; Fork-/Dependabot-PRs dürfen keine Deploy-Secrets oder Schreibtoken erhalten.
- Workflow-Dateien und Produktionskonfiguration sind über `.github/CODEOWNERS` Joachim Schirra zugeordnet.

## Rollback

1. In GitHub den letzten funktionierenden Release/Tag auswählen.
2. Einen Branch von diesem Stand erzeugen.
3. Den Rücksetz-Commit über einen Pull Request nach `main` bringen; keine Historie mit Force-Push überschreiben.
4. Qualitätsworkflow abwarten.
5. Produktionsworkflow erneut manuell starten.

Ein Rollbackziel ist nur zulässig, wenn es die zu diesem Zeitpunkt verpflichtenden Sicherheitskontrollen weiterhin enthält. Ein älterer, verwundbarer V7-/V8-/V8.1-Stand ist kein freigabefähiges Sicherheitsrollback. Die Rückrollübung und der freigegebene Ziel-Commit werden protokolliert.

## Externe Abnahmen

Die Quelllieferung kann GitHub-Regeln, Environment-Reviewer, Pages-Quelle, tatsächliche Action-Ausführung, Browser-/Screenreader-Ergebnisse, HTTPS-Header oder Live-Rollback nicht selbst beweisen. Diese Punkte bleiben bis zu einem belegten Lauf externe Releasegates. Der intern von `actions/jekyll-build-pages` verwendete Hersteller-Container ist tagbasiert; direkte Actions sind zwar SHA-gepinnt, die Lieferkette wird daher nicht als vollständig bitreproduzierbar bezeichnet.

## Speicher

Beim Ersetzen alter Dateien entsteht im aktuellen Repositorybaum kein doppelter Speicherverbrauch. Git behält die Historie absichtlich. Generierte Verzeichnisse `node_modules/`, `_preview/`, `_site/`, `_artifacts/` und `artifacts/` werden nicht committed.
