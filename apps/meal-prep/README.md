# Vorrat · Meal Prep

Buildfreie Mini-App mit HTML, CSS und JavaScript-Modulen. Im Repository mit einem statischen HTTP-Server öffnen (z. B. `python3 -m http.server 8000` aus dem Repository und dann `/apps/meal-prep/`). Module benötigen HTTP statt `file://`.

## Neue Rezepte hinzufügen – auch in einer neuen Codex-Sitzung

Die Regeln liegen im Projekt; der alte Chat muss dafür nicht mitgegeben werden. Neue Sitzungen im selben Repository starten und die Anweisungsdatei im Auftrag ausdrücklich nennen.

1. Einen Quellenordner anlegen, z. B. `apps/meal-prep/inbox/sunday-meal-prep/woche-06/`.
2. Screenshots vollständig und in Leserichtung ablegen, z. B. `01-uebersicht.jpg`, `02-zutaten.jpg`, `03-vorbereitung.jpg`, `04-gerichte.jpg`.
3. Die [leere Vorlage](inbox/quelle.json) als `quelle.json` in den neuen Ordner kopieren. Bekannte Angaben oder Wünsche ergänzen; alles Unbekannte bleibt `null`. `status` steht bereits auf `new`. Dateinamen müssen nicht eingetragen werden: Bei `files: null` liest Codex alle Bild- und PDF-Dateien direkt im Quellordner in numerischer Reihenfolge (z. B. `01`, `02`, …, `10`). Buch und Originaltitel können auch im Auftrag genannt oder aus den Bildern ermittelt werden.
4. Den folgenden Prompt mit angepasstem Quellordner verwenden. Buch, Originaltitel und weitere Metadaten liest Codex automatisch aus der dortigen `quelle.json`.
5. Nach dem Import Änderungen und offene Angaben in `import-notizen.md` im Quellordner nachlesen. Das Quellenmaterial bleibt unverändert; neue Kombis erscheinen in der App.

Aktuelle Buch-IDs: `sunday-meal-prep`, `cook-once`, `meal-prep`. Neue Bücher können mit Titel und Autor ergänzt werden.

### Beispiel-Prompt zum Kopieren

```text
Bitte arbeite neue Rezept-Kombis in apps/meal-prep ein.
Lies zuerst apps/meal-prep/AGENTS.md und apps/meal-prep/REZEPT-IMPORT.md.

Quelle: apps/meal-prep/inbox/sunday-meal-prep/woche-06/

Sieh alle angegebenen Screenshots an. Vereinfache stark, mit Fokus auf
tragende Zutaten und ihre Wiederverwendung in mehreren Mahlzeiten.
Bonusgerichte ignorieren; große Wochenpläne in Kombis mit 2–4 Gerichten teilen.
Originaltitel und Fundstelle erhalten. Originalportionen beibehalten,
sofern die Metadaten keine anderen Zielportionen vorgeben.

Keine fehlenden Mengen erfinden. Bereits importierte Quellen prüfen,
Duplikate vermeiden und Änderungen/offene Angaben in import-notizen.md
festhalten. Ergänze die Daten im bestehenden Modell, ohne die App umzubauen.
Führe das Prüfskript aus und gleiche Einkaufsmengen mit der Quelle ab.
Berichte kurz über neue Kombis, Wiederverwendung und Vereinfachungen.
```

Der Ordner `woche-06` ist im Prompt nur ein Beispiel und noch nicht angelegt. Alternativ können Bilder im Chat angehängt werden: die Quellenzeile entsprechend ersetzen und Buch, Originaltitel und bekannte Seiten im Prompt nennen. Chat-Anhänge werden dadurch nicht automatisch lokal archiviert.

### Dateien und Beispiel

- [AGENTS.md](AGENTS.md): dauerhafte Projektregeln für Codex.
- [REZEPT-IMPORT.md](REZEPT-IMPORT.md): Ablauf, Metadatenfelder, Datenkonventionen und ausführlicher Prompt.
- [Beispielordner](inbox/_beispiel-couscous/README.md): ausgefüllte Quelle, Importnotizen und [vollständiger Beispieldatensatz](inbox/_beispiel-couscous/datensatz.json), basierend auf der bestehenden Couscous-Kombi. Keine Bilder, kein neuer Importauftrag; nicht doppelt übernehmen.
- [Prüfskript](scripts/check-data.mjs): ohne zusätzliche Pakete mit Node.js ausführen.

Die Inbox ist eine nachvollziehbare Quellenablage. Dateien hineinzulegen startet keinen automatischen Import; der Codex-Auftrag ist der Auslöser. Nur `data.js` und `cookbooks.js` werden von der App geladen.

### Daten prüfen

Vom Repository-Stamm aus:

```sh
node apps/meal-prep/scripts/check-data.mjs
node apps/meal-prep/scripts/check-data.mjs --self-test
node apps/meal-prep/scripts/check-data.mjs apps/meal-prep/inbox/_beispiel-couscous/datensatz.json
```

Geprüft werden eindeutige IDs, Pflichtfelder/Quellen, gültige Buch-/Rezept-/Zutatenreferenzen, positive Mengen, vollständige Baustein-Aufteilung, verwaiste Rezepte/Bausteine, Einkaufssummen und Skalierung, tragende Zutaten sowie Suchbarkeit. `--self-test` prüft zusätzlich die Erkennung von acht absichtlich fehlerhaften Datenvarianten. Bei Fehlern endet das Skript mit einem Fehlerstatus. Die Prüfung ergänzt den manuellen Abgleich mit den Rezeptbildern; sie bestätigt keine korrekte Texterkennung oder Garzeiten.

## Datenmodell

`data.js` enthält ausschließlich Rohdaten. IDs bleiben stabil und verbinden:

- **cookbooks**: separat in `cookbooks.js`, mit Titel und Autorin. `combos.bookId` verweist auf das Buch; `bookReference` beschreibt die Fundstelle (Woche oder Rezepttitel). Keine erfundenen Seitenzahlen.
- **ingredients**: kanonischer Name und eine feste Einkaufseinheit pro Zutat.
- **batches**: einmal vorbereitete Bausteine, ihre gesamten Rohzutaten und Arbeitsschritte.
- **recipes**: Tagesmahlzeiten, Anteile an Bausteinen (`share: 0.5` = Hälfte), zusätzliche frische Zutaten und Schritte.
- **combos**: zusammengehörige Bausteine und Rezepte; `baseServings` gilt pro Mahlzeit.

`model.js` konstruiert einen `Catalog` und Instanzen von `Cookbook`, `Ingredient`, `Recipe`, `Combo`. Klassenmethoden liegen auf den Prototypen; zusätzliche Vererbungshierarchien sind nicht nötig. `Combo.shoppingList(servings)` summiert jeden Baustein genau einmal und ergänzt frische Rezeptzutaten. `matches(query)` sucht mit UND-Verknüpfung über Suchwörter. Mengen skalieren linear; Einheiten werden nicht automatisch umgerechnet. Für dieselbe Zutat immer dieselbe Einheit verwenden. Baustein-Anteile einer Kombi müssen zusammen 100 % ergeben und werden beim Start geprüft.

Die Einkaufsliste markiert vorhandene Zutaten per ID. Nur diese Häkchen werden in `localStorage` gespeichert. Es gibt keine Datenbank, Benutzerkonten oder Netzwerk-Schreibzugriffe. Die Häkchen sind keine mengenbasierte Vorratsverwaltung.

## Buchrezepte übernehmen

1. Zutaten vereinheitlichen und vorhandene IDs wiederverwenden.
2. Gemeinsame Vorbereitungen als Bausteine formulieren; Mengen für die ganze Kombi erfassen.
3. Pro Rezept den verwendeten Anteil und nur zusätzliche Zutaten eintragen.
4. Kombination mit 2–4 Rezepten verknüpfen. Die Oberfläche erzeugt automatisch weitere Tageskarten.
5. `bookId`, Fundstelle (`bookReference`), Anpassungen und Original-Portionen ergänzen. Neue Bücher einmal in `cookbooks.js` erfassen. `Combo.book` löst die Zuordnung auf; ungültige Buch-IDs werden beim Start abgewiesen.

Noch offen: Eingabeoberfläche/Import für neue Kombis, mengenbasierte Vorräte, geprüfte Lagerungshinweise je Originalrezept. Aktuell erfolgt die Erfassung bewusst direkt in den Rohdaten.

## Übernommene Kombi: Hauptdarsteller Couscous

Aus den bereitgestellten Screenshots vereinfacht, mit Originalmengen: zwei Gerichte à zwei Portionen, 45 Minuten Gesamtvorbereitung. Couscous samt Brühe und die gemeinsam aufgeteilten Zutaten Feta, Zucchini und Tomaten sind Bausteine mit je 50 % Verwendung. Alle übrigen Zutaten stehen beim jeweiligen Gericht. Beide Gerichte werden am Prep Day fertiggestellt; Tagesnummern sind ein Verzehrvorschlag. Quelle: „Meal Prep“ von Lena Merz, Rezept „Hauptdarsteller Couscous“. Seitenzahl noch offen. Tomaten werden im gesamten Katalog in Stück geführt.

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

## Kochbücher und Zuordnung

- **Sunday Meal Prep vegetarisch**, Keda Black → beide Woche-05-Kombis.
- **Cook Once, Eat All Week**, Cassy Joy Garcia → Pute, Kürbis und Kohl (Woche 18).
- **Meal Prep**, Lena Merz → Hauptdarsteller Couscous.

Titel und Autorinnen nach den bereitgestellten Covern. Seitenzahlen werden erst mit bestätigter Fundstelle ergänzt. Buchangaben stehen auf den Kombi-Karten, in den Details und in der Kochbuchübersicht. Tagesrezepte gehören über ihre Kombi zur jeweiligen Quelle; gemeinsame Rezeptdatensätze brauchen keine doppelte Buchzuordnung. Die ursprünglichen frei erstellten Kombis und ihre exklusiven Rezepte/Bausteine wurden entfernt.

`combos.originalTitle` bewahrt den Originaltitel bzw. Wochen-Titel unabhängig vom kurzen App-Titel. Er erscheint auf Kombi-Karten, im Buchverweis und in der Kochbuchübersicht und ist über die Suche auffindbar. Beide Sunday-Kombis gehören zum Original „Woche 05“; `bookReference` präzisiert die zugehörigen Gerichte.

## Tragende Zutaten

`Combo.ingredientUses` zählt unterschiedliche Tagesgerichte pro Zutat, über Bausteine und direkte Rezeptzutaten hinweg. `keyIngredients` enthält Zutaten in mindestens zwei Gerichten, absteigend nach Verwendungen. `ingredients.supporting: true` nimmt Öl, Brühe und Gewürze aus dieser Hervorhebung aus; sie bleiben in Mengen und Einkaufsliste enthalten. Die Schlüsselzutaten stehen auf Cards zuerst, mit „↳“ und Anzahl der Gerichte. Details zeigen dieselbe Übersicht und markieren die Zutatennamen in Prep, Tageskarten und Einkaufsliste.
