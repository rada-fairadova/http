class HelpDeskAPI {
    constructor(baseURL = 'http://localhost:7070') {
        this.baseURL = baseURL;
    }

    async request(method, params = {}, data = null) {
        const url = new URL(this.baseURL);
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

        const options = {
            method: data ? 'POST' : 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (method === 'deleteById' && response.status === 204) {
                return { success: true };
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const text = await response.text();
            return text ? JSON.parse(text) : { success: true };
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getAllTickets() {
        return this.request('allTickets');
    }

    async getTicketById(id) {
        return this.request('ticketById', { id });
    }

    async createTicket(ticketData) {
        return this.request('createTicket', {}, ticketData);
    }

    async updateTicket(id, ticketData) {
        return this.request('updateById', { id }, ticketData);
    }

    async deleteTicket(id) {
        return this.request('deleteById', { id });
    }
}

export default HelpDeskAPI;