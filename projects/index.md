---
layout: page
title: Build & Roadmap
permalink: /projects/
eyebrow: Structured delivery
lead: Aktiver SAP-Build, projektbezogene Gates und die längerfristige LLSG-Entwicklungsrichtung – sichtbar getrennt nach Reifegrad.
status_source: project
description: Aktiver SAP-Build, Projekt-Gates und längerfristige LLSG-Gesamtroadmap.
nav_projects: true
---

## LLSG Foundation und Purchase to Pay

Das gegenwärtige Projekt schafft das organisatorische und fachliche Fundament der fiktiven Long Life Sciences GmbH und baut darauf einen integrierten Purchase-to-Pay-Prozess auf.

<div class="case-study-summary">
<p class="section-kicker">Aktueller Stand</p>
<h2>Gate 2 erfolgreich getestet</h2>
<p class="lead-copy">Bestellung, 101-Wareneingang, Material- und FI-Beleg, Charge, Prüflos, Ergebniserfassung, positive Verwendungsentscheidung und Bestandsfreigabe wurden als integrierter MM/FI/QM-Ablauf getestet.</p>
</div>

<p><a class="button button-dark compact-button" href="{{ '/projects/llsg-foundation-p2p/' | relative_url }}">Projekt, Roadmap und nächste Gates öffnen</a></p>

## LLSG-Gesamtroadmap

Die Gesamtroadmap zeigt den Entwicklungsrahmen des Modellunternehmens. Nur **Foundation & Purchase to Pay** ist derzeit ein aktiver Build. Alle weiteren Felder bleiben ausdrücklich als nächste, spätere oder strategische Entwicklungsrichtung gekennzeichnet.

<div class="portfolio-roadmap">
{% assign horizons = "current,next,later,future" | split: "," %}
{% for horizon in horizons %}
{% assign items = site.data.portfolio_roadmap | where: "horizon", horizon %}
<section class="portfolio-lane portfolio-{{ horizon | escape }}">
<h3>{{ items.first.horizonLabel | escape }}</h3>
<div>
{% for item in items %}
{% if item.url %}<a href="{{ item.url | relative_url | escape }}" class="portfolio-card">{% else %}<article class="portfolio-card">{% endif %}
<span>{{ item.status | escape }}</span><strong>{{ item.title | escape }}</strong><p>{{ item.summary | escape }}</p>
{% if item.url %}</a>{% else %}</article>{% endif %}
{% endfor %}
</div>
</section>
{% endfor %}
</div>

## Weitere Vertiefung

- [Gate 2 im Detail]({{ '/projects/llsg-foundation-p2p/gate-2/' | relative_url }}) – Testziel, Ablauf, Ergebnis und Grenzen
- [Test & Nachweise]({{ '/evidence/' | relative_url }}) – Testergebnisse und öffentlicher Status der vorgesehenen Nachweise
- [Build Journal]({{ '/journal/' | relative_url }}) – datierte Entscheidungen, Korrekturen und Erkenntnisse
