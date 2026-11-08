# Import Week 20

## Quelle, Portionen und Entscheidung

- „Cook Once, Eat All Week“, Cassy Joy Garcia, `cook-once`.
- Alle neun Screenshots `01.png`–`09.png` in numerischer Reihenfolge vollständig angesehen: Übersicht/Einkauf 01–02, Vorbereitung 03–06, drei Hauptgerichte 07–09. Keine Bonusgerichte übernommen.
- Originaltitel nach 01.png: „Week 20 - Baked Chicken Breast, Collard Greens, and Sweet Potatoes“. Tippfehler „Sweeht“ in `quelle.json` berichtigt. Buchseiten unbekannt; nur bestätigte Screenshot-Fundstellen verwendet.
- Vor Import weder Week-20-Kombi noch zugehörige Rezept-/Baustein-IDs vorhanden; andere Quellen unverändert.
- Originalportionen ausdrücklich in Bildern: **Chipotle Chicken Casserole: 5** (07.png), **Buffalo Chicken–Stuffed Sweet Potatoes: 4** (08.png), **Chicken Florentine Lasagna: 6** (09.png). Buchstandard vier hat hier keinen Vorrang.
- Das bestehende Modell verlangt eine einheitliche Portionszahl je Kombi und mindestens zwei Gerichte. Nutzer hat deshalb im Chat ausdrücklich **je vier Portionen** bestätigt. Zielwert 4 in Metadaten ergänzt; Originalportionen unverändert als Herkunft dokumentiert. Faktoren: 4/5, 1, 2/3. Insgesamt 12 Zielportionen statt 15 Originalportionen.

## Daten und Wiederverwendung

Neue Kombi `cook-once-week20`, drei Gerichte `cw20-chipotle`, `cw20-buffalo`, `cw20-lasagna`.

- `cw20-chicken`: einmal Hähnchen backen, gegart **36:45:40** aufteilen. Originalertrag 10 cups mit Verteilung 3/3/4 cups; nach Skalierung 2,4/3/2⅔ cups. Anteile werden als Verhältnis übernommen, ohne willkürliches Grammgewicht eines gegarten cups.
- `cw20-greens`: einmal Blattkohl dünsten, gegart **6:5** für Auflauf und Lasagne.
- `cw20-potatoes`: alles würfeln und einmal rösten, gegart **4:5** für Auflauf und Buffalo-Bowl. Beide Portionen mit gleichem Roh-/Garverfahren; keine gemischten Garzustände im Baustein.

Originaltitel aller Hauptgerichte und jeweilige Fundstelle in `bookReference`. `baseServings: 4` bedeutet vier Portionen je Gericht.

## Mengenabgleich

US-Maße: 1 lb = 453,59237 g; 1 oz = 28,349523 g; 1 US cup = 236,588 ml; EL/TL bleiben Löffelmaße. Nur fertige g/ml-Werte auf ganze Zahlen gerundet. Fahrenheit: 375 °F ≈ 190 °C, 400 °F ≈ 200 °C, 350 °F ≈ 180 °C. Garzeiten nicht proportional verkürzt.

| Einkauf im Import | Original / Rechnung |
| --- | --- |
| **1829 g Hähnchenbrust roh** | 5 lb × (3/10 × 4/5 + 3/10 + 4/10 × 2/3) = 1829,489 g; gerundet. Gesamtfaktor 121/150. |
| **121/150 EL Öl fürs Hähnchen** | 1 EL × gleicher Gesamtfaktor; nur einmal im Baustein |
| **22/15 Bund Collard Greens** | 2 Bund × (1/2 × 4/5 + 1/2 × 2/3). Keine Grammannahme je Bund. Einkauf praktisch auf ganze Bünde aufrunden, Überschuss nicht als Rezeptmenge behaupten. |
| **11/15 EL Öl für Kohl** | Original 1 EL × 11/15 |
| **7,2 mittelgroße Süßkartoffeln** | Vier für Auflauf × 4/5 = 3,2; vier für Buffalo unverändert. Original „8 (about 3 pounds)“ liefert kein verlässliches Einzelgewicht. Eigene Stück-ID statt vorhandener Gramm-ID, keine erfundene Umrechnung. Bruchteile anteilig verwenden; Einkauf auf ganze Knollen aufrunden. |
| **1,8 EL Öl für Süßkartoffeln** | 1 EL × 4/5 für ursprüngliche Würfel, 1 EL unverändert für ursprüngliche ganze Kartoffeln |
| **47 ml fertige Mayonnaise** | 1/4 US cup × 4/5 = 47,318 ml |
| **2,4 TL Paprika, 0,4 TL Chipotle, 0,4 TL Knoblauchpulver** | 1 EL Paprika (= 3 TL), je 1/2 TL Chipotle/Knoblauchpulver, jeweils × 4/5 |
| **118 ml Hot Sauce, 57 g Butter** | Buffalo bleibt bei vier Portionen: 1/2 US cup Sauce = 118,294 ml; 1/4 cup Butter durch bestätigte 2 oz in 01.png = 56,699 g. Butter als gewählte Originalalternative, kein Ghee/Öl zusätzlich. |
| **2/3 EL Öl, 2/3 weiße Zwiebel, 2 Knoblauchzehen** | Lasagne: 1 EL, 1 Zwiebel, 3 Zehen jeweils × 2/3 |
| **151 g braune Champignons** | 8 oz × 2/3 = 151,197 g |
| **57 g getrocknete Tomaten, trocken verpackt** | 3 oz × 2/3 = 56,699 g; kein Öl-/Abtropfgewicht unterstellt |
| **118 ml Gemüsebrühe** | (1/2 US cup Weißwein + 1/4 US cup Hühnerbrühe) × 2/3 = 118,294 ml. Beide Originalflüssigkeiten mengenidentisch durch Gemüsebrühe ersetzt. |
| **20 ml Sahne** | 2 US tablespoons × 2/3 = 19,716 ml, gerundet. Neue ml-ID, keine Umrechnung über vorhandene Sahne-ID in g. |
| **2/3 EL Zitronensaft** | 1 EL × 2/3; keine neue Stückzahl Zitronen aus Saftausbeute berechnet |
| **16/3 Lasagneblätter ohne Vorkochen** | 8 Blätter × 2/3. 5⅓ Blätter passend brechen; kein erfundenes Blattgewicht. Original glutenfrei, hier normale oder glutenfreie geeignete Blätter möglich. |
| **57 g Parmesan** | 3 oz × 2/3 = 56,699 g |

Gesamtes Olivenöl der Kombi: 121/150 + 11/15 + 1,8 + 2/3 = **601/150 EL** (ca. 4,0067). Keine doppelte Erfassung über Rezeptanteile. Die gerundete Hähnchengesamtmenge wird mit exakten Anteilen 36/121, 45/121 und 40/121 verwendet; kleine Rundungsdifferenzen der anteiligen Rohgewichte sind beabsichtigt.

## Vereinfachungen und offene Angaben

- Separate Koriander-Limetten-Sauce entfällt vollständig: 1/2 cup Koriander, 3 EL Öl, 2 EL Limettensaft im Original. Dazu keine Koriandergarnitur. Kein Ersatz mit erfundener Sauce.
- Buffalo-Portion wird ebenfalls gewürfelt statt ganze Knollen zu füllen; als Bowl ausdrücklich anders benannt. Die ursprüngliche 45–60-Minuten-Garzeit ganzer Kartoffeln entfällt mit diesem Arbeitsschritt; Würfel behalten die Originalzeit 40–50 Minuten. Fertigbacken weiterhin 15 Minuten.
- Frühlingszwiebel-Garnitur (2 EL bzw. 2 Stück) und Zwiebelpulver (1/2 TL × 4/5) gestrichen. Fertige Mayonnaise statt selbst gemachter Avocadoöl-Mayonnaise. Chipotle bleibt für den charakteristischen Geschmack erhalten.
- Weißwein/Hühnerbrühe → Gemüsebrühe wie oben; keine zusätzliche Wein-Einkaufsposition. Parmesan und Sahne bleiben, keine neue Béchamel oder Ersatzsauce.
- Salz und Pfeffer nach Geschmack, ohne neue Mengen. Original-„no-boil“-Lasagneblätter erhalten; bei produktabhängigem Flüssigkeitsbedarf Wasser nach Packungsangabe ergänzen, ohne erfundene feste Menge. Eine knapp passende Form verwenden.
- Collard Greens als eigene Zutat, weder Schwarzkohl noch Wirsing als unmarkierten Ersatz ausgegeben. Bestehende Zutaten-IDs/Einheiten verwendet, soweit Zustand und Einheit passen.
- Prep-Zeit 115 Minuten ist eine eigene Gesamtzeitschätzung mit Ofenzeit, keine Buchangabe. Hähnchen/Kohl zügig kühlen, für spätere Tage einfrieren. Tagesnummern bedeuten Varianten, keine Lagerungszusage.
- Keine kritischen offenen Mengen. Stück-/Bundgewichte unbekannt und bewusst nicht erfunden. `quelle.json` nur bezüglich Titelkorrektur, bestätigtem Zielwert und Status aktualisiert; Screenshots unverändert.

## Prüfungen

- `node apps/meal-prep/scripts/check-data.mjs`: bestanden; 3 Bücher, 15 Kombis, 41 Rezepte. Referenzen, vollständige Bausteinaufteilung, Einkauf, Skalierung, Wiederverwendung und Suche geprüft.
- Zusätzlicher unabhängiger Abgleich aller Einkaufspositionen sowie der Hähnchen-/Kohl-/Kartoffelanteile gegen die oben aus der Quelle berechneten Sollmengen: bestanden.
- `git diff --check`: bestanden. Keine Oberfläche, Infrastruktur, Modell- oder Prüfskriptänderung.
