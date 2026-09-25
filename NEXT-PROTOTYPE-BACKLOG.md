# Verbindlicher Aufgabenstand für den nächsten Prototyp

Status: V6-Prototyp umgesetzt; externe Aktivierungen und ausdrücklich spätere Optionen bleiben deaktiviert.

Das ausdrückliche Startsignal wurde am 20.09.2026 erteilt. Die Umsetzung folgt den nachstehenden Vorgaben; Details und bewusste Nicht-Aktivierungen sind in `IMPLEMENTATION-STATUS.md` dokumentiert.

## Umsetzungsstand V6

| Backlogbereich | Stand im V6-Prototyp |
|---|---|
| Redaktionelle/technische Trennung | umgesetzt |
| Strukturierte Inhaltsmodelle | umgesetzt beziehungsweise für neue Einträge vorbereitet |
| Redaktionssystem | Pages CMS konfiguriert, externe GitHub-App noch nicht aktiviert |
| Analytics und Performance | produktionsabhängig vorbereitet, im Prototyp deaktiviert |
| Projektcockpit und Statusdimensionen | umgesetzt |
| Evidence Standard und Screenshotregeln | umgesetzt |
| Rückverfolgbarkeit und Produktdossier | umgesetzt |
| Systemlandkarte, Suche, Filter und Neu im Lab | umgesetzt |
| Kontaktformular | gemäß Backlog nur dokumentiert, nicht aktiviert |
| LLSG X-Ray | Gate-2-Pilot umgesetzt, echte Screenshots weiterhin offen |
| GitHub Discussions | gemäß Backlog für eine spätere öffentliche Freigabe zurückgestellt |

## 1. Redaktionelle und technische Trennung

Das bestehende visuelle Design bleibt grundsätzlich erhalten. Inhalt und technische Darstellung werden jedoch konsequenter getrennt:

- zentrale Layouts für wiederkehrende Seitentypen
- wiederverwendbare Includes beziehungsweise Komponenten für Karten, Statusanzeigen, Nachweise, Galerien und Navigationselemente
- zentrale CSS- und JavaScript-Dateien
- redaktionelle Inhalte ohne unnötig eingebettetes HTML
- keine manuelle Vervielfältigung wiederkehrender Darstellungslogik in einzelnen Markdown-Dateien

## 2. Strukturierte Inhaltsmodelle

Wiederkehrende Inhalte werden als strukturierte Daten beziehungsweise Jekyll Collections organisiert. Vorgesehen sind mindestens:

- Personen und Personas
- Geschäftsfelder und Produkte
- Projekte und Gates
- Business Episodes
- Off-Duty-Geschichten
- SAP-Nachweise und Screenshots
- Build-Journal-Einträge

Die genaue Aufteilung zwischen Front Matter, `_data` und Jekyll Collections wird anhand der jeweiligen Inhaltstypen festgelegt.

## 3. Redaktionssystem

Der nächste Prototyp soll ein Redaktionssystem vorsehen, über das Inhalte ohne manuelle Erstellung oder Bearbeitung komplexer Markdown- und HTML-Dateien gepflegt werden können.

Das Redaktionssystem soll insbesondere unterstützen:

- vorhandene Inhalte bearbeiten
- neue Einträge anlegen
- Titel, Texte, Status, Datum und Zuordnungen über Felder pflegen
- Bilder und bereinigte SAP-Screenshots hochladen
- Bildunterschriften, Alternativtexte und Evidence-IDs erfassen
- Personen, Produkte, Projekte, Gates, Stories und Nachweise als eigene Inhaltstypen verwalten
- aus den Eingaben automatisch die für Jekyll benötigten Inhaltsdateien erzeugen
- das bestehende Design vor versehentlichen redaktionellen Änderungen schützen

Bei der technischen Auswahl sind die Nutzung eines privaten GitHub-Repositorys, sichere Authentifizierung, geringer Betriebsaufwand und möglichst geringe beziehungsweise keine laufenden Zusatzkosten zu berücksichtigen.

## 4. Noch offen

Weitere Anforderungen von Joachim werden vor dem Start ergänzt. Die technische Umsetzung und die Auswahl des konkreten Redaktionssystems werden erst nach dem ausdrücklichen Startsignal begonnen.

## 5. Analytics, Reichweite und technische Performance

Der nächste Prototyp soll ein möglichst aussagekräftiges, zugleich datenschutzfreundliches Messkonzept vorbereiten. Besucheranalyse, Google-Sichtbarkeit und technische Performance werden getrennt betrachtet.

### 5.1 Besucher- und Inhaltsanalyse

Für Analytics und Performance-Messung gilt als verbindliche Vorgabe: Es dürfen keine zusätzlichen einmaligen oder laufenden Kosten entstehen. Kostenpflichtige Abonnements, Lizenzen oder eigens dafür betriebene Server werden nicht verwendet. Plausible Cloud ist deshalb nicht als bevorzugte Lösung vorgesehen. Die endgültige Auswahl erfolgt aus kostenfreien Diensten und kostenlosen Nutzungskontingenten, die zum Umsetzungszeitpunkt hinsichtlich Datenschutz, Funktionsumfang und technischer Kompatibilität geprüft werden. Eine Überschreitung kostenloser Kontingente darf keine automatische kostenpflichtige Buchung auslösen.

Als voraussichtliche Basis werden geprüft:

- Cloudflare Web Analytics im kostenlosen Tarif für Reichweiten- und Performance-Grunddaten
- Google Search Console für Suchsichtbarkeit und Suchanfragen
- Lighthouse beziehungsweise Lighthouse CI innerhalb der vorhandenen GitHub-Automatisierung
- eine kostenfreie, datenschutzverträgliche Lösung für projektspezifische Ereignisse; falls keine ausreichend belastbare Lösung ohne Zusatzkosten verfügbar ist, wird der Ereignisumfang auf die kostenfrei und rechtssicher messbaren Daten begrenzt

Mindestens vorgesehen sind:

- Seitenaufrufe, Besucher und Besuche
- zeitliche Entwicklung nach Tagen, Wochen und Monaten
- meistbesuchte Seiten und Einstiegsseiten
- Herkunftskanäle und verweisende Seiten
- Auswertung von mit Kampagnenparametern versehenen Links, insbesondere aus LinkedIn
- geografische Auswertung in angemessener, nicht personenbezogener Granularität
- Geräteklassen, Browser und Betriebssysteme
- Aufenthalts- und Interaktionskennzahlen, soweit datenschutzfreundlich verfügbar
- externe Linkklicks, Downloads, Formulare und 404-Aufrufe
- Filterung beziehungsweise angemessene Behandlung automatisierter Bot-Zugriffe

### 5.2 Projektspezifische Ereignisse

Für das SAP Transformation Lab sollen insbesondere folgende Interaktionen messbar werden:

- Öffnen des Evidence Centers
- Öffnen einzelner Projekt- und Gate-Seiten
- Anzeigen beziehungsweise Vergrößern eines SAP-Screenshots
- Aufruf einer Personen-Detailseite über „Mehr“
- Öffnen einer Business Episode oder Off-Duty-Geschichte
- Aufruf einzelner Geschäftsfeld- und Produktseiten
- Klick zum LinkedIn-Profil
- Download eines bereitgestellten Projektdokuments
- Absenden beziehungsweise Auslösen einer Kontaktaufnahme

Ereignisnamen und Parameter werden zentral definiert, damit die Auswertungen dauerhaft vergleichbar bleiben.

### 5.3 Google-Sichtbarkeit

Google Search Console soll für die spätere öffentliche Website eingerichtet beziehungsweise technisch vorbereitet werden. Ausgewertet werden sollen insbesondere:

- Impressionen in der Google-Suche
- Klicks und Klickrate
- durchschnittliche Suchposition
- Suchanfragen
- erfolgreiche und schwache Zielseiten
- Länder, Geräte und zeitliche Entwicklung
- Indexierungsprobleme

### 5.4 Technische Performance und Qualität

Für reale Besucherperformance ist derzeit Cloudflare Web Analytics im kostenlosen Tarif als mögliche Ergänzung vorgesehen. Beim Start wird geprüft, ob es für den dann geltenden Hosting- und Domainaufbau die beste kostenneutrale Lösung ist.

Zusätzlich soll der Build automatisierte Qualitätsprüfungen enthalten:

- Lighthouse-Auswertung
- Core Web Vitals beziehungsweise vergleichbare Kennzahlen
- Performance, Barrierefreiheit, SEO und Best Practices
- Prüfung defekter interner und externer Links
- Prüfung fehlender Alternativtexte
- Warnungen bei übergroßen oder ungeeigneten Bildern
- Erkennung wesentlicher Verschlechterungen gegenüber dem vorherigen Stand

Analytics-Skripte werden ausschließlich in der Produktionswebsite aktiviert, nicht in lokalen oder herunterladbaren Prototyp-Vorschauen.

### 5.5 Monatliche Auswertung

Das Messkonzept soll eine regelmäßige gemeinsame Auswertung ermöglichen. Ein Monatsbericht kann mindestens enthalten:

- Reichweitenentwicklung
- wichtigste Besucherquellen und Kampagnen
- erfolgreichste Inhalte
- Google-Suchbegriffe und Sichtbarkeit
- Interesse an Projekten, Gates und SAP-Nachweisen
- Nutzung des Evidence Centers
- technische Performance und Qualitätsabweichungen
- daraus abgeleitete redaktionelle und technische Empfehlungen

Export- beziehungsweise API-Möglichkeiten sind bei der Produktauswahl zu berücksichtigen, damit die Messdaten gemeinsam analysiert werden können.

### 5.6 Datenschutz und Abgrenzung

- Datenschutzerklärung, Anbieterinformationen und gegebenenfalls Auftragsverarbeitungsvereinbarungen werden passend zur endgültigen Lösung ergänzt.
- Die Notwendigkeit einer Einwilligung wird anhand der konkreten Konfiguration vor Veröffentlichung geprüft.
- Es werden keine unnötigen dauerhaften Besucherprofile aufgebaut.
- IP-basierte B2B- beziehungsweise Unternehmensidentifikation wird in der ersten öffentlichen Version nicht eingebaut.
- Eine spätere Einführung von Unternehmensidentifikation wäre eine gesonderte Entscheidung nach Prüfung von Zuverlässigkeit, Nutzen, Kosten und Datenschutzfolgen.
- Unternehmensinteresse soll zunächst über Kampagnenparameter, freiwillige Kontaktangaben und aggregierte Interaktionen erkennbar werden.

### 5.7 Verbindliche Kostenvorgabe

- Das gesamte Messkonzept muss ohne zusätzliche Kosten betrieben werden können.
- Vorhandene kostenlose Möglichkeiten von GitHub, Google und Cloudflare dürfen genutzt werden.
- Kostenlose Nutzungskontingente anderer Anbieter sind nur zulässig, wenn keine automatische kostenpflichtige Hochstufung oder Abrechnung erfolgt.
- Keine kostenpflichtige Analytics-Plattform, kein zusätzlich angemieteter Server und keine kostenpflichtige B2B-Besuchererkennung.
- Sollte eine gewünschte Detailfunktion nicht seriös und datenschutzverträglich kostenfrei realisierbar sein, wird sie weggelassen oder durch eine einfachere aggregierte Messung ersetzt.

## 6. Zusätzliche fachliche und gestalterische Ausbaupunkte

Die folgenden Punkte werden für den nächsten Prototyp als vereinbarte Zielrichtung aufgenommen. Sie ergänzen das bestehende Grunddesign, stellen es aber nicht infrage.

### 6.1 Einheitliches Projektcockpit

Projekt- und Gate-Seiten erhalten einen konsistenten Projektpass mit mindestens:

- Projektname
- aktuellem Gate und Status
- System beziehungsweise Release
- relevanten Organisationseinheiten
- beteiligten SAP-Modulen
- Produkt- und Prozessbezug
- letztem nachgewiesenem Ergebnis
- nächstem geplanten Schritt
- letzter Aktualisierung

### 6.2 Evidence Standard

Es wird eine verständliche Methodenseite vorbereitet, die erklärt:

- wann etwas als geplant, entschieden, konfiguriert oder getestet gilt
- wann ein öffentlicher Nachweis als veröffentlicht gilt
- wie Evidence-IDs aufgebaut sind
- wie Testziel, Durchführung, Ergebnis, Aussage und offene Punkte dokumentiert werden
- wie Screenshots ausgewählt und auf Veröffentlichungsfähigkeit geprüft werden

Jeder veröffentlichte Nachweis soll mindestens Evidence-ID, Projekt, Gate, Modul beziehungsweise Prozess, belegte Aussage, Status und Aufnahmedatum enthalten.

### 6.3 Verbindliche Klarstellung zu LLSG-Screenshots

LLSG ist eine fiktive Company und die innerhalb von LLSG verwendeten Geschäfts-, Stamm- und Bewegungsdaten sind synthetisch. Eine pauschale Anonymisierung oder Pseudonymisierung dieser Daten ist deshalb nicht erforderlich und soll nicht vorgenommen werden.

Insbesondere dürfen für die Nachvollziehbarkeit grundsätzlich sichtbar bleiben:

- LLSG-Organisationskennungen wie LS01 und LS10
- fiktive Materialien und Produkte wie LLSG-PH-101 beziehungsweise CHRONUNDO
- fiktive Geschäftspartner
- LLSG-Bestell-, Material-, FI-, Prüf- und Chargenbezüge
- Mengen, Werte, Bewegungsarten, Konten und Status, soweit sie ausschließlich das fiktive LLSG-Szenario betreffen

Vor Veröffentlichung erfolgt stattdessen eine gezielte Prüfung auf echte, fremde oder sicherheitsrelevante Informationen. Zu entfernen, auszuschneiden oder unkenntlich zu machen sind insbesondere:

- Daten anderer Benutzer oder Unternehmen aus der gemeinsam genutzten Sandbox
- andere Buchungskreise, Werke, Geschäftspartner, Materialien oder Belege außerhalb von LLSG
- reale personenbezogene Daten und Benutzerkennungen, soweit sie nicht bewusst öffentlich sein sollen
- Hostnamen, Systemadressen, IP-Adressen, Mandanten- und Verbindungsdetails, sofern sicherheitsrelevant
- Zugangsdaten, Tokens, Schlüssel und sonstige Authentifizierungsinformationen
- nicht zum Nachweis gehörende Browser-, Desktop-, Benachrichtigungs- oder Sitzungsinformationen

Ziel ist nicht die Verfremdung des LLSG-Nachweises, sondern die Entfernung sachfremder oder schutzbedürftiger Informationen. Saubere LLSG-Belegketten sollen möglichst vollständig und konsistent sichtbar bleiben.

### 6.4 Getrennte Statusdimensionen

Umsetzungsstatus und öffentlicher Nachweisstatus werden getrennt geführt. Eine mögliche Grundsystematik ist:

- Umsetzung: Idee, geplant, entschieden, konfiguriert, getestet
- Nachweis: nicht veröffentlicht, vorbereitet, veröffentlicht

Die endgültigen deutsch- beziehungsweise englischsprachigen Bezeichnungen werden vor der Umsetzung konsistent festgelegt.

### 6.5 Durchgängige Rückverfolgbarkeit

Soweit fachlich sinnvoll, werden Beziehungen zwischen folgenden Artefakten sichtbar gemacht:

- geschäftlicher Bedarf oder Business Episode
- fachliche Entscheidung
- Architektur- beziehungsweise Designentscheidung
- SAP-Konfiguration oder Entwicklung
- Testfall und Ergebnis
- veröffentlichter Nachweis

Die Verknüpfungen sollen in beide Richtungen funktionieren und aus strukturierten Metadaten erzeugt werden.

### 6.6 Produktdossiers

Produktseiten sollen als strukturierte Dossiers aufgebaut werden und je nach Reifegrad enthalten können:

- Produktbild und bewusst fiktive Produktbeschreibung
- Geschäftsfeld und Produktstatus
- Verpackung, Mengeneinheiten und logistische Merkmale
- chargen-, seriennummern- oder equipmentbezogene Anforderungen
- relevante SAP-Stammdaten und Prozesse
- zugehörige Projekte, Gates und Nachweise
- beteiligte fiktive Personen
- sichtbare Kennzeichnung der Fiktivität

### 6.7 Systemlandkarte

Für einen späteren Ausbau wird eine hochwertige, verständliche Systemlandkarte vorbereitet, die Geschäftsfelder, End-to-End-Prozesse, SAP-Module und technische Komponenten miteinander verbindet. Sie soll nicht wie eine überladene SAP-Gesamtgrafik wirken und bei Bedarf schrittweise beziehungsweise interaktiv erschlossen werden können.

### 6.8 Verbindung von Story und SAP-Build

Geeignete Business Episodes sollen auf den daraus entstehenden fachlichen Bedarf, das Projekt oder den SAP-Nachweis verweisen. Technische Seiten sollen umgekehrt auf den verständlichen geschäftlichen Hintergrund verweisen können. Inside LLSG und die technische Dokumentation bleiben klar unterscheidbar, werden aber nachvollziehbar miteinander verbunden.

### 6.9 Suche, Filter und Mehrfachausgabe

Für den wachsenden Inhaltsbestand werden vorbereitet beziehungsweise später ergänzt:

- kostenneutrale statische Volltextsuche
- Filter im Evidence Center nach Prozess, Modul, Gate, Status, Belegart und Produkt
- automatisch erzeugte druckbare Gate- und Projektzusammenfassungen
- PDF- beziehungsweise Portfoliofassungen aus denselben strukturierten Quelldaten
- gebrandete Social-Media-Vorschaubilder für wichtige Seiten
- kuratierter Bereich „Neu im Lab“ und später optional ein kostenfreier RSS-Feed

### 6.10 Diskussionsmöglichkeit

Nach einer späteren öffentlichen Freigabe kann eine dezente Verknüpfung geeigneter Seiten mit thematisch passenden GitHub Discussions vorgesehen werden. Offene Kommentarbereiche auf jeder Seite sind nicht vorgesehen.

### 6.11 Bewusste Begrenzung

Weiterhin nicht vorgesehen sind:

- eigene Seiten für jede SAP-Transaktion
- Hauptmenüpunkte für jedes SAP-Modul
- unkommentierte Screenshot-Sammlungen
- zahlreiche leere Zukunftsseiten
- austauschbare fiktive Bereiche wie Karriere oder Investor Relations, die den Eindruck eines realen Unternehmens verstärken könnten
- übermäßige Animationen, Slider oder technische Spielereien
- ein überladenes Dashboard auf der Einstiegsseite

## 7. Optionales Kontaktformular

Ein Kontaktformular wird als sinnvoller, aber noch nicht terminierter Ausbaupunkt in den Backlog aufgenommen. Ob und wann es umgesetzt und öffentlich aktiviert wird, wird später entschieden.

### 7.1 Zweck und Abgrenzung

- Das Formular dient der Kontaktaufnahme mit Joachim Schirra als Betreiber des privaten SAP Transformation Lab.
- Es darf nicht den Eindruck erwecken, Besucher nähmen Kontakt mit der fiktiven Long Life Sciences GmbH auf.
- Die Fiktivität von LLSG wird auf der Kontaktseite unmittelbar und verständlich klargestellt.
- Mögliche Anlässe sind fachlicher Austausch, Feedback, beruflicher Kontakt, technische Fragen und sonstige Nachrichten.

### 7.2 Platzierung

- kein zusätzlicher Hauptmenüpunkt, solange die Navigation bereits ausgelastet ist
- Zugang über Footer und About-Seite
- optional dezenter Kontaktaufruf am Ende ausgewählter Projekt- oder Evidence-Seiten
- zusätzlicher alternativer Kontaktweg über Joachims LinkedIn-Profil

### 7.3 Vorgesehene Felder

- Name
- E-Mail-Adresse
- Unternehmen, ausdrücklich optional
- Anlass beziehungsweise Themenauswahl
- Nachricht

Nicht vorgesehen sind unnötige Pflichtangaben, Telefonnummer, Anschrift, Dateiupload oder eine mit dem Kontaktformular vermischte Newsletter-Anmeldung.

### 7.4 Datenschutz und Messung

- Übermittelte Formulardaten dürfen nicht an das Analytics-System weitergegeben werden.
- Als Analytics-Ereignis darf ausschließlich die erfolgreiche Übermittlung ohne Inhalte und personenbezogene Parameter gezählt werden.
- Datenschutzerklärung, Zweck, eingesetzter Dienst, Speicherdauer und Löschverfahren werden vor Aktivierung ergänzt und geprüft.
- Es werden nur die für die Bearbeitung der Anfrage erforderlichen Daten erhoben.

### 7.5 Spam-Schutz und Kosten

- Die Lösung muss die verbindliche Vorgabe vollständiger Kostenneutralität erfüllen.
- Keine automatische kostenpflichtige Hochstufung oder Abrechnung.
- Ein kostenloser Spam-Schutz wie Cloudflare Turnstile kann geprüft werden.
- Ein externer Formulardienst oder eine kostenlose Serverfunktion wird erst vor der tatsächlichen Umsetzung anhand der dann gültigen Tarife, Limits, Datenschutzbedingungen und Zuverlässigkeit ausgewählt.
- Überschreitungen eines kostenlosen Kontingents müssen Anfragen kontrolliert ablehnen beziehungsweise die Funktion deaktivieren, statt Kosten auszulösen.

### 7.6 Umsetzungsstatus

Status: als Option beschlossen, Umsetzung und Aktivierung noch nicht beschlossen.

## 8. Signature-Feature: LLSG X-Ray

LLSG X-Ray wird als außergewöhnliches interaktives Highlight-Feature in den Backlog aufgenommen. Ziel ist eine schrittweise, synchronisierte Darstellung eines real umgesetzten LLSG-Geschäftsvorgangs aus drei Perspektiven.

### 8.1 Drei Perspektiven

- **Business:** Was geschieht fachlich innerhalb der fiktiven LLSG?
- **SAP X-Ray:** Welche SAP-Objekte, Module, Organisationseinheiten und Integrationen sind beteiligt?
- **Proof:** Welche geprüften LLSG-Nachweise und Evidence-IDs belegen den jeweiligen Schritt?

Die Perspektiven sollen innerhalb desselben Szenarios umschaltbar beziehungsweise gemeinsam nachvollziehbar sein.

### 8.2 Pilotfall Gate 2

Der erste mögliche Pilot ist Gate 2 – Goods Receipt & Quality mit mindestens folgenden Schritten:

1. Lieferung von CHRONUNDO an Werk LS10
2. Wareneingang mit Bewegungsart 101
3. Materialbeleg
4. automatisch erzeugter FI-Beleg
5. Charge und Prüflos
6. Ergebniserfassung und positive Verwendungsentscheidung
7. Überführung in den frei verwendbaren Bestand

Jeder Schritt kann enthalten:

- verständliches Business-Ereignis
- SAP-Aktion und Ergebnis
- beteiligte Module und Organisationseinheiten
- betroffene SAP-Objekte
- Status
- Evidence-ID
- zugehörigen LLSG-Screenshot
- optional eine sehr kurze passende Story-Notiz aus der LLSG-Welt

### 8.3 Gestalterische Leitlinie

- hochwertige Einbindung in die bestehende Navy-Gold-Gestaltung
- schrittweise Fortschrittsdarstellung statt überladener Gesamtgrafik
- klare Hervorhebung des jeweils aktiven Prozessschritts
- sachliche SAP-Darstellung bleibt dominant; Figuren- und Storyelemente werden sparsam eingesetzt
- keine Nachbildung der SAP-Fiori-Oberfläche und keine irreführende Produktdarstellung
- vollständig per Tastatur bedienbar und mit verständlicher nicht-interaktiver Fallback-Darstellung

### 8.4 Technische Leitlinie

- Umsetzung mit Jekyll, HTML, CSS und möglichst wenig eigenem JavaScript
- keine externe Datenbank und kein kostenpflichtiger Dienst
- keine zusätzlichen laufenden Kosten
- Inhalte aus strukturierten Daten beziehungsweise Jekyll Collections
- keine doppelte redaktionelle Pflege: Gate-Seite, Evidence Center und X-Ray verwenden dieselben Quelldaten
- Analytics darf nur aggregierte Interaktionen wie gestartete Szenarien, erreichte Schritte oder geöffnete Nachweise messen
- gute Performance auch auf mobilen Geräten

### 8.5 Redaktionelle Pflege

Das geplante Redaktionssystem soll für X-Ray-Schritte mindestens folgende Felder bereitstellen können:

- Szenario und Schrittfolge
- Business-Ereignis
- SAP-Aktion
- beteiligte Module
- SAP-Objekte und Organisationseinheiten
- Ergebnis und Status
- Evidence-ID und Screenshot
- optionale Story-Notiz

### 8.6 Spätere Szenarien

Nach erfolgreicher Erprobung von Gate 2 können weitere Szenarien ergänzt werden, insbesondere:

- First Purchase Order
- Negative Quality Case
- Invoice Verification
- Payment Run
- erster Order-to-Cash-Prozess
- Retouren- oder Reklamationsfall

### 8.7 Umsetzungsstatus

Status: als Signature-Feature in den Backlog aufgenommen. Die konkrete Umsetzungstiefe im nächsten Prototyp wird vor dessen Start festgelegt; Gate 2 ist der bevorzugte Pilotfall.
