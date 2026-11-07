// Rohdaten: IDs verknüpfen Zutaten, vorbereitete Bausteine und Rezepte.
export const data = {
  ingredients: [
    { id: 'chickpeas', name: 'Kichererbsen', unit: 'g (abgetropft)' },
    { id: 'carrot', name: 'Karotten', unit: 'g' },
    { id: 'couscous', name: 'Couscous', unit: 'g (trocken)' },
    { id: 'lemon', name: 'Zitrone', unit: 'Stk.' },
    { id: 'yogurt', name: 'Naturjoghurt', unit: 'g' },
    { id: 'oil', name: 'Olivenöl', unit: 'EL' },
    { id: 'spinach', name: 'Spinat', unit: 'g' },
    { id: 'tomato', name: 'Tomaten', unit: 'g' },
    { id: 'pasta', name: 'Pasta', unit: 'g (trocken)' },
    { id: 'beans', name: 'Weiße Bohnen', unit: 'g (abgetropft)' },
    { id: 'pepper', name: 'Paprika', unit: 'Stk.' }
  ],
  batches: [
    { id: 'roast', name: 'Ofengemüse & Kichererbsen', color: 'orange', ingredients: [{id:'chickpeas',amount:480},{id:'carrot',amount:600},{id:'oil',amount:2}], steps: ['Karotten in kleine Stücke schneiden, Kichererbsen abspülen.', 'Mit Öl mischen und bei 200 °C Ober-/Unterhitze ca. 25–30 Minuten rösten, bis die Karotten gar sind.'] },
    { id: 'grain', name: 'Couscous', color: 'gold', ingredients: [{id:'couscous',amount:240}], steps: ['Couscous nach Packungsangabe mit heißem Wasser zubereiten und auflockern.'] },
    { id: 'dip', name: 'Zitronen-Joghurt', color: 'green', ingredients: [{id:'yogurt',amount:300},{id:'lemon',amount:1}], steps: ['Joghurt mit Zitronensaft verrühren und nach Geschmack würzen.'] },
    { id: 'tomato-base', name: 'Tomaten-Bohnen-Basis', color: 'orange', ingredients: [{id:'tomato',amount:800},{id:'beans',amount:480},{id:'oil',amount:2}], steps: ['Tomaten würfeln und in Öl weich dünsten.', 'Abgespülte Bohnen zugeben und etwa 10 Minuten köcheln lassen. Nach Geschmack würzen.'] }
  ],
  recipes: [
    {id:'bowl',name:'Die warme Ofen-Bowl',day:1,batches:[{id:'roast',share:0.5},{id:'grain',share:0.5},{id:'dip',share:0.5}],ingredients:[],steps:['Jeweils die Hälfte von Ofengemüse und Couscous anrichten.','Die Hälfte des Dips darübergeben.']},
    {id:'salad',name:'Couscous zum Mitnehmen',day:2,batches:[{id:'roast',share:0.5},{id:'grain',share:0.5},{id:'dip',share:0.5}],ingredients:[{id:'spinach',amount:100}],steps:['Übriges Ofengemüse und Couscous mit gewaschenem Spinat mischen.','Den restlichen Dip bis zum Essen separat aufbewahren und dazugeben.']},
    {id:'pasta-bowl',name:'Pasta mit Tomaten & Bohnen',day:1,batches:[{id:'tomato-base',share:0.5}],ingredients:[{id:'pasta',amount:180}],steps:['Pasta nach Packungsangabe garen.','Die Hälfte der Tomaten-Bohnen-Basis vollständig erhitzen und mit der Pasta mischen.']},
    {id:'pepper-bowl',name:'Paprika-Bohnen-Pfanne',day:2,batches:[{id:'tomato-base',share:0.5}],ingredients:[{id:'pepper',amount:2},{id:'spinach',amount:100}],steps:['Paprika klein schneiden und mit etwas Wasser zugedeckt weich dünsten.','Restliche Basis und Spinat zugeben, vollständig erhitzen und abschmecken.']}
  ],
  combos: [
    {id:'sunshine',name:'Ein Blech. Zwei gute Tage.',subtitle:'Ofengemüse, Couscous und ein Dip, der alles verbindet.',icon:'◒',theme:'sun',prepMinutes:35,baseServings:2,recipes:['bowl','salad'],batches:['roast','grain','dip']},
    {id:'tomato-days',name:'Eine Basis. Viel Tomate.',subtitle:'Ein Topf Bohnen-Tomaten, heute mit Pasta, morgen als Pfanne.',icon:'◔',theme:'tomato',prepMinutes:20,baseServings:2,recipes:['pasta-bowl','pepper-bowl'],batches:['tomato-base']}
  ]
};
