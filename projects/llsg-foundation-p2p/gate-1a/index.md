---
layout: page
title: Gate 1A First Purchase Order
permalink: /projects/llsg-foundation-p2p/gate-1a/
eyebrow: Project 01 · Tested Gate
lead: Der erste belastbare P2P-Meilenstein – eine vollständig angelegte und gespeicherte Bestellung für das LLSG-Modellunternehmen.
status_source: gate
gate_id: gate-1a
description: Testziel, Ergebnis und SAP-Nachweise für Gate 1A First Purchase Order.
nav_projects: true
content_type: gate
trace_business: Beschaffungsbedarf für das fiktive Leitprodukt CHRONUNDO
trace_decision: Fremdbeschaffung als FERT über die zentrale Einkaufsorganisation
trace_build: Organisations- und Stammdaten sowie Einkaufsparameter eingerichtet
trace_test: Erste technisch saubere Bestellung erfolgreich gespeichert
trace_evidence: G1A-01 bis G1A-03 · Veröffentlichung vorbereitet
---

<a class="back-link" href="{{ '/projects/llsg-foundation-p2p/' | relative_url }}">← Zurück zum Projekt</a>

{% include project-pass.html %}

## Executive Summary

Gate 1A bestätigt, dass das organisatorische und stammdatenseitige Fundament für die erste Bestellung trägt. Der Test ist abgeschlossen; die öffentliche Evidence wird separat vorbereitet.

## Testziel

Gate 1A sollte zeigen, dass Organisationsstruktur, Lieferanten- und Materialstammdaten sowie Einkaufsparameter ausreichen, um eine technisch saubere erste Bestellung anzulegen und dauerhaft zu speichern.

## Ergebnis

**Das Testziel wurde erreicht.** Die Bestellung wurde mit dem vorgesehenen Buchungskreis, Werk, Einkaufsorganisation, Einkäufergruppe, Lieferanten und Material erfolgreich gespeichert.

## Nachweiskette

<div class="screenshot-grid">
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Bestellkopf und Lieferant</strong><small>SAP S/4HANA · ME21N/Bestellanzeige</small></div><figcaption><b>G1A-01</b> Organisationsdaten und Lieferant der LLSG-Bestellung. <em>Belegt die korrekte Einordnung des Beschaffungsvorgangs.</em></figcaption></figure>
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Bestellposition CHRONUNDO</strong><small>Material · Menge · Werk · Preis</small></div><figcaption><b>G1A-02</b> Zentrale Positionsdaten der ersten Bestellung. <em>Belegt die verwendbare Kombination aus Stamm- und Bewegungsdaten.</em></figcaption></figure>
  <figure class="proof-figure"><div class="screenshot-placeholder"><span>Öffentlicher Nachweis in Vorbereitung</span><strong>Gespeicherter Einkaufsbeleg</strong><small>LLSG-Belegnummer darf konsistent sichtbar bleiben</small></div><figcaption><b>G1A-03</b> Systembestätigung der gespeicherten Bestellung. <em>Belegt den erfolgreichen Abschluss des Tests.</em></figcaption></figure>
</div>

{% include traceability.html %}

## Erkenntnis

Der Meilenstein bestätigt das organisatorische und stammdatenseitige Fundament. Er beweist noch keinen vollständigen Purchase-to-Pay-Prozess; genau deshalb wird er als eigenes, eng abgegrenztes Gate geführt.

Für reale Transformationen zeigt Gate 1A, wie sinnvoll begrenzte, testbare Meilensteine Risiken früher sichtbar machen als ein erst am Ende geprüfter Gesamtprozess.
