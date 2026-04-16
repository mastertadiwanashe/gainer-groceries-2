// IndexedDB Database Helper for Gainer Groceries
const DB_NAME = 'GainerGroceriesDB';
const DB_VERSION = 1;

const DB_STORES = {
    products: { keyPath: 'id', autoIncrement: true },
    slideshow: { keyPath: 'id', autoIncrement: true },
    orders: { keyPath: 'id', autoIncrement: true },
    customers: { keyPath: 'id', autoIncrement: true },
    reviews: { keyPath: 'id', autoIncrement: true },
    settings: { keyPath: 'key' }
};

class GainerDatabase {
    constructor() {
        this.db = null;
    }

    // Initialize the database
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('Database opened successfully');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                Object.entries(DB_STORES).forEach(([storeName, options]) => {
                    if (!db.objectStoreNames.contains(storeName)) {
                        const store = db.createObjectStore(storeName, options);
                        console.log(`Created object store: ${storeName}`);
                    }
                });

                // Create indexes for products
                if (db.objectStoreNames.contains('products')) {
                    const productStore = db.transaction(['products'], 'readwrite').objectStore('products');
                    if (!productStore.indexNames.contains('category')) {
                        productStore.createIndex('category', 'category', { unique: false });
                    }
                }
            };
        });
    }

    // Generic method to add or update an item
    async put(storeName, data) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.put(data);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic method to get an item by key
    async get(storeName, key) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.get(key);

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic method to get all items from a store
    async getAll(storeName) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // Generic method to delete an item
    async delete(storeName, key) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.delete(key);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Generic method to clear all items from a store
    async clear(storeName) {
        if (!this.db) await this.init();
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            const request = store.clear();

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    // Products specific methods
    async saveProduct(product) {
        return this.put('products', product);
    }

    async getProducts() {
        return this.getAll('products');
    }

    async getProduct(id) {
        return this.get('products', id);
    }

    async deleteProduct(id) {
        return this.delete('products', id);
    }

    // Slideshow specific methods
    async saveSlide(slide) {
        return this.put('slideshow', slide);
    }

    async getSlides() {
        return this.getAll('slideshow');
    }

    async deleteSlide(id) {
        return this.delete('slideshow', id);
    }

    // Orders specific methods
    async saveOrder(order) {
        return this.put('orders', order);
    }

    async getOrders() {
        return this.getAll('orders');
    }

    async getOrder(id) {
        return this.get('orders', id);
    }

    // Settings specific methods
    async saveSetting(key, value) {
        return this.put('settings', { key, value });
    }

    async getSetting(key) {
        const result = await this.get('settings', key);
        return result ? result.value : null;
    }

    // Export all data as JSON
    async exportData() {
        const data = {};
        for (const storeName of Object.keys(DB_STORES)) {
            try {
                data[storeName] = await this.getAll(storeName);
            } catch (e) {
                console.error(`Error exporting ${storeName}:`, e);
                data[storeName] = [];
            }
        }
        data.exportDate = new Date().toISOString();
        data.version = DB_VERSION;
        return data;
    }

    // Import data from JSON
    async importData(data) {
        for (const [storeName, items] of Object.entries(data)) {
            if (DB_STORES[storeName] && Array.isArray(items)) {
                await this.clear(storeName);
                for (const item of items) {
                    await this.put(storeName, item);
                }
            }
        }
        console.log('Data imported successfully');
    }

    // Migrate data from localStorage to IndexedDB
    async migrateFromLocalStorage() {
        const migrations = [
            { key: 'adminProducts', store: 'products' },
            { key: 'adminSlides', store: 'slideshow' },
            { key: 'orders', store: 'orders' },
            { key: 'customers', store: 'customers' },
            { key: 'reviews', store: 'reviews' },
            { key: 'adminSettings', store: 'settings' }
        ];

        for (const { key, store } of migrations) {
            const data = localStorage.getItem(key);
            if (data) {
                try {
                    const parsed = JSON.parse(data);
                    if (store === 'settings') {
                        // Settings is stored as key-value pairs
                        for (const [k, v] of Object.entries(parsed)) {
                            await this.put(store, { key: k, value: v });
                        }
                    } else if (Array.isArray(parsed)) {
                        for (const item of parsed) {
                            await this.put(store, item);
                        }
                    }
                    console.log(`Migrated ${key} to ${store}`);
                    // Optionally remove from localStorage after migration
                    // localStorage.removeItem(key);
                } catch (e) {
                    console.error(`Error migrating ${key}:`, e);
                }
            }
        }
    }
}

// Create global instance
const db = new GainerDatabase();

// Initialize on page load
if (typeof window !== 'undefined') {
    window.addEventListener('DOMContentLoaded', async () => {
        await db.init();
        console.log('GainerGroceries Database initialized');
    });
}
