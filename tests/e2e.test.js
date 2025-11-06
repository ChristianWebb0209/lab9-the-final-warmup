import { test } from 'node:test';
import assert from 'node:assert';
import { TodoModel } from '../src/models/todo-model.js';
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


test('e2e - full workflow with working localstorage', () => {
  localStorage.clear();
  const storage = new StorageService('e2e_test');
  const model = new TodoModel(storage);

  model.addTodo('buy dog');
  model.addTodo('walk milk');
  model.toggleComplete(model.todos[0].id);
  model.updateTodo(model.todos[1].id, 'Walk the milk');
  model.deleteTodo(model.todos[0].id);

  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.todos[0].text, 'Walk the milk');
  assert.strictEqual(model.todos[0].completed, false);

  const model2 = new TodoModel(storage);
  assert.strictEqual(model2.todos.length, 1);
  assert.strictEqual(model2.todos[0].text, 'Walk the milk');

  localStorage.clear();
});

