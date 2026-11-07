export class Ingredient {
  constructor(raw) { Object.assign(this, raw); }
}
export class Recipe {
  constructor(raw, catalog) { Object.assign(this, raw); this.catalog = catalog; }
  get preparations() { return this.batches.map(use => ({...use, batch: this.catalog.batches.get(use.id)})); }
}
export class Combo {
  constructor(raw, catalog) { Object.assign(this, raw); this.catalog = catalog; }
  get meals() { return this.recipes.map(id => this.catalog.recipes.get(id)); }
  get preparations() { return this.batches.map(id => this.catalog.batches.get(id)); }
  shoppingList(servings = this.baseServings) {
    const totals = new Map();
    const add = item => totals.set(item.id, (totals.get(item.id) || 0) + item.amount * servings / this.baseServings);
    this.preparations.forEach(batch => batch.ingredients.forEach(add));
    this.meals.forEach(recipe => recipe.ingredients.forEach(add));
    return [...totals].map(([id,amount]) => ({ingredient:this.catalog.ingredients.get(id),amount}));
  }
  matches(query) {
    const text = [this.name, ...this.shoppingList().map(x => x.ingredient.name)].join(' ').toLocaleLowerCase('de');
    return query.toLocaleLowerCase('de').trim().split(/\s+/).every(word => text.includes(word));
  }
}
export class Catalog {
  constructor(raw) {
    this.ingredients = new Map(raw.ingredients.map(x => [x.id,new Ingredient(x)]));
    this.batches = new Map(raw.batches.map(x => [x.id,x]));
    this.recipes = new Map(raw.recipes.map(x => [x.id,new Recipe(x,this)]));
    this.combos = raw.combos.map(x => new Combo(x,this));
    this.validate();
  }
  validate() {
    const check = (map,id) => { if (!map.has(id)) throw new Error(`Unbekannte Referenz: ${id}`); };
    for (const combo of this.combos) {
      combo.recipes.forEach(id => check(this.recipes,id));
      combo.batches.forEach(id => check(this.batches,id));
      for (const batch of combo.preparations) {
        batch.ingredients.forEach(x => check(this.ingredients,x.id));
        const share = combo.meals.flatMap(x => x.batches).filter(x => x.id === batch.id).reduce((n,x) => n+x.share,0);
        if (Math.abs(share-1)>0.001) throw new Error(`Baustein ${batch.id}: Anteile müssen 100 % ergeben.`);
      }
      combo.meals.forEach(recipe => {
        recipe.ingredients.forEach(x => check(this.ingredients,x.id));
        recipe.batches.forEach(x => { if (!combo.batches.includes(x.id)) throw new Error(`Baustein fehlt: ${x.id}`); });
      });
    }
  }
}
