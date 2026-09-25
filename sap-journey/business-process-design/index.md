---
layout: page
title: Business and Process Design
permalink: /sap-journey/business-process-design/
eyebrow: Prozesse & Lösungsdesign · Business View
lead: Geschäftlicher Auslöser, fachlicher Scope und End-to-End-Prozess – bevor aus Anforderungen SAP-Konfiguration wird.
description: Fachliche Anforderungen und End-to-End-Prozessdesign im SAP Transformation Lab.
nav_journey: true
---

<a class="back-link" href="{{ '/sap-journey/' | relative_url }}">← Zurück zu Prozesse & Lösungsdesign</a>

## Vom Geschäft zur umsetzbaren Anforderung

Der Build beginnt nicht mit einer Transaktion oder einem Customizing-Pfad. Ausgangspunkt ist eine geschäftliche Situation: ein benötigter Prozess, ein Risiko, eine Entscheidung oder eine konkrete Business Episode. Daraus werden Scope, Verantwortlichkeiten, Prozessschritte und überprüfbare Ergebnisse abgeleitet.

<ol class="process-design-chain" aria-label="Vom geschäftlichen Auslöser zum Nachweis">
  <li><span>01</span><strong>Business Episode oder Anforderung</strong><small>Warum muss sich etwas verändern?</small></li>
  <li><span>02</span><strong>Business &amp; Process Design</strong><small>Was soll fachlich funktionieren?</small></li>
  <li><span>03</span><strong>Solution Architecture</strong><small>Wie wird es in SAP gestaltet?</small></li>
  <li><span>04</span><strong>Build &amp; Delivery</strong><small>Was wird tatsächlich umgesetzt?</small></li>
  <li><span>05</span><strong>Test &amp; Nachweis</strong><small>Was funktioniert und was ist öffentlich belegt?</small></li>
</ol>

## Aktiver End-to-End-Prozess

### Purchase to Pay

Der erste aktive Prozessstrang führt vom organisatorischen Fundament über Lieferant, Material und Bestellung bis zu Wareneingang, Qualitätsprüfung, Rechnung, Zahlung und FI-Ausgleich.

**Bereits getestet:** Bestellung sowie integrierter Wareneingang mit MM-/FI-Beleg, Charge, Prüflos, Ergebniserfassung, positiver Verwendungsentscheidung und Bestandsfreigabe.

**Als Nächstes:** negativer Qualitätsfall, anschließend Rechnungsprüfung sowie Zahlung und Ausgleich.

[Projekt und Gate-Roadmap öffnen →]({{ '/projects/llsg-foundation-p2p/' | relative_url }})

## Geplante Prozessentwicklung

Order to Cash und weitere End-to-End-Prozesse sind Teil der Entwicklungsrichtung, aber noch nicht als umgesetzt dargestellt. Die [Gesamtroadmap]({{ '/projects/' | relative_url }}) trennt den aktiven Build von geplanten und späteren Vorhaben.

## Verbindung zu Inside LLSG

Business Episodes können einen fachlichen Auslöser anschaulich machen. Die Episode ist jedoch weder Spezifikation noch Testnachweis. Die verbindliche fachliche Entscheidung steht hier beziehungsweise im Projekt; das getestete Ergebnis steht unter [Test & Nachweise]({{ '/evidence/' | relative_url }}).
