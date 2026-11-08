# Import Woche 08

## Herkunft und Prüfung

- Buch: „Sunday Meal Prep vegetarisch“, Keda Black, `sunday-meal-prep`.
- Originaltitel: „Woche 08“. Alle 14 Dateien `01.png`–`14.png` in numerischer Reihenfolge angesehen, einschließlich Übersicht, Einkauf, Vorbereitung und sämtlicher Hauptgerichte. Bonus-Müsliriegel nicht übernommen.
- Keine bestätigten Buchseiten sichtbar. Fundstellen sind die lokalen Screenshot-Dateien; keine Seitenzahl erfunden.
- Vor Import keine Kombination mit Buch-ID + „Woche 08“ bzw. passender Fundstelle in `data.js`; vorhandene andere Wochen unverändert.
- Originalportionen: je 4 nach `cookbooks.js/defaultServingsPerMeal`. Metadaten und Bilder enthalten keine konkreten Rezeptportionen; Buchstandard ist eine dokumentierte Annahme. Kein Zielwert, keine Mengenskalierung. Insgesamt fünf Hauptgerichte mit je vier Portionen.

## Neue Kombis

- `sunday-week08-ofen-pasta`: `sw08-bread`, `sw08-pasta`, `sw08-quiche`. Originaltitel: „Herzhafte Arme Ritter, dazu Salat“ (10.png), „Nudeln in Zitronen-Rosmarin-Creme“ (11.png), „Quiche mit geräuchertem Tofu“ (12.png). Vorbereitung 06–08.png.
- `sunday-week08-weizen-suppe`: `sw08-wheat`, `sw08-soup`. Originaltitel: „Weizen mit Zuckerschoten nach Art eines Risottos“ (13.png), „Frühlingsminestrone“ (14.png). Vorbereitung 06.png, 09.png.

Bausteine: `sw08-broccoli` (gegart 2:1), `sw08-yogurt` (200/300 g), `sw08-creme` (200/100/200 ml), `sw08-cheese` (50/60 g), `sw08-vegetables` (gegart 1:2). Jeder Baustein wird einmal eingekauft und vollständig aufgebraucht. Rohanteile sind Einkaufsmengen, keine behaupteten Gargewichte.

## Vereinfachungen

- Pesto vollständig gestrichen, auch als Suppen-Topping; damit unabhängig voneinander kochbare Kombis. Brot direkt mit Brokkoli und Guss schichten. Keine Umverteilung des gestrichenen Pestos.
- Beilagensalat und Vinaigrette entfallen, ebenso sämtliche lose Brunnenkresse, Kerbel, Schnittlauch, Zitronenabrieb und Kräuter-Zitronen-Butter. Frischer Rosmarin als tragender Geschmack der Pasta bleibt ein Zweig.
- 50 g Comté im Brot durch 50 g Parmesan ersetzt; zusammen mit unveränderten 60 g für Pasta ein Käse mit insgesamt 110 g. Die 100 g Pesto-Parmesan entfallen.
- Griechischer Joghurt über bestehende Naturjoghurt-ID, in den Schritten ausdrücklich griechisch. Crème fraîche erhält eine ml-ID; keine Dichteumrechnung in g. Milch ebenfalls ml.
- Erbsen als gewählte Originalalternative, vereinfacht TK statt Enthülsen; 150 g ausgelöste Menge erhalten. Weiße Bohnen: Konserve wählen, 100 g gespült/abgetropft, keine Umrechnung in Trockenbohnen.
- Für alle Nudeln bestehende Pasta-ID; in der Suppe weiterhin ausdrücklich 50 g Risoni/Buchstabennudeln. Keine Garzeit proportional skaliert.
- Paprikapulver, Muskat und optionale Parmesanrinde entfallen. Salz/Pfeffer nach Geschmack. Karotten-/Rübengrün nur verwenden, wenn an den gekauften Stückzahlen vorhanden, ohne zusätzliche Einkaufsmenge.
- Backpapier statt unbeziffertem Fett für die Brotform. Teig bleibt selbst gemacht: 200 g Mehl, 160 g Butter, 120 ml Wasser. Nicht beziffertes Ausrollmehl bleibt ohne erfundene Grammzahl.
- Prep-Zeiten (80/35 Minuten) sind eigene Schätzungen, keine anteilig umgerechnete Original-Wochenzeit. Tagesnummern dienen der Variantenfolge; keine Lagerungszusage. Suppe für spätere Tage einfrieren.

## Einkaufsmengen gegen Quelle abgeglichen

Für die unskalierten vier Portionen je Gericht, Bausteine jeweils nur einmal gezählt:

| Kombi Ofen/Pasta: Einkauf | Quelle / Verteilung |
| --- | --- |
| 300 g Brokkoliröschen roh | 03.png + 07.png: 2/3 Brot, 1/3 Quiche (200/100 g rohe Einkaufsanteile). Kein Gargewicht angenommen; ganzer Einkaufsbrokkoli ggf. mehr wegen Verschnitt. |
| 500 g griechischer Joghurt | 04.png + 07.png: 200 g Brot, 300 g Quiche |
| 500 ml Crème fraîche | 04.png, 07.png, 11.png: 200 ml Brot, 100 ml Quiche, 200 ml Pasta |
| 110 g Parmesan | 160 g Original gesamt minus 100 g gestrichenes Pesto plus 50 g Ersatz für Comté; 50 g Brot, 60 g Pasta |
| 500 g altbackenes Sauerteigbrot | 05.png, 07.png; bestehende Brot-ID in g |
| 600 ml Milch, 5 Eier | 04.png, 07.png: Milch und 3 Eier Brot; 2 Eier Quiche |
| 200 g Mehl, 160 g Butter | Quicheteig 06.png; 120 ml Wasser im Schritt |
| 200 g Räuchertofu | 04.png, 07.png: vollständig Quiche |
| 500 g trockene Pasta | 04.png, 11.png: vollständig Zitronenpasta |
| 50 g Butter, 2 EL Zitronensaft, 1 Zweig Rosmarin | 03.png, 11.png: Pastasauce; keine Zahl Zitronen aus Saftausbeute erfunden |
| 1 EL körniger Senf | 07.png: Brot-Guss, Vinaigrette-Senf entfällt |

| Kombi Weizen/Suppe: Einkauf | Quelle / Verteilung |
| --- | --- |
| 6 junge Karotten, 1 Lauchstange, 2 Zwiebeln, 3 Schalotten | 03.png, 06.png, 09.png; gemeinsame Basis zu 1/3 Weizen, 2/3 Suppe. Vierte Schalotte gehörte zum gestrichenen Pesto. Stückzahlen erhalten. |
| 2 EL Olivenöl, 15 g Butter | 09.png: vollständig gemeinsame Basis, gleiche Teilung |
| 180 g Weizen/Einkorn trocken | 05.png, 13.png: Weizengericht |
| 200 g Zuckerschoten, 600 ml Gemüsebrühe | 03.png, 13.png: Weizengericht. Brühe fertig angesetzt statt Päckchenzahl; keine erfundene Pulvermenge. |
| 2 junge weiße Rüben, 1 Fenchelknolle | 03.png, 09.png: Suppe |
| 100 g weiße Bohnen abgetropft | 05.png, 06.png, 09.png: vollständig Suppe |
| 50 g Pasta trocken, 150 g ausgelöste Erbsen | 03.png, 04.png, 14.png: Suppe; 350–400 g mit Schote sind keine zusätzliche Menge |

### Entfallene Einkaufspositionen und Restdifferenzen

- Bonus: 2 Äpfel, 250 g Beeren, 40 g Nüsse, 90 g Haferflocken, 50 g Rosinen, 75 g Zucker, 180 g Mehl, 150 g Butter, 1 TL Backpulver und Bonusgewürze vollständig gestrichen. Beeren stehen im Bonus-Zubereitungstext nicht ausdrücklich, sind aber über den Titel zugeordnet; keine Übernahme.
- Pesto: 150 g Brunnenkresse (= Hälfte von 300 g), 80 g Mandeln, 1 Schalotte, 2 Knoblauchzehen, 3 EL Öl, 100 g Parmesan gestrichen.
- Weitere 150 g lose Brunnenkresse, 1 Salat, Vinaigrette (2 TL Senf, 1 EL Zitronensaft, 3 EL Öl, unbezifferter Knoblauch/Abrieb), 1 Bund Schnittlauch und 1 kleines Bund Kerbel entfallen. Die unbezifferten Knoblauchanteile werden nicht künstlich aus der Einkaufsliste verteilt.
- 45 g Kräuterbutter samt Zeste von 1 Zitrone entfällt. Die Original-Einkaufsliste nennt 2 Bio-Zitronen; durch Weglassen der Zesten und Vinaigrette bleibt nur 2 EL Saft, ohne angenommene Stückausbeute.
- Butter: Einkaufsliste 425 g; explizit lesbare Verwendungen summieren sich auf 420 g (160 Teig + 45 Kräuterbutter + 15 Gemüsebasis + 150 Bonus + 50 Pasta). Import: 225 g (160 + 15 + 50). Differenz zum Original: 195 g für gestrichene Kräuterbutter/Bonus und 5 g ohne eindeutige Zuordnung. Kein erfundener Einsatz der 5 g; mögliches Formfett ist nicht bestätigt.
- Mehl: 380 g Einkauf minus 180 g Bonus = 200 g Teig, zusätzliches Ausrollmehl unbeziffert. Eier, Milch, Joghurt, Crème fraîche, Brot, Tofu und Hauptgericht-Nudeln vollständig erhalten. Kein Bonus importiert.
- Keine kritische offene Mengenangabe für die vereinfachten Gerichte. Suppenwasser bleibt wie in 09.png „bis bedeckt“; Teigwasser 120 ml steht im Schritt. Quellen bleiben unverändert bis auf den vorgesehenen Statuswechsel in `quelle.json`.

## Prüfungen

- `node apps/meal-prep/scripts/check-data.mjs`: bestanden, 3 Bücher, 14 Kombis, 38 Rezepte. IDs, Referenzen, vollständige Bausteinanteile, Einkauf, Skalierung, Wiederverwendung und Suche geprüft.
- Zusätzlich beide neuen Einkaufslisten über das App-Modell gegen unabhängig aus den Bildern abgeleitete Sollmengen geprüft (alle Positionen und Mengen); bestanden.
- Keine Änderungen an Oberfläche, Modell, Buchstandards oder Prüfskript.
