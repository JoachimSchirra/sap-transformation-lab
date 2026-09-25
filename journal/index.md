---
layout: page
title: Build Journal
permalink: /journal/
eyebrow: Decisions · Corrections · Lessons
lead: Der tatsächliche Projektverlauf in datierten, kuratierten Einträgen – ohne die Gate-Dokumentation erneut zu erzählen.
description: Kuratierter zeitlicher Projektverlauf des SAP Transformation Lab.
nav_journal: true
---

Das **Build Journal** hält fest, was wann entschieden, umgesetzt, getestet oder korrigiert wurde. Testdetails gehören auf die jeweilige Gate-Seite; hier stehen Verlauf und Erkenntnis.

<div class="journal-purpose-grid">
  <div><strong>Arbeitsschritt</strong><span>Was tatsächlich konfiguriert oder ausgeführt wurde</span></div>
  <div><strong>Entscheidung</strong><span>Warum ein fachlicher oder technischer Weg gewählt wurde</span></div>
  <div><strong>Korrektur</strong><span>Welches Problem auftrat und wie es gelöst wurde</span></div>
  <div><strong>Erkenntnis</strong><span>Was daraus für den weiteren Build folgt</span></div>
</div>

{% assign entries = site.pages | where: "content_type", "journal" | where_exp: "item", "item.published != false" | sort: "date" | reverse %}
{% if entries.size > 0 %}
## Journal-Einträge

<div class="editorial-list">
{% for entry in entries %}<a href="{{ entry.url | relative_url | escape }}"><time datetime="{{ entry.date | date_to_xmlschema | escape }}">{{ entry.date | date: '%d.%m.%Y' | escape }}</time><strong>{{ entry.title | escape }}</strong><span>{{ entry.summary | default: entry.description | escape }}</span></a>{% endfor %}
</div>
{% else %}
<p class="empty-state">Noch keine eigenständigen Journaleinträge veröffentlicht.</p>
{% endif %}

## Als Nächstes

Der nächste Journaleintrag entsteht erst nach einem tatsächlich durchgeführten und geprüften Arbeitsschritt. Geplant sind der negative Qualitätsfall, die Rechnungsprüfung sowie Zahlung und FI-Ausgleich.
