# Sportzeiten

Kleine, dependency-freie Website zum Erfassen und Anzeigen von Laufzeiten.

## Starten

```sh
node server.js
```

Danach `http://127.0.0.1:8080` öffnen. Die Übersichtsseite liest `data/runs.json`; das Formular unter „Lauf hinzufügen“ schreibt neue Einträge über den lokalen Server in dieselbe Datei.

## CSV erneut importieren

```sh
node tools/import-csv.js
```

Der Import ersetzt `data/runs.json`. Deshalb nur verwenden, wenn später hinzugefügte Einträge nicht erhalten werden müssen. Die CSV-Spalten für Pace, Geschwindigkeit und Hochrechnungen werden absichtlich nicht importiert, sondern aus Strecke und Dauer berechnet.
