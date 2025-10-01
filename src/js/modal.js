class ModalManager {
    constructor() {
        this.ticketModal = document.getElementById('ticketModal');
        this.deleteModal = document.getElementById('deleteModal');
        this.detailsModal = document.getElementById('detailsModal');
        this.currentTicketId = null;
        
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        [this.ticketModal, this.deleteModal, this.detailsModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeAllModals();
                }
            });
        });

        document.getElementById('cancelBtn').addEventListener('click', () => this.closeAllModals());
        document.getElementById('cancelDeleteBtn').addEventListener('click', () => this.closeAllModals());
        document.getElementById('closeDetailsBtn').addEventListener('click', () => this.closeAllModals());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });
    }

    openAddTicketModal() {
        this.currentTicketId = null;
        document.getElementById('modalTitle').textContent = 'Добавить тикет';
        document.getElementById('ticketForm').reset();
        this.ticketModal.style.display = 'block';
    }

    openEditTicketModal(ticket) {
        this.currentTicketId = ticket.id;
        document.getElementById('modalTitle').textContent = 'Редактировать тикет';
        document.getElementById('ticketName').value = ticket.name;
        document.getElementById('ticketDescription').value = ticket.description || '';
        this.ticketModal.style.display = 'block';
    }

    openDeleteTicketModal(ticketId) {
        this.currentTicketId = ticketId;
        this.deleteModal.style.display = 'block';
    }

    openDetailsModal(ticket) {
        document.getElementById('detailName').textContent = ticket.name;
        document.getElementById('detailStatus').textContent = ticket.status ? 'Выполнено' : 'В работе';
        document.getElementById('detailStatus').className = `status-badge ${ticket.status ? 'status-done' : 'status-todo'}`;
        
        const createdDate = new Date(ticket.created);
        document.getElementById('detailCreated').textContent = createdDate.toLocaleString();
        
        document.getElementById('detailDescription').textContent = ticket.description || 'Описание отсутствует';
        this.detailsModal.style.display = 'block';
    }

    closeAllModals() {
        this.ticketModal.style.display = 'none';
        this.deleteModal.style.display = 'none';
        this.detailsModal.style.display = 'none';
        this.currentTicketId = null;
    }

    getCurrentTicketId() {
        return this.currentTicketId;
    }
}

export default ModalManager;