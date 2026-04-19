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

// Settings API
const SettingsAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'settings.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching settings:', e);
            return {};
        }
    },
    
    async save(settings) {
        try {
            const response = await fetch(API_BASE + 'settings.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            return await response.json();
        } catch (e) {
            console.error('Error saving settings:', e);
            return { error: e.message };
        }
    }
};

// Delivery Zones API
const DeliveryZonesAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'delivery-zones.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching zones:', e);
            return [];
        }
    },
    
    async add(zone) {
        try {
            const response = await fetch(API_BASE + 'delivery-zones.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(zone)
            });
            return await response.json();
        } catch (e) {
            console.error('Error adding zone:', e);
            return { error: e.message };
        }
    },
    
    async update(zone) {
        try {
            const response = await fetch(API_BASE + 'delivery-zones.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(zone)
            });
            return await response.json();
        } catch (e) {
            console.error('Error updating zone:', e);
            return { error: e.message };
        }
    },
    
    async delete(id) {
        try {
            const response = await fetch(API_BASE + 'delivery-zones.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return await response.json();
        } catch (e) {
            console.error('Error deleting zone:', e);
            return { error: e.message };
        }
    }
};

// Delivery Slots API
const DeliverySlotsAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'delivery-slots.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching slots:', e);
            return [];
        }
    },
    
    async add(slot) {
        try {
            const response = await fetch(API_BASE + 'delivery-slots.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slot)
            });
            return await response.json();
        } catch (e) {
            console.error('Error adding slot:', e);
            return { error: e.message };
        }
    },
    
    async update(slot) {
        try {
            const response = await fetch(API_BASE + 'delivery-slots.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(slot)
            });
            return await response.json();
        } catch (e) {
            console.error('Error updating slot:', e);
            return { error: e.message };
        }
    },
    
    async delete(id) {
        try {
            const response = await fetch(API_BASE + 'delivery-slots.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return await response.json();
        } catch (e) {
            console.error('Error deleting slot:', e);
            return { error: e.message };
        }
    }
};

// Drivers API
const DriversAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'drivers.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching drivers:', e);
            return [];
        }
    },
    
    async add(driver) {
        try {
            const response = await fetch(API_BASE + 'drivers.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(driver)
            });
            return await response.json();
        } catch (e) {
            console.error('Error adding driver:', e);
            return { error: e.message };
        }
    },
    
    async update(driver) {
        try {
            const response = await fetch(API_BASE + 'drivers.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(driver)
            });
            return await response.json();
        } catch (e) {
            console.error('Error updating driver:', e);
            return { error: e.message };
        }
    },
    
    async delete(id) {
        try {
            const response = await fetch(API_BASE + 'drivers.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return await response.json();
        } catch (e) {
            console.error('Error deleting driver:', e);
            return { error: e.message };
        }
    }
};

// Reviews API
const ReviewsAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'reviews.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching reviews:', e);
            return [];
        }
    },
    
    async add(review) {
        try {
            const response = await fetch(API_BASE + 'reviews.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(review)
            });
            return await response.json();
        } catch (e) {
            console.error('Error adding review:', e);
            return { error: e.message };
        }
    },
    
    async approve(id, isApproved = 1) {
        try {
            const response = await fetch(API_BASE + 'reviews.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isApproved })
            });
            return await response.json();
        } catch (e) {
            console.error('Error approving review:', e);
            return { error: e.message };
        }
    },
    
    async delete(id) {
        try {
            const response = await fetch(API_BASE + 'reviews.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return await response.json();
        } catch (e) {
            console.error('Error deleting review:', e);
            return { error: e.message };
        }
    }
};

// Categories API
const CategoriesAPI = {
    async getAll() {
        try {
            const response = await fetch(API_BASE + 'categories.php');
            return await response.json();
        } catch (e) {
            console.error('Error fetching categories:', e);
            return [];
        }
    },
    
    async add(category) {
        try {
            const response = await fetch(API_BASE + 'categories.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
            return await response.json();
        } catch (e) {
            console.error('Error adding category:', e);
            return { error: e.message };
        }
    },
    
    async update(category) {
        try {
            const response = await fetch(API_BASE + 'categories.php', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(category)
            });
            return await response.json();
        } catch (e) {
            console.error('Error updating category:', e);
            return { error: e.message };
        }
    },
    
    async delete(id) {
        try {
            const response = await fetch(API_BASE + 'categories.php', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id })
            });
            return await response.json();
        } catch (e) {
            console.error('Error deleting category:', e);
            return { error: e.message };
        }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        ProductsAPI, 
        SlideshowAPI, 
        OrdersAPI, 
        AnalyticsAPI,
        SettingsAPI,
        DeliveryZonesAPI,
        DeliverySlotsAPI,
        DriversAPI,
        ReviewsAPI,
        CategoriesAPI
    };
}
