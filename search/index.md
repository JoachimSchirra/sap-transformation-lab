---
layout: page
title: Suche im Lab
permalink: /search/
eyebrow: Orientierung
lead: Geschäftsfelder, Personen, Projekte, Gates, Nachweise und technische Dokumentation durchsuchen.
description: Kostenneutrale statische Volltextsuche im SAP Transformation Lab.
---

<div class="site-search" data-site-search>
  <label for="site-search-input">Suchbegriff</label>
  <div class="search-input-row"><input id="site-search-input" type="search" placeholder="Zum Beispiel Gate 2, CHRONUNDO, QM oder Grumpy" autocomplete="off" data-search-input><button type="button" class="button button-dark" data-search-clear>Leeren</button></div>
  <p class="search-summary" data-search-summary role="status" aria-live="polite" aria-atomic="true">Alle veröffentlichten Inhalte werden angezeigt.</p>
  <div class="search-results" data-search-results></div>
  {% assign searchable_pages = site.pages | where_exp: "item", "item.search_exclude != true and item.noindex != true and item.published != false and item.title" | sort: "title" %}
  {% capture search_json %}[
  {% for item in searchable_pages %}{% unless forloop.first %},{% endunless %}{"title":{{ item.title | jsonify }},"url":{{ item.url | jsonify }},"type":{{ item.eyebrow | default: item.content_type | default: 'Inhalt' | jsonify }},"text":{{ item.content | default: item.search_text | default: item.description | default: item.lead | strip_html | normalize_whitespace | jsonify }}}{% endfor %}
  ]{% endcapture %}<div hidden data-search-data="{{ search_json | strip_newlines | escape }}"></div>
</div>

Die Suche arbeitet vollständig im Browser. Suchbegriffe werden nicht an einen externen Dienst übertragen.

<noscript>Die interaktive Suche benötigt JavaScript. Alle Hauptbereiche bleiben über die Navigation und die Sitemap erreichbar.</noscript>
