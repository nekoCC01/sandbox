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
