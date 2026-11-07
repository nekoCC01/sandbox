// Rohdaten: IDs verknüpfen Zutaten, vorbereitete Bausteine und Rezepte.
export const data = {
  ingredients: [
    {"id": "turkey", "name": "Putenbrust mit Knochen und Haut", "unit": "g (roh)"},
    {"id": "butternut", "name": "Butternut-Kürbis", "unit": "g (ganz, roh)"},
    {"id": "kale", "name": "Schwarzkohl / Palmkohl", "unit": "Bund"},
    {"id": "canned-tomato", "name": "Tomaten (Dose)", "unit": "g"},
    {"id": "garlic-powder", "name": "Knoblauchpulver", "unit": "TL"},
    {"id": "butter", "name": "Butter", "unit": "g"},
    {"id": "sage", "name": "Salbei (getrocknet)", "unit": "TL"},

    { id: 'broth', name: 'Gemüsebrühe', unit: 'ml' },
    { id: 'aubergine', name: 'Aubergine', unit: 'Stk.' },
    { id: 'zucchini', name: 'Zucchini (groß)', unit: 'Stk.' },
    { id: 'feta', name: 'Feta', unit: 'g' },
    { id: 'egg', name: 'Ei', unit: 'Stk.' },
    { id: 'chili', name: 'Chilipulver', unit: 'TL' },
    { id: 'herbs', name: 'Italienische Kräuter (getrocknet)', unit: 'TL' },
    { id: 'lemon-juice', name: 'Zitronensaft', unit: 'EL' },
    { id: 'chickpeas', name: 'Kichererbsen', unit: 'g (abgetropft)' },
    { id: 'carrot', name: 'Karotten', unit: 'g' },
    { id: 'couscous', name: 'Couscous', unit: 'g (trocken)' },
    { id: 'lemon', name: 'Zitrone', unit: 'Stk.' },
    { id: 'yogurt', name: 'Naturjoghurt', unit: 'g' },
    { id: 'oil', name: 'Olivenöl', unit: 'EL' },
    { id: 'spinach', name: 'Spinat', unit: 'g' },
    { id: 'tomato', name: 'Tomaten', unit: 'Stk.' },
    { id: 'pasta', name: 'Pasta', unit: 'g (trocken)' },
    { id: 'beans', name: 'Weiße Bohnen', unit: 'g (abgetropft)' },
    { id: 'pepper', name: 'Paprika', unit: 'Stk.' }
  ],
  batches: [
    {"id": "turkey-roast", "name": "Pute aus dem Ofen", "color": "orange", "ingredients": [{"id": "turkey", "amount": 2500}, {"id": "oil", "amount": 1}], "steps": ["Putenbrust mit Öl und Salz einreiben. Mit der Haut nach oben bei 150 °C Ober-/Unterhitze etwa 75–90 Minuten braten; entscheidend sind 74 °C Kerntemperatur an der dicksten Stelle, ohne den Knochen zu berühren.", "Fleisch vom Knochen lösen und in drei gleich große Mengen teilen: zwei Drittel würfeln (Kürbis und Auflauf), ein Drittel für die Suppe zerzupfen."]},
    {"id": "squash-roast", "name": "Gerösteter Butternut", "color": "gold", "ingredients": [{"id": "butternut", "amount": 1800}], "steps": ["Kürbisse längs halbieren und entkernen. Nach der Pute bei 190 °C Ober-/Unterhitze mit der Schnittfläche nach unten etwa 45–60 Minuten weich backen.", "Die Hälfte der gegarten Kürbismenge mit Schale für den gefüllten Kürbis reservieren. Das Fruchtfleisch der anderen Hälfte für den Auflauf auslösen."]},
    {"id": "kale-prep", "name": "Geputzter Schwarzkohl", "color": "green", "ingredients": [{"id": "kale", "amount": 2}], "steps": ["Kohl waschen, harte Stiele entfernen und Blätter schneiden. Die Hälfte roh für die Suppe reservieren; die andere Hälfte ist für den Auflauf."]},

    { id: 'book-couscous', name: 'Couscous in Brühe', color: 'gold', ingredients: [{id:'couscous',amount:180},{id:'broth',amount:320}], steps: ['Brühe aufkochen, über den Couscous geben und etwa 5 Minuten quellen lassen. Auflockern und in zwei gleiche Hälften teilen.'] },
    { id: 'book-shared', name: 'Feta, Zucchini & Tomaten', color: 'green', ingredients: [{id:'feta',amount:200},{id:'zucchini',amount:1},{id:'tomato',amount:2}], steps: ['Feta und Zucchini halbieren; je eine Tomate für jedes Gericht reservieren.', 'Eine Zucchinihälfte und eine Tomate für das Ofengemüse würfeln. Die übrige Zucchinihälfte für den Salat fein würfeln, die zweite Tomate ebenfalls schneiden.'] },
    { id: 'roast', name: 'Ofengemüse & Kichererbsen', color: 'orange', ingredients: [{id:'chickpeas',amount:480},{id:'carrot',amount:600},{id:'oil',amount:2}], steps: ['Karotten in kleine Stücke schneiden, Kichererbsen abspülen.', 'Mit Öl mischen und bei 200 °C Ober-/Unterhitze ca. 25–30 Minuten rösten, bis die Karotten gar sind.'] },
    { id: 'grain', name: 'Couscous', color: 'gold', ingredients: [{id:'couscous',amount:240}], steps: ['Couscous nach Packungsangabe mit heißem Wasser zubereiten und auflockern.'] },
    { id: 'dip', name: 'Zitronen-Joghurt', color: 'green', ingredients: [{id:'yogurt',amount:300},{id:'lemon',amount:1}], steps: ['Joghurt mit Zitronensaft verrühren und nach Geschmack würzen.'] },
    { id: 'tomato-base', name: 'Tomaten-Bohnen-Basis', color: 'orange', ingredients: [{id:'tomato',amount:6},{id:'beans',amount:480},{id:'oil',amount:2}], steps: ['Tomaten würfeln und in Öl weich dünsten.', 'Abgespülte Bohnen zugeben und etwa 10 Minuten köcheln lassen. Nach Geschmack würzen.'] }
  ],
  recipes: [
    {"id": "turkey-squash", "name": "Gefüllter Kürbis mit Pute", "shortName": "Gefüllter Kürbis", "day": 1, "batches": [{"id": "turkey-roast", "share": 0.3333333333333333, "note": "gewürfelt"}, {"id": "squash-roast", "share": 0.5, "note": "Hälften mit Schale"}], "ingredients": [{"id": "yogurt", "amount": 115}, {"id": "garlic-powder", "amount": 1}, {"id": "herbs", "amount": 1.5}], "steps": ["Etwas Fruchtfleisch aus den reservierten Kürbishälften lösen, dabei einen Rand stehen lassen. Mit Joghurt, Knoblauch, Kräutern, Salz und Pfeffer zerdrücken.", "Zurück in die Kürbishälften geben, die zugeteilte Pute darauf verteilen. Bei 190 °C etwa 25 Minuten backen, bis alles durchgehend heiß ist. In die gewählte Anzahl Portionen teilen."]},
    {"id": "turkey-soup", "name": "Puten-Kohl-Suppe", "shortName": "Kohl-Suppe", "day": 2, "batches": [{"id": "turkey-roast", "share": 0.3333333333333333, "note": "zerzupft"}, {"id": "kale-prep", "share": 0.5, "note": "roh in die Suppe"}], "ingredients": [{"id": "carrot", "amount": 300}, {"id": "canned-tomato", "amount": 400}, {"id": "broth", "amount": 1400}, {"id": "herbs", "amount": 3}, {"id": "garlic-powder", "amount": 0.5}, {"id": "lemon-juice", "amount": 2}], "steps": ["Karotten in dünne Scheiben schneiden. Mit Dosentomaten, Brühe, Kräutern und Knoblauch etwa 15 Minuten köcheln, bis die Karotten weich sind.", "Zugezupfte Pute und den rohen Kohl zugeben. Einige Minuten köcheln, bis der Kohl weich und das Fleisch durchgehend heiß ist. Mit Zitronensaft, Salz und Pfeffer abschmecken."]},
    {"id": "turkey-casserole", "name": "Kürbis-Kohl-Auflauf mit Pute", "shortName": "Kürbis-Auflauf", "day": 3, "batches": [{"id": "turkey-roast", "share": 0.3333333333333333, "note": "gewürfelt"}, {"id": "squash-roast", "share": 0.5, "note": "ausgelöstes Fruchtfleisch"}, {"id": "kale-prep", "share": 0.5, "note": "kurz dünsten"}], "ingredients": [{"id": "butter", "amount": 30}, {"id": "sage", "amount": 1}, {"id": "oil", "amount": 0.5}, {"id": "lemon-juice", "amount": 1}], "steps": ["Die reservierte Kohlhälfte in Öl zugedeckt etwa 3–4 Minuten zusammenfallen lassen; bei Bedarf etwas Wasser zugeben. Mit Zitronensaft und Salz würzen.", "Kürbisfruchtfleisch mit Butter, Salbei, Salz und Pfeffer zerdrücken. In eine Auflaufform geben, Kohl und die zugeteilte Pute darauf verteilen.", "Bei 190 °C etwa 20–25 Minuten backen, bis der Auflauf durchgehend heiß ist."]},

    {id:'couscous-patties',name:'Couscous-Feta-Bratlinge & Ofengemüse',day:1,batches:[{id:'book-couscous',share:0.5},{id:'book-shared',share:0.5}],ingredients:[{id:'aubergine',amount:1},{id:'egg',amount:1},{id:'oil',amount:2},{id:'chili',amount:0.5},{id:'herbs',amount:0.5}],stepLabel:'Am Prep Day zubereiten',steps:['Backofen auf 200 °C vorheizen. Aubergine würfeln, mit der zugeteilten Zucchini und Tomate in eine Ofenform geben. Mit der Hälfte des hier angegebenen Öls, Chili, Salz und Pfeffer mischen.', 'Die zugeteilte Couscoushälfte mit dem Feta, Ei und den Kräutern vermengen und würzen. Kleine flache Bratlinge formen und auf ein Blech mit Backpapier legen. Das übrige Öl darübergeben.', 'Bratlinge und Gemüse etwa 30 Minuten backen. In die gewählte Anzahl Portionen aufteilen.'],servingNote:'Zum Essen: eine vorbereitete Portion Bratlinge mit Ofengemüse.'},
    {id:'couscous-chickpea-salad',name:'Couscous-Salat mit Kichererbsen',day:2,batches:[{id:'book-couscous',share:0.5},{id:'book-shared',share:0.5}],ingredients:[{id:'chickpeas',amount:240},{id:'oil',amount:3},{id:'lemon-juice',amount:3},{id:'chili',amount:0.5},{id:'herbs',amount:0.5}],stepLabel:'Parallel am Prep Day mischen',steps:['Kichererbsen abspülen und abtropfen lassen. Mit der zweiten Couscoushälfte und der rohen Zucchini und Tomate mischen.', 'Den zugeteilten Feta hineinbröseln. Mit Öl, Zitronensaft, Kräutern, Chili, Salz und Pfeffer abschmecken. In die gewählte Anzahl Portionen aufteilen.'],servingNote:'Zum Essen: der Salat ist bereits fertig gemischt.'},
    {id:'bowl',name:'Die warme Ofen-Bowl',day:1,batches:[{id:'roast',share:0.5},{id:'grain',share:0.5},{id:'dip',share:0.5}],ingredients:[],steps:['Jeweils die Hälfte von Ofengemüse und Couscous anrichten.','Die Hälfte des Dips darübergeben.']},
    {id:'salad',name:'Couscous zum Mitnehmen',day:2,batches:[{id:'roast',share:0.5},{id:'grain',share:0.5},{id:'dip',share:0.5}],ingredients:[{id:'spinach',amount:100}],steps:['Übriges Ofengemüse und Couscous mit gewaschenem Spinat mischen.','Den restlichen Dip bis zum Essen separat aufbewahren und dazugeben.']},
    {id:'pasta-bowl',name:'Pasta mit Tomaten & Bohnen',day:1,batches:[{id:'tomato-base',share:0.5}],ingredients:[{id:'pasta',amount:180}],steps:['Pasta nach Packungsangabe garen.','Die Hälfte der Tomaten-Bohnen-Basis vollständig erhitzen und mit der Pasta mischen.']},
    {id:'pepper-bowl',name:'Paprika-Bohnen-Pfanne',day:2,batches:[{id:'tomato-base',share:0.5}],ingredients:[{id:'pepper',amount:2},{id:'spinach',amount:100}],steps:['Paprika klein schneiden und mit etwas Wasser zugedeckt weich dünsten.','Restliche Basis und Spinat zugeben, vollständig erhitzen und abschmecken.']}
  ],
  combos: [
    {"id": "pute-kuerbis-kohl", "name": "Pute, Kürbis. Drei Möglichkeiten.", "subtitle": "Pute für alle drei Gerichte. Kürbis für Füllung und Auflauf. Schwarzkohl für Suppe und Auflauf.", "theme": "sun", "prepMinutes": 180, "baseServings": 4, "recipes": ["turkey-squash", "turkey-soup", "turkey-casserole"], "batches": ["turkey-roast", "squash-roast", "kale-prep"], "source": "Vereinfacht nach deinen Screenshots, Woche 18: Pute, Schwarzkohl und Butternut. Buch und Seite noch offen.", "planNote": "Am Prep Day Pute und Kürbis nacheinander im Ofen garen, Kohl putzen und alles aufteilen. Danach pro Gericht etwa 25–35 Minuten fertigstellen. Die Prep-Zeit ist ein grober Gesamtwert inklusive Ofenzeit; Tag 1–3 sind ein Verzehrvorschlag.", "scalingNote": "Bewusst vereinfacht: ohne Speck, Nuss-Honig-Topping und Granatapfel; eine Kräutermischung statt Thymian und Rosmarin, Gemüsebrühe statt Hühnerbrühe. Gerundete Mengen: 2,5 kg Putenbrust mit Knochen, 1,8 kg Kürbis (etwa 2 Stück à 900 g), 1,4 l Brühe und 115 g Joghurt bei je 4 Portionen. Karotten auf 300 g vereinheitlicht, da Stück- und Gewichtsangabe im Original widersprüchlich sind. Der Auflauf ist auf 4 statt 5 Portionen vereinheitlicht. Die angezeigten Putenmengen sind anteilige rohe Einkaufsmengen, nicht das Gewicht des gegarten Fleisches."},

    {id:'hauptdarsteller-couscous',name:'Hauptdarsteller Couscous',subtitle:'Einmal Couscous quellen lassen: die Hälfte wird zu Feta-Bratlingen, die andere zum Kichererbsen-Salat.',theme:'sun',prepMinutes:45,baseServings:2,recipes:['couscous-patties','couscous-chickpea-salad'],batches:['book-couscous','book-shared'],source:'Nach deinen Rezept-Screenshots „Hauptdarsteller Couscous“; Buch und Seite noch offen.',planNote:'Alles am Prep Day zubereiten: zwei Gerichte mit je zwei Portionen. Tag 1 und Tag 2 sind ein Verzehrvorschlag. Während Bratlinge und Gemüse im Ofen sind, den Salat mischen.',scalingNote:'Bei Bruchteilen von Eiern: Ei verquirlen und anteilig verwenden. Bratlinge passend zur Menge formen; im Original ergeben sich sechs Stück für zwei Portionen.'},
    {id:'sunshine',name:'Ein Blech. Zwei gute Tage.',subtitle:'Ofengemüse, Couscous und ein Dip, der alles verbindet.',icon:'◒',theme:'sun',prepMinutes:35,baseServings:2,recipes:['bowl','salad'],batches:['roast','grain','dip']},
    {id:'tomato-days',name:'Eine Basis. Viel Tomate.',subtitle:'Ein Topf Bohnen-Tomaten, heute mit Pasta, morgen als Pfanne.',icon:'◔',theme:'tomato',prepMinutes:20,baseServings:2,recipes:['pasta-bowl','pepper-bowl'],batches:['tomato-base']}
  ]
};
