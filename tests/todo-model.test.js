import { test } from 'node:test';
import assert from 'node:assert';
import { TodoModel } from '../src/models/todo-model.js';

// make a very basic mock of sotrage
class MockStorage {
  constructor() { this.data = {}; }
  save(key, value) { this.data[key] = value; }
  load(key, defaultValue) { return this.data[key] !== undefined ? this.data[key] : defaultValue; }
  remove() { }
  clear() { this.data = {}; }
}

test('addTodo creates todo', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('Test');
  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.todos[0].text, 'Test');
  assert.strictEqual(model.todos[0].completed, false);
});

test('addTodo doesnt accept empty', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('');
  model.addTodo('   ');
  assert.strictEqual(model.todos.length, 0);
});

test('toggleComplete toggles status', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('Test');
  const id = model.todos[0].id;
  model.toggleComplete(id);
  assert.strictEqual(model.todos[0].completed, true);
  model.toggleComplete(id);
  assert.strictEqual(model.todos[0].completed, false);
});

test('deleteTodo removes by id', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('Todo 1');
  model.addTodo('Todo 2');
  model.deleteTodo(model.todos[0].id);
  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.todos[0].text, 'Todo 2');
});

test('updateTodo modifies text', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('Original');
  model.updateTodo(model.todos[0].id, 'Updated');
  assert.strictEqual(model.todos[0].text, 'Updated');
});

test('updateTodo doesnt accept empty', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('Original');
  model.updateTodo(model.todos[0].id, '');
  assert.strictEqual(model.todos[0].text, 'Original');
});

test('clearCompleted removes completed', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('Active');
  model.addTodo('Done');
  model.toggleComplete(model.todos[1].id);
  model.clearCompleted();
  assert.strictEqual(model.todos.length, 1);
  assert.ok(!model.todos[0].completed);
});

test('clearAll resets everything', () => {
  const model = new TodoModel(new MockStorage());
  model.addTodo('Todo 1');
  model.addTodo('Todo 2');
  model.clearAll();
  assert.strictEqual(model.todos.length, 0);
  assert.strictEqual(model.nextId, 1);
});

test('persists to storage', () => {
  const storage = new MockStorage();
  const model = new TodoModel(storage);
  model.addTodo('Test');
  assert.deepStrictEqual(storage.data.items, model.todos);
});

test('loads from storage', () => {
  const storage = new MockStorage();
  storage.save('items', [{ id: 1, text: 'Loaded', completed: false, createdAt: '2024-01-01' }]);
  storage.save('nextId', 2);
  const model = new TodoModel(storage);
  assert.strictEqual(model.todos.length, 1);
  assert.strictEqual(model.nextId, 2);
});
