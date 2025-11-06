import { test } from 'node:test';
import assert from 'node:assert';
import { StorageService } from '../src/services/storage-service.js';

// we need to mock localStorage here, i think because tests can't use localstorage themselves
const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) || null,
  setItem: (key, value) => storage.set(key, String(value)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
  get length() { return storage.size; },
  key: (index) => Array.from(storage.keys())[index] || null
};


test('stores with the right storage prefix', () => {
  const storage = new StorageService('test');
  storage.save('key', { value: 123 });
  assert.strictEqual(localStorage.getItem('test_key'), JSON.stringify({ value: 123 }));
  localStorage.removeItem('test_key');
});

test('load retrieves data', () => {
  const storage = new StorageService('test');
  storage.save('key', { value: 456 });
  assert.deepStrictEqual(storage.load('key'), { value: 456 });
  localStorage.removeItem('test_key');
});

test('load returns default when missing', () => {
  const storage = new StorageService('test');
  assert.strictEqual(storage.load('missing', 'default'), 'default');
});

test('remove by key works', () => {
  const storage = new StorageService('test');
  storage.save('key', 'value');
  storage.remove('key');
  assert.strictEqual(storage.load('key'), null);
});

test('clear removes prefixed keys only', () => {
  const storage = new StorageService('test');
  storage.save('key1', 'value1');
  storage.save('key2', 'value2');
  localStorage.setItem('other_key', 'other');
  storage.clear();
  assert.strictEqual(localStorage.getItem('test_key1'), null);
  assert.strictEqual(localStorage.getItem('other_key'), 'other');
  localStorage.removeItem('other_key');
});
