---
layout: page
title: Test & Nachweise
permalink: /evidence/
eyebrow: Evidence Center
lead: Kuratierte und bereinigte Nachweise aus dem tatsächlichen LLSG-Systemaufbau – geordnet nach Prozess, Modul und erreichtem Gate.
status_source: project
description: Zentrale Übersicht der Test- und Veröffentlichungsstände von SAP-Nachweisen im SAP Transformation Lab.
nav_evidence: true
---

<p class="lead-copy">Das Evidence Center trennt Behauptung und Nachweis. Jeder Eintrag gehört zu einem dokumentierten Test, erklärt den fachlichen Zusammenhang und zeigt nur die Bildschirmbereiche, die für das Ergebnis tatsächlich relevant sind.</p>

<div class="evidence-principles">
  <div><strong>Eigener Build</strong><span>Nur Ergebnisse aus dem LLSG-Modellsystem</span></div>
  <div><strong>Kontext statt Galerie</strong><span>Jeder Screenshot beantwortet eine konkrete Frage</span></div>
  <div><strong>Bereinigt</strong><span>Keine Zugänge, Benutzer oder fremden Systemdaten</span></div>
  <div><strong>Statusklar</strong><span>Geplant, implementiert und getestet bleiben getrennt</span></div>
</div>

<p><a class="button button-dark compact-button" href="{{ '/evidence/standard/' | relative_url }}">So werden Nachweise bewertet</a></p>

## Getestete Gates

<div class="evidence-filter" data-evidence-filter>
  <label>Nachweise filtern <input type="search" placeholder="Gate, Modul, Prozess oder Produkt" data-evidence-query></label>
  <div class="filter-buttons" role="group" aria-label="Schnellfilter">
    <button type="button" class="active" data-filter="all">Alle</button>
    <button type="button" data-filter="mm">MM</button>
    <button type="button" data-filter="fi">FI</button>
    <button type="button" data-filter="qm">QM</button>
    <button type="button" data-filter="tested">Getestet</button>
  </div>
</div>

<div class="evidence-index-grid" data-evidence-grid>
  <a class="evidence-index-card" data-tags="gate 1a mm tested chronundo bestellung purchase order" href="{{ '/projects/llsg-foundation-p2p/gate-1a/' | relative_url }}">
    <span class="evidence-code">Gate 1A · MM</span><h3>First Purchase Order</h3><p>Beleganlage, Bestellposition und gespeicherte Bestellung als Fundament des P2P-Prozesses.</p><span class="verified-mark">Getestet · 15.09.2026</span>
  </a>
  <a class="evidence-index-card" data-tags="gate 2 mm fi qm tested chronundo wareneingang qualität" href="{{ '/projects/llsg-foundation-p2p/gate-2/' | relative_url }}">
    <span class="evidence-code">Gate 2 · MM / FI / QM</span><h3>Goods Receipt &amp; Quality</h3><p>101-Wareneingang, Belegintegration, Charge, Prüflos, Verwendungsentscheidung und Bestandsfreigabe.</p><span class="verified-mark">Getestet</span>
  </a>
</div>
<p class="filter-empty" data-filter-empty hidden>Für diesen Filter sind noch keine Nachweise vorhanden.</p>

## Nachweisregister

<p>Das Register führt Umsetzung und Veröffentlichung getrennt. Solange noch kein geprüfter Screenshot eingesetzt ist, bleibt der Nachweisstatus ausdrücklich auf <strong>Vorbereitet</strong>.</p>

<div class="evidence-register">
  <div class="evidence-register-list">
  {% for entry in site.data.evidence %}
    <article class="evidence-record">
      <div class="evidence-record-heading"><strong>{{ entry.id | escape }}</strong><span>Nachweis · {{ entry.evidenceStatus | escape }}</span></div>
      <h3>{{ entry.documentType | escape }}</h3>
      <p>{{ entry.claim | escape }}</p>
      <dl><dt>Gate</dt><dd>{{ entry.gate | escape }}</dd><dt>Module</dt><dd>{{ entry.modules | escape }}</dd><dt>Prozess</dt><dd>{{ entry.process | escape }}</dd><dt>Umsetzung</dt><dd>{{ entry.deliveryStatus | escape }}</dd><dt>Aufnahme</dt><dd>{{ entry.captured | escape }}</dd></dl>
    </article>
  {% endfor %}
  </div>
</div>

## Wie die Nachweise gelesen werden

Die Gate-Seiten zeigen nicht möglichst viele Screenshots, sondern eine nachvollziehbare Beweiskette. Jede Abbildung erhält eine laufende Nachweisnummer, eine präzise Bildunterschrift und den Satz **Was dieser Nachweis belegt**. Wo mehrere SAP-Ansichten denselben Sachverhalt zeigen, werden sie zu einer Beweisgruppe zusammengeführt.

## Veröffentlichungsschutz

Vor der Veröffentlichung wird jeder Screenshot zugeschnitten und auf Benutzernamen, Systemkennung, Mandant, technische Verbindungsdaten, fremde Buchungskreise und sonstige nicht zum LLSG-Modell gehörende Informationen geprüft. Fremde Inhalte aus dem gemeinsam genutzten System werden weder gezeigt noch als Referenz verwendet.
