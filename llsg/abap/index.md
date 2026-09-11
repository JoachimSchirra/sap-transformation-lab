---
layout: page
title: ABAP Lab
permalink: /abap/
---

Das **ABAP Lab** ist die technische Werkstatt des SAP Transformation Lab. Hier werden Eigenentwicklungen und Erweiterungen dokumentiert, die aus konkreten Anforderungen der Long Life Sciences Group (LLSG) entstehen.

Im Mittelpunkt steht nicht das isolierte Vorführen einzelner Sprachbefehle. Jede veröffentlichte Lösung soll einen nachvollziehbaren fachlichen Zweck innerhalb des Modellunternehmens erfüllen.

## Vom Bedarf zur Entwicklung

Eine ABAP-Umsetzung beginnt mit einer fachlichen oder technischen Anforderung. Die Dokumentation soll deshalb möglichst folgende Fragen beantworten:

1. Welches Problem soll gelöst werden?
2. Warum reicht der SAP-Standard nicht aus?
3. Welche Lösungsalternativen wurden betrachtet?
4. Warum wurde die gewählte Umsetzung bevorzugt?
5. Wie wurde die Lösung implementiert?
6. Wie wurde sie getestet?
7. Welche Grenzen oder offenen Punkte bestehen?

## Entwicklungsgrundsätze

Für Eigenentwicklungen gelten insbesondere folgende Leitlinien:

- SAP-Standard vor Eigenentwicklung
- Erweiterung statt Modifikation
- Orientierung am Clean-Core-Prinzip
- verständlicher und wartbarer Quellcode
- objektorientierte Gestaltung, wo sie fachlich sinnvoll ist
- möglichst geringe Abhängigkeit von technischen Einzelheiten
- nachvollziehbare Fehlerbehandlung
- Berücksichtigung von Berechtigungen und Datenschutz
- dokumentierte Tests

## Mögliche Themenfelder

Das ABAP Lab kann im weiteren Projektverlauf unter anderem folgende Inhalte aufnehmen:

- klassische ABAP-Reports
- objektorientiertes ABAP
- Datenzugriffe und interne Tabellen
- Schnittstellen und Datenverarbeitung
- Erweiterungspunkte und BAdIs
- Core Data Services
- OData und APIs
- RESTful Application Programming Model
- ABAP Cloud
- automatisierte Tests mit ABAP Unit

Diese Aufzählung beschreibt den möglichen Entwicklungsrahmen. Sie bedeutet nicht, dass zu allen Themen bereits Implementierungen vorhanden sind.

## Aufbau eines veröffentlichten Beispiels

Jedes veröffentlichte Entwicklungsbeispiel soll nach Möglichkeit enthalten:

- fachliche Anforderung
- technisches Lösungskonzept
- Voraussetzungen und Abhängigkeiten
- Quellcode
- Erklärung wesentlicher Entwurfsentscheidungen
- Testfall und Ergebnis
- bekannte Einschränkungen
- Bezug zum entsprechenden LLSG-Prozess

## Abgrenzung und Veröffentlichung

Veröffentlicht wird ausschließlich Quellcode, der eigens für das SAP Transformation Lab entwickelt und vor der Veröffentlichung geprüft wurde.

Nicht veröffentlicht werden:

- Quellcode aktueller oder früherer Arbeitgeber oder Kunden
- kopierte unternehmensspezifische Entwicklungen
- Zugangsdaten oder technische Verbindungsinformationen
- reale Stamm- oder Bewegungsdaten
- interne Systemkennungen oder vertrauliche Namensräume

## Aktueller Stand

Das ABAP Lab befindet sich im Aufbau. Erste Inhalte werden veröffentlicht, sobald eine konkrete Anforderung aus dem LLSG-Modell umgesetzt und nachvollziehbar getestet wurde.
