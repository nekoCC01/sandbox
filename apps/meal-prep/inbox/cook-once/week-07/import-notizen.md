# Import Week 07

## Herkunft und Umfang

Alle Dateien 01.png–10.png in numerischer Reihenfolge angesehen: Übersicht/Einkauf 01–02, Vorbereitung 03–06, Suppe und Sandwiches 07–08, Buffalo-Auflauf 09, Pizza-Blech 10. Keine bestätigten Buchseiten; die Anzeige „Seite 180 von 696“ ist eine Dokumentanzeige, keine Buchseitenbestätigung. Keine Bonusgerichte übernommen. Abgleich im bisherigen Katalog nach Buch-ID, Originaltitel und Week 07 ergab keinen vorhandenen Import. Bestehende Kombis bleiben erhalten.

Angelegt: Kombi `cook-once-week07`; Rezepte `cw07-soup-sandwich`, `cw07-buffalo`, `cw07-pizza`; Bausteine `cw07-turkey`, `cw07-potatoes`, `cw07-tomatoes`. Originaltitel und genaue Screenshot-Fundstellen stehen in der Kombi. Buch bereits vorhanden.

## Portionen und Freigabe

Konkrete Bildangaben: Roasted Tomato Soup and Grilled Turkey and Cheese Sandwiches = 4 (07), Buffalo Turkey Casserole = 6 (09), Turkey Pizza Sheet Pan Dinner = 4 (10). Buchstandard nicht benötigt. Auf ausdrücklichen Nutzerwunsch im Chat den Auflauf auf vier Portionen skaliert (Faktor 2/3); die anderen Mengen nicht portionsskaliert. Daher gemeinsame baseServings 4. Der zunächst erwogene separate Auflauf-Entwurf entfällt.

## Einkaufsmengen gegen Quelle abgeglichen

US-Maße: lb = 453,59237 g; oz = 28,3495 g; cup = ca. 236,588 ml; pint = zwei cups. Gewichte/Volumina auf ganze g/ml gerundet. Öl behält die Quellen-EL; keine Dichteumrechnung. Alle gegarten Bausteine vollständig verteilt; Einkaufsanteile sind rohe Ausgangsmengen und keine behaupteten Garerträge.

| Zutat | Quelle / Verteilung | App-Einkauf für je 4 Portionen |
| --- | --- | --- |
| Putenbrustfilet, roh | 5 lb; Sandwich 1/3, Auflauf 4/9 × 2/3, Blech 2/9 | 1932 g; gegart 9:8:6 |
| Öl zur Pute | 1 EL × 23/27 | 23/27 EL |
| Kartoffeln, roh | 3 lb; Auflauf 4/6 × 2/3, Blech 2/6 | 1058 g; gegart 4:3 |
| Öl zu Kartoffeln | 1,5 EL × 7/9 | 7/6 EL |
| Kirschtomaten, roh | Suppe 2 pints, Blech 1 cup | 1183 ml Rohvolumen; 80:20 |
| Öl zu Suppentomaten | 1 EL | 1 EL |
| Öl zum Dünsten | 1 EL | 1 EL |
| Zwiebel / Knoblauch | 1/2 mittelgroße / 3 Zehen | 0,5 Stück / 3 Zehen |
| Brühe | 1 cup Hühnerbrühe | 237 ml Gemüsebrühe als Anpassung |
| Brot / Cheddar | je 8 Scheiben | je 8 Scheiben; kein erfundenes Scheibengewicht |
| Butter Sandwiches | 8 EL = 1 stick = 4 oz | 113 g |
| Butter Auflauf | 1/4 cup = 2 oz × 2/3 | 38 g |
| Hot Sauce Auflauf | 1/3 cup × 2/3 | 53 ml |
| Ranch Auflauf / Blech | 1/4 cup × 2/3 / 1/4 cup | 39 / 59 ml, zusammen 98 ml |
| Mozzarella / Champignons | je 4 oz laut Einkauf, Blech je 1 cup | je 113 g |
| Grüne Paprika | 1/2 Stück | 0,5 Stück |

Öl gesamt: 23/27 + 7/6 + 1 + 1 = ca. 4,019 EL; Butter gesamt 151 g. Diese Summen schließen die reduzierte Auflaufmenge ein. Tomaten bleiben ausdrücklich eine metrische Volumenangabe für locker abgemessene rohe Früchte, kein erfundenes Gewicht. Das Modell zeigt anteilige rohe Tomatenmengen auch beim späteren Rösten; im Text wird der Zustand unterschieden.

## Vereinfachungen und offene Angaben

Pute einmal rösten; Kartoffeln einmal rösten und auf zwei Gerichte verteilen; Tomaten gemeinsam roh aufteilen, nur Suppenanteil vorrösten. Die ursprüngliche Putenverteilung ergibt sich aus 1/3 in Scheiben und den übrigen 6 cups Würfeln im Verhältnis 4:2. Keine erfundenen Grammwerte für gegartes Fleisch. Kartoffelverteilung aus 4 bzw. 2 cups gegarter Menge.

Sahne (1/4 cup) und Basilikum in der Suppe entfallen. Speck (6 Streifen, nach Skalierung 4), Frühlingszwiebeln (2, skaliert 4/3) und Petersilie (8 Zweige, skaliert 16/3) des Auflaufs entfallen. Pepperoni (2 oz), Oliven (2 EL) und Chiliflocken (1/2 TL) des Blechs entfallen. Dadurch weniger separate Brat-/Garniturschritte. Ranch fertig kaufen. Glutenfreies Brot ist optional statt zwingend; Salz und Pfeffer nach Geschmack. Sahne nicht in Gramm umgerechnet. Garzeiten nicht skaliert; Temperaturen gerundet: 375 °F → 190 °C, 400 °F → 200 °C, 350 °F → 175 °C. Prep-Zeit 115 Minuten geschätzt.

Auffälligkeiten der Quelle: Einkauf nennt Hot Sauce mit 2,5 fl oz UND 1/3 cup (nicht exakt gleich); konkrete Rezeptangabe 1/3 cup hat Vorrang. Basilikum wird im Einkauf als 1 oz, im Rezept als 1/3 cup genannt; durch Auslassung keine Umrechnung nötig. Seitenzahlen unbekannt, keine kritischen Mengenlücken für die vereinfachten Gerichte.

## Prüfung

`node apps/meal-prep/scripts/check-data.mjs` erfolgreich: 3 Bücher, 12 Kombis, 33 Rezepte. Referenzen, Anteile, Einkauf, Skalierung, Wiederverwendung und Suche geprüft. Einkauf zusätzlich wie oben mit Screenshots abgeglichen. Keine UI- oder Prüfskriptänderung.
