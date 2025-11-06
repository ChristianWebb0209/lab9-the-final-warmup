import { LitElement, html, unsafeCSS } from 'lit';
import './todo-item.js';
import styles from '../styles.css?raw';

/**
 * TodoList - Displays a list of todos
 */
export class TodoList extends LitElement {
  static properties = {
    todos: { type: Array }
  };

  static styles = unsafeCSS(styles);

  constructor() {
    super();
    this.todos = [];
  }

  render() {
    if (this.todos.length === 0) {
      return html`
        <div class="empty-state">
          <div class="empty-icon">📝</div>
          <p>No todos yet. Add one above!</p>
        </div>
      `;
    }

    return html`
      <div class="list-container">
        ${this.todos.map(todo => html`
          <todo-item .todo=${todo}></todo-item>
        `)}
      </div>
    `;
  }
}

customElements.define('todo-list', TodoList);
