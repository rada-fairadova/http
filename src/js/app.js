import '../css/style.css';
import HelpDeskAPI from './api.js';
import Ticket from './ticket.js';

class HelpDeskApp {
    constructor() {
        this.api = new HelpDeskAPI();
        this.tickets = [];
        this.currentEditingTicket = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadTickets();
    }

    bindEvents() {
        document.getElementById('addTicketBtn').addEventListener('click', () => {
            this.showTicketModal();
        });

        document.getElementById('ticketForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTicket();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.hideTicketModal();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.hideDeleteModal();
        });

        document.getElementById('closeDetailsBtn').addEventListener('click', () => {
            this.hideDetailsModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    async loadTickets() {
        this.showLoading();
        
        try {
            this.tickets = await this.api.getAllTickets();
            this.renderTickets();
        } catch (error) {
            this.showError('Ошибка загрузки тикетов');
            console.error('Failed to load tickets:', error);
        } finally {
            this.hideLoading();
        }
    }

    renderTickets() {
        const container = document.getElementById('ticketsContainer');
        container.innerHTML = '';

        this.tickets.forEach(ticketData => {
            const ticket = new Ticket(ticketData);

            ticket.onStatusToggle = (id, newStatus) => this.updateTicketStatus(id, newStatus);
            ticket.onShowDetails = (ticket) => this.showTicketDetails(ticket);
            ticket.onEdit = (ticket) => this.editTicket(ticket);
            ticket.onDelete = (ticket) => this.showDeleteConfirmation(ticket);
            
            container.appendChild(ticket.render());
        });
    }

    showTicketModal(ticket = null) {
        this.currentEditingTicket = ticket;
        const modal = document.getElementById('ticketModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('ticketForm');
        
        if (ticket) {
            title.textContent = 'Редактировать тикет';
            document.getElementById('ticketName').value = ticket.name;
            document.getElementById('ticketDescription').value = ticket.description;
        } else {
            title.textContent = 'Добавить тикет';
            form.reset();
        }
        
        modal.style.display = 'block';
    }

    hideTicketModal() {
        document.getElementById('ticketModal').style.display = 'none';
        this.currentEditingTicket = null;
    }

    async saveTicket() {
        const formData = new FormData(document.getElementById('ticketForm'));
        const ticketData = {
            name: formData.get('name'),
            description: formData.get('description')
        };

        try {
            if (this.currentEditingTicket) {
                await this.api.updateTicket(this.currentEditingTicket.id, ticketData);
            } else {
                await this.api.createTicket(ticketData);
            }
            
            this.hideTicketModal();
            await this.loadTickets();
        } catch (error) {
            this.showError('Ошибка сохранения тикета');
            console.error('Failed to save ticket:', error);
        }
    }

    async updateTicketStatus(id, status) {
        try {
            await this.api.updateTicket(id, { status });
            await this.loadTickets();
        } catch (error) {
            this.showError('Ошибка обновления статуса');
            console.error('Failed to update ticket status:', error);
            await this.loadTickets();
        }
    }

    editTicket(ticket) {
        this.showTicketModal(ticket);
    }

    showDeleteConfirmation(ticket) {
        this.currentEditingTicket = ticket;
        document.getElementById('deleteModal').style.display = 'block';
    }

    hideDeleteModal() {
        document.getElementById('deleteModal').style.display = 'none';
        this.currentEditingTicket = null;
    }

    async confirmDelete() {
        if (!this.currentEditingTicket) return;

        try {
            await this.api.deleteTicket(this.currentEditingTicket.id);
            this.hideDeleteModal();
            await this.loadTickets();
        } catch (error) {
            this.showError('Ошибка удаления тикета');
            console.error('Failed to delete ticket:', error);
        }
    }

    showTicketDetails(ticket) {
        const modal = document.getElementById('detailsModal');
        const content = document.getElementById('detailsContent');
        
        content.innerHTML = `
            <p><strong>Краткое описание:</strong> ${ticket.name}</p>
            <p><strong>Подробное описание:</strong> ${ticket.description || 'Нет описания'}</p>
            <p><strong>Статус:</strong> ${ticket.status ? 'Выполнено' : 'В работе'}</p>
            <p><strong>Дата создания:</strong> ${ticket.formatDate(ticket.created)}</p>
        `;
        
        modal.style.display = 'block';
    }

    hideDetailsModal() {
        document.getElementById('detailsModal').style.display = 'none';
    }

    showLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    hideLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    showError(message) {
        const container = document.getElementById('ticketsContainer');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.textContent = message;
        container.insertBefore(errorDiv, container.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new HelpDeskApp();
});