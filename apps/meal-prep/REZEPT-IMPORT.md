# Rezepte einarbeiten

## 1. Quellen ablegen

Pro Originalrezept oder Wochenplan einen Ordner anlegen:

```text
inbox/<bookId>/<originaltitel-slug>/
  quelle.json
  01-uebersicht.jpg
  02-zutaten.jpg
  03-vorbereitung.jpg
  04-gerichte.jpg
```

Dateinamen dürfen abweichen; nummerierte Namen erleichtern die Reihenfolge. Alle nötigen Rezeptseiten beilegen, nicht nur die Einkaufsliste. Screenshots im Chat bleiben möglich. Chat-Anhänge sind nicht automatisch als Dateien im Repository archiviert; nur tatsächlich vorhandene Dateien in `files` auflisten. Keine Platzhalterbilder erzeugen.

`inbox/_beispiel-couscous/` enthält eine ausgefüllte Metadatenvorlage und einen gültigen Datenausschnitt zum Orientieren, keine Bilder und keinen neuen Importauftrag.

## 2. Metadaten angeben

`quelle.json` ist eine kleine Begleitdatei, kein automatischer Importmechanismus:

| Feld | Bedeutung |
| --- | --- |
| `bookId` | Bestehende ID aus `cookbooks.js`; bei neuem Buch zunächst Titel und Autor ergänzen lassen. |
| `originalTitle` | Titel/Woche exakt wie im Buch, unabhängig vom App-Titel. |
| `pages` | Bestätigte Buchseiten als Liste, sonst `null`. PDF-Anzeigeseiten separat als `documentPages` angeben. |
| `originalServings` | Bekannte Original-Portionen; bei verschiedenen Gerichten getrennte Angaben. Unbekannt = `null`. |
| `targetServingsPerMeal` | Optionaler Wunsch; sonst Originalportionen beibehalten. |
| `files` | Tatsächlich im Ordner liegende Bild-/PDF-Dateien; bei Chat-Anhängen leer lassen. |
| `notes` | Besondere Wünsche, z. B. „vorgegarte Rote Bete verwenden“. |
| `status` | `new`, `needs-clarification` oder `imported`; Beispiel nutzt `example-already-imported`. |

Standard: Deutsch, metrisch, möglichst 2–4 Gerichte je Kombi, kurze Anleitung, Bonusgerichte auslassen, Fokus auf gemeinsame Zutaten. Dafür keine zusätzlichen Parameter nötig.

## 3. Einheitlicher Arbeitsablauf

1. Projektregeln, Metadaten, vorhandene Bücher und Zutaten lesen; alle angegebenen Bilder ansehen. Prüfen, ob die Quelle schon über `bookId` + `originalTitle` + Fundstelle eingearbeitet ist. Wochen können mehrere Kombis ergeben.
2. Originalportionen, Mengen und Verteilung herausarbeiten. Fehlende Angaben kennzeichnen. Bei kritischen Lücken keinen scheinbar fertigen Datensatz veröffentlichen.
3. Auf wenige Bausteine reduzieren. Wiederverwendung kann gemeinsames Garen oder Aufteilen einer Rohzutat sein; Zustand ausdrücklich beschreiben. Keine Wiederverwendung behaupten, die aus den Daten nicht entsteht.
4. Vereinfachen: Toppings und separate Saucen reduzieren, Zutaten vereinheitlichen, bei Bedarf Wochenplan teilen. Umstellungen sind erlaubt, müssen als Anpassung erkennbar bleiben. Kein vollständiges Originalrezept kopieren.
5. Daten in `data.js` einfügen. Neue Bücher in `cookbooks.js`. Quelle und Änderungen in der Kombi erhalten. Pro vorbereiteter Gesamtmenge müssen die Rezeptanteile genau 100 % ergeben. `baseServings` gilt für jedes Gericht, nicht für die gesamte Kombi.
6. `import-notizen.md` im Quellordner schreiben: angelegte Kombi-IDs, Herkunft, Originalportionen, angepasste Mengen, Umrechnungen, ausgelassene Teile, offene Fragen und Prüfungen. Danach `status` passend aktualisieren. Bei reinen Chat-Anhängen kann ein neuer nachvollziehbarer Quellenordner mit Metadaten/Notizen angelegt werden; nicht behaupten, die Bilder seien dort archiviert.
7. Prüfskript ausführen, Einkaufsmengen zusätzlich gegen die Quelle abgleichen. Automatische Prüfungen können weder Lesefehler noch die kulinarische Qualität bestätigen. Bei UI-Änderungen die Darstellung separat kontrollieren.

## 4. Datenkonventionen

- Zutaten: `id`, `name`, `unit`, optional `supporting: true`.
- Baustein: `id`, `name`, `color` (`orange`, `gold`, `green`), `ingredients: [{id, amount}]`, `steps`.
- Rezept: `id`, `name`, `day`, `batches: [{id, share, note?}]`, `ingredients` (nur zusätzliche Mengen), `steps`; optional `shortName`, `stepLabel`, `servingNote`.
- Kombi: `id`, `name`, `originalTitle`, `bookId`, `bookReference`, `subtitle`, `theme`, `prepMinutes`, `baseServings`, `recipes` (IDs), `batches` (IDs), `source`, `planNote`, `scalingNote`.

Eine Zutat hat eine feste Einheit. Keine rohe und gegarte Menge unter derselben Mengenannahme mischen. Unterschiedliche Roh-/Garzustände brauchen klar bezeichnete Zutaten oder eine dokumentierte, verlässliche Umrechnung. Einkaufsliste summiert Bausteine einmal und ergänzt direkte Zutaten. Rezeptanteile beziehen sich auf die gegarte Gesamtmenge; die UI zeigt dazu anteilige rohe Einkaufsmengen.

## 5. Beispiel-Prompt für eine neue Sitzung

Vom selben Repository aus starten; Pfad und Angaben ersetzen:

```text
Bitte arbeite neue Rezept-Kombis in apps/meal-prep ein.

Lies zuerst apps/meal-prep/AGENTS.md und REZEPT-IMPORT.md.
Quelle: apps/meal-prep/inbox/sunday-meal-prep/woche-06/
Metadaten: quelle.json in diesem Ordner.
Kochbuch: Sunday Meal Prep vegetarisch (bookId: sunday-meal-prep).
Originaltitel: Woche 06.

Sieh alle dort angegebenen Screenshots an. Vereinfache stark und konzentriere
Dich auf Zutaten, die mehrere Mahlzeiten tragen. Bonusgerichte ignorieren.
Bei mehr als vier Gerichten den Plan in kleine sinnvolle Kombis teilen.
Originaltitel und Fundstelle zum Nachschlagen erhalten.

Übernimm die Originalportionen, sofern quelle.json nichts anderes vorgibt.
Erfinde keine fehlenden Mengen; dokumentiere Anpassungen und offene Angaben.
Prüfe vorhandene Einträge, um Duplikate zu vermeiden.
Ergänze nur die Daten im bestehenden Modell und die Importnotizen.
Führe das Prüfskript aus und gleiche die Einkaufsmengen mit den Screenshots ab.
Berichte anschließend kurz über Kombis, Wiederverwendung und Änderungen.
```

Für Chat-Anhänge statt des Quellordners schreiben: „Quelle: die Screenshots dieser Nachricht. Kochbuch: … Originaltitel: … Seiten: unbekannt.“ Alle übrigen Regeln bleiben gleich.
