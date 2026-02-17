const api = {
    // --- Todos ---
    async getTodos() {
        const response = await fetch(CONFIG.API_URL, {
            headers: getHeaders()
        });
        this.handleAuth(response);
        return response.json();
    },

    async createTodo(data) {
        const response = await fetch(CONFIG.API_URL, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        this.handleAuth(response);
        return response.json();
    },

    async updateTodo(id, data) {
        const response = await fetch(`${CONFIG.API_URL}/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        this.handleAuth(response);
        return response.json();
    },

    async deleteTodo(id) {
        const response = await fetch(`${CONFIG.API_URL}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        this.handleAuth(response);
        return response.ok;
    },

    async toggleTodo(id) {
        const response = await fetch(`${CONFIG.API_URL}/${id}/toggle`, {
            method: 'PUT',
            headers: getHeaders()
        });
        this.handleAuth(response);
        return response.ok;
    },

    async getTodoById(id) {
        const response = await fetch(`${CONFIG.API_URL}/${id}`, {
            headers: getHeaders()
        });
        this.handleAuth(response);
        return response.json();
    },

    // --- Categories ---
    async getCategories() {
        const response = await fetch(CONFIG.API_CATEGORIES, {
            headers: getHeaders()
        });
        this.handleAuth(response);
        return response.json();
    },

    async createCategory(data) {
        const response = await fetch(CONFIG.API_CATEGORIES, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(data)
        });
        this.handleAuth(response);
        return response.json(); // Or handle error if necessary
    },

    async deleteCategory(id) {
        const response = await fetch(`${CONFIG.API_CATEGORIES}/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        this.handleAuth(response);
        return response.ok;
    },

    // --- Helper ---
    handleAuth(response) {
        if (response.status === 401 || response.status === 403) {
            logout();
            throw new Error('Unauthorized');
        }
        if (!response.ok && response.status !== 201) { // 201 Created is fine
            // Some API calls might return 400 Bad Request, we should handle them
            // But throwing error here is generally okay if we catch it upstream
        }
    }
};
