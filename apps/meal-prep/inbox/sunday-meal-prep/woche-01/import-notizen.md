# Woche 01 – Import

Quelle: „Sunday Meal Prep vegetarisch“, Keda Black, Originaltitel „Woche 01“.
Alle 15 Screenshots 01.png–15.png in numerischer Reihenfolge angesehen. Keine bestätigten Buchseiten. Übersicht 01, Hinweise 02, Einkauf 03–06, Vorbereitung 07–10, Hauptgerichte 11–15. Bilder unverändert.

## Status und offene Angaben

`imported`: Der Nutzer hat für alle fünf Hauptgerichte jeweils vier Originalportionen bestätigt. Keine Zielportionen vorgegeben, daher unverändert je vier Portionen übernommen (20 insgesamt). Beide Kombis sind in `data.js` veröffentlicht. `datensatz.json` archiviert die neuen Einträge; er enthält nur die Ergänzungen und ist kein eigenständiger vollständiger App-Katalog. Der bisherige Entwurf wurde durch diesen bestätigten Stand ersetzt.

Duplikatprüfung: Im bestehenden Katalog keine Kombination aus bookId `sunday-meal-prep`, Originaltitel `Woche 01` und dieser Fundstelle vorhanden. Bestehende Woche 02/05 bleiben unverändert.

Angelegte Kombis:
- `sunday-week01-gemuese`: Champignons, Spinat und Bulgur mit Spiegelei; Dhal, Spinat, Wirsing mit Kreuzkümmel und Reis; Linsensuppe mit Gemüse und Miso.
- `sunday-week01-pasta-tarte`: Pasta puttanesca; Zwiebeltarte, dazu Salat (Originaltitel in bookReference, Salat entfällt in der App).

## Wiederverwendung und Vereinfachungen

Pilze werden roh 400/100 g, TK-Spinat 400/200 g geteilt. Vom Wirsing wird die ausdrücklich angebotene Variante ½ Kopf gewählt und die geputzte Rohmenge halbiert; kein Grammgewicht geschätzt. Für Pasta und Tarte einmal 200 g Tomme/Cantal reiben: je 100 g. Die Pasta verwendet damit Tomme/Cantal statt 100 g Parmesan; Tartekäse bleibt erhalten. Das ist eine bewusste Anpassung zur Zutatenvereinheitlichung.

Bonus-Käse-Kräuter-Brot samt seinen Zutaten vollständig ignoriert. Ohne zusätzliche Brote, Käseplatte, Salat/Vinaigrette, Kräutergarnituren, Ingwer, Kurkuma, Zitrone und Dhal-Joghurt. Keine Gewürzmengen für unbezifferte Prisen erfunden. Salz, Pfeffer und bei Pasta Chili nach Geschmack. Karottengrün entfällt. Die 2 EL gedünsteten Zwiebeln der Suppe bleiben bei der Tarte, damit die Kombis unabhängig sind; Suppengemüse mit Wasser dünsten. Miso zum Schluss einrühren. Keine neuen Mengen für Ersatzgewürze. Garzeiten nicht mit Portionen skalieren; Linsen nach tatsächlicher Garprobe/Packung garen. Prep-Zeiten sind eigene Schätzungen, keine Originalzeitmessung.

Bestehende IDs wiederverwendet: unter anderem Pasta (hier Spaghetti), Linsen (hier ausdrücklich grün), Spinat (hier TK), Joghurt (hier griechisch). Neue Stück-IDs für Karotten und Wirsing verhindern unbelegte Umrechnung in vorhandene Gramm-Einheiten. Wasser im Ablauf, keine Einkaufsposition.

## Einkauf gegen Screenshots abgeglichen

Alle Angaben gelten für die unskalierte Originalrezeptmenge, jeweils vier Portionen pro Gericht bestätigt.

| Position | Entwurf | Quellenabgleich |
| --- | --- | --- |
| Champignons | 500 g | 03/07/10/11: 400 g Pfanne, 100 g Suppe |
| TK-Spinat | 600 g | 04/11/14: 400 g Pfanne, 200 g Dhal |
| Wirsing | ½ Kopf | 03: ½ oder 1 kleiner; 07: halbieren |
| Karotten | 5 Stück | 03/10: alle für Suppe; kein Grammgewicht |
| Bulgur / Reis | 150 / 240 g trocken | 05/11/14 |
| Rote / grüne Linsen | 200 / 150 g trocken | 05/08/10 |
| Eier | 5 Stück | 05/11/13: 4 Pfanne + 1 Tarte; optionale 8 Pfanneneier nicht gewählt |
| Butter | 180 g | 05/08/11: 15 g Pfanne + 165 g Teig |
| Olivenöl | 11 EL | 08/09/11/14: 3 Pasta + 4 Zwiebeln + 1 Pilze + 3 Wirsing; Vinaigrette entfällt |
| Knoblauch | 11 Zehen | 08/10: 2 Dhal + 4 Pasta + 5 Suppe; kein Zusatz für Vinaigrette |
| Zwiebeln | 10 Stück | 03/09: Gesamtmenge bleibt in Tarte, kein 2-EL-Abzug |
| Spaghetti / Dosentomaten | 500 / 450 g | 05/08/12 |
| Oliven / Kapern / Tomatenmark | 300 g / 2 EL / 2 EL | 05/08/09 |
| Miso / Kreuzkümmel | 2 EL / 1 TL | 05/06/10/14 |
| Mehl | 200 g | 08: nur Tarte; 500 g Bonusbrot entfallen; Ausrollmehl unbeziffert |
| Tomme/Cantal | 200 g | Original 100 g Tarte + Ersatz für 100 g Parmesan; 200 g Original-Bonusbrotkäse entfallen |
| Griechischer Joghurt | 150 g | 13: Tarte; Dhal-Topping entfällt, daher nicht 200 g Gesamteinkauf |

## Prüfungen

- `node apps/meal-prep/scripts/check-data.mjs`: bestanden, bestehender Katalog mit 9 Kombis und 25 Rezepten.
- Entwurf technisch mit dem bestehenden Katalog zusammengeführt und ausschließlich in einer temporären Prüffassung mit Dummy-Portionszahl 1 validiert: bestanden, 11 Kombis und 30 Rezepte. Diese Dummy-Zahl ist keine Portionsentscheidung und steht nicht im Entwurf oder App-Katalog.
- Einkaufssummen der beiden Entwurfskombis separat positionsweise gegen obige Quellenwerte einschließlich dokumentierter Anpassungen geprüft; bestanden. Der zunächst in der Prüferwartung ausgelassene 1 TL Kreuzkümmel wurde ergänzt; Rezeptmenge unverändert.
- Keine UI-, Modell- oder Prüfskriptänderungen. Keine Browserprüfung erforderlich. Originalportionen bestätigt; Import abgeschlossen.

## Abschluss nach Portionsbestätigung

Je vier Portionen pro Gericht vom Nutzer bestätigt. Beide Kombis ohne Mengenskalierung in data.js übernommen; Metadaten auf imported gesetzt. Keine offenen Mengenangaben, die den vereinfachten Datensatz blockieren. Buchseiten bleiben unbekannt. Abschließende Datenprüfung und Einkaufsabgleich mit vier Basisportionen siehe Ergebnis unten.

Abschließend bestanden: `node apps/meal-prep/scripts/check-data.mjs` (3 Bücher, 11 Kombis, 30 Rezepte) und `git diff --check`. Einkaufssummen nach Übernahme erneut ausgegeben und mit der obigen Quellentabelle abgeglichen; unverändert, keine Skalierung bei je vier Portionen.
