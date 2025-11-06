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
   * @param {string} key - key name
   * @param {*} data - data to save to storage
   */
  save(key, data) {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      localStorage.setItem(fullKey, JSON.stringify(data));
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
   * Deletes from storage item with the given key
   * @param {string} key - The key name to remove (will be prefixed with storageKey)
   */
  remove(key) {
    try {
      const fullKey = `${this.storageKey}_${key}`;
      localStorage.removeItem(fullKey);
    } catch (error) {
      console.error('Failed to remove from localStorage:', error);
    }
  }

  /**
   * Clears all storage entries with the storageKey prefix
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
