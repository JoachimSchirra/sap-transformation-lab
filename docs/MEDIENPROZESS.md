# Medienprozess

## Ziel

Originale SAP-Screenshots, Persona-Bilder und Story-Grafiken sollen hochwertig wirken, ohne Repository und Seiten unnötig zu vergrößern.

## Ablage

1. redaktionelle Originaldatei prüfen;
2. keine Zugangsdaten, realen Personen- oder Kundendaten, internen URLs oder Lizenzverletzungen veröffentlichen;
3. Quelldatei ausschließlich lokal unter `_media-source/` ablegen; der Ordnerinhalt wird durch `.gitignore` nicht veröffentlicht;
4. aussagekräftigen Dateinamen in Kleinbuchstaben verwenden;
5. präzisen Alternativtext im zugehörigen CMS-Feld pflegen;
6. `npm run media` ausführen.

Der Optimierer akzeptiert nur unterstützte reguläre Rasterdateien, verwirft Symlinks und unbekannte Formate, begrenzt Dateigröße, Dimensionen und Pixelzahl, entfernt beim Neuschreiben Metadaten und erzeugt WebP- und AVIF-Varianten in 480, 800, 1200 und 1600 Pixel Breite. Alle Quellen und normalisierten Namen werden vor der ersten Ausgabe geprüft. Der vollständige Satz entsteht in einem Stagingverzeichnis und ersetzt `assets/images/generated/` kontrolliert; damit verschwinden auch zurückgezogene verwaltete Derivate. Nur diese Derivate werden committed und veröffentlicht.

Direkte Dateiuploads über Pages CMS sind deaktiviert. Bildfelder speichern ausschließlich einen bereits erzeugten Pfad unter `/assets/images/generated/`. Neue Originale werden lokal geprüft und ausschließlich über `npm run media` importiert. Sämtliche Dateien in diesem öffentlichen Ordner müssen im erzeugten `manifest.json` stehen, vollständig decodierbar und frei von EXIF-, ICC-, IPTC- und XMP-Metadaten sein. Seit V8.2.2 erzwingen Inhaltsvalidator, Preview-Builder und alle sechs CMS-Bildfelder denselben Derivatpfadstandard.

Favicon, Logos und Social Preview sind keine redaktionellen Medien. Sie liegen außerhalb von `generated/` in einer festen technischen Allowlist, die neben dem Pfad auch Format, Abmessungen und SHA-256 bindet. Auch diese Dateien werden vollständig decodiert, auf Pixelgrenzen und auf Metadaten geprüft. Neue oder ausgetauschte Markenassets erfordern deshalb eine bewusste Code- und Hashanpassung.

Der Optimierer verwaltet den kompletten Inhalt von `assets/images/generated/`. Manuell gepflegte Bilder gehören nicht in dieses Verzeichnis. Ein abgebrochener Vorprüfungslauf verändert den bisherigen veröffentlichten Satz nicht.

## Richtwerte

- normale Inhaltsgrafik: möglichst unter 250 KB;
- große Hero- oder Storygrafik: möglichst unter 500 KB;
- keine einzelne Webgrafik über 1,5 MB;
- Screenshots nicht stärker verkleinern, als es die Lesbarkeit von SAP-Feldern erlaubt.

## Evidence-Regel

Ein Screenshot wird erst als öffentlicher Nachweis geführt, wenn:

- der dargestellte Vorgang tatsächlich im LLSG-System erzeugt wurde;
- Gate, Systemkontext und Aussage dokumentiert sind;
- Bildinhalt, Zuschnitt und Alternativtext geprüft wurden;
- der Evidence-Status bewusst auf „Veröffentlicht“ gesetzt wurde.

Fiktive LLSG-Daten müssen nicht allein wegen ihrer Fiktivität anonymisiert werden. Sicherheitsrelevante Systemdetails, Zugangsdaten, echte Namen oder fremde Informationen bleiben dennoch ausgeschlossen.
