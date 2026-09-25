# Installation und Inbetriebnahme · V8.5.1

Diese Reihenfolge gilt für das bestehende Repository `joachimschirra/sap-transformation-lab` und die Projektadresse `https://joachimschirra.github.io/sap-transformation-lab/`.

## 1. Voraussetzungen

- GitHub Desktop ist installiert und mit dem GitHub-Konto `joachimschirra` verbunden.
- Das Paket `LLSG-Website-v8.5.1-QUELLPAKET.zip` ist vollständig entpackt.
- Das Repository bleibt während der Übernahme zunächst privat.
- Für eine kostenfreie Veröffentlichung über GitHub Pages muss das Repository anschließend öffentlich sein. GitHub Pages aus privaten persönlichen Repositorys erfordert GitHub Pro.

Nicht den Browser-Dateiupload verwenden: Das Paket enthält mehr als 100 Dateien sowie wichtige Punktdateien und Workflowverzeichnisse.

## 2. Bestehenden Stand sichern

1. In GitHub Desktop **File → Clone repository** öffnen.
2. `joachimschirra/sap-transformation-lab` auswählen und klonen.
3. **Fetch origin** ausführen und sicherstellen, dass `main` aktiv ist.
4. **Current branch → New branch** wählen.
5. Branch `archive/pre-v8.5.1` von `main` erzeugen.
6. **Publish branch** anklicken.
7. Zurück zu `main` wechseln.
8. Branch `website-v8.5.1-release-candidate` von `main` erzeugen.

Der Archivbranch ist die Rückkehrmöglichkeit. Alte Dateien werden nicht zusätzlich in `main` aufbewahrt.

## 3. Quellpaket vollständig übernehmen

1. In GitHub Desktop **Repository → Show in Explorer** öffnen.
2. Den Repositoryordner zusätzlich in Visual Studio Code öffnen.
3. Im VS-Code-Explorer den bisherigen sichtbaren Inhalt des Repositorys löschen. Der interne Ordner `.git` wird dort nicht angezeigt und bleibt erhalten.
4. Aus dem entpackten Ordner `sap-transformation-lab-v8.5.1` dessen **gesamten Inhalt** in den Repositorystamm kopieren. Nicht den äußeren Ordner selbst kopieren.
5. Prüfen, ob mindestens diese Pfade direkt im Repositorystamm vorhanden sind:
   - `.github/workflows/deploy-pages.yml`
   - `.github/workflows/quality.yml`
   - `.pages.yml`
   - `_media-source/.gitkeep`
   - `_config.yml`
   - `_config.production.yml`
   - `index.md`
   - `package.json`
6. In GitHub Desktop kontrollieren, dass Löschungen, Änderungen und neue Dateien angezeigt werden.
7. Commit-Nachricht: `Website V8.5.1 als Release Candidate übernehmen`
8. **Commit to website-v8.5.1-release-candidate** und danach **Publish branch**.

Nicht committen: `node_modules`, `_preview`, `_site`, `_serve`, `_artifacts`, `artifacts` und Dateien in `_media-source` außer `.gitkeep`.

## 4. Pflichtangaben vor öffentlicher Freigabe

Im Release-Branch vollständig bearbeiten:

1. `impressum.md`: reale Betreiberangaben, vollständige geeignete Postanschrift und unmittelbar erreichbare Kontaktmöglichkeit.
2. `datenschutz.md`: tatsächliches Hosting bei GitHub Pages, eingesetztes Cloudflare Web Analytics, Datenkategorien, Zwecke, Rechtsgrundlage, Empfänger, Speicherdauer und Betroffenenrechte nach abschließender Prüfung beschreiben.
3. Alle sichtbaren Fiktionshinweise, Namensabgrenzungen und Seiteninhalte prüfen.
4. Öffentliche Nachweise, die noch nicht als Bild vorliegen, bleiben ausdrücklich als „in Vorbereitung“ gekennzeichnet.

## 5. Cloudflare Web Analytics kostenneutral vorbereiten

1. Im Cloudflare-Dashboard **Web Analytics → Add a site** öffnen.
2. Als Hostname `joachimschirra.github.io` eintragen.
3. Die manuelle Einrichtung für eine nicht über Cloudflare proxied Website wählen. DNS und Nameserver bleiben unverändert.
4. Unter **Manage site** das JavaScript-Snippet anzeigen.
5. Aus dem Snippet ausschließlich den Wert hinter `"token"` kopieren.
6. In `_config.production.yml` eintragen:

   ```yaml
   analytics:
     enabled: true
     provider: cloudflare
     token: "HIER_DEN_CLOUDFLARE_TOKEN_EINTRAGEN"
   ```

Der Token ist Bestandteil des öffentlichen Beacon-Snippets und kein geheimer API-Schlüssel. Cloudflare Web Analytics liefert Seitenaufrufe, Herkunfts- und Performanceinformationen. Es unterstützt gegenwärtig keine benutzerdefinierten Ereignisse; die lokale `llsgAnalyticsQueue` ist lediglich ein Erweiterungspunkt.

## 6. Produktionsschalter setzen

Erst nach Abschluss von Impressum, Datenschutz, Security-Review und inhaltlicher Prüfung `_config.production.yml` setzen:

```yaml
environment: production
production_ready: true
repository_public: true

security:
  review_approved: true
  reviewed_at: "JJJJ-MM-TT"

legal:
  approved: true
  imprint_complete: true
  privacy_complete: true
  reviewed_at: "JJJJ-MM-TT"

contact:
  enabled: false
  email: ""
  linkedin: ""

analytics:
  enabled: true
  provider: cloudflare
  token: "CLOUDFLARE_TOKEN"
```

Das Kontaktformular ist in V8.5.1 bewusst nicht implementiert. `contact.enabled` bleibt daher `false`.

Die Änderungen committen und den Release-Branch erneut pushen.

## 7. Repository für den kostenfreien Pages-Betrieb veröffentlichen

Bei GitHub Free:

1. Repository auf GitHub öffnen.
2. **Settings → General → Danger Zone → Change repository visibility**.
3. **Make public** wählen und die verlangte Bestätigung durchführen.

Der Quellcode und die Branches sind danach öffentlich sichtbar. Wer das Repository privat halten möchte, benötigt für GitHub Pages aus diesem privaten Repository einen geeigneten kostenpflichtigen GitHub-Tarif.

## 8. GitHub Actions und Pages konfigurieren

1. **Settings → Actions → General** öffnen.
2. **Allow select actions and reusable workflows** wählen.
3. GitHub-eigene Actions erlauben.
4. Als zusätzliche zugelassene Action `treosh/lighthouse-ci-action@*` eintragen.
5. Workflow permissions auf die Standard-Leseberechtigung belassen; die Workflows fordern ihre notwendigen Pages-Rechte selbst an.
6. **Settings → Pages** öffnen.
7. Unter **Build and deployment → Source** den Wert **GitHub Actions** wählen.

## 9. Pull Request und Qualitätsprüfung

1. Auf der Repository-Startseite den Hinweis zum Branch `website-v8.5.1-release-candidate` öffnen.
2. **Compare & pull request** wählen.
3. Base: `main`; Compare: `website-v8.5.1-release-candidate`.
4. Pull Request anlegen.
5. Unter **Checks** den Workflow **Website quality** vollständig abwarten.
6. Erst fortfahren, wenn alle Schritte grün sind: Dependency Audit, Inhaltsprüfung, Security Regression, Preview, Jekyll-Build, HTML, Links, axe und Lighthouse.
7. Unter **Actions** im Lauf das Artefakt `website-quality-reports` öffnen und die Lighthouse-Berichte prüfen.

## 10. Schutz für `main` setzen

Nachdem der erste Quality-Check einmal existiert:

1. **Settings → Rules → Rulesets → New branch ruleset**.
2. Name: `Protect main`.
3. Enforcement status: **Active**.
4. Zielbranch: `main` beziehungsweise Default branch.
5. Aktivieren:
   - Pull Request vor Merge erforderlich;
   - erforderliche Freigaben: `0`, solange Joachim alleiniger Maintainer ist;
   - Statuschecks vor Merge erforderlich;
   - Check `validate-build-and-test` auswählen;
   - Löschen des Branches blockieren;
   - Force Push blockieren.
6. Keine Codeowner-Freigabe erzwingen, solange der Pull-Request-Autor und einzige Codeowner dieselbe Person sind.
7. Regeln speichern.

Danach den Pull Request erst mergen, wenn der erneute Check grün ist.

## 11. Deployment-Environment schützen

1. **Settings → Environments** öffnen.
2. Environment `github-pages` öffnen oder neu anlegen.
3. Deployment branch auf `main` beschränken.
4. **Required reviewers** aktivieren und Joachim Schirra auswählen.
5. **Prevent self-review** deaktiviert lassen, solange kein unabhängiger zweiter Reviewer vorhanden ist.

## 12. Produktion veröffentlichen

1. Nach dem Merge den automatisch gestarteten Workflow **Website quality** auf `main` vollständig grün abwarten.
2. **Actions → Deploy approved production site** öffnen.
3. **Run workflow** wählen.
4. Branch `main` auswählen und starten.
5. Nach erfolgreichem Build unter **Review deployments** das Environment `github-pages` freigeben.
6. Den Lauf bis zum grünen Abschluss abwarten.
7. Website öffnen: `https://joachimschirra.github.io/sap-transformation-lab/`.

Der Workflow veröffentlicht ausschließlich das geprüfte Build-Artefakt und speichert `website-release-record` mit Commit und Dateihashes.

## 13. Pages CMS aktivieren

1. `https://app.pagescms.org` öffnen.
2. Mit GitHub anmelden.
3. Die Pages-CMS-GitHub-App installieren.
4. Repositoryzugriff ausschließlich auf `sap-transformation-lab` beschränken.
5. Das Repository öffnen. Die vorhandene `.pages.yml` verwenden; keine neue Konfiguration erzeugen.
6. Prüfen, ob Personen, Produkte, Projekte, Status, Roadmap, Business Episodes, Off Duty, Build Journal, Evidence, Gates und „Neu im Lab“ erscheinen.
7. Inhaltliche Änderungen auf einem separaten Redaktionsbranch speichern und anschließend per Pull Request nach `main` übernehmen.

Medien werden nicht direkt im CMS hochgeladen. Originale lokal in `_media-source` ablegen, `npm run media` ausführen und ausschließlich die erzeugten Dateien aus `assets/images/generated` committen.

## 14. Google Search Console verbinden

Nach erfolgreicher öffentlicher Veröffentlichung:

1. In Google Search Console eine **URL-Präfix-Property** anlegen:
   `https://joachimschirra.github.io/sap-transformation-lab/`
2. Verifikation über eine HTML-Datei wählen.
3. Die von Google bereitgestellte Datei unverändert in den Repositorystamm eines neuen Branches legen.
4. Pull Request, grünen Quality-Check, Merge und erneutes Produktionsdeployment durchführen.
5. Prüfen, ob die Verifikationsdatei unter der von Google verlangten Projektadresse erreichbar ist.
6. In Search Console die Property verifizieren.
7. Sitemap einreichen:
   `https://joachimschirra.github.io/sap-transformation-lab/sitemap.xml`

## 15. Abnahme nach Veröffentlichung

Prüfen:

- Startseite, Hauptnavigation und Footer;
- Suche einschließlich Trefferlinks;
- interaktive Gate-Roadmap mit Maus und Tastatur;
- Evidence-Filter;
- Gate-2-X-Ray-Tabs;
- Mobilmenü auf iPhone und iPad;
- kein horizontales Seitenscrolling bei 320, 375, 768 und 1440 Pixel Breite;
- Impressum, Datenschutz und Disclaimer;
- `robots.txt` und `sitemap.xml`;
- Cloudflare-Beacon im Seitenquelltext und erste Daten im Dashboard;
- 404-Seite;
- Pages-CMS-Teständerung ausschließlich über Branch und Pull Request.

## 16. Rollback

1. Vom Branch `archive/pre-v8.5.1` einen neuen Rollback-Branch erstellen.
2. Nur dann verwenden, wenn dieser Stand die zum Rollbackzeitpunkt erforderlichen Sicherheits- und Rechtstexte enthält.
3. Rollback per Pull Request nach `main` bringen.
4. Quality-Workflow abwarten.
5. Produktionsworkflow erneut manuell starten und das `github-pages`-Deployment freigeben.

Keinen Force Push auf `main` verwenden.
