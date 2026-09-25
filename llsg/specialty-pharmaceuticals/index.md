---
layout: page
title: Specialty Pharmaceuticals
permalink: /llsg/specialty-pharmaceuticals/
eyebrow: LLSG · Business Area
lead: Fiktive pharmazeutische Produkte als fachliche Grundlage für belastbare SAP-End-to-End-Prozesse.
status: Operativer Kernbereich
description: Der strategische Geschäftsbereich Specialty Pharmaceuticals der fiktiven Long Life Sciences GmbH.
nav_llsg: true
---

<a class="back-link" href="{{ '/llsg/' | relative_url }}">← Zurück zur Long Life Sciences GmbH</a>

**Specialty Pharmaceuticals** ist ein operativer Kernbereich der fiktiven Long Life Sciences GmbH. Hier werden Produkte, regulatorisch geprägte Geschäftsanforderungen und die daraus entstehenden SAP-Prozesse nachvollziehbar miteinander verbunden.

## Produkte

<div class="product-grid">
{% assign products = site.pages | where_exp: "item", "item.product_id and item.published != false" | sort: "title" %}
{% for product in products %}
  <article class="product-card">
    <div class="product-media">{% if product.image %}<img src="{{ product.image | relative_url | escape }}" alt="{{ product.image_alt | escape }}" width="800" height="600" loading="lazy">{% else %}<span>Produktvisualisierung in Vorbereitung</span>{% endif %}</div>
    <div class="product-copy">
      <p class="product-kicker">{{ product.product_status | escape }}</p>
      <h2>{{ product.product_id | escape }} · {{ product.title | escape }}</h2>
      <p>{{ product.lead | escape }}</p>
      <a class="person-more" href="{{ product.url | relative_url | escape }}">Produktdossier öffnen</a>
    </div>
  </article>
{% endfor %}
</div>

## Ausbau der Produktwelt

Weitere Produkte werden erst ergänzt, wenn ihre Rolle in der Unternehmensstory und ihr fachlicher Nutzen für die SAP-Simulation geklärt sind. Die vorbereitete Produktdarstellung kann später Fotos, Verpackungsentwürfe, Kurzbeschreibungen, Stammdatenmerkmale und Verweise auf die zugehörigen Prozesse aufnehmen.

> Alle genannten Produkte sind fiktiv. Die Long Life Sciences GmbH stellt keine realen Arzneimittel her und vertreibt keine realen Produkte oder Dienstleistungen.
