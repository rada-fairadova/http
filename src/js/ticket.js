class TicketManager {
    constructor(api, modalManager) {
        this.api = api;
        this.modalManager = modalManager;
        this.ticketsContainer = document.getElementById('ticketsContainer');
        this.loadingElement = document.getElementById('loading');
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.getElementById('ticketForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTicketSubmit();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.handleTicketDelete();
        });

        document.getElementById('addTicketBtn').addEventListener('click', () => {
            this.modalManager.openAddTicketModal();
        });
    }

    async loadTickets() {
        this.showLoading();
        
        try {
            const tickets = await this.api.getAllTickets();
            this.renderTickets(tickets);
        } catch (error) {
            console.error('Failed to load tickets:', error);
            this.showError('Не удалось загрузить тикеты');
        } finally {
            this.hideLoading();
        }
    }

    renderTickets(tickets) {
        if (!tickets || tickets.length === 0) {
            this.ticketsContainer.innerHTML = '<div class="no-tickets">Тикетов нет</div>';
            return;
        }

        this.ticketsContainer.innerHTML = tickets.map(ticket => `
            <div class="ticket" data-id="${ticket.id}">
                <div class="ticket-header">
                    <input type="checkbox" class="status-checkbox" ${ticket.status ? 'checked' : ''} 
                           data-id="${ticket.id}">
                    <div class="ticket-actions">
                        <button class="edit-btn" data-id="${ticket.id}" title="Редактировать">✎</button>
                        <button class="delete-btn" data-id="${ticket.id}" title="Удалить">×</button>
                    </div>
                </div>
                <div class="ticket-body" data-id="${ticket.id}">
                    <div class="ticket-name">${this.escapeHtml(ticket.name)}</div>
                    <div class="ticket-footer">
                        <span class="ticket-date">${new Date(ticket.created).toLocaleString()}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.attachTicketEventListeners();
    }

    attachTicketEventListeners() {
        document.querySelectorAll('.status-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const ticketId = e.target.dataset.id;
                this.handleStatusChange(ticketId, e.target.checked);
            });
        });

        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                const ticketId = e.target.dataset.id;
                await this.handleEditTicket(ticketId);
            });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const ticketId = e.target.dataset.id;
                this.modalManager.openDeleteTicketModal(ticketId);
            });
        });

        document.querySelectorAll('.ticket-body').forEach(body => {
            body.addEventListener('click', async (e) => {
                const ticketId = e.currentTarget.dataset.id;
                await this.handleViewDetails(ticketId);
            });
        });
    }

    async handleTicketSubmit() {
        const formData = new FormData(document.getElementById('ticketForm'));
        const ticketData = {
            name: formData.get('name'),
            description: formData.get('description')
        };

        try {
            const ticketId = this.modalManager.getCurrentTicketId();
            
            if (ticketId) {
                await this.api.updateTicket(ticketId, ticketData);
            } else {
                await this.api.createTicket(ticketData);
            }

            this.modalManager.closeAllModals();
            await this.loadTickets();
        } catch (error) {
            console.error('Failed to save ticket:', error);
            alert('Не удалось сохранить тикет');
        }
    }

    async handleTicketDelete() {
        const ticketId = this.modalManager.getCurrentTicketId();
        
        try {
            await this.api.deleteTicket(ticketId);
            this.modalManager.closeAllModals();
            await this.loadTickets(); 
        } catch (error) {
            console.error('Failed to delete ticket:', error);
            alert('Не удалось удалить тикет');
        }
    }

    async handleStatusChange(ticketId, status) {
        try {
            const ticket = await this.api.getTicketById(ticketId);
            await this.api.updateTicket(ticketId, {
                ...ticket,
                status: status
            });
            await this.loadTickets(); 
        } catch (error) {
            console.error('Failed to update ticket status:', error);
            alert('Не удалось обновить статус тикета');
        }
    }

    async handleEditTicket(ticketId) {
        try {
            const ticket = await this.api.getTicketById(ticketId);
            this.modalManager.openEditTicketModal(ticket);
        } catch (error) {
            console.error('Failed to load ticket for editing:', error);
            alert('Не удалось загрузить данные тикета');
        }
    }

    async handleViewDetails(ticketId) {
        try {
            const ticket = await this.api.getTicketById(ticketId);
            this.modalManager.openDetailsModal(ticket);
        } catch (error) {
            console.error('Failed to load ticket details:', error);
            alert('Не удалось загрузить детали тикета');
        }
    }

    showLoading() {
        this.loadingElement.style.display = 'block';
        this.ticketsContainer.innerHTML = '';
    }

    hideLoading() {
        this.loadingElement.style.display = 'none';
    }

    showError(message) {
        this.ticketsContainer.innerHTML = `<div class="error">${message}</div>`;
    }

    escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}

export default TicketManager;