/**
 * Manages the todo list data and business logic.
 * Implements the Observer pattern for reactive updates.
 */
export class TodoModel {
  /**
   * @param {StorageService} storageService - The storage service instance
   */
  constructor(storageService) {
    this.storage = storageService;
    this.todos = this.storage.load('items', []);
    this.listeners = [];
    this.nextId = this.storage.load('nextId', 1);
  }

  /**
   * @param {Function} listener - Callback function called on model changes
   */
  subscribe(listener) {
    this.listeners.push(listener);
  }

  /**
   * Notifies all subscribed listeners of state changes.
   */
  notify() {
    this.listeners.forEach(listener => listener());
  }

  /**
   * @param {string} text - The text content of the todo item
   */
  addTodo(text) {
    if (!text || text.trim() === '') {
      return;
    }

    const todo = {
      id: this.nextId++,
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };

    this.todos.push(todo);
    this.save();
    this.notify();
  }

  /**
   * @param {number} id - The unique identifier of the todo item
   */
  toggleComplete(id) {
    const todo = this.todos.find(t => t.id === id);
    if (todo) {
      todo.completed = !todo.completed;
      this.save();
      this.notify();
    }
  }

  /**
   * @param {number} id - The unique identifier of the todo item
   */
  deleteTodo(id) {
    this.todos = this.todos.filter(t => t.id !== id);
    this.save();
    this.notify();
  }

  /**
   * @param {number} id - The unique identifier of the todo item
   * @param {string} newText - The new text content for the todo
   */
  updateTodo(id, newText) {
    const todo = this.todos.find(t => t.id === id);
    if (todo && newText && newText.trim() !== '') {
      todo.text = newText.trim();
      this.save();
      this.notify();
    }
  }

  clearCompleted() {
    this.todos = this.todos.filter(t => !t.completed);
    this.save();
    this.notify();
  }

  clearAll() {
    this.todos = [];
    this.nextId = 1;
    this.storage.clear();
    this.notify();
  }

  /**
   * @returns {number} num of incomplete todos
   */
  get activeCount() {
    return this.todos.filter(t => !t.completed).length;
  }

  /**
   * @returns {number} num of completed todos
   */
  get completedCount() {
    return this.todos.filter(t => t.completed).length;
  }

  /**
   * Saves current state to storage
   */
  save() {
    this.storage.save('items', this.todos);
    this.storage.save('nextId', this.nextId);
  }
}
