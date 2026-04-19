// API Client for PHP Backend
// Replaces IndexedDB with MySQL backend calls

const API_BASE = 'api/';

// Products API
const ProductsAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'products.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching products:', e);
            return [];
        }
    },
    
    async add(product) {
        try {
            const response = await fetch(API_BASE + 'products.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            return await response.json();
        } catch (e) {
            console.error('Error adding product:', e);
            return { error: e.message };
        }
    },
    
    async update(product) {
        try {
            const response = await fetch(API_BASE + 'products.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            return await response.json();
        } catch (e) {
            console.error('Error updating product:', e);
            return { error: e.message };
        }
    },
    
    async delete(id) {
        try {
            const response = await fetch(API_BASE + 'products.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return await response.json();
        } catch (e) {
            console.error('Error deleting product:', e);
            return { error: e.message };
        }
    }
};

// Slideshow API
const SlideshowAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'slideshow.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching slides:', e);
            return [];
        }
    },
    
    async add(slide) {
        try {
            const response = await fetch(API_BASE + 'slideshow.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slide)
            });
            return await response.json();
        } catch (e) {
            console.error('Error adding slide:', e);
            return { error: e.message };
        }
    },
    
    async update(slide) {
        try {
            const response = await fetch(API_BASE + 'slideshow.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slide)
            });
            return await response.json();
        } catch (e) {
            console.error('Error updating slide:', e);
            return { error: e.message };
        }
    },
    
    async delete(id) {
        try {
            const response = await fetch(API_BASE + 'slideshow.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return await response.json();
        } catch (e) {
            console.error('Error deleting slide:', e);
            return { error: e.message };
        }
    }
};

// Orders API
const OrdersAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'orders.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching orders:', e);
            return [];
        }
    },
    
    async create(order) {
        try {
            const response = await fetch(API_BASE + 'orders.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            return await response.json();
        } catch (e) {
            console.error('Error creating order:', e);
            return { error: e.message };
        }
    },
    
    async updateStatus(id, status) {
        try {
            const response = await fetch(API_BASE + 'orders.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            return await response.json();
        } catch (e) {
            console.error('Error updating order:', e);
            return { error: e.message };
        }
    }
};

// Analytics API
const AnalyticsAPI = {
    async getSummary() {
        try {
            const response = await fetch(API_BASE + 'analytics.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching analytics:', e);
            return {
                totalOrders: 0,
                totalSales: 0,
                dailyRevenue: 0,
                weeklyRevenue: 0,
                monthlyRevenue: 0,
                lowStock: [],
                recentOrders: []
            };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ProductsAPI, SlideshowAPI, OrdersAPI, AnalyticsAPI };
}
