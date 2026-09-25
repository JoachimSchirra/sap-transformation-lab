---
layout: page
title: Off Duty
permalink: /inside-llsg/off-duty/
eyebrow: Inside LLSG · After Hours
lead: Figuren, Freundschaft und Rhein-Ruhr-Geschichten jenseits des unmittelbaren Geschäftsprozesses – ohne erzwungenen SAP-Bezug.
status: In Vorbereitung
description: Private und humorvolle Geschichten aus der fiktiven Welt von LLSG.
nav_inside: true
---

<a class="back-link" href="{{ '/inside-llsg/' | relative_url }}">← Zurück zu Inside LLSG</a>

**Off Duty** beginnt dort, wo der Arbeitstag endet. Die Geschichten entwickeln Figuren und Beziehungen weiter, zeigen private Interessen oder führen hinaus in die Rhein-Ruhr-Welt von LLSG.

## Geschichten ohne Pflichtprogramm

Eine Off-Duty-Episode muss keine SAP-Anforderung, Prozessverbesserung oder fachliche Botschaft erzeugen. Sie darf einfach unterhalten – etwa bei einem Abend in einer alten Ruhrgebietskneipe oder bei Grumpy in seinem renovierten Bergmannshaus in Essen-Katernberg.

Wiederkehrende Motive können sein:

- die jahrzehntelange Freundschaft von Big Joe und Grumpy
- gemeinsame Abende mit Matthias „Matze“ Reuter
- Essen, Duisburg, Düsseldorf und weitere Schauplätze im Ruhrgebiet
- Hobbys, Eigenheiten und überraschende Seiten der LLSG-Figuren
- Geschichten, in denen das Modellunternehmen einmal keine Hauptrolle spielt

## Geplante Sammlung

Die Episoden erhalten später jeweils eine eigene Seite. Bildwelten und Figurenprofile werden mit [People of LLSG]({{ '/inside-llsg/people/' | relative_url }}) verbunden.

{% assign stories = site.pages | where: "content_type", "off_duty" | where_exp: "item", "item.published != false" | sort: "date" | reverse %}
{% if stories.size > 0 %}
<div class="editorial-list">
{% for story in stories %}<a href="{{ story.url | relative_url | escape }}"><time datetime="{{ story.date | date_to_xmlschema | escape }}">{{ story.date | date: '%d.%m.%Y' | escape }}</time><strong>{{ story.title | escape }}</strong><span>{{ story.summary | default: story.description | escape }}</span></a>{% endfor %}
</div>
{% else %}
<p class="empty-state">Noch keine Off-Duty-Geschichte veröffentlicht.</p>
{% endif %}

> Alle Personen, Dialoge und Ereignisse dieser Serie sind fiktiv.
