#!/usr/bin/env node
// Keine Pakete nötig. Lädt Browser-ES-Module isoliert, ohne das Repository umzukonfigurieren.
import assert from 'node:assert/strict';
import { readFile, writeFile, copyFile, mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const appDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const selfTest = args.includes('--self-test');
const inputs = args.filter(arg => arg !== '--self-test');
if (inputs.length > 1 || inputs.some(arg => arg.startsWith('--'))) {
  console.error('Aufruf: node apps/meal-prep/scripts/check-data.mjs [datensatz.json] [--self-test]');
  process.exit(1);
}
const text = (value, context) => assert(typeof value === 'string' && value.trim(), `${context}: Text fehlt`);
const positive = (value, context) => assert(Number.isFinite(value) && value > 0, `${context}: positive Zahl erwartet`);
const near = (a, b, context) => assert(Math.abs(a - b) < 1e-7, context);
const unique = (ids, context) => assert.equal(new Set(ids).size, ids.length, `${context}: doppelte ID/Referenz`);
function validate(raw, Catalog) {
  for (const group of ['cookbooks', 'ingredients', 'batches', 'recipes', 'combos']) {
    assert(Array.isArray(raw[group]) && raw[group].length, `${group}: nichtleere Liste erwartet`);
    raw[group].forEach(row => text(row.id, `${group}.id`));
    unique(raw[group].map(row => row.id), group);
  }
  const ingredientIds = new Set(raw.ingredients.map(row => row.id));
  const items = (list, context) => {
    assert(Array.isArray(list), `${context}: Zutatenliste erwartet`);
    unique(list.map(row => row.id), context);
    for (const item of list) {
      assert(ingredientIds.has(item.id), `${context}: unbekannte Zutat ${item.id}`);
      positive(item.amount, `${context}/${item.id}`);
    }
  };
  const steps = (list, context) => {
    assert(Array.isArray(list) && list.length, `${context}: Schritte fehlen`);
    list.forEach(step => text(step, context));
  };
  raw.cookbooks.forEach(book => {
    text(book.title, book.id); text(book.author, book.id);
    // Optional für ältere externe Datensätze und Bücher ohne bekannten Standard.
    // Ein konkreter Standard darf abweichende Rezeptportionen nicht überschreiben.
    for (const field of ['defaultServingsPerMeal', 'defaultTotalServings']) {
      if (book[field] !== undefined && book[field] !== null) {
        assert(Number.isInteger(book[field]) && book[field] > 0, `${book.id}/${field}: positive ganze Portionszahl erwartet`);
      }
    }
  });
  raw.ingredients.forEach(ingredient => {
    text(ingredient.name, ingredient.id); text(ingredient.unit, ingredient.id);
    assert(ingredient.supporting === undefined || typeof ingredient.supporting === 'boolean', `${ingredient.id}: supporting muss boolesch sein`);
  });
  raw.batches.forEach(batch => {
    text(batch.name, batch.id); items(batch.ingredients, batch.id); steps(batch.steps, batch.id);
    assert(batch.ingredients.length, `${batch.id}: keine Zutaten`);
    assert(['orange', 'gold', 'green'].includes(batch.color), `${batch.id}: unbekannte Farbe`);
  });
  raw.recipes.forEach(recipe => {
    text(recipe.name, recipe.id); items(recipe.ingredients, recipe.id); steps(recipe.steps, recipe.id);
    assert(Number.isInteger(recipe.day) && recipe.day > 0, `${recipe.id}: ungültiger Tag`);
    assert(Array.isArray(recipe.batches), `${recipe.id}: Bausteinliste fehlt`);
    unique(recipe.batches.map(use => use.id), recipe.id);
    recipe.batches.forEach(use => { positive(use.share, recipe.id); assert(use.share <= 1, `${recipe.id}: Anteil über 100 %`); });
  });
  raw.combos.forEach(combo => {
    for (const field of ['name', 'bookId', 'originalTitle', 'bookReference', 'subtitle', 'source', 'planNote', 'scalingNote']) text(combo[field], `${combo.id}/${field}`);
    assert(Number.isInteger(combo.baseServings) && combo.baseServings > 0, `${combo.id}: ungültige Basisportionen`);
    positive(combo.prepMinutes, combo.id);
    assert(Array.isArray(combo.recipes) && combo.recipes.length >= 2 && combo.recipes.length <= 4, `${combo.id}: 2–4 Gerichte erwartet`);
    assert(Array.isArray(combo.batches) && combo.batches.length, `${combo.id}: Bausteine fehlen`);
    unique(combo.recipes, combo.id); unique(combo.batches, combo.id);
    assert(['sun', 'tomato'].includes(combo.theme), `${combo.id}: unbekanntes Theme`);
  });
  // Prüft Referenzen, Buchzuordnung und Gesamtanteile mit dem tatsächlichen App-Modell.
  const catalog = new Catalog(raw);
  const usedRecipes = new Set(raw.combos.flatMap(combo => combo.recipes));
  const usedBatches = new Set(raw.combos.flatMap(combo => combo.batches));
  raw.recipes.forEach(recipe => assert(usedRecipes.has(recipe.id), `Verwaistes Rezept: ${recipe.id}`));
  raw.batches.forEach(batch => assert(usedBatches.has(batch.id), `Verwaister Baustein: ${batch.id}`));
  for (const combo of catalog.combos) {
    // Unabhängiger Mengenabgleich: pro Baustein einkaufen, nicht pro Verwendung.
    const expected = new Map();
    const add = item => expected.set(item.id, (expected.get(item.id) || 0) + item.amount);
    combo.preparations.forEach(batch => batch.ingredients.forEach(add));
    combo.meals.forEach(recipe => recipe.ingredients.forEach(add));
    for (const portions of [1, combo.baseServings, combo.baseServings * 2]) {
      const actual = combo.shoppingList(portions);
      assert.equal(actual.length, expected.size, `${combo.id}: doppelte/fehlende Einkaufsposition`);
      actual.forEach(item => near(item.amount, expected.get(item.ingredient.id) * portions / combo.baseServings, `${combo.id}: Menge/Skalierung ${item.ingredient.id}`));
    }
    // Unabhängig über Gerichte gezählt: dieselbe Zutat in einem Gericht zählt nur einmal.
    const usage = new Map();
    for (const recipe of combo.meals) {
      const ids = new Set(recipe.ingredients.map(item => item.id));
      recipe.batches.forEach(use => catalog.batches.get(use.id).ingredients.forEach(item => ids.add(item.id)));
      ids.forEach(id => usage.set(id, (usage.get(id) || 0) + 1));
    }
    const keys = [...usage].filter(([id, count]) => count > 1 && !catalog.ingredients.get(id).supporting).sort();
    assert.deepEqual(combo.keyIngredients.map(item => [item.ingredient.id, item.count]).sort(), keys, `${combo.id}: tragende Zutaten`);
    assert(keys.length, `${combo.id}: keine tragende, mehrfach verwendete Zutat`);
    assert(combo.matches(combo.originalTitle), `${combo.id}: Originaltitel nicht suchbar`);
    combo.shoppingList().forEach(item => assert(combo.matches(item.ingredient.name), `${combo.id}: Zutat nicht suchbar`));
  }
  return catalog;
}

const temp = await mkdtemp(join(tmpdir(), 'meal-prep-check-'));
try {
  await writeFile(join(temp, 'package.json'), '{"type":"module"}');
  for (const name of ['model.js', 'data.js', 'cookbooks.js']) await copyFile(join(appDir, name), join(temp, name));
  const { Catalog } = await import(pathToFileURL(join(temp, 'model.js')).href);
  const raw = inputs.length ? JSON.parse(await readFile(resolve(inputs[0]), 'utf8')) : (await import(pathToFileURL(join(temp, 'data.js')).href)).data;
  const catalog = validate(raw, Catalog);
  if (selfTest) {
    const cases = [
      ['ungültiger Buchstandard', copy => { copy.cookbooks[0].defaultServingsPerMeal = 0; }],
      ['gebrochener Buchstandard', copy => { copy.cookbooks[0].defaultServingsPerMeal = 2.5; }],
      ['ungültige Gesamtportionen', copy => { copy.cookbooks[0].defaultTotalServings = -4; }],
      ['doppelte ID', copy => copy.ingredients.push({ ...copy.ingredients[0] })],
      ['fehlendes Buch', copy => { copy.combos[0].bookId = 'missing'; }],
      ['fehlender Originaltitel', copy => { copy.combos[0].originalTitle = ''; }],
      ['fehlendes Rezept', copy => { copy.combos[0].recipes[0] = 'missing'; }],
      ['falsche Anteile', copy => { copy.recipes.find(recipe => recipe.batches.length).batches[0].share = 0; }],
      ['unvollständige Aufteilung', copy => { copy.recipes.find(recipe => recipe.batches.length).batches[0].share *= 0.5; }],
      ['negative Menge', copy => { copy.batches[0].ingredients[0].amount = -1; }],
      ['unbekannte Zutat', copy => { copy.batches[0].ingredients[0].id = 'missing'; }]
    ];
    for (const [name, mutate] of cases) {
      const broken = JSON.parse(JSON.stringify(raw)); mutate(broken);
      assert.throws(() => validate(broken, Catalog), undefined, `Fehler nicht erkannt: ${name}`);
    }
    console.log(`Selbsttest: ${cases.length} absichtliche Datenfehler erkannt.`);
  }
  console.log(`OK: ${catalog.cookbooks.size} Bücher, ${catalog.combos.length} Kombis, ${catalog.recipes.size} Rezepte. IDs, Quellen, Referenzen, Aufteilung, Einkaufsmengen, Skalierung, Wiederverwendung und Suche geprüft.`);
} catch (error) {
  console.error(`Datenprüfung fehlgeschlagen: ${error.message}`);
  process.exitCode = 1;
} finally {
  await rm(temp, { recursive: true, force: true });
}
