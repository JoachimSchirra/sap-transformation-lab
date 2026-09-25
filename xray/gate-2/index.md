---
layout: page
title: LLSG X-Ray · Gate 2
permalink: /xray/gate-2/
eyebrow: Signature Feature · Pilot
lead: Ein getesteter LLSG-Geschäftsvorgang – synchron aus Business-, SAP- und Proof-Perspektive.
status: Gate 2 · Getestet
description: Interaktive X-Ray-Darstellung des integrierten Gate-2-Wareneingangs.
nav_evidence: true
---

<a class="back-link" href="{{ '/projects/llsg-foundation-p2p/gate-2/' | relative_url }}">← Zurück zur Gate-2-Dokumentation</a>

<p class="lead-copy">Wähle einen Prozessschritt und wechsle anschließend zwischen den drei Sichtweisen. Alle Angaben stammen aus derselben strukturierten Prozessdefinition; die vorgesehenen Screenshots werden erst nach ihrer Veröffentlichungsprüfung ergänzt.</p>

<div class="xray" data-xray>
  <div class="xray-progress" role="tablist" aria-label="Gate-2-Prozessschritte" data-xray-steps></div>
  <div class="xray-toolbar" role="tablist" aria-label="Perspektive">
    <button type="button" role="tab" aria-selected="true" data-view="business">Business</button>
    <button type="button" role="tab" aria-selected="false" data-view="sap">SAP X-Ray</button>
    <button type="button" role="tab" aria-selected="false" data-view="proof">Proof</button>
  </div>
  <article class="xray-stage" aria-live="polite" aria-atomic="false">
    <div class="xray-stage-head"><span data-xray-number aria-hidden="true">–</span><div><p class="section-kicker" data-xray-status>Interaktive Prozessansicht</p><h2 data-xray-title>Prozessschritt auswählen</h2></div></div>
    <div class="xray-view" data-xray-content></div>
    <p class="xray-story" data-xray-story></p>
  </article>
  <div hidden data-xray-data="{{ site.data.xray_gate_2 | jsonify | escape }}"></div>
  <div hidden data-xray-evidence-data="{{ site.data.evidence | jsonify | escape }}"></div>
  <noscript><div class="no-js-fallback"><h2>Gate-2-Ablauf ohne Interaktion</h2><ol><li>Lieferung</li><li>Wareneingang 101</li><li>Material- und FI-Beleg</li><li>Charge und Prüflos</li><li>Ergebniserfassung und Verwendungsentscheid</li><li>Frei verwendbarer Bestand</li></ol><p>Umsetzungsstatus: getestet. Öffentlicher Nachweisstatus: vorbereitet.</p></div></noscript>
</div>

## Aussage des Piloten

LLSG X-Ray ersetzt weder Gate-Dokumentation noch Evidence Center. Es verbindet beide mit dem geschäftlichen Vorgang und macht sichtbar, wie eine einzelne Buchung fachliche, logistische, qualitative und finanzielle Folgen auslöst.
