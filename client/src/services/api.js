const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
    const token = localStorage.getItem('token');

    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };
};

const handleResponse = async (res) => {
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data.message || 'API Request Failed');
    }

    return data;
};


// =========================
// AUTH SERVICE
// =========================

export const authService = {

    login: async (email, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                email,
                password
            })
        });

        return handleResponse(res);
    },

    register: async (userData) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(userData)
        });

        return handleResponse(res);
    },

    getMe: async () => {
        const res = await fetch(`${API_URL}/auth/me`, {
            headers: getHeaders()
        });

        return handleResponse(res);
    }
};


// =========================
// FOOD SERVICE
// =========================

export const foodService = {

    getFoods: async (query = '') => {
        const res = await fetch(
            `${API_URL}/foods${query ? `?${query}` : ''}`,
            {
                headers: getHeaders()
            }
        );

        return handleResponse(res);
    },

    createFood: async (foodData) => {
        const res = await fetch(`${API_URL}/foods`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(foodData)
        });
        return handleResponse(res);
    },

    updateFood: async (id, foodData) => {
        const res = await fetch(`${API_URL}/foods/${id}`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(foodData)
        });
        return handleResponse(res);
    },

    deleteFood: async (id) => {
        const res = await fetch(`${API_URL}/foods/${id}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        return handleResponse(res);
    }
};


// =========================
// CATEGORY SERVICE
// =========================

export const categoryService = {

    getCategories: async () => {
        const res = await fetch(`${API_URL}/categories`, {
            headers: getHeaders()
        });

        return handleResponse(res);
    }
};


// =========================
// ORDER SERVICE
// =========================

export const orderService = {

    // Create new order
    createOrder: async (orderData) => {
        const res = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(orderData)
        });

        return handleResponse(res);
    },


    // Get logged-in user's orders
    getMyOrders: async () => {
        const res = await fetch(`${API_URL}/orders/my`, {
            headers: getHeaders()
        });

        return handleResponse(res);
    },


    // Get ONE order by ID
    getOrderById: async (id) => {
        const res = await fetch(`${API_URL}/orders/${id}`, {
            headers: getHeaders()
        });

        return handleResponse(res);
    },


    // Get all orders - cafe/admin
    getAllOrders: async () => {
        const res = await fetch(`${API_URL}/orders`, {
            headers: getHeaders()
        });

        return handleResponse(res);
    },


    // Update order status
    updateOrderStatus: async (id, status) => {
        const res = await fetch(`${API_URL}/orders/${id}/status`, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify({
                status
            })
        });

        return handleResponse(res);
    },

    // Cancel order
    cancelOrder: async (id) => {
        const res = await fetch(`${API_URL}/orders/${id}/cancel`, {
            method: 'PATCH',
            headers: getHeaders()
        });

        return handleResponse(res);
    }
};


// =========================
// ADMIN SERVICE
// =========================

export const adminService = {

    getStats: async () => {
        const res = await fetch(
            `${API_URL}/admin/statistics`,
            {
                headers: getHeaders()
            }
        );

        return handleResponse(res);
    }
};