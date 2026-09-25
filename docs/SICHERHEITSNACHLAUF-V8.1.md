# Sicherheitsnachlauf V8.1

Stand: 21.09.2026

## Abgrenzung

V8.1 verändert weder das bestätigte visuelle Design noch die fachliche Seitenstruktur. Das Release schließt ausschließlich technische und betriebliche Sicherheitsbefunde der V8-Nachprüfung. V8 bleibt als unveränderter Rückfallstand erhalten.

## Geschlossene Befunde

### 1. Dateisystem- und Pfadgrenzen

- Ausgabeordner der Vorschau müssen echte Unterverzeichnisse der Projektwurzel sein.
- Projektwurzel, Home-Verzeichnis und Dateisystemwurzel sind als rekursive Löschziele ausgeschlossen.
- Permalinks akzeptieren nur kanonische interne Routen; Traversal, Backslashes, Protokolle, Query und Fragmente werden abgewiesen.
- Jede aus einer Route berechnete Zieldatei wird nochmals gegen den Ausgabeordner geprüft.
- Ein-Datei- und Serve-Ausgaben dürfen nur in freigegebenen Projektpfaden entstehen.

### 2. Medien und unbeabsichtigte Veröffentlichung

- Rohdateien liegen lokal in `_media-source/`; dessen Inhalt wird nicht versioniert und von Jekyll ausgeschlossen.
- Nur optimierte Derivate unter `assets/images/generated/` werden veröffentlicht.
- Größen-, Pixel- und Dimensionslimits reduzieren Risiken durch ungewöhnlich große oder fehlerhafte Rasterdateien.
- Normalisierte Dateinamen dürfen nicht kollidieren.
- Pages CMS verweist nur auf veröffentlichungsfertige Assets; Rohoriginale dürfen dort nicht hochgeladen werden.

### 3. Redaktionelle Inhalte und aktive Einbettungen

- Der Inhaltsvalidator parst YAML strukturiert statt Freigaben per Textsuche zu erraten.
- Unsichere URL-Schemata, Inline-Eventhandler, Frames, Objekte, Formulare, eingebettetes Markup und nicht erlaubte Script-Elemente blockieren den Build.
- Daten für Suche, Gate Roadmap und X-Ray werden HTML-escaped in Datenattributen übertragen und erst anschließend als JSON geparst.
- Redaktionell pflegbare Metadaten und zentrale Datenfelder werden bei der Ausgabe escaped.
- Veröffentlichte Bildpfade müssen in freigegebenen Asset-Verzeichnissen liegen und als Datei existieren.

Bewusst bleibt gerendertes Markdown-HTML für die vorhandenen kuratierten Seiten möglich. Die Schutzgrenze ist daher der geprüfte Repository-Inhalt mit Validator und Review, nicht ein Mehrbenutzer-CMS für nicht vertrauenswürdige Autoren.

### 4. Abhängigkeiten und Build-Lieferkette

- Der verwundbare lokale Lighthouse-CI-Abhängigkeitsbaum wurde aus `package-lock.json` entfernt.
- Der vollständige Audit der Entwicklungsabhängigkeiten meldet null bekannte Schwachstellen.
- Alle GitHub Actions sind auf vollständige Commit-SHAs fixiert.
- Dependabot überwacht npm- und GitHub-Actions-Abhängigkeiten wöchentlich.
- Der Pages-Build verwendet eine auf einen vollständigen Commit-SHA fixierte Revision der offiziellen Action `actions/jekyll-build-pages`; ein separates, driftendes Ruby-Bundle ist nicht mehr Bestandteil des Repositories.

### 5. Produktionsfreigabe

- Der Deploy-Workflow checkt ausschließlich `main` aus und verweigert abweichende Workflow-Revisionen.
- Dependency-Audit, Produktionsvalidator, HTML, Links, axe und Lighthouse laufen unmittelbar vor dem Upload erneut.
- Nur der abschließende Deploy-Job besitzt `pages: write` und `id-token: write`; der Build besitzt ausschließlich `contents: read`.
- `security.review_approved: true` ist eine zusätzliche zwingende Produktionsfreigabe.
- CODEOWNERS und dokumentierte Branch-/Environment-Regeln ergänzen die technischen Sperren.

## Verbleibende Betreiberaufgaben

Die folgenden Punkte können nicht im ZIP erzwungen werden und müssen einmalig im GitHub-Repository gesetzt beziehungsweise geprüft werden:

1. Branch-Regel für `main` mit Pull Request und verpflichtendem Qualitätscheck;
2. Required Reviewer für das Environment `github-pages`;
3. Pages-Quelle „GitHub Actions“;
4. Aktivierung und Sichtung der Dependabot-Meldungen;
5. manuelle Browser-, VoiceOver-/NVDA- und Zielgeräteabnahme;
6. finale rechtliche, inhaltliche und Security-Freigabe in `_config.production.yml`.

## Bewusste Plattformgrenze

GitHub Pages erlaubt für dieses Projekt keine frei konfigurierbaren HTTP-Response-Header. Ein serverseitig erzwungener Content-Security-Policy-, Permissions-Policy- oder Frame-Ancestors-Header gehört deshalb nicht zu V8.1. Sollte später eine eigene Domain über einen vorgeschalteten Dienst betrieben werden, werden diese Header dort ergänzt. V8.1 setzt bis dahin auf eine minimale Angriffsfläche, statische Auslieferung, keine Formulare, keine Authentifizierung, restriktive Inhaltsvalidierung und unveränderliche Build-Bausteine.
