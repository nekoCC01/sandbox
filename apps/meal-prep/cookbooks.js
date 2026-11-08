// Bücher werden einmal erfasst; Kombis verweisen über bookId darauf.
// Portionswerte sind Import-Rückfallwerte, keine Skalierung bestehender Kombis.
// defaultTotalServings beschreibt die Lunch-Gesamtmenge, nicht Portionen je Gericht.
// Titel und Autorinnen nach den bereitgestellten Buchcovern.
export const cookbooks = [
  { id: 'sunday-meal-prep', title: 'Sunday Meal Prep vegetarisch', author: 'Keda Black', defaultServingsPerMeal: 4 },
  { id: 'cook-once', title: 'Cook Once, Eat All Week', author: 'Cassy Joy Garcia', defaultServingsPerMeal: 4 },
  { id: 'meal-prep', title: 'Meal Prep', subtitle: '1 × Kochen – 4 × Mittagspause to go', author: 'Lena Merz', defaultServingsPerMeal: 2, defaultTotalServings: 4 }
];
