# Bahncardrechner
Datenschutzfreundliches Tool zur Berechnung, ob sich der Kauf einer Bahncard lohnt. Dafür werden die Tickets aus dem vergangenen Jahr des:der Nutzer:in des letzten Jahres analysiert, auf Basis der aus den PDF extrahierten Daten.
Alles im Browser und lokal auf dem Rechner.

Schritte:
1. Tickets sammeln (aus Mail herunterladen)
2. Tickets reinladen
3. Daten überprüfen
4. Schätzung: Mehr Reisen / Weniger Reisen | Kurzfristiger, Langfristiger
5. Ergebnis


## Roadmap
[x] Zug-Klasse extrahieren
    [x] Regex
    [x] View erstellen
[x] PDFs die nicht gelesen werden können
    [x] Ticket löschen
    [x] Meldung erstellen
[x] Fahrten nach Datum sotieren
    [x] Datum parsen
    [x] Nach Datum sotieren
[x] Zentrale Preis-Verwaltung price.js
[x] Input
    [x] Input Alter (Buttons)
    [x] Input Klasse (Buttons)
[] View anpassen
    [x] View in Tabelle umwandeln
        https://medium.com/allenhwkim/mobile-friendly-table-b0cb066dbc0e
    [] Drop-Downs für Ticket-Art, Klasse, Reisende, Bahncard
    [] Table-View in Drag & Drop
    [] Ticket via Tabelle hinzufügen
    [] Beispiel-Content anzeigen & Overlay: Drag & Drop oder eintippen
    [] Kopier-Funktion
    [] Feste Breiten für Tabelle
[] Regex Muster testen & updaten
[] Footer
    [] Impressum / Datenschutz-Link
[] Ergebnisse
    [] Analyse welches von den angezeigten das sinnvollste ist
    [] Inflationsberechnung
[] Design ...
    [] Mobil-Version verbessern

### Roadmap v2
[] Zentrale String Verwaltung strings.js (für potenziellen Language-Switch)
[] Tooltips mit Erklärungen
[] BahnCard-Fotos
[] Ergebnis-Modul (Alter, Klasse, Flexibilität)
    [] Mehr Fahren (View: Aktuell Fahrten, progonostiziert)
    [] Flexibler Fahren (View: Aktuell Flex vs. Sparpreis | progonostiziert ..)
    [] Preise
[] Monetarisierung
    [] Bei Affiliate Programm anmelden
    [] Fragen klären
    [] Einbetten & Cookie-Modal

# Struktur
1. Background
2. Fahrten & Input
3. Ergebnis (Input Alter & Klasse)
4. Prognose (Input Fahrtentwicklung, Flexibilität)
