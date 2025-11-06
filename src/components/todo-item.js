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
    // changed to using a completed variable to fix the issue with completed not being properly updated
    this.completed = false;
  }

  willUpdate(changedProperties) {
    if (changedProperties.has('todo')) {
      // sync states
      this.completed = this.todo?.completed || false;
    }
  }

  updated() {
    // make sure logical state for completed stays updated, this was a bug beforehand
    if (this.todo && this.completed !== this.todo.completed) {
      this.completed = this.todo.completed;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    // for performance and flexibility check every 100ms for updates
    this._checkInterval = setInterval(() => {
      if (this.todo && this.completed !== this.todo.completed) {
        this.completed = this.todo.completed;
        this.requestUpdate();
      }
    }, 100);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._checkInterval) {
      // clear the check interval
      clearInterval(this._checkInterval);
    }
  }

  /**
   * Calls toggle-todo custom event when checkbox clicked
   */
  handleToggle(e) {
    if (!this.todo) return;
    // dont do toggle logic if user clicks on a button or input
    if (e.target.closest('.button-group') || e.target.closest('.edit-input')) {
      return;
    }

    // spawn banana on click
    this.spawnBanana(e);

    this.dispatchEvent(new CustomEvent('toggle-todo', {
      detail: { id: this.todo.id },
      bubbles: true,
      composed: true
    }));

    requestAnimationFrame(() => {
      // nest in another one, making it wait two frames for added safety (it wasnt working because it hadnt yet processed toggle)
      requestAnimationFrame(() => {
        if (this.todo && this.completed !== this.todo.completed) {
          this.completed = this.todo.completed;
          this.requestUpdate();
        }
      });
    });
  }

  spawnBanana(e) {
    const banana = document.createElement('img');
    banana.src = './assets/banana.png';
    banana.style.position = 'fixed';
    banana.style.width = '120px';
    banana.style.height = '120px';
    banana.style.zIndex = '10000';
    banana.style.pointerEvents = 'none';
    banana.style.background = 'transparent';

    const direction = Math.random() > 0.5 ? 1 : -1;
    const horizontalVelocity = direction * (100 + Math.random() * 100);
    const verticalVelocity = -150 - Math.random() * 100;
    const gravity = 500;

    // spawn at center of mouse
    let x = e.clientX - 60;
    let y = e.clientY - 60;

    banana.style.left = `${x}px`;
    banana.style.top = `${y}px`;

    document.body.appendChild(banana);
    let vx = horizontalVelocity;
    let vy = verticalVelocity;
    let rotation = 0;
    const rotationDirection = Math.random() > 0.5 ? 1 : -1;
    const rotationSpeed = rotationDirection * 360;

    // i found this part online, works pretty streightforward, no physics just motion
    let lastTime = performance.now();
    const animate = (currentTime) => {
      const deltaTime = (currentTime - lastTime) / 1000;
      lastTime = currentTime;

      vy += gravity * deltaTime;
      x += vx * deltaTime;
      y += vy * deltaTime;

      rotation += rotationSpeed * deltaTime;

      banana.style.left = `${x}px`;
      banana.style.top = `${y}px`;
      banana.style.transform = `rotate(${rotation}deg)`;

      if (y < window.innerHeight + 100) {
        requestAnimationFrame(animate);
      } else {
        banana.remove();
      }
    };

    requestAnimationFrame(animate);
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
