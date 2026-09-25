---
layout: page
title: CHRONUNDO
permalink: /llsg/specialty-pharmaceuticals/chronundo/
eyebrow: LLSG · Product Dossier
lead: Das bewusst fiktive pharmazeutische Leitprodukt des ersten SAP-End-to-End-Prozesses.
status: Operatives Modellprodukt
description: Strukturiertes Produktdossier für das fiktive LLSG-Produkt CHRONUNDO.
nav_llsg: true
content_type: product
fictional: true
image_alt: ""
product_id: LLSG-PH-101
business_area: Specialty Pharmaceuticals
product_status: Operatives Modellprodukt
base_unit: Packung
packaging: 30 Filmtabletten je Packung · 20 Packungen je Karton
procurement: Fremdbeschaffung als Fertigerzeugnis
batch_management: Verpflichtend
quality: Wareneingangsprüfung mit Prüflos und Verwendungsentscheid
shelf_life: 36 Monate · 24 Monate Mindestrestlaufzeit
fiction: Vollständig fiktives Produkt ohne reale medizinische Wirkung
---

<a class="back-link" href="{{ '/llsg/specialty-pharmaceuticals/' | relative_url }}">← Zurück zu Specialty Pharmaceuticals</a>

<div class="product-dossier-hero">
  <div class="product-media dossier-media">{% if page.image %}<img src="{{ page.image | relative_url }}" alt="{{ page.image_alt | escape }}" width="900" height="700">{% else %}<span>Produktvisualisierung in Vorbereitung</span>{% endif %}</div>
  <div>
    <p class="section-kicker">{{ page.product_id | escape }}</p>
    <h2>{{ page.title | escape }}</h2>
    <p class="lead-copy">CHRONUNDO ist das fachliche Bindeglied zwischen der überzeichneten LLSG-Unternehmenswelt und einer realistisch aufgebauten SAP-Prozesskette.</p>
    <span class="fiction-pill">Fiktives Produkt · keine reale medizinische Wirkung</span>
  </div>
</div>

## Produktpass

<dl class="dossier-facts">
  <div><dt>Geschäftsfeld</dt><dd>{{ page.business_area | escape }}</dd></div>
  <div><dt>Status</dt><dd>{{ page.product_status | escape }}</dd></div>
  <div><dt>Basismengeneinheit</dt><dd>{{ page.base_unit | escape }}</dd></div>
  <div><dt>Verpackung</dt><dd>{{ page.packaging | escape }}</dd></div>
  <div><dt>Beschaffung</dt><dd>{{ page.procurement | escape }}</dd></div>
  <div><dt>Charge</dt><dd>{{ page.batch_management | escape }}</dd></div>
  <div><dt>Qualität</dt><dd>{{ page.quality | escape }}</dd></div>
  <div><dt>Haltbarkeit</dt><dd>{{ page.shelf_life | escape }}</dd></div>
</dl>

## SAP-Bezug

CHRONUNDO wird als fremdbeschafftes Fertigerzeugnis geführt. Das Produkt verbindet Materialstamm, Lieferantenbezug, Bestellung, Wareneingang, Chargenführung, Qualitätsmanagement, Bestandsarten sowie FI-/CO-Integration.

## Zugehörige Projekte und Nachweise

<div class="journey-links">
  <a href="{{ '/projects/llsg-foundation-p2p/' | relative_url }}"><span>Projekt</span><strong>Foundation and Purchase to Pay</strong><small>Organisationsaufbau und erster End-to-End-Strang</small></a>
  <a href="{{ '/projects/llsg-foundation-p2p/gate-2/' | relative_url }}"><span>Getestetes Gate</span><strong>Goods Receipt &amp; Quality</strong><small>MM/FI/QM bis zum freien Bestand</small></a>
</div>

> CHRONUNDO, seine Beschreibung und sämtliche zugehörigen Daten sind frei erfunden. Die Long Life Sciences GmbH stellt keine realen Arzneimittel her und bietet keine realen Produkte oder Dienstleistungen an.
