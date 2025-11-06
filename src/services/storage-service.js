/**
 * Handles all storage as JSON using key 'todos'
 */
export class StorageService {
  /**
   * @param {string} [storageKey='todos'] - default storageKey is 'todos'
   */
  constructor(storageKey = 'todos') {
    /** @type {string} */
    this.storageKey = storageKey;
  }

  /**
   * Saves a key / data pair to local storage 
   * @param {string} k - key name
   * @param {*} d - data to save to storage
   */
  save(k, d) {
    try {
      const fk = `${this.storageKey}_${k}`;
      localStorage.setItem(fk, JSON.stringify(d));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }

  /**
   * Loads from localStorage based on a key, returns null if nothing found
   * @param {string} key - key name
   * @param {*} [defaultValue=null] - default return null if don't find in storage
   * @returns {*} object obtained from localStorage
   */
  load(key, defaultValue = null) {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      const item = localStorage.getItem(fullKey);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error('Failed to load from localStorage:', error);
      return defaultValue;
    }
  }

  /**
   * Deletes from storage item with key k
   * @param {string} k - The key name to remove (will be prefixed with storageKey)
   */
  remove(k) {
    try {
      const fullK = `${this.storageKey}_${k}`;
      localStorage.removeItem(fullK);
    } catch (e) {
      console.error('Failed to remove from localStorage:', e);
    }
  }

  /**
   * clears all of storages info going key by key
   */
  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(this.storageKey)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }
}
