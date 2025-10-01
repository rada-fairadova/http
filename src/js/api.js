class HelpDeskAPI {
    constructor(baseURL = 'https://helpdesk-backend-9d3u.onrender.com') {
        this.baseURL = baseURL;
    }

    async request(method, params = {}, body = null) {
        const url = new URL(this.baseURL);

        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });

        const options = {
            method,
            headers: {}
        };

        if (body && (method === 'POST' || method === 'PUT')) {
            options.headers['Content-Type'] = 'application/json';
            options.body = JSON.stringify(body);
        }

        try {
            const response = await fetch(url, options);
            
            if (response.status === 204) {
                return null; // No content
            }

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async getAllTickets() {
        return this.request('GET', { method: 'allTickets' });
    }

    async getTicketById(id) {
        return this.request('GET', { method: 'ticketById', id });
    }

    async createTicket(ticketData) {
        return this.request('POST', { method: 'createTicket' }, ticketData);
    }

    async updateTicket(id, ticketData) {
        return this.request('POST', { method: 'updateById', id }, ticketData);
    }

    async deleteTicket(id) {
        return this.request('GET', { method: 'deleteById', id });
    }
}

export default HelpDeskAPI;