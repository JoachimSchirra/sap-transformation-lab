---
layout: page
title: System and Solution Architecture
permalink: /sap-journey/system-architecture/
eyebrow: SAP Journey · Foundation
lead: Der organisatorische und technische Rahmen, in dem die LLSG-Prozesse konsistent aufgebaut und getestet werden.
status: Foundation implemented
description: Systemrahmen, Organisationsstruktur und Architekturprinzipien des SAP Transformation Lab.
nav_journey: true
---

<a class="back-link" href="{{ '/sap-journey/' | relative_url }}">← Zurück zur SAP Journey</a>

## Systemkontext

Das Modellunternehmen wird in SAP S/4HANA 2023 als Greenfield-Szenario aufgebaut. Dokumentiert werden ausschließlich die selbst angelegten LLSG-Strukturen und die daraus entstehenden Prozesse. Andere Inhalte des gemeinsam genutzten Systems gehören nicht zum Projekt.

<div class="architecture-grid">
  <div><span>Company Code</span><strong>LS01</strong><small>Long Life Sciences GmbH</small></div>
  <div><span>Plant</span><strong>LS10</strong><small>Duisburg</small></div>
  <div><span>Chart of Accounts</span><strong>LSCA</strong><small>LLSG operating chart</small></div>
  <div><span>Fiscal Year</span><strong>K4</strong><small>Calendar year</small></div>
  <div><span>Purchasing Group</span><strong>LSP</strong><small>Pharma Procurement</small></div>
  <div><span>Build Approach</span><strong>Greenfield</strong><small>Standard before custom</small></div>
</div>

## Architekturprinzipien

- fachliche Entscheidung vor technischer Konfiguration
- SAP-Standard vor Eigenentwicklung
- End-to-End-Nachweis vor isolierter Transaktion
- kleine, überprüfbare Gates statt unbestätigter Großbehauptungen
- klare Trennung von geplant, beschlossen, implementiert und getestet
- ausschließlich synthetische Stamm- und Bewegungsdaten

## Dokumentationsmodell

**Prozesse & Lösungsdesign** erklärt Anforderungen, Themen und Architekturentscheidungen. **Build & Roadmap** bündelt Ziel, Scope und Gates. **Test & Nachweise** zeigt geprüfte Ergebnisse und öffentlichen Belegstatus. Das **Build Journal** hält fest, wann und in welcher Reihenfolge diese Ergebnisse entstanden sind.
