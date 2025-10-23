class Ticket {
    constructor({ id, name, description, status, created }) {
        this.id = id;
        this.name = name;
        this.description = description || '';
        this.status = Boolean(status);
        this.created = created || Date.now();
    }

    formatDate(timestamp) {
        return new Date(timestamp).toLocaleString('ru-RU');
    }

    render() {
        const ticketElement = document.createElement('div');
        ticketElement.className = `ticket ${this.status ? 'ticket-completed' : ''}`;
        ticketElement.innerHTML = `
            <div class="ticket-header">
                <div class="ticket-status">
                    <input type="checkbox" class="status-checkbox" ${this.status ? 'checked' : ''}>
                </div>
                <div class="ticket-name">${this.escapeHtml(this.name)}</div>
                <div class="ticket-actions">
                    <button class="ticket-action edit-btn" title="Редактировать">✎</button>
                    <button class="ticket-action delete-btn" title="Удалить">×</button>
                </div>
            </div>
            <div class="ticket-meta">
                <span>Создан: ${this.formatDate(this.created)}</span>
            </div>
        `;

        this.attachEventListeners(ticketElement);
        return ticketElement;
    }

    attachEventListeners(element) {
        const checkbox = element.querySelector('.status-checkbox');
        const name = element.querySelector('.ticket-name');
        const editBtn = element.querySelector('.edit-btn');
        const deleteBtn = element.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            this.toggleStatus();
        });

        name.addEventListener('click', () => {
            this.showDetails();
        });

        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.edit();
        });

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.delete();
        });
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    toggleStatus() {
        if (typeof this.onStatusToggle === 'function') {
            this.onStatusToggle(this.id, !this.status);
        }
    }

    showDetails() {
        if (typeof this.onShowDetails === 'function') {
            this.onShowDetails(this);
        }
    }

    edit() {
        if (typeof this.onEdit === 'function') {
            this.onEdit(this);
        }
    }

    delete() {
        if (typeof this.onDelete === 'function') {
            this.onDelete(this);
        }
    }
}

export default Ticket;