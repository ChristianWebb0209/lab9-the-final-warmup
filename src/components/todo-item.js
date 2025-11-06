import { LitElement, html, unsafeCSS } from 'lit';
import styles from '../styles.css?raw';

/**
 * Single todo item that handles editing and deleting.
 */
export class TodoItem extends LitElement {
  static properties = {
    todo: { type: Object },
    completed: { type: Boolean, state: true },
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
  handleDelete(e) {
    if (!this.todo) return;
    e.stopPropagation();
    if (confirm('Remove this jungle task from your expedition?')) {
      this.dispatchEvent(new CustomEvent('delete-todo', {
        detail: { id: this.todo.id },
        bubbles: true,
        composed: true
      }));
    }
  }

  handleEdit(e) {
    if (!this.todo) return;
    e.stopPropagation();
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
      <div 
        class="todo-item ${this.completed ? 'completed' : ''}"
        ?data-completed=${this.completed}
        @click=${this.handleToggle}
        role="button"
        tabindex="0"
        aria-label="Mark jungle task as conquered"
        @keydown=${(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          this.handleToggle(e);
        }
      }}
      >
        <span class="todo-text ${this.completed ? 'completed' : ''}">
          ${this.todo?.text || ''}
        </span>
        <div class="button-group">
          <button
            class="edit-btn"
            @click=${this.handleEdit}
            ?disabled=${this.completed}
            aria-label="Edit jungle todo">
            Edit
          </button>
          <button
            class="delete-btn"
            @click=${this.handleDelete}
            aria-label="Delete jungletodo">
            Delete
          </button>
        </div>
      </div>
    `;
  }
}

customElements.define('todo-item', TodoItem);
