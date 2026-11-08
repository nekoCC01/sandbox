# Import: Süßkartoffeln aus Topf und Ofen

## Quelle und Duplikatprüfung

- Buch: „Meal Prep – 1 × Kochen – 4 × Mittagspause to go“, Lena Merz; vorhandene Buch-ID `meal-prep`.
- Alle angegebenen Bilder angesehen: `01.png` (Übersicht/Titel), `02.png` (Zutaten, Schritte 1–4), `03.png` (Fortsetzung von Schritt 4, Portionen und Zeit). Keine Bonusgerichte vorhanden.
- Bestätigter Originaltitel auf 01.png und 02.png: **„Süßkartoffeln aus Topf und Ofen“**. Metadaten enthielten „Mit Flammkuchen und One Pot“; diesen beschreibenden Titel im `source` erhalten und `quelle.json/originalTitle` anhand der Bilder berichtigt.
- Keine bestätigten Buchseiten. Fundstellen mit Dateinamen in der Kombi erhalten; keine Seitenzahl erfunden.
- Vor Import weder gleicher Originaltitel/Buch/Fundstelle noch entsprechende Flammkuchen-Kombi in `data.js` vorhanden. Bestehende Süßkartoffel-Varianten gehören zu einer anderen Quelle und bleiben unverändert.

## Neue Kombi und Portionen

- Kombi: `flammkuchen-one-pot`.
- Rezepte: `flamm-tart` (Süßkartoffel-Trauben-Flammkuchen), `flamm-quinoa` (One-Pot-Quinoa mit Süßkartoffeln und Trauben). Das Buch benennt beide innerhalb des gemeinsamen Originaltitels; App-Kurztitel beschreiben die Gerichte.
- Bausteine: `flamm-potato` (rohe Süßkartoffeln aufteilen), `flamm-grapes` (Trauben waschen/halbieren und aufteilen).
- Originalportionen konkret bestätigt: Flammkuchen wird in 02.png als **Portion 1 und 2** halbiert; One Pot wird in 03.png als **Portion 3 und 4** auf zwei Boxen verteilt. Somit **zwei Gerichte mit je zwei Portionen**, vier Lunchportionen insgesamt. `baseServings: 2`, keine Zielskalierung. Die Angabe „Für 4 Portionen“ gilt für die gesamte Kombi.
- Die Freigabe zur Skalierung des vorangegangenen Week-20-Imports gilt nicht für diese Quelle; hier bleiben Originalmengen und Originalportionen bestehen.

## Einkaufsmengen mit 02.png abgeglichen

| Einkauf für die gesamte Kombi | Verwendung / Abgleich |
| --- | --- |
| 275 g Flammkuchenteig aus dem Kühlregal | Eine Packung, vollständig Flammkuchen |
| 500 g Süßkartoffeln roh | Original: 2 Stück, ca. 500 g. Nach dem Schälen geputzte Rohmenge dritteln: 1/3 in hauchdünnen Scheiben aufs Blech, 2/3 als 1-cm-Würfel in den Topf. Vorhandene Gramm-ID verwendet, kein Stückgewicht oder Schälverlust erfunden. Einkaufsanteile ca. 166,67/333,33 g sind keine Netto- oder Gargewichte. |
| 1 Zweig frischer Rosmarin | Vollständig Flammkuchen; Originalalternative Thymian nicht zusätzlich erfasst |
| 200 g Crème fraîche | Vollständig Flammkuchen. Neue Gramm-ID `creme-fraiche`, da vorhandene `creme-fraiche-volume` ml verwendet; keine Dichte angenommen. |
| 150 g kernlose Trauben | Je 75 g Flammkuchen und One Pot; vollständig aufgebraucht |
| 1 rote Zwiebel | Vollständig Flammkuchen. Bestehende ID `onion` mit Stückeinheit verwendet; rote Sorte im Schritt ausdrücklich genannt. |
| 100 g Quinoa trocken | Vollständig One Pot |
| 250 ml Gemüsebrühe | Vollständig One Pot |
| 1/2 TL Chilipulver | Vollständig One Pot |

Salz und Pfeffer nach Geschmack, wie in der Quelle ohne Mengenangabe. Keine zusätzliche Ölmenge, Sauce oder sonstige Zutat erfunden. Bausteine werden nur einmal eingekauft; Anteile summieren sich jeweils auf 100 %. Vorbereitete Süßkartoffeln bleiben getrennt roh, bis sie im jeweiligen Gericht garen; Trauben werden am Blech mitgebacken bzw. frisch zugegeben.

## Vereinfachungen und Ablauf

- **2 EL Pinienkerne und 1/2 Bund Petersilie weggelassen**. Damit entfällt eine separate Pfanne zum Nussrösten sowie das Waschen/Schneiden einer zusätzlichen Kräutersorte.
- Süßkartoffeln und Trauben bleiben als in beiden Mahlzeiten tragende Zutaten erhalten. Keine künstliche Wiederverwendung der Zwiebel oder Crème fraîche hinzugefügt.
- Fertigteig wie Original. Flammkuchen bei 200 °C auf unterer Schiene 18–20 Minuten; parallel One Pot zugedeckt 25–30 Minuten. Keine Garzeit skaliert. Bei Bedarf Wasser ergänzen, ohne eine feste zusätzliche Literzahl zu behaupten.
- `prepMinutes: 60` nach bestätigter Gesamt-Zubereitungszeit „1 Std.“ in 01.png/03.png. Beide Gerichte am Prep Day fertigstellen, anschließend abkühlen und kühlen. Tagesnummern sind Varianten, keine Lagerungszusage.
- Keine Kalorienwerte übernommen, da die ausgelassenen Zutaten diese ändern würden.
- Neue Zutaten nur bei fehlender passender ID: Fertigteig in g, Crème fraîche in g, Trauben in g, Quinoa trocken in g. Bestehende Bücher, Datenmodell und Oberfläche bleiben unverändert.
- Keine kritischen offenen Angaben. Buchseiten und konkretes geputztes Süßkartoffelgewicht bleiben unbekannt. Screenshot-Dateien unverändert; Metadatenstatus auf `imported` gesetzt.

## Prüfungen

- `node apps/meal-prep/scripts/check-data.mjs`: bestanden; 3 Bücher, 16 Kombis, 43 Rezepte. IDs, Quellen, Referenzen, Aufteilung, Einkauf, Skalierung, Wiederverwendung und Suche geprüft.
- Zusätzlich alle neun Einkaufspositionen der neuen Kombi über das App-Modell unabhängig gegen die oben erfassten Quellmengen abgeglichen; Süßkartoffel-/Traubenanteile und zwei Basisportionen je Gericht geprüft: bestanden.
- `git diff --check`: bestanden. Keine Änderungen an Importprüfung oder UI, daher kein zusätzlicher UI-Test erforderlich.
