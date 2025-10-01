import '../css/style.css';
import HelpDeskAPI from './api.js';
import ModalManager from './modal.js';
import TicketManager from './ticket.js';

class HelpDeskApp {
    constructor() {
        this.api = new HelpDeskAPI();
        this.modalManager = new ModalManager();
        this.ticketManager = new TicketManager(this.api, this.modalManager);
    }

    init() {
        console.log('HelpDesk application initialized');
        this.ticketManager.loadTickets();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new HelpDeskApp();
    app.init();
});