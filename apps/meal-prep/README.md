# Vorrat · Meal Prep

Buildfreie Mini-App mit HTML, CSS und JavaScript-Modulen. Im Repository mit einem statischen HTTP-Server öffnen (z. B. `python3 -m http.server 8000` aus dem Repository und dann `/apps/meal-prep/`). Module benötigen HTTP statt `file://`.

## Datenmodell

`data.js` enthält ausschließlich Rohdaten. IDs bleiben stabil und verbinden:

- **ingredients**: kanonischer Name und eine feste Einkaufseinheit pro Zutat.
- **batches**: einmal vorbereitete Bausteine, ihre gesamten Rohzutaten und Arbeitsschritte.
- **recipes**: Tagesmahlzeiten, Anteile an Bausteinen (`share: 0.5` = Hälfte), zusätzliche frische Zutaten und Schritte.
- **combos**: zusammengehörige Bausteine und Rezepte; `baseServings` gilt pro Mahlzeit.

`model.js` konstruiert einen `Catalog` und Instanzen von `Ingredient`, `Recipe`, `Combo`. Klassenmethoden liegen auf den Prototypen; zusätzliche Vererbungshierarchien sind nicht nötig. `Combo.shoppingList(servings)` summiert jeden Baustein genau einmal und ergänzt frische Rezeptzutaten. `matches(query)` sucht mit UND-Verknüpfung über Suchwörter. Mengen skalieren linear; Einheiten werden nicht automatisch umgerechnet. Für dieselbe Zutat immer dieselbe Einheit verwenden. Baustein-Anteile einer Kombi müssen zusammen 100 % ergeben und werden beim Start geprüft.

Die Einkaufsliste markiert vorhandene Zutaten per ID. Nur diese Häkchen werden in `localStorage` gespeichert. Es gibt keine Datenbank, Benutzerkonten oder Netzwerk-Schreibzugriffe. Die Häkchen sind keine mengenbasierte Vorratsverwaltung.

## Buchrezepte übernehmen

1. Zutaten vereinheitlichen und vorhandene IDs wiederverwenden.
2. Gemeinsame Vorbereitungen als Bausteine formulieren; Mengen für die ganze Kombi erfassen.
3. Pro Rezept den verwendeten Anteil und nur zusätzliche Zutaten eintragen.
4. Kombination mit 2–4 Rezepten verknüpfen. Die Oberfläche erzeugt automatisch weitere Tageskarten.
5. Quellenangabe und Original-Portionen bei der Übernahme ergänzen; die aktuellen Inhalte sind frei erstellte Beispiele.

Noch offen: Eingabeoberfläche/Import für neue Kombis, mengenbasierte Vorräte, geprüfte Lagerungshinweise je Originalrezept. Aktuell erfolgt die Erfassung bewusst direkt in den Rohdaten.

## Übernommene Kombi: Hauptdarsteller Couscous

Aus den bereitgestellten Screenshots vereinfacht, mit Originalmengen: zwei Gerichte à zwei Portionen, 45 Minuten Gesamtvorbereitung. Couscous samt Brühe und die gemeinsam aufgeteilten Zutaten Feta, Zucchini und Tomaten sind Bausteine mit je 50 % Verwendung. Alle übrigen Zutaten stehen beim jeweiligen Gericht. Beide Gerichte werden am Prep Day fertiggestellt; Tagesnummern sind ein Verzehrvorschlag. Buch/Seite sind noch unbekannt. Tomaten werden im gesamten Katalog in Stück geführt; die freie Tomaten-Bohnen-Beispielkombi verwendet jetzt sechs Stück.

## Pute, Kürbis, Schwarzkohl

Drei Hauptgerichte aus den Woche-18-Screenshots, keine Bonusgerichte. Vereinfachungen und gerundete Umrechnungen stehen an der Kombi. Je vier Portionen als Datenbasis (Auflauf ursprünglich fünf); die Oberfläche skaliert auf die ausgewählte Portionszahl. Speck, aufwendiges Topping und Granatapfel entfallen. Karotten: 300 g als bewusste Anpassung wegen widersprüchlicher Angaben im Original. Putenbrust bleibt mit Knochen und Haut; keine implizite Umrechnung in Filet. Fleisch nach dem Garen tatsächlich in Drittel aufteilen; angezeigte Rohmengen sind Einkaufsanteile, keine Garerträge. Temperaturen: 300 °F ≈ 150 °C, 375 °F ≈ 190 °C, 165 °F ≈ 74 °C. Gesamt-Prep-Zeit grob 180 Minuten bei nacheinander belegtem Ofen.

Die Verwendungsübersicht wird für alle Kombis automatisch aus den Baustein-Anteilen erzeugt. Optionale `note`-Felder an Verwendungen erklären den Zustand (gewürfelt, zerzupft, roh).

## Woche 05: zwei kleine Kombis statt eines Wochenprojekts

Bewusste Neu-Kombination mit angepassten Mengen für je zwei Portionen, keine originalgetreue Rezeptübernahme:

- Tomaten-Paprika-Basis und Feta je halbiert → Shakshuka und Blumenkohl-Pasta. Die ursprünglich getrennten Saucen werden vereinheitlicht.
- Linsen je halbiert → Rote-Bete-Bowl und Spinat-Reis.
- Pilz-Karotten-Pfanne je halbiert → Spinat-Reis und Miso-Suppe.
- Joghurt-Dip je halbiert → Bowl und Reis.

Vorgegarte Rote Bete, frischer Reis am Verzehrtag, Gemüse als Suppeneinlage statt Absieben und Filo-Falten. Kein Bonuskuchen, Bulgur, separates Gewürzöl oder zusätzliche Toppings. Prep-Zeiten sind grobe Schätzungen für die Bausteine, Fertigstellung erfolgt in den Tageskarten.
