---
layout: page
title: Gate 2 Goods Receipt and Quality
permalink: /projects/llsg-foundation-p2p/gate-2/
eyebrow: Project 01 · Tested Gate
lead: Der erste integrierte MM/FI/QM-Wareneingang – von der Bestellung bis zum frei verwendbaren Bestand.
status_source: gate
gate_id: gate-2
description: Testziel, Ablauf und SAP-Nachweise für Gate 2 Goods Receipt and Quality.
nav_projects: true
content_type: gate
trace_business: Lieferung von CHRONUNDO an das Werk LS10
trace_decision: Bestellbezogener Wareneingang mit chargengeführter Qualitätsprüfung
trace_build: MM/FI-Kontenfindung, Charge, Prüflos und Bestandsarten integriert
trace_test: 101-Wareneingang bis positiver Verwendungsentscheid erfolgreich getestet
trace_evidence: G2-01 bis G2-06 · Veröffentlichung vorbereitet
---

<a class="back-link" href="{{ '/projects/llsg-foundation-p2p/' | relative_url }}">← Zurück zum Projekt</a>

{% include project-pass.html %}

## Executive Summary

Gate 2 bestätigt den integrierten Ablauf vom bestellbezogenen Wareneingang über Material- und FI-Beleg bis zu Prüflos, Ergebniserfassung, positiver Verwendungsentscheidung und frei verwendbarem Bestand. Das Ergebnis wurde im LLSG-System getestet; Screenshots sind noch nicht öffentlich freigegeben.

## Geschäftliche Relevanz und Risiko

Der Prozess muss gleichzeitig Bestand, Bewertung und Qualitätsstatus korrekt fortschreiben. Fehler an dieser Stelle würden Verfügbarkeit, Abschlussfähigkeit und regulatorisch relevante Qualitätsentscheidungen berühren.

## Was Gate 2 beweist

Gate 2 zeigt, dass der bisher aufgebaute Beschaffungsprozess nicht an der Bestellung endet. Der Wareneingang erzeugt integrierte Folgebelege, übernimmt die Chargeninformationen, stößt die Qualitätsprüfung an und führt nach positiver Verwendungsentscheidung in den frei verwendbaren Bestand.

<ol class="process-rail" aria-label="Getesteter Gate-2-Prozess">
  <li><span>01</span><strong>101 Wareneingang</strong></li>
  <li><span>02</span><strong>MM und FI Belege</strong></li>
  <li><span>03</span><strong>Charge und Prüflos</strong></li>
  <li><span>04</span><strong>Ergebniserfassung</strong></li>
  <li><span>05</span><strong>Verwendungsentscheid</strong></li>
  <li><span>06</span><strong>Freier Bestand</strong></li>
</ol>

<p><a class="button button-dark compact-button" href="{{ '/xray/gate-2/' | relative_url }}">Gate 2 im LLSG X-Ray öffnen</a></p>

{% include traceability.html %}

## Kuratierte Nachweiskette

<div class="screenshot-grid">
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Wareneingang mit Bewegungsart 101</strong><small>Bestellbezug · Menge · Werk LS10</small></div><figcaption><b>G2-01</b> Erfassung des bestellbezogenen Wareneingangs. <em>Belegt den operativen Start der integrierten Prozesskette.</em></figcaption></figure>
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Materialbeleg</strong><small>Belegfluss und gebuchte Menge</small></div><figcaption><b>G2-02</b> Materialwirtschaftlicher Folgebeleg. <em>Belegt die erfolgreiche Bestandsbuchung.</em></figcaption></figure>
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>FI Beleg zum Wareneingang</strong><small>Konten und Beträge gezielt zuschneiden</small></div><figcaption><b>G2-03</b> Automatisch erzeugter FI-Beleg. <em>Belegt die Integration zwischen Materialwirtschaft und Finanzwesen.</em></figcaption></figure>
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Charge und Prüflos</strong><small>Interne Charge · Lieferantencharge · QI-Bestand</small></div><figcaption><b>G2-04</b> Übernommene Chargendaten und automatisch erzeugtes Prüflos. <em>Belegt die QM-Integration.</em></figcaption></figure>
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Ergebnis und Verwendungsentscheidung</strong><small>Akzeptiertes Ergebnis · positive Entscheidung</small></div><figcaption><b>G2-05</b> Ergebniserfassung und positiver Verwendungsentscheid. <em>Belegt den fachlich abgeschlossenen Qualitätsprozess.</em></figcaption></figure>
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Bestandsübersicht nach Freigabe</strong><small>Frei verwendbarer Bestand · Werk LS10</small></div><figcaption><b>G2-06</b> Bestand nach Abschluss der Qualitätsprüfung. <em>Belegt die erfolgreiche Freigabe für die weitere Verwendung.</em></figcaption></figure>
</div>

## Testdaten und Datenschutz

Die später eingesetzten Screenshots zeigen ausschließlich synthetische LLSG-Daten. LLSG-Organisationskennungen, fiktive Stamm- und Bewegungsdaten sowie zusammengehörige Belegnummern dürfen für eine nachvollziehbare Beweiskette sichtbar bleiben. Entfernt werden ausschließlich echte fremde, personenbezogene oder sicherheitsrelevante Informationen aus der gemeinsam genutzten Sandbox.

## Nächster geplanter Schritt

Gate 3 soll den positiven Standardfall bewusst verlassen und einen negativen Qualitätsfall mit abweichendem Prüfergebnis, gesperrtem Bestand und nachvollziehbarer Folgeentscheidung dokumentieren.

## Erkenntnis für reale Transformationen

Ein erfolgreicher Wareneingang ist mehr als eine Materialbuchung: Erst die konsistente Wirkung auf Bewertung, Charge, Qualitätsprüfung und Bestandsstatus macht den Prozess belastbar und steuerbar.
