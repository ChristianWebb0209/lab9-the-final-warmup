import { LitElement, html, unsafeCSS } from 'lit';
import styles from '../styles.css?raw';

/**
 * Single todo item that handles editing and deleting.
 */
export class TodoItem extends LitElement {
  static properties = {
    todo: { type: Object },
    isEditing: { state: true },
    editValue: { state: true }
  };

  static styles = unsafeCSS(styles);

  constructor() {
    super();
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Calls toggle-todo custom event when checkbox clicked
   */
  handleToggle() {
    if (!this.todo) return;
    this.dispatchEvent(new CustomEvent('toggle-todo', {
      detail: { id: this.todo.id },
      bubbles: true,
      composed: true
    }));
  }

  /**
   * Calls delete-todo custom event
   */
  handleDelete() {
    if (!this.todo) return;
    if (confirm('Delete this todo?')) {
      this.dispatchEvent(new CustomEvent('delete-todo', {
        detail: { id: this.todo.id },
        bubbles: true,
        composed: true
      }));
    }
  }

  handleEdit() {
    if (!this.todo) return;
    this.isEditing = true;
    this.editValue = this.todo.text;
  }

  handleEditInput(e) {
    this.editValue = e.target.value;
  }

  /**
   * Handles saving todo through custom event
   */
  handleSave() {
    if (!this.todo || !this.editValue.trim()) return;
    this.dispatchEvent(new CustomEvent('update-todo', {
      detail: { id: this.todo.id, text: this.editValue },
      bubbles: true,
      composed: true
    }));
    this.isEditing = false;
  }

  handleCancel() {
    this.isEditing = false;
    this.editValue = '';
  }

  /**
   * Handles saving or canceling based on Enter or Esc key pressed down
   * @param {KeyboardEvent} e
   */
  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.handleSave();
    } else if (e.key === 'Escape') {
      this.handleCancel();
    }
  }

  render() {
    if (this.isEditing) {
      return html`
        <div class="todo-item">
          <input
            class="edit-input"
            type="text"
            .value=${this.editValue}
            @input=${this.handleEditInput}
            @keydown=${this.handleKeyDown}
            autofocus
          />
          <div class="button-group">
            <button class="save-btn" @click=${this.handleSave}>Save</button>
            <button class="cancel-btn" @click=${this.handleCancel}>Cancel</button>
          </div>
        </div>
      `;
    }

    return html`
      <div class="todo-item">
        <input
          type="checkbox"
          class="checkbox"
          .checked=${this.todo?.completed || false}
          @change=${this.handleToggle}
          aria-label="Toggle todo"
        />
        <span class="todo-text ${this.todo?.completed ? 'completed' : ''}">
          ${this.todo?.text || ''}
        </span>
        <div class="button-group">
          <button
            class="edit-btn"
            @click=${this.handleEdit}
            ?disabled=${this.todo?.completed}
            aria-label="Edit todo">
            Edit
          </button>
          <button
            class="delete-btn"
            @click=${this.handleDelete}
            aria-label="Delete todo">
            Delete
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('todo-item', TodoItem);
