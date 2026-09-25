# Prüfmatrix V8.1

| Bereich | Automatische Kontrolle | Lokaler Stand | GitHub-/Betreiberstand |
|---|---|---|---|
| Pfadsicherheit | sichere Projektziele und kanonische Routen | bestanden | Workflow erneut |
| Inhaltsgrenzen | aktive Tags, Handler, URL-Schemata, Bildpfade | bestanden | Workflow erneut |
| Dependencies | Lockfile und vollständiger npm-Audit | 0 Schwachstellen | Dependabot laufend |
| Supply Chain | Actions nur mit vollständigen Commit-SHAs | bestanden | Repository-Regel setzen |
| Jekyll-Build | offizielle Pages-Build-Action auf Commit-SHA fixiert | lokal nicht verfügbar | Workflow zwingend |
| HTML und Links | html-validate und Lychee | Vorschau bestanden | Jekyll-Ausgabe zwingend |
| Accessibility | axe auf sechs Kernrouten | Browser lokal nicht verfügbar | Workflow + manuell |
| Performance/SEO | Lighthouse auf neun Routen, je drei Läufe | Browser lokal nicht verfügbar | Workflow zwingend |
| Medien | private Quellen, Limits, nur Derivate öffentlich | bestanden | Redaktionsprozess einhalten |
| Deployment | Vollprüfung vor Upload, Least Privilege | YAML/SHA geprüft | Environment-Reviewer setzen |
| Produktion | strukturierte Legal-, Content- und Security-Sperren | blockiert wie vorgesehen | erst nach Abnahme freigeben |

Eine öffentliche Veröffentlichung ist nur zulässig, wenn alle automatisierten GitHub-Prüfungen grün sind und die manuelle Zielgeräte-/Screenreader-Abnahme keine blockierenden Befunde enthält.
