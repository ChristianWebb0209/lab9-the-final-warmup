import { LitElement, html, unsafeCSS } from 'lit';
import styles from '../styles.css?raw';

/**
 * Form component for user to add a new todos
 */
export class TodoForm extends LitElement {
  static properties = {
    inputValue: { state: true }
  };

  static styles = unsafeCSS(styles);

  constructor() {
    super();
    this.inputValue = '';
  }

  /**
   * Handles form submission
   * @param {Event} e - Submit event for form
   */
  handleSubmit(e) {
    e.preventDefault();
    const text = this.inputValue.trim();

    if (text) {
      this.dispatchEvent(new CustomEvent('add-todo', {
        detail: { text },
        bubbles: true,
        composed: true
      }));

      this.inputValue = '';
    }
  }

  handleInput(e) {
    this.inputValue = e.target.value;
  }

  render() {
    return html`
      <form @submit=${this.handleSubmit}>
        <input
          class="edit-input"
          type="text"
          placeholder="What jungle challenge awaits?"
          .value=${this.inputValue}
          @input=${this.handleInput}
          aria-label="New jungle task"
          autofocus
        />
        <button type="submit" ?disabled=${!this.inputValue.trim()}>
          Add
        </button>
      </form>
    `;
  }
}

customElements.define('todo-form', TodoForm);
