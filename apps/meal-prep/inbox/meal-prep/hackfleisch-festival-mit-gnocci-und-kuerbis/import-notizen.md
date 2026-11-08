# Import: Hackfleisch-Festival mit Gnocchi und Kürbis

- Kombi-ID: `hack-gnocchi-pumpkin`; Rezepte: `hack-tomato`, `hack-cream`.
- Buch: „Meal Prep“ von Lena Merz (`meal-prep`). Alle drei ausdrücklich aufgeführten Screenshots 01.png, 02.png und 03.png angesehen. Fundstelle in der Kombi erhalten; keine sichtbaren Buchseiten, daher `pages: null`.
- Duplikatprüfung: kein vorhandener Eintrag mit diesem Originaltitel bzw. dieser Quelle in App-Daten oder bisherigen Importnotizen gefunden.
- Metadaten-Tippfehler „Gnocci“ zu „Gnocchi“ nach dem sichtbaren Originaltitel in 01/02 korrigiert. Quellordner und Bilder unverändert.
- Original: vier Lunchportionen, zwei Varianten mit je zwei Portionen (1+2 und 3+4). Eine Kombi mit zwei Gerichten und `baseServings: 2`; keine Skalierung. Zubereitungszeit 50 Minuten aus der Quelle übernommen.

## Wiederverwendung und Vereinfachung

Drei Bausteine: ganzer Kürbis putzen und roh 1:2 aufteilen, 400 g rohes Hack halbieren, 800 g Gnocchi gemeinsam kochen und gegarte Menge halbieren. Hack wird in jeder Sauce frisch gebraten; kein gemeinsam gegartes Hack behauptet. Statt Raspeln und Bällchenformen den ganzen geputzten Kürbis klein würfeln und das Hack in beiden Pfannen krümelig braten. Tomatenpfanne entsprechend mit Würfeln garen, bis diese weich sind. Die beiden unterschiedlichen Saucen bleiben erhalten. Kein Bonusgericht vorhanden.

Vorhandene Öl-ID steht für Olivenöl; im Original nur „Öl“. Muskat als einzelnes Gewürz weggelassen. Salz/Pfeffer ohne Mengen nach Geschmack. Keine zusätzlichen Mengen erfunden. Neue Zutaten-IDs für Hack, Gnocchi, Sahne und ganzen Hokkaido; bestehende Hokkaido-ID bezeichnet entkerntes Gewicht und wäre hier sachlich falsch.

## Einkaufsmengen gegen Screenshot 02/03

| Zutat | Original und importierte Gesamtmenge | Verteilung |
| --- | --- | --- |
| Hokkaido | 1 kleiner ganzer Kürbis, 700 g | Nach Entkernen 1/3 Tomate, 2/3 Sahne |
| Gemischtes Hack | 400 g roh | Je 200 g |
| Gnocchi, Kühlregal | 800 g | Je die Hälfte der gekochten Menge |
| Öl | 4 EL | Je 2 EL |
| Stückige Tomaten | 400 g | Tomatenpfanne |
| Sahne | 200 g | Sahnepfanne |
| Chili | 1/2 TL | Tomatenpfanne |

700 g sind ausdrücklich das Ganzgewicht vor dem Entkernen. Kein Netto- oder Garertrag bekannt und keiner geschätzt. Muskat entfällt; Salz und Pfeffer sind unbeziffert und werden nicht als Einkaufsmenge fingiert.

## Offene Angaben und Prüfung

Keine kritischen Mengen offen. Buchseiten und entkernter Kürbisertrag unbekannt; keine Zahlen ergänzt. Alle 7 bezifferten Einkaufspositionen separat aus den neu erfassten Bausteinen und Rezeptzutaten summiert und gegen obige Quellmengen geprüft: identisch. `node apps/meal-prep/scripts/check-data.mjs` erfolgreich: 3 Bücher, 9 Kombis, 25 Rezepte; Referenzen, Anteile, Einkauf, Skalierung und Wiederverwendung bestanden. Keine UI- oder Prüfskriptänderungen.
