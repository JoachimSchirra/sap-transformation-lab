---
layout: page
title: Business Episodes
permalink: /inside-llsg/business-episodes/
eyebrow: Inside LLSG · Business
lead: Fiktive Situationen aus dem Unternehmensalltag, die fachliche Anforderungen, Entscheidungen und manchmal einen konkreten SAP-Build auslösen.
status: In Vorbereitung
description: Business Episodes aus der fiktiven Unternehmenswelt der Long Life Sciences GmbH.
nav_inside: true
---

<a class="back-link" href="{{ '/inside-llsg/' | relative_url }}">← Zurück zu Inside LLSG</a>

**Business Episodes** erzählen das operative Leben der fiktiven Long Life Sciences GmbH. Eine Episode kann mit einer Kundenanforderung, einem Qualitätsproblem, einer Managemententscheidung, einem Konflikt zwischen Abteilungen oder einer unerwarteten Situation im Tagesgeschäft beginnen.

## Von der Geschichte zur fachlichen Frage

Die Geschichten dürfen zugespitzt und unterhaltsam sein. Sobald daraus eine Anforderung an das Modellunternehmen entsteht, wird der Übergang zur SAP-Dokumentation klar kenntlich gemacht.

Jede fachlich relevante Episode erhält nach Möglichkeit den Abschnitt **Bedeutung für das SAP-Modell**:

- geschäftlicher Auslöser
- fachliche Anforderung
- daraus entstehende SAP-Frage
- Entscheidungs- oder Umsetzungsstatus
- Verknüpfung zur SAP Journey oder zum Projekt

Eine erzählte Anforderung ist noch kein Nachweis ihrer Umsetzung. Erst die verknüpfte Dokumentation zeigt, was tatsächlich beschlossen, implementiert und getestet wurde.

## Geplante Sammlung

Die ersten Episoden werden hier veröffentlicht, sobald Geschichte, fachliche Ableitung und Fiktionsprüfung gemeinsam abgeschlossen sind. Bis dahin wird kein bloßer Platzhalter als fertige Episode ausgegeben.

{% assign episodes = site.pages | where: "content_type", "business_episode" | where_exp: "item", "item.published != false" | sort: "date" | reverse %}
{% if episodes.size > 0 %}
<div class="editorial-list">
{% for episode in episodes %}<a href="{{ episode.url | relative_url | escape }}"><time datetime="{{ episode.date | date_to_xmlschema | escape }}">{{ episode.date | date: '%d.%m.%Y' | escape }}</time><strong>{{ episode.title | escape }}</strong><span>{{ episode.summary | default: episode.description | escape }}</span></a>{% endfor %}
</div>
{% else %}
<p class="empty-state">Noch keine Episode veröffentlicht.</p>
{% endif %}

> Alle Personen, Dialoge, Unternehmen und Ereignisse dieser Serie sind fiktiv.
