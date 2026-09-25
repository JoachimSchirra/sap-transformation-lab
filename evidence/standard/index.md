---
layout: page
title: So werden Nachweise bewertet
permalink: /evidence/standard/
eyebrow: Methodik · Build Evidence
lead: Eine einheitliche Regel dafür, was im SAP Transformation Lab als geplant, umgesetzt, getestet und öffentlich nachgewiesen gilt.
status: Verbindlicher Prototypstandard
description: Methodik, Statusmodell und Mindestangaben für SAP-Nachweise im SAP Transformation Lab.
nav_evidence: true
---

<a class="back-link" href="{{ '/evidence/' | relative_url }}">← Zurück zum Evidence Center</a>

## Zwei getrennte Statusdimensionen

<div class="status-definition-grid">
  <article><p class="section-kicker">Umsetzungsstatus</p><h3>Was im System erreicht ist</h3><ol><li><strong>Idee</strong> – noch ohne Umsetzungsentscheidung</li><li><strong>Geplant</strong> – fachlich vorgesehen</li><li><strong>Entschieden</strong> – verbindlich spezifiziert</li><li><strong>Konfiguriert</strong> – im System eingerichtet</li><li><strong>Getestet</strong> – mit dokumentiertem Ergebnis ausgeführt</li></ol></article>
  <article><p class="section-kicker">Nachweisstatus</p><h3>Was öffentlich belegt ist</h3><ol><li><strong>Nicht veröffentlicht</strong> – kein öffentlicher Nachweis</li><li><strong>Vorbereitet</strong> – Evidence-ID und Nachweisplatz angelegt</li><li><strong>Veröffentlicht</strong> – geprüfter Nachweis öffentlich verfügbar</li></ol></article>
</div>

Ein getesteter SAP-Schritt ist nicht automatisch öffentlich nachgewiesen. Umgekehrt kann ein vorbereiteter Screenshot niemals einen noch nicht durchgeführten Test ersetzen.

## Aufbau einer Evidence-ID

Evidence-IDs folgen dem Muster **Gate – laufende Nummer**, beispielsweise `G2-03`. Die ID bleibt stabil, auch wenn Bildunterschrift, Zuschnitt oder ergänzende Beschreibung später verbessert werden.

## Mindestangaben je Nachweis

Jeder veröffentlichte Nachweis enthält mindestens:

- Evidence-ID und Aufnahmedatum
- Projekt und Gate
- Modul beziehungsweise Prozess
- belegte Aussage
- Umsetzungs- und Nachweisstatus
- verständliche Bildunterschrift und Alternativtext
- bekannte Grenzen oder offene Punkte

## Veröffentlichungsprüfung für Screenshots

LLSG-Daten sind synthetisch und müssen nicht pauschal anonymisiert werden. LS01, LS10, CHRONUNDO sowie zusammengehörige LLSG-Beleg-, Chargen- und Bestandsdaten dürfen sichtbar bleiben. Geprüft und entfernt werden hingegen Daten anderer Unternehmen oder Benutzer, echte personenbezogene Daten, Zugangsdaten sowie Host-, Mandanten- und Verbindungsdetails. Ziel ist ein vollständiger LLSG-Nachweis ohne sachfremde oder schutzbedürftige Informationen.

## Aussagegrenze

Ein Nachweis belegt ausschließlich die Aussage, die ihm ausdrücklich zugeordnet ist. Ein Materialbeleg beweist beispielsweise eine Buchung, aber noch keinen vollständig abgestimmten End-to-End-Prozess.
