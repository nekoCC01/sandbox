import { emptyUser, validateUser, mergeUser } from './models.mjs';
export const STORAGE_KEY = 'fitness-tracker.user.v1';
export class UserStore {
  constructor(base, catalog, storage = globalThis.localStorage) {
    this.catalog = catalog; this.storage = storage; this.base = validateUser(base, catalog); this.warning = '';
    let local = emptyUser();
    try { const raw = storage.getItem(STORAGE_KEY); this.lastRaw = raw; if (raw) local = validateUser(JSON.parse(raw), catalog); }
    catch { this.warning = 'Browserdaten konnten nicht geladen werden. Sie wurden nicht überschrieben. Bitte vor neuen Einträgen die Daten sichern.'; this.readOnly = true; }
    this.data = mergeUser(base, local);
  }
  save(next) {
    if (this.readOnly) throw Error(this.warning);
    validateUser(next, this.catalog);
    // Persist before changing application state: quota/private-mode errors cannot look like a successful save.
    if (this.storage.getItem(STORAGE_KEY) !== this.lastRaw) throw Error('Browserdaten wurden in einem anderen Tab geändert. Bitte neu laden, bevor du speicherst.');
    const serialized = JSON.stringify(next);
    this.storage.setItem(STORAGE_KEY, serialized); this.lastRaw = serialized; this.data = next;
  }
  add(collection, row) { this.save({ ...this.data, [collection]: [...this.data[collection], row] }); }
  import(data) { this.save(validateUser(mergeUser(this.data, validateUser(data, this.catalog)), this.catalog)); }
  serialize() { return JSON.stringify(this.data, null, 2) + '\n'; }
}
