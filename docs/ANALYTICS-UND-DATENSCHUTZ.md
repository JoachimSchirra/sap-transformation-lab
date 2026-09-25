# Analytics- und Datenschutzvorbereitung

## Status im Prototyp

Analytics ist in `_config.yml` deaktiviert. Der vorhandene Include ist nur ein Adapterpunkt: Solange `analytics.enabled` nicht bewusst auf `true` gesetzt und ein gültiger Token hinterlegt wird, wird weder ein externes Skript geladen noch eine Ereigniswarteschlange angelegt. Lokale Vorschauen und herunterladbare Einzeldateien laden keinerlei Analytics-Code.

## Vorgesehene kostenneutrale Bausteine

1. Cloudflare Web Analytics für aggregierte Reichweiten- und Performance-Grunddaten
2. Google Search Console für Suchsichtbarkeit und Indexierungsprobleme
3. Lighthouse CI für technische Qualitätsmessung
4. zentrale, inhaltsfreie Ereignisnamen über `data-track` für spätere Aktivierung

Die technische Vorbereitung ist keine Freigabe. Vor Aktivierung wird insbesondere geprüft, ob das gewählte Produkt noch kostenfrei verfügbar ist, welche Daten tatsächlich übertragen werden, ob eine Einwilligung erforderlich ist und wie dies in der Datenschutzerklärung beschrieben werden muss.

Vor einer öffentlichen Aktivierung werden die dann geltenden Tarife, Datenschutzbedingungen, Einwilligungserfordernisse und Kontingentgrenzen erneut geprüft. Eine automatische kostenpflichtige Hochstufung ist nicht zulässig.

## Nicht vorgesehen

- personenbezogene Besucherprofile
- Übertragung von Formularinhalten an Analytics
- kostenpflichtige B2B-Unternehmenserkennung
- Analytics in Offline-Prototypen
- Fingerprinting, Session-Replays oder Versuche, einzelne Unternehmen beziehungsweise Personen zu identifizieren

## Kampagnen

Links aus LinkedIn können später mit konsistenten UTM-Parametern versehen werden. Empfohlenes Muster: `utm_source=linkedin&utm_medium=social&utm_campaign=<kampagne>`.
