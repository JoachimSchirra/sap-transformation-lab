---
layout: page
title: People of LLSG
permalink: /inside-llsg/people/
eyebrow: Inside LLSG · The Cast
lead: Die Menschen, Charaktere und bewusst überzeichneten Persönlichkeiten hinter der fiktiven Long Life Sciences GmbH.
status: Character Directory
description: Figurenprofile, Rollen und spätere Porträts der fiktiven LLSG-Unternehmenswelt.
nav_inside: true
search_exclude: false
---

<a class="back-link" href="{{ '/inside-llsg/' | relative_url }}">← Zurück zu Inside LLSG</a>

**People of LLSG** wird das Figurenverzeichnis der Unternehmens- und Erzählwelt. Jedes Profil verbindet die offizielle Rolle bei LLSG mit Charakter, Spitznamen, persönlichen Eigenheiten und seiner Funktion innerhalb der Geschichten.

Die Porträtflächen sind bereits vorbereitet. Bilder werden ergänzt, sobald die jeweilige Figur im dafür vorgesehenen Figurenprojekt abschließend gestaltet und freigegeben wurde.

<div class="people-grid">
{% assign people = site.pages | where: "layout", "person" | where_exp: "person", "person.listing != false" | sort: "title" %}
{% for person in people %}
<article class="person-card">
  <div class="person-portrait">{% if person.image %}<img src="{{ person.image | relative_url | escape }}" alt="{{ person.image_alt | escape }}" width="480" height="600" loading="lazy">{% else %}<span>{% if person.status == 'Profile in Development' %}Profil wird redaktionell ergänzt{% else %}Porträt in Vorbereitung{% endif %}</span>{% endif %}</div>
  <div class="person-copy"><p class="person-role">{{ person.role | escape }}</p><h2>{{ person.title | escape }}</h2><p>{{ person.summary | escape }}</p><a class="person-more" href="{{ person.url | relative_url | escape }}">Mehr über {{ person.title | escape }}</a></div>
</article>
{% endfor %}
</div>

> Sämtliche dargestellten Personen sind fiktiv und keine Abbilder realer Beschäftigter, Kolleginnen, Kollegen oder Geschäftspartner.
