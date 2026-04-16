// Comprehensive Admin-Website Integration
const GainerIntegration = {
    // Data keys for localStorage
    keys: {
        products: 'adminProducts',
        orders: 'orders',
        reviews: 'reviews',
        settings: 'adminSettings',
        customers: 'customers',
        slides: 'adminSlides',
        lastSync: 'lastSyncTimestamp'
    },

    // Initialize all integrations
    init() {
        // Don't run on admin dashboard
        if (window.location.pathname.includes('admin')) {
            console.log('Skipping Gainer Integration on admin page');
            return;
        }
        console.log('Initializing Gainer Integration...');
        this.loadAllData();
        this.startSyncMonitoring();
        this.applySettings();
        console.log('Gainer Integration initialized successfully');
    },

    // Load all data from admin
    loadAllData() {
        this.loadProducts();
        this.loadSettings();
        this.loadSlides();
        this.loadReviews();
    },

    // Load products from admin
    loadProducts() {
        const adminProducts = localStorage.getItem(this.keys.products);
        if (adminProducts) {
            try {
                products = JSON.parse(adminProducts);
                console.log('Loaded', products.length, 'products from admin');
                if (typeof renderProducts === 'function') {
                    renderProducts();
                }
            } catch (e) {
                console.error('Error loading products:', e);
            }
        }
    },

    // Load and apply settings
    loadSettings() {
        const settings = localStorage.getItem(this.keys.settings);
        if (settings) {
            try {
                const config = JSON.parse(settings);
                this.applySettingsToStore(config);
                console.log('Applied admin settings:', config);
            } catch (e) {
                console.error('Error loading settings:', e);
            }
        }
    },

    // Apply settings to store UI
    applySettingsToStore(config) {
        // Update store name if available
        if (config.storeName) {
            document.title = config.storeName + ' - Your Online Supermarket';
            const logoElements = document.querySelectorAll('.logo');
            logoElements.forEach(el => {
                if (el.tagName === 'IMG') {
                    el.alt = config.storeName;
                } else {
                    el.textContent = config.storeName;
                }
            });
        }

        // Update contact info
        if (config.whatsapp) {
            const whatsappLinks = document.querySelectorAll('a[href*="whatsapp"]');
            whatsappLinks.forEach(link => {
                link.href = `https://wa.me/${config.whatsapp.replace(/\D/g, '')}`;
            });
        }

        // Update delivery fee
        if (config.deliveryFee !== undefined) {
            window.storeDeliveryFee = parseFloat(config.deliveryFee);
            const deliveryElements = document.querySelectorAll('.delivery-fee');
            deliveryElements.forEach(el => {
                el.textContent = `$${config.deliveryFee.toFixed(2)}`;
            });
        }

        // Apply theme colors if specified
        if (config.primaryColor) {
            document.documentElement.style.setProperty('--primary-color', config.primaryColor);
        }
    },

    // Load slideshow from admin
    loadSlides() {
        if (typeof loadAdminSlides === 'function') {
            loadAdminSlides();
            console.log('Loaded slideshow from admin');
        }
    },

    // Load reviews
    loadReviews() {
        const reviews = localStorage.getItem(this.keys.reviews);
        if (reviews && typeof displayProductReviews === 'function') {
            try {
                const reviewsData = JSON.parse(reviews);
                console.log('Loaded', reviewsData.length, 'reviews');
            } catch (e) {
                console.error('Error loading reviews:', e);
            }
        }
    },

    // Save order to admin
    saveOrder(orderData) {
        try {
            let orders = JSON.parse(localStorage.getItem(this.keys.orders) || '[]');
            orderData.id = Date.now();
            orderData.date = new Date().toISOString();
            orderData.status = 'new';
            orders.push(orderData);
            localStorage.setItem(this.keys.orders, JSON.stringify(orders));
            
            // Notify admin of new order
            this.notifyAdmin('newOrder', orderData);
            console.log('Order saved to admin:', orderData.id);
            return orderData.id;
        } catch (e) {
            console.error('Error saving order:', e);
            return null;
        }
    },

    // Save customer to admin
    saveCustomer(customerData) {
        try {
            let customers = JSON.parse(localStorage.getItem(this.keys.customers) || '[]');
            const existing = customers.find(c => c.email === customerData.email);
            
            if (existing) {
                // Update existing customer
                Object.assign(existing, customerData, {
                    lastOrder: new Date().toISOString(),
                    orderCount: (existing.orderCount || 0) + 1
                });
            } else {
                // Add new customer
                customerData.id = Date.now();
                customerData.createdAt = new Date().toISOString();
                customerData.orderCount = 1;
                customers.push(customerData);
            }
            
            localStorage.setItem(this.keys.customers, JSON.stringify(customers));
            console.log('Customer saved to admin:', customerData.email);
        } catch (e) {
            console.error('Error saving customer:', e);
        }
    },

    // Submit review
    submitReview(reviewData) {
        try {
            let reviews = JSON.parse(localStorage.getItem(this.keys.reviews) || '[]');
            reviewData.id = Date.now();
            reviewData.date = new Date().toISOString();
            reviewData.status = 'visible'; // Default to visible
            reviews.push(reviewData);
            localStorage.setItem(this.keys.reviews, JSON.stringify(reviews));
            
            this.notifyAdmin('newReview', reviewData);
            console.log('Review submitted:', reviewData.id);
            return true;
        } catch (e) {
            console.error('Error submitting review:', e);
            return false;
        }
    },

    // Notify admin dashboard of changes
    notifyAdmin(type, data) {
        // Set timestamp for polling
        localStorage.setItem('adminNotification', JSON.stringify({
            type: type,
            timestamp: Date.now(),
            data: data
        }));
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('adminNotification', {
            detail: { type, data }
        }));
    },

    // Start monitoring for admin changes
    startSyncMonitoring() {
        // Check for updates every 2 seconds
        setInterval(() => {
            this.checkForUpdates();
        }, 2000);

        // Listen for storage events (cross-tab communication)
        window.addEventListener('storage', (e) => {
            if (Object.values(this.keys).includes(e.key)) {
                console.log('Data updated from admin:', e.key);
                this.handleDataUpdate(e.key);
            }
        });

        console.log('Sync monitoring started');
    },

    // Check for data updates
    checkForUpdates() {
        const lastSync = localStorage.getItem(this.keys.lastSync);
        const currentSync = localStorage.getItem('adminDataTimestamp');
        
        if (currentSync && currentSync !== lastSync) {
            console.log('Admin data changed, syncing...');
            this.loadAllData();
            localStorage.setItem(this.keys.lastSync, currentSync);
        }
    },

    // Handle specific data updates
    handleDataUpdate(key) {
        switch(key) {
            case this.keys.products:
                this.loadProducts();
                break;
            case this.keys.settings:
                this.loadSettings();
                this.applySettings();
                break;
            case this.keys.slides:
                this.loadSlides();
                break;
            case this.keys.reviews:
                this.loadReviews();
                break;
        }
    },

    // Get real-time stats for store
    getStoreStats() {
        const orders = JSON.parse(localStorage.getItem(this.keys.orders) || '[]');
        const products = JSON.parse(localStorage.getItem(this.keys.products) || '[]');
        
        return {
            totalOrders: orders.length,
            totalProducts: products.length,
            totalRevenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
            averageOrderValue: orders.length > 0 ? 
                orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length : 0
        };
    }
};

// Initialize integration when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    GainerIntegration.init();
});

// Make integration globally available
window.GainerIntegration = GainerIntegration;
let products = [];

// Load products from IndexedDB or use defaults
async function loadProductsFromStorage() {
    if (typeof db !== 'undefined' && db) {
        try {
            const adminProducts = await db.getProducts();
            if (adminProducts && adminProducts.length > 0) {
                products = adminProducts;
                console.log('Loaded products from IndexedDB:', products.length, 'products');
                return;
            }
        } catch (e) {
            console.error('Error loading products from IndexedDB:', e);
        }
    }

    // Fallback to localStorage or defaults
    const adminProducts = localStorage.getItem('adminProducts');
    if (adminProducts) {
        products = JSON.parse(adminProducts);
    } else {
        // Default products with icons
        products = [
            // Pantry Items - Add your custom product images
            { id: 1, name: "White Rice (2kg)", category: "pantry", price: 4.50, stock: "in-stock", image: "your-images/rice.jpg", icon: "🍚" },
            { id: 2, name: "Pasta (500g)", category: "pantry", price: 2.80, stock: "in-stock", image: "your-images/pasta.jpg", icon: "🍝" },
            { id: 3, name: "All Purpose Flour (1kg)", category: "pantry", price: 3.20, stock: "in-stock", image: "your-images/flour.jpg", icon: "🌾" },
            { id: 4, name: "Sugar (1kg)", category: "pantry", price: 2.50, stock: "in-stock", image: "your-images/sugar.jpg", icon: "🍬" },
            { id: 5, name: "Cooking Oil (2L)", category: "pantry", price: 8.00, stock: "in-stock", image: "your-images/cooking-oil.jpg", icon: "🫒" },
            { id: 6, name: "Canned Tomatoes (400g)", category: "pantry", price: 1.80, stock: "on-request", image: "your-images/tomatoes.jpg", icon: "🥫" },
            { id: 7, name: "Salt (1kg)", category: "pantry", price: 1.20, stock: "in-stock", image: "your-images/salt.jpg", icon: "🧂" },
            { id: 8, name: "Tomato Sauce (500ml)", category: "pantry", price: 2.20, stock: "in-stock", image: "your-images/tomato-sauce.jpg", icon: "🍅" },

            // Breakfast & Cereals - Add your custom product images
            { id: 9, name: "Oats (500g)", category: "breakfast", price: 3.50, stock: "in-stock", image: "your-images/oats.jpg", icon: "🥣" },
            { id: 10, name: "Cornflakes (500g)", category: "breakfast", price: 4.00, stock: "in-stock", image: "your-images/cornflakes.jpg", icon: "🌽" },
            { id: 11, name: "Peanut Butter (500g)", category: "breakfast", price: 5.50, stock: "in-stock", image: "your-images/peanut-butter.jpg", icon: "🥜" },
            { id: 12, name: "Strawberry Jam (450g)", category: "breakfast", price: 3.80, stock: "in-stock", image: "your-images/jam.jpg", icon: "🍓" },
            { id: 13, name: "Tea Bags (100s)", category: "breakfast", price: 6.00, stock: "in-stock", image: "your-images/tea.jpg", icon: "🍵" },
            { id: 14, name: "Instant Coffee (200g)", category: "breakfast", price: 8.50, stock: "on-request", image: "your-images/coffee.jpg", icon: "☕" },

            // Snacks & Biscuits - Add your custom product images
            { id: 15, name: "Potato Chips (150g)", category: "snacks", price: 2.50, stock: "in-stock", image: "your-images/chips.jpg", icon: "🥔" },
            { id: 16, name: "Chocolate Chip Cookies (200g)", category: "snacks", price: 3.20, stock: "in-stock", image: "your-images/cookies.jpg", icon: "🍪" },
            { id: 17, name: "Milk Chocolate (100g)", category: "snacks", price: 2.80, stock: "in-stock", image: "your-images/chocolate.jpg", icon: "🍫" },
            { id: 18, name: "Mixed Sweets (250g)", category: "snacks", price: 3.00, stock: "in-stock", image: "your-images/sweets.jpg", icon: "🍬" },
            { id: 19, name: "Crackers (200g)", category: "snacks", price: 2.20, stock: "on-request", image: "your-images/crackers.jpg", icon: "🥨" },

            // Toiletries & Personal Care - Add your custom product images
            { id: 20, name: "Soap Bar (125g)", category: "toiletries", price: 1.50, stock: "in-stock", image: "your-images/soap.jpg", icon: "🧼" },
            { id: 21, name: "Shower Gel (250ml)", category: "toiletries", price: 4.50, stock: "in-stock", image: "your-images/shower-gel.jpg", icon: "🚿" },
            { id: 22, name: "Toothpaste (100ml)", category: "toiletries", price: 3.80, stock: "in-stock", image: "your-images/toothpaste.jpg", icon: "🦷" },
            { id: 23, name: "Body Lotion (200ml)", category: "toiletries", price: 5.20, stock: "in-stock", image: "your-images/lotion.jpg", icon: "🧴" },
            { id: 24, name: "Deodorant (50ml)", category: "toiletries", price: 4.00, stock: "in-stock", image: "your-images/deodorant.jpg", icon: "💨" },
            { id: 25, name: "Sanitary Pads (10s)", category: "toiletries", price: 3.50, stock: "in-stock", image: "your-images/pads.jpg", icon: "🩸" },

            // Cleaning & Household - Add your custom product images
            { id: 26, name: "Dishwashing Liquid (750ml)", category: "household", price: 3.80, stock: "in-stock", image: "your-images/dishwashing.jpg", icon: "🧽" },
            { id: 27, name: "Laundry Detergent (2kg)", category: "household", price: 12.00, stock: "in-stock", image: "your-images/detergent.jpg", icon: "🧺" },
            { id: 28, name: "Bleach (1L)", category: "household", price: 2.50, stock: "in-stock", image: "your-images/bleach.jpg", icon: "⚗️" },
            { id: 29, name: "Surface Cleaner (500ml)", category: "household", price: 4.20, stock: "in-stock", image: "your-images/cleaner.jpg", icon: "🧹" },
            { id: 30, name: "Toilet Paper (12 rolls)", category: "household", price: 8.00, stock: "in-stock", image: "your-images/toilet-paper.jpg", icon: "🧻" },
            
            // Baby Products - Add your custom product images
            { id: 31, name: "Baby Cereal (250g)", category: "baby", price: 4.50, stock: "on-request", image: "your-images/baby-cereal.jpg", icon: "👶" },
            { id: 32, name: "Diapers (Medium 30s)", category: "baby", price: 15.00, stock: "in-stock", image: "your-images/diapers.jpg", icon: "🍼" },
            { id: 33, name: "Baby Wipes (80s)", category: "baby", price: 6.50, stock: "in-stock", image: "your-images/baby-wipes.jpg", icon: "🧷" },
            
            // Frozen Items - Add your custom product images
            { id: 34, name: "Frozen Chicken (1kg)", category: "frozen", price: 7.50, stock: "on-request", image: "your-images/frozen-chicken.jpg", icon: "🍗" },
            { id: 35, name: "Frozen Vegetables (500g)", category: "frozen", price: 3.00, stock: "on-request", image: "your-images/frozen-veg.jpg", icon: "🥦" },
            { id: 36, name: "Ice Cream (1L)", category: "frozen", price: 6.00, stock: "on-request", image: "your-images/ice-cream.jpg", icon: "🍦" }
        ];
    }
}

// Load products on page load
loadProductsFromStorage();

// Shopping Cart
let cart = [];

// Load cart from sessionStorage
function loadCartFromStorage() {
    const storedCart = sessionStorage.getItem('gainerCart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }
}

// Save cart to sessionStorage
function saveCartToStorage() {
    sessionStorage.setItem('gainerCart', JSON.stringify(cart));
}

// Render products with custom images and admin data
function renderProducts(productsToRender) {
    const productsGrid = document.getElementById('products-grid');
    productsGrid.innerHTML = '';
    
    productsToRender.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.productId = product.id;
        
        // Get icon if not present (for admin products)
        const icon = product.icon || getProductIcon(product.name);
        
        // Get review rating and count
        const avgRating = getProductAverageRating(product.id);
        const reviewCount = getProductReviewCount(product.id);
        
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image ? 
                    `<img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                     <span style="display:none;">${icon}</span>` : 
                    `<span>${icon}</span>`
                }
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-category">${getCategoryDisplayName(product.category)}</p>
                <div class="product-reviews" style="margin: 8px 0; cursor: pointer;" onclick="event.stopPropagation(); showReviewModal(${product.id}, '${product.name.replace(/'/g, "\\'")}')">
                    <span style="color: #fbbf24;">${getStarRatingHTML(parseFloat(avgRating))}</span>
                    <span style="font-size: 12px; color: #6b7280; margin-left: 5px;">(${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'})</span>
                </div>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                ${product.quantity ? `<p class="product-quantity">${product.quantity}</p>` : ''}
                <p class="product-stock ${product.stock}">
                    ${product.stock === 'in-stock' ? 'In Stock' : product.stock === 'out-of-stock' ? 'Out of Stock' : 'Available on Request'}
                </p>
                ${product.description ? `<p class="product-description"><small>${product.description}</small></p>` : ''}
                <button class="add-to-cart" onclick="addToCart(${product.id})" 
                        ${product.stock !== 'in-stock' ? 'disabled' : ''}>
                    ${product.stock === 'in-stock' ? 'Add to Cart' : product.stock === 'out-of-stock' ? 'Out of Stock' : 'Available on Request'}
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Get category display name
function getCategoryDisplayName(category) {
    const categoryNames = {
        'pantry': 'Pantry',
        'breakfast': 'Breakfast & Cereals',
        'snacks': 'Snacks & Biscuits',
        'toiletries': 'Toiletries & Personal Care',
        'household': 'Cleaning & Household',
        'baby': 'Baby Products',
        'frozen': 'Frozen'
    };
    return categoryNames[category] || category;
}

// Get product icon based on product name
function getProductIcon(productName) {
    const iconMap = {
        'rice': '🍚',
        'pasta': '🍝',
        'flour': '🌾',
        'sugar': '🍬',
        'oil': '🫒',
        'tomato': '🍅',
        'salt': '🧂',
        'oats': '🥣',
        'cornflakes': '🌽',
        'peanut': '🥜',
        'jam': '🍓',
        'tea': '🍵',
        'coffee': '☕',
        'chips': '🥔',
        'cookies': '🍪',
        'chocolate': '🍫',
        'sweets': '🍬',
        'crackers': '🥨',
        'soap': '🧼',
        'shower': '🚿',
        'toothpaste': '🦷',
        'lotion': '🧴',
        'deodorant': '💨',
        'pads': '🩸',
        'detergent': '🧺',
        'bleach': '⚗️',
        'cleaner': '🧹',
        'toilet': '🧻',
        'baby': '👶',
        'diapers': '🍼',
        'wipes': '🧷',
        'chicken': '🍗',
        'vegetables': '🥦',
        'ice cream': '🍦',
        'dishwashing': '🧽'
    };
    
    const name = productName.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
        if (name.includes(key)) {
            return icon;
        }
    }
    
    return '📦'; // Default icon
}

// Add to cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock !== 'in-stock') return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartUI();
    showNotification(`${product.name} added to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartUI();
}

// Update quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCartToStorage();
            updateCartUI();
        }
    }
}

// Update cart UI
function updateCartUI() {
    updateCartCount();
    updateCartSidebar();
    updateCartTotal();
}

// Update cart count
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Update cart sidebar
function updateCartSidebar() {
    const cartItems = document.getElementById('cart-items');
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 2rem; color: #666;">Your cart is empty</p>';
        return;
    }
    
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remove</button>
        </div>
    `).join('');
}

// Update cart total
function updateCartTotal() {
    const cartTotal = document.getElementById('cart-total');
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = total.toFixed(2);
}

// Toggle cart sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('active');
}

// Search products
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const categoryFilter = document.getElementById('category-filter').value;
    
    let filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) &&
        (categoryFilter === '' || product.category === categoryFilter)
    );
    
    renderProducts(filteredProducts);
}

// Filter by category
function filterByCategory(category) {
    document.getElementById('category-filter').value = category;
    searchProducts();
    
    // Scroll to shop section with error handling
    const shopSection = document.getElementById('shop');
    if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn('Shop section not found');
    }
}

// Scroll to shop section with error handling
function scrollToShop() {
    const shopSection = document.getElementById('shop');
    if (shopSection) {
        shopSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        console.warn('Shop section not found');
        // Fallback: scroll to products grid
        const productsGrid = document.getElementById('products-grid');
        if (productsGrid) {
            productsGrid.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Go to Admin Portal
function goToAdmin() {
    window.location.href = 'admin-dashboard.html';
}

// Open WhatsApp
function openWhatsApp() {
    // Zimbabwe number format: +263 71 374 9230 (no +1 prefix)
    const phoneNumber = '263713749230'; // Country code 263, number 71 374 9230
    const message = encodeURIComponent('Hi! I would like to place an order with Gainer Groceries.');
    window.open(`https://wa.me/+${phoneNumber}?text=${message}`, '_blank');
}

// Open Email
function openEmail() {
    const email = 'gainergroceries@gmail.com';
    const subject = encodeURIComponent('Inquiry - Gainer Groceries');
    const body = encodeURIComponent('Hi Gainer Groceries Team,\n\nI would like to inquire about...\n\nThank you!');
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
}

// Handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('contact-name').value,
        email: document.getElementById('contact-email').value,
        phone: document.getElementById('contact-phone').value,
        subject: document.getElementById('contact-subject').value,
        message: document.getElementById('contact-message').value
    };
    
    // Create WhatsApp message with form data
    const phoneNumber = '263713749230';
    let whatsappMessage = `📝 *New Contact Form Submission*\n\n`;
    whatsappMessage += `*Name:* ${formData.name}\n`;
    whatsappMessage += `*Email:* ${formData.email}\n`;
    whatsappMessage += `*Phone:* ${formData.phone}\n`;
    whatsappMessage += `*Subject:* ${formData.subject}\n\n`;
    whatsappMessage += `*Message:*\n${formData.message}\n\n`;
    whatsappMessage += `*Sent from:* Gainer Groceries Website`;
    
    // Open WhatsApp with the message
    window.open(`https://wa.me/+${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
    
    // Show success message
    showNotification('Message sent successfully! We\'ll contact you soon.');
    
    // Reset form
    document.getElementById('contact-form').reset();
    
    // Scroll to top of contact section
    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

// Order via WhatsApp
function orderViaWhatsApp() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const phoneNumber = '263713749230';
    let message = 'Hi! I would like to place the following order:\n\n';
    
    cart.forEach(item => {
        message += `${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nTotal: $${total.toFixed(2)}\n\n`;
    message += 'Please confirm delivery details and payment method.';
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// Quick WhatsApp Order with customer details template
function quickWhatsAppOrder() {
    const phoneNumber = '263713749230';
    
    let message = `🛒 *NEW ORDER REQUEST*\n\n`;
    message += `*Customer Information:*\n`;
    message += `Name: [Please fill in your name]\n`;
    message += `Phone: [Please fill in your phone number]\n`;
    message += `Email: [Optional]\n\n`;
    message += `*Delivery Address:*\n`;
    message += `Street Address: [Please fill in]\n`;
    message += `Area/Suburb: [Please fill in]\n`;
    message += `City: Harare\n\n`;
    message += `*Order Items:*\n`;
    message += `[Please list the items you want to order]\n\n`;
    message += `*Preferred Delivery Time:*\n`;
    message += `[Morning/Afternoon/Evening/ASAP]\n\n`;
    message += `*Payment Method:*\n`;
    message += `[Cash on Delivery/EcoCash/Bank Transfer]\n\n`;
    message += `*Special Instructions:*\n`;
    message += `[Any special requests or notes]\n\n`;
    message += `Please fill in the details above and send back. Thank you!`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// Go to Checkout
function goToCheckoutPage() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal < 20) {
        showNotification('Minimum order amount is $20');
        return;
    }
    window.location.href = 'checkout.html';
}

// Proceed to checkout (legacy function)
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    // Update checkout summary with error handling
    try {
        updateCheckoutSummary();
        const checkoutModal = document.getElementById('checkout-modal');
        if (checkoutModal) {
            checkoutModal.classList.add('active');
            toggleCart();
        } else {
            console.error('Checkout modal not found');
            showNotification('Checkout system unavailable');
        }
    } catch (error) {
        console.error('Error opening checkout:', error);
        showNotification('Error opening checkout');
    }
}

// Update checkout summary
function updateCheckoutSummary() {
    try {
        const checkoutItems = document.getElementById('checkout-items');
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = calculateDeliveryFee(subtotal);
        const finalTotal = subtotal + deliveryFee;
        
        if (!checkoutItems) {
            console.error('Checkout items element not found');
            return;
        }
        
        checkoutItems.innerHTML = cart.map(item => `
            <div class="summary-line">
                <span>${item.quantity}x ${item.name}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
        
        const subtotalElement = document.getElementById('subtotal');
        const deliveryFeeElement = document.getElementById('delivery-fee');
        const finalTotalElement = document.getElementById('final-total');
        
        if (subtotalElement) subtotalElement.textContent = subtotal.toFixed(2);
        if (deliveryFeeElement) deliveryFeeElement.textContent = deliveryFee.toFixed(2);
        if (finalTotalElement) finalTotalElement.textContent = finalTotal.toFixed(2);
        
    } catch (error) {
        console.error('Error updating checkout summary:', error);
        showNotification('Error updating checkout summary');
    }
}

// Calculate delivery fee
function calculateDeliveryFee(subtotal) {
    if (subtotal >= 50) return 0;
    if (subtotal >= 30) return 3;
    if (subtotal >= 20) return 5;
    return 7;
}

// Process checkout
function processCheckout(event) {
    event.preventDefault();
    
    try {
        const nameElement = document.getElementById('name');
        const phoneElement = document.getElementById('phone');
        const addressElement = document.getElementById('address');
        const paymentElement = document.getElementById('payment');
        const notesElement = document.getElementById('notes');
        const finalTotalElement = document.getElementById('final-total');
        
        if (!nameElement || !phoneElement || !addressElement || !paymentElement || !finalTotalElement) {
            console.error('Required form elements not found');
            showNotification('Checkout form error');
            return;
        }
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const deliveryFee = calculateDeliveryFee(subtotal);
        const finalTotal = subtotal + deliveryFee;
        
        const orderData = {
            id: Date.now(), // Unique order ID
            customerName: nameElement.value,
            phone: phoneElement.value,
            address: addressElement.value,
            payment: paymentElement.value,
            notes: notesElement ? notesElement.value : '',
            items: cart.map(item => ({
                id: item.id,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                subtotal: item.price * item.quantity
            })),
            subtotal: subtotal,
            deliveryFee: deliveryFee,
            total: finalTotal,
            status: 'new',
            date: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
        
        // Save order using integration system
        if (window.GainerIntegration) {
            GainerIntegration.saveOrder(orderData);
            GainerIntegration.saveCustomer({
                name: orderData.customerName,
                phone: orderData.phone,
                email: orderData.phone + '@customer.com',
                address: orderData.address
            });
        } else {
            // Fallback to legacy functions
            saveOrderToAdmin(orderData);
            saveCustomerData(orderData);
        }
        
        // Sync with admin dashboard
        localStorage.setItem('adminDataTimestamp', Date.now().toString());
        
        // Here you would normally send this data to your server
        console.log('Order submitted:', orderData);
        
        // Show success message
        closeCheckout();
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            successModal.classList.add('active');
        } else {
            console.error('Success modal not found');
            showNotification('Order placed successfully!');
        }
        
        // Clear cart
        cart = [];
        updateCartUI();
        
        // Reset form
        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.reset();
        }
        
    } catch (error) {
        console.error('Error processing checkout:', error);
        showNotification('Error processing order');
    }
}

// Save order to localStorage for admin dashboard
function saveOrderToAdmin(orderData) {
    try {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));
        console.log('Order saved to admin dashboard:', orderData.id);
    } catch (error) {
        console.error('Error saving order:', error);
    }
}

// Save customer data for admin dashboard
function saveCustomerData(orderData) {
    try {
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        
        // Check if customer already exists
        let customer = customers.find(c => c.phone === orderData.phone);
        
        if (!customer) {
            // Create new customer
            customer = {
                id: Date.now(),
                name: orderData.customerName,
                phone: orderData.phone,
                email: orderData.phone + '@customer.com', // Placeholder email
                address: orderData.address,
                status: 'active',
                totalOrders: 0,
                totalSpent: 0,
                joinDate: new Date().toISOString()
            };
            customers.push(customer);
        }
        
        // Update customer stats
        customer.totalOrders = (customer.totalOrders || 0) + 1;
        customer.totalSpent = (customer.totalSpent || 0) + orderData.total;
        customer.lastOrderDate = new Date().toISOString();
        
        localStorage.setItem('customers', JSON.stringify(customers));
        console.log('Customer data updated:', customer.phone);
    } catch (error) {
        console.error('Error saving customer data:', error);
    }
}

// Submit a product review
function submitProductReview(productId, rating, comment, customerName) {
    try {
        const reviewData = {
            productId: productId,
            productName: products.find(p => p.id === productId)?.name || 'Unknown Product',
            customerName: customerName || 'Anonymous',
            rating: parseInt(rating),
            comment: comment,
            date: new Date().toISOString(),
            status: 'visible'
        };
        
        // Use integration system if available
        if (window.GainerIntegration) {
            const success = GainerIntegration.submitReview(reviewData);
            if (success) {
                showNotification('Review submitted successfully!');
                return true;
            }
        } else {
            // Fallback: save directly to localStorage
            let reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
            reviewData.id = Date.now();
            reviews.push(reviewData);
            localStorage.setItem('reviews', JSON.stringify(reviews));
            showNotification('Review submitted successfully!');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('Error submitting review:', error);
        showNotification('Error submitting review');
        return false;
    }
}

// Display reviews for a product
function displayProductReviews(productId) {
    try {
        const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
        const productReviews = reviews.filter(r => r.productId === productId && r.status === 'visible');
        
        const reviewsContainer = document.getElementById('product-reviews');
        if (!reviewsContainer) return;
        
        if (productReviews.length === 0) {
            reviewsContainer.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>';
            return;
        }
        
        const averageRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
        
        reviewsContainer.innerHTML = `
            <div class="reviews-summary">
                <div class="average-rating">
                    <span class="stars">${'★'.repeat(Math.round(averageRating))}${'☆'.repeat(5 - Math.round(averageRating))}</span>
                    <span class="rating-number">${averageRating.toFixed(1)}</span>
                    <span class="review-count">(${productReviews.length} reviews)</span>
                </div>
            </div>
            <div class="reviews-list">
                ${productReviews.map(review => `
                    <div class="review-item">
                        <div class="review-header">
                            <span class="reviewer-name">${review.customerName}</span>
                            <span class="review-date">${new Date(review.date).toLocaleDateString()}</span>
                        </div>
                        <div class="review-rating">${'★'.repeat(review.rating)}${'☆'.repeat(5 - review.rating)}</div>
                        <p class="review-comment">${review.comment}</p>
                    </div>
                `).join('')}
            </div>
        `;
    } catch (error) {
        console.error('Error displaying reviews:', error);
    }
}

// Close checkout modal
function closeCheckout() {
    try {
        const checkoutModal = document.getElementById('checkout-modal');
        if (checkoutModal) {
            checkoutModal.classList.remove('active');
        } else {
            console.warn('Checkout modal not found');
        }
    } catch (error) {
        console.error('Error closing checkout:', error);
    }
}

// Close success modal
function closeSuccess() {
    try {
        const successModal = document.getElementById('success-modal');
        if (successModal) {
            successModal.classList.remove('active');
        } else {
            console.warn('Success modal not found');
        }
    } catch (error) {
        console.error('Error closing success modal:', error);
    }
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #2c7a2c;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 4000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth scroll for navigation links with error handling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        } else {
            console.warn(`Target section ${targetId} not found`);
        }
    });
});

// Close modals when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });
});

// Close cart when clicking outside
document.addEventListener('click', function(e) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBtn = document.querySelector('.cart-btn');
    
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('active');
    }
});

// Form validation
function validateForm() {
    const phone = document.getElementById('phone').value;
    const phoneRegex = /^[0-9]{10}$/;
    
    if (!phoneRegex.test(phone.replace(/\s/g, ''))) {
        showNotification('Please enter a valid phone number');
        return false;
    }
    
    return true;
}

// Add form validation to checkout form
document.getElementById('checkout-form').addEventListener('submit', function(e) {
    if (!validateForm()) {
        e.preventDefault();
    }
});

// Mobile menu toggle (if needed in future)
function toggleMobileMenu() {
    const nav = document.querySelector('.nav');
    nav.classList.toggle('active');
}

// Check for minimum order
function checkMinimumOrder() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal < 20) {
        showNotification('Minimum order amount is $20');
        return false;
    }
    return true;
}

// Add minimum order check to checkout
document.querySelector('.proceed-to-checkout').addEventListener('click', function() {
    if (!checkMinimumOrder()) {
        return;
    }
    proceedToCheckout();
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load products and cart
    loadProductsFromStorage();
    loadCartFromStorage();
    renderProducts(products);
    updateCartUI();
    
    // Check if all required elements exist
    const requiredElements = [
        'products-grid',
        'cart-count',
        'cart-sidebar',
        'cart-items',
        'cart-total',
        'category-filter'
    ];
    
    requiredElements.forEach(id => {
        if (!document.getElementById(id)) {
            console.warn(`Required element #${id} not found`);
        }
    });
    
    // Initialize event listeners
    initializeEventListeners();
});

// Initialize all event listeners
function initializeEventListeners() {
    // Search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', searchProducts);
    }
    
    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', searchProducts);
    }
}

// Review System for Admin Integration
function addSampleReviews() {
    const existingReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    
    if (existingReviews.length === 0) {
        // Add sample reviews for demo purposes
        const sampleReviews = [
            {
                id: 1,
                productId: 1,
                productName: "White Rice (2kg)",
                customerId: 1,
                customerName: "John Doe",
                rating: 5,
                comment: "Excellent quality rice, very fresh and well packaged. Will definitely order again!",
                date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'visible'
            },
            {
                id: 2,
                productId: 2,
                productName: "Pasta (500g)",
                customerId: 2,
                customerName: "Jane Smith",
                rating: 4,
                comment: "Good quality pasta, cooks well. Great value for money.",
                date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'visible'
            },
            {
                id: 3,
                productId: 5,
                productName: "Cooking Oil (2L)",
                customerId: 3,
                customerName: "Mike Johnson",
                rating: 5,
                comment: "Pure and fresh cooking oil. Very satisfied with the quality.",
                date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                status: 'visible'
            }
        ];
        
        localStorage.setItem('reviews', JSON.stringify(sampleReviews));
    }
}

// Add review submission function (for future implementation)
function submitReview(productId, productName, rating, comment) {
    const review = {
        id: Date.now(),
        productId: productId,
        productName: productName,
        customerId: Date.now(), // This would be the actual customer ID
        customerName: "Current Customer", // This would be the actual customer name
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
        status: 'visible' // Reviews are visible by default
    };
    
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    console.log('Review submitted:', review);
    return review;
}

// Initialize sample reviews on page load
document.addEventListener('DOMContentLoaded', function() {
    addSampleReviews();
});

// Ensure everything is properly loaded
window.addEventListener('load', function() {
    // Final initialization
    console.log('Store fully loaded and integrated with admin dashboard');
    
    // Double-check product loading
    if (products.length === 0) {
        loadProductsFromStorage();
        renderProducts(products);
    }
    
    // Update cart UI
    updateCartUI();
});

// === COMPREHENSIVE CART, CHECKOUT & PAYMENT ENHANCEMENTS ===

// 1. ENHANCED CART FUNCTIONALITY
let savedCarts = JSON.parse(localStorage.getItem('savedCarts') || '[]');
let currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');

// Save cart for later
function saveCartForLater(cartName) {
    if (cart.length === 0) {
        showNotification('Cart is empty');
        return;
    }
    
    const savedCart = {
        id: Date.now(),
        name: cartName || `Saved Cart ${savedCarts.length + 1}`,
        items: [...cart],
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        savedAt: new Date().toISOString()
    };
    
    savedCarts.push(savedCart);
    localStorage.setItem('savedCarts', JSON.stringify(savedCarts));
    showNotification(`Cart saved as "${savedCart.name}"`);
}

// Load saved cart
function loadSavedCart(cartId) {
    const savedCart = savedCarts.find(sc => sc.id === cartId);
    if (savedCart) {
        cart = [...savedCart.items];
        saveCartToStorage();
        updateCartUI();
        showNotification(`Loaded "${savedCart.name}"`);
    }
}

// Clear cart
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('Clear all items from cart?')) {
        cart = [];
        saveCartToStorage();
        updateCartUI();
        showNotification('Cart cleared');
    }
}

// 2. STAFF/EMPLOYEE PURCHASING SYSTEM
let staffMembers = JSON.parse(localStorage.getItem('staffMembers') || '[]');
let staffCart = JSON.parse(localStorage.getItem('staffCart') || '[]');

// Initialize default staff
function initializeStaff() {
    if (staffMembers.length === 0) {
        staffMembers = [
            { id: 1, name: 'Manager', code: 'MGR001', discount: 15, role: 'manager' },
            { id: 2, name: 'Cashier', code: 'CSR002', discount: 10, role: 'cashier' },
            { id: 3, name: 'Staff', code: 'STF003', discount: 5, role: 'staff' }
        ];
        localStorage.setItem('staffMembers', JSON.stringify(staffMembers));
    }
}

// Verify staff code
function verifyStaffCode(code) {
    const staff = staffMembers.find(s => s.code === code);
    if (staff) {
        currentUser = { ...staff, type: 'staff' };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        return staff;
    }
    return null;
}

// Add item to staff cart
function addToStaffCart(productId, staffCode) {
    const staff = verifyStaffCode(staffCode);
    if (!staff) {
        showNotification('Invalid staff code');
        return false;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product || product.stock !== 'in-stock') {
        showNotification('Product not available');
        return false;
    }
    
    const discountedPrice = product.price * (1 - staff.discount / 100);
    
    const existingItem = staffCart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        staffCart.push({
            ...product,
            quantity: 1,
            originalPrice: product.price,
            discountedPrice: discountedPrice,
            staffDiscount: staff.discount
        });
    }
    
    localStorage.setItem('staffCart', JSON.stringify(staffCart));
    showNotification(`${product.name} added to staff cart (${staff.discount}% off)`);
    return true;
}

// Process staff purchase
function processStaffPurchase(staffCode) {
    const staff = verifyStaffCode(staffCode);
    if (!staff) {
        showNotification('Invalid staff code');
        return;
    }
    
    if (staffCart.length === 0) {
        showNotification('Staff cart is empty');
        return;
    }
    
    const subtotal = staffCart.reduce((sum, item) => sum + (item.discountedPrice * item.quantity), 0);
    const total = subtotal;
    
    const orderData = {
        id: Date.now(),
        type: 'staff_purchase',
        staffId: staff.id,
        staffName: staff.name,
        staffCode: staff.code,
        staffDiscount: staff.discount,
        items: staffCart.map(item => ({
            id: item.id,
            name: item.name,
            originalPrice: item.originalPrice,
            discountedPrice: item.discountedPrice,
            quantity: item.quantity,
            discount: item.staffDiscount
        })),
        subtotal: staffCart.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0),
        discount: staffCart.reduce((sum, item) => sum + ((item.originalPrice - item.discountedPrice) * item.quantity), 0),
        total: total,
        status: 'completed',
        date: new Date().toISOString()
    };
    
    // Save to orders
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Clear staff cart
    staffCart = [];
    localStorage.setItem('staffCart', JSON.stringify(staffCart));
    
    showNotification(`Staff purchase completed! Total: $${total.toFixed(2)}`);
    
    // Sync with admin
    localStorage.setItem('adminDataTimestamp', Date.now().toString());
}

// 3. PAYMENT METHODS
const PAYMENT_METHODS = {
    CASH: { id: 'cash', name: 'Cash on Delivery', icon: '💵' },
    CARD: { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
    MOBILE: { id: 'mobile', name: 'Mobile Money', icon: '📱' },
    ECOCASH: { id: 'ecocash', name: 'EcoCash Staff', icon: '💚', number: '263774899928' },
    TRANSFER: { id: 'transfer', name: 'Bank Transfer', icon: '🏦' },
    PAYPAL: { id: 'paypal', name: 'PayPal', icon: '🅿️' }
};

// Payment configuration
const PAYMENT_CONFIG = {
    whatsappNumber: '263713749230',
    ecocashStaffNumber: '263774899928',
    email: 'gainergroceries@gmail.com'
};

// Process payment
function processPayment(orderId, paymentMethod, paymentDetails) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        showNotification('Order not found');
        return false;
    }
    
    let paymentResult = {
        success: true,
        transactionId: 'TXN' + Date.now(),
        paymentMethod: paymentMethod,
        amount: order.total,
        timestamp: new Date().toISOString(),
        status: 'completed'
    };
    
    // Handle EcoCash staff payment
    if (paymentMethod === 'ecocash') {
        const ecocashNumber = PAYMENT_CONFIG.ecocashStaffNumber;
        const message = encodeURIComponent(`Hi! Staff payment for Order #${orderId}. Amount: $${order.total.toFixed(2)}. Please confirm.`);
        window.open(`https://wa.me/${ecocashNumber}?text=${message}`, '_blank');
        
        paymentResult.ecocashNumber = ecocashNumber;
        showNotification(`EcoCash payment request sent to staff number!`);
    }
    
    order.payment = {
        method: paymentMethod,
        status: paymentMethod === 'cash' || paymentMethod === 'ecocash' ? 'pending' : 'paid',
        transactionId: paymentResult.transactionId,
        paidAt: new Date().toISOString()
    };
    
    localStorage.setItem('orders', JSON.stringify(orders));
    
    if (paymentMethod !== 'ecocash') {
        showNotification(`Payment successful! Transaction ID: ${paymentResult.transactionId}`);
    }
    return paymentResult;
}

// Process EcoCash payment for staff
function processEcoCashPayment(orderId, orderTotal) {
    const ecocashNumber = PAYMENT_CONFIG.ecocashStaffNumber;
    const message = encodeURIComponent(`Staff Purchase - Order #${orderId}\nTotal: $${orderTotal.toFixed(2)}\nPlease process EcoCash payment.`);
    window.open(`https://wa.me/${ecocashNumber}?text=${message}`, '_blank');
    showNotification(`EcoCash payment request sent to +263 77 489 9928`);
}

// 4. ENHANCED CHECKOUT WITH MULTIPLE PAYMENT OPTIONS
function showEnhancedCheckout() {
    if (cart.length === 0) {
        showNotification('Cart is empty');
        return;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryFee = calculateDeliveryFee(subtotal);
    const finalTotal = subtotal + deliveryFee;
    
    // Build enhanced checkout modal
    const checkoutHTML = `
        <div id="enhanced-checkout-modal" class="modal active">
            <div class="modal-content" style="max-width: 600px; max-height: 90vh; overflow-y: auto;">
                <div class="modal-header">
                    <h2>Complete Your Order</h2>
                    <button class="close-btn" onclick="closeEnhancedCheckout()">&times;</button>
                </div>
                
                <form id="enhanced-checkout-form" onsubmit="processEnhancedCheckout(event)">
                    <!-- Order Summary -->
                    <div class="checkout-section" style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <h3>Order Summary</h3>
                        <div id="checkout-items-summary">
                            ${cart.map(item => `
                                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                                    <span>${item.quantity}x ${item.name}</span>
                                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                                </div>
                            `).join('')}
                        </div>
                        <div style="border-top: 1px solid #ddd; margin-top: 10px; padding-top: 10px;">
                            <div style="display: flex; justify-content: space-between;">
                                <span>Subtotal:</span>
                                <span>$${subtotal.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between;">
                                <span>Delivery Fee:</span>
                                <span>$${deliveryFee.toFixed(2)}</span>
                            </div>
                            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 18px; margin-top: 10px;">
                                <span>Total:</span>
                                <span style="color: #10b981;">$${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Customer Details -->
                    <div class="form-group">
                        <label>Full Name *</label>
                        <input type="text" id="checkout-name" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label>Phone Number *</label>
                        <input type="tel" id="checkout-phone" required style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label>Email</label>
                        <input type="email" id="checkout-email" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <div class="form-group">
                        <label>Delivery Address *</label>
                        <textarea id="checkout-address" required rows="3" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Delivery Instructions</label>
                        <textarea id="checkout-instructions" rows="2" placeholder="e.g., Ring doorbell, Leave at gate..." style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;"></textarea>
                    </div>
                    
                    <!-- Delivery Time -->
                    <div class="form-group">
                        <label>Preferred Delivery Time</label>
                        <select id="checkout-time" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                            <option value="asap">As soon as possible</option>
                            <option value="morning">Morning (8am - 12pm)</option>
                            <option value="afternoon">Afternoon (12pm - 5pm)</option>
                            <option value="evening">Evening (5pm - 8pm)</option>
                        </select>
                    </div>
                    
                    <!-- Payment Methods -->
                    <div class="form-group">
                        <label>Payment Method *</label>
                        <div class="payment-methods" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; margin-top: 10px;">
                            ${Object.values(PAYMENT_METHODS).map(method => `
                                <label class="payment-option" style="display: flex; align-items: center; padding: 12px; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.3s;">
                                    <input type="radio" name="payment-method" value="${method.id}" required style="margin-right: 10px;">
                                    <span style="font-size: 24px; margin-right: 8px;">${method.icon}</span>
                                    <span>${method.name}</span>
                                </label>
                            `).join('')}
                        </div>
                    </div>
                    
                    <!-- Staff Purchase Option -->
                    <div class="form-group" style="background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px;">
                        <label style="display: flex; align-items: center; cursor: pointer;">
                            <input type="checkbox" id="staff-purchase-toggle" onchange="toggleStaffPurchase()" style="margin-right: 10px;">
                            <span>This is a staff purchase</span>
                        </label>
                        <div id="staff-code-section" style="display: none; margin-top: 10px;">
                            <input type="text" id="staff-code" placeholder="Enter staff code (e.g., MGR001)" style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px;">
                            <small style="color: #666;">Staff discount will be applied automatically</small>
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="width: 100%; padding: 15px; font-size: 16px; margin-top: 20px;">
                        Complete Order - $${finalTotal.toFixed(2)}
                    </button>
                </form>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    const existingModal = document.getElementById('enhanced-checkout-modal');
    if (existingModal) existingModal.remove();
    
    // Add to body
    document.body.insertAdjacentHTML('beforeend', checkoutHTML);
}

function closeEnhancedCheckout() {
    const modal = document.getElementById('enhanced-checkout-modal');
    if (modal) modal.remove();
}

function toggleStaffPurchase() {
    const toggle = document.getElementById('staff-purchase-toggle');
    const section = document.getElementById('staff-code-section');
    section.style.display = toggle.checked ? 'block' : 'none';
}

function processEnhancedCheckout(event) {
    event.preventDefault();
    
    const isStaff = document.getElementById('staff-purchase-toggle').checked;
    const staffCode = document.getElementById('staff-code')?.value;
    
    if (isStaff && staffCode) {
        // Process as staff purchase
        cart.forEach(item => addToStaffCart(item.id, staffCode));
        processStaffPurchase(staffCode);
        closeEnhancedCheckout();
        cart = [];
        saveCartToStorage();
        updateCartUI();
        return;
    }
    
    // Regular customer checkout
    const orderData = {
        id: Date.now(),
        type: 'customer',
        customerName: document.getElementById('checkout-name').value,
        phone: document.getElementById('checkout-phone').value,
        email: document.getElementById('checkout-email').value,
        address: document.getElementById('checkout-address').value,
        instructions: document.getElementById('checkout-instructions').value,
        deliveryTime: document.getElementById('checkout-time').value,
        paymentMethod: document.querySelector('input[name="payment-method"]:checked')?.value,
        items: cart.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),
        subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        deliveryFee: calculateDeliveryFee(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)),
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + calculateDeliveryFee(cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)),
        status: 'new',
        date: new Date().toISOString()
    };
    
    // Save order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(orderData);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Process payment if not cash
    if (orderData.paymentMethod && orderData.paymentMethod !== 'cash') {
        processPayment(orderData.id, orderData.paymentMethod);
    }
    
    // Save customer data
    if (window.GainerIntegration) {
        GainerIntegration.saveCustomer({
            name: orderData.customerName,
            phone: orderData.phone,
            email: orderData.email,
            address: orderData.address
        });
    }
    
    // Clear cart
    cart = [];
    saveCartToStorage();
    updateCartUI();
    
    closeEnhancedCheckout();
    showNotification('Order placed successfully!');
    
    // Sync with admin
    localStorage.setItem('adminDataTimestamp', Date.now().toString());
}

// 5. QUICK BUY FUNCTIONALITY
function quickBuy(productId) {
    const product = products.find(p => p.id === productId);
    if (!product || product.stock !== 'in-stock') {
        showNotification('Product not available');
        return;
    }
    
    // Add to cart
    addToCart(productId);
    
    // Show enhanced checkout immediately
    setTimeout(() => {
        showEnhancedCheckout();
    }, 300);
}

// 6. PROMO CODES
let activePromos = JSON.parse(localStorage.getItem('activePromos') || '[]');

function applyPromoCode(code) {
    const promo = activePromos.find(p => p.code === code.toUpperCase() && p.active);
    if (!promo) {
        showNotification('Invalid or expired promo code');
        return false;
    }
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = promo.type === 'percentage' ? subtotal * (promo.value / 100) : promo.value;
    
    window.currentDiscount = discount;
    window.currentPromo = promo;
    
    showNotification(`Promo applied! You saved $${discount.toFixed(2)}`);
    updateCartUI();
    return true;
}

// Initialize promos
function initializePromos() {
    if (activePromos.length === 0) {
        activePromos = [
            { id: 1, code: 'WELCOME10', type: 'percentage', value: 10, active: true },
            { id: 2, code: 'SAVE5', type: 'fixed', value: 5, active: true },
            { id: 3, code: 'STAFF20', type: 'percentage', value: 20, active: true }
        ];
        localStorage.setItem('activePromos', JSON.stringify(activePromos));
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', function() {
    initializeStaff();
    initializePromos();
});

// === CART SIDEBAR HELPER FUNCTIONS ===

function toggleCartStaffSection() {
    const toggle = document.getElementById('cart-staff-toggle');
    const section = document.getElementById('cart-staff-code-section');
    if (toggle && section) {
        section.style.display = toggle.checked ? 'block' : 'none';
    }
}

function processStaffCartPurchase() {
    const staffCode = document.getElementById('cart-staff-code')?.value;
    if (!staffCode) {
        showNotification('Please enter staff code');
        return;
    }
    
    const staff = verifyStaffCode(staffCode);
    if (!staff) {
        showNotification('Invalid staff code');
        return;
    }
    
    // Move cart items to staff cart
    cart.forEach(item => {
        const discountedPrice = item.price * (1 - staff.discount / 100);
        const existingItem = staffCart.find(si => si.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
        } else {
            staffCart.push({
                ...item,
                originalPrice: item.price,
                discountedPrice: discountedPrice,
                staffDiscount: staff.discount
            });
        }
    });
    
    localStorage.setItem('staffCart', JSON.stringify(staffCart));
    
    // Process as staff purchase
    processStaffPurchase(staffCode);
    
    // Clear regular cart
    cart = [];
    saveCartToStorage();
    updateCartUI();
    toggleCart();
}

function applyCartPromoCode() {
    const code = document.getElementById('cart-promo-code')?.value;
    if (!code) {
        showNotification('Please enter promo code');
        return;
    }
    applyPromoCode(code);
}

function quickBuyAll() {
    if (cart.length === 0) {
        showNotification('Cart is empty');
        return;
    }
    
    // Check minimum order ($20)
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (subtotal < 20) {
        showNotification(`Minimum order amount is $20. Add $${(20 - subtotal).toFixed(2)} more.`);
        return;
    }
    
    // Redirect to dedicated checkout page
    window.location.href = 'checkout.html';
}

// Quick Buy button on product cards
function addQuickBuyButton(productCard, productId) {
    const quickBuyBtn = document.createElement('button');
    quickBuyBtn.className = 'quick-buy-btn';
    quickBuyBtn.innerHTML = '<i class="fas fa-bolt"></i> Quick Buy';
    quickBuyBtn.onclick = (e) => {
        e.stopPropagation();
        quickBuy(productId);
    };
    productCard.appendChild(quickBuyBtn);
}

// Customer Review Submission
function submitProductReview(productId, productName, customerName, rating, comment) {
    const review = {
        id: Date.now(),
        productId: productId,
        productName: productName,
        customerName: customerName,
        rating: rating,
        comment: comment,
        date: new Date().toISOString(),
        status: 'visible'
    };
    
    // Save review
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Notify admin dashboard
    localStorage.setItem('adminNotification', JSON.stringify({
        type: 'newReview',
        data: review,
        timestamp: Date.now()
    }));
    localStorage.setItem('adminDataTimestamp', Date.now().toString());
    
    showNotification('Thank you! Your review has been submitted.');
    return review;
}

// Get product reviews for display
function getProductReviews(productId) {
    const reviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    return reviews.filter(r => r.productId === productId && r.status === 'visible');
}

// Calculate average rating for a product
function getProductAverageRating(productId) {
    const reviews = getProductReviews(productId);
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, r) => sum + r.rating, 0);
    return (total / reviews.length).toFixed(1);
}

// Get total review count for a product
function getProductReviewCount(productId) {
    const reviews = getProductReviews(productId);
    return reviews.length;
}

// Display star rating HTML
function getStarRatingHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = 5 - fullStars - halfStar;
    
    let html = '';
    for (let i = 0; i < fullStars; i++) html += '<i class="fas fa-star" style="color:#fbbf24;"></i>';
    if (halfStar) html += '<i class="fas fa-star-half-alt" style="color:#fbbf24;"></i>';
    for (let i = 0; i < emptyStars; i++) html += '<i class="far fa-star" style="color:#d1d5db;"></i>';
    
    return html;
}

// Show review modal for a product
function showReviewModal(productId, productName) {
    const reviews = getProductReviews(productId);
    const avgRating = getProductAverageRating(productId);
    
    let reviewsHtml = '';
    if (reviews.length > 0) {
        reviewsHtml = reviews.slice(0, 5).map(r => `
            <div style="border-bottom:1px solid #e5e7eb; padding:15px 0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
                    <span style="font-weight:600;">${r.customerName}</span>
                    <span style="font-size:12px; color:#6b7280;">${new Date(r.date).toLocaleDateString()}</span>
                </div>
                <div style="margin-bottom:8px;">${getStarRatingHTML(r.rating)}</div>
                <p style="color:#374151; font-size:14px;">${r.comment}</p>
            </div>
        `).join('');
    } else {
        reviewsHtml = '<p style="color:#6b7280; text-align:center; padding:20px;">No reviews yet. Be the first to review!</p>';
    }
    
    const modalHtml = `
        <div id="review-modal" class="modal active" style="display:flex; position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:10000; align-items:center; justify-content:center;">
            <div style="background:white; width:90%; max-width:600px; max-height:80vh; border-radius:12px; overflow:hidden; box-shadow:0 25px 50px rgba(0,0,0,0.25);">
                <div style="padding:20px; border-bottom:1px solid #e5e7eb; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h3 style="margin:0; font-size:18px;">Reviews: ${productName}</h3>
                        <div style="display:flex; align-items:center; gap:10px; margin-top:5px;">
                            <span style="font-size:24px; font-weight:bold; color:#fbbf24;">${avgRating > 0 ? avgRating : '0.0'}</span>
                            <span>${getStarRatingHTML(parseFloat(avgRating))}</span>
                            <span style="color:#6b7280; font-size:14px;">(${reviews.length} ${reviews.length === 1 ? 'review' : 'reviews'})</span>
                        </div>
                    </div>
                    <button onclick="closeReviewModal()" style="background:none; border:none; font-size:24px; cursor:pointer; color:#6b7280;">&times;</button>
                </div>
                
                <div style="padding:20px; max-height:300px; overflow-y:auto;">
                    ${reviewsHtml}
                </div>
                
                <div style="padding:20px; border-top:1px solid #e5e7eb; background:#f9fafb;">
                    <h4 style="margin:0 0 15px 0; font-size:16px;">Write a Review</h4>
                    <form id="review-form" onsubmit="submitReviewForm(event, ${productId}, '${productName.replace(/'/g, "\\'")}')">
                        <button type="submit" style="width:100%; padding:15px; margin-bottom:20px; background:linear-gradient(135deg, #10b981, #059669); color:white; border:none; border-radius:8px; font-size:16px; font-weight:600; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px;">
                            <i class="fas fa-paper-plane"></i> Submit Review
                        </button>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-weight:500;">Your Name *</label>
                            <input type="text" id="reviewer-name" style="width:100%; padding:12px; border:2px solid #d1d5db; border-radius:8px; box-sizing:border-box; font-size:14px;">
                        </div>
                        <div style="margin-bottom:15px;">
                            <label style="display:block; margin-bottom:5px; font-weight:500;">Rating *</label>
                            <div id="star-input" style="display:flex; gap:10px; font-size:36px; user-select:none; padding:10px 0;">
                                <i class="far fa-star" style="cursor:pointer; color:#d1d5db; transition:all 0.2s;" onclick="setRating(1)" onmouseover="hoverRating(1)" onmouseout="resetHover()" data-rating="1"></i>
                                <i class="far fa-star" style="cursor:pointer; color:#d1d5db; transition:all 0.2s;" onclick="setRating(2)" onmouseover="hoverRating(2)" onmouseout="resetHover()" data-rating="2"></i>
                                <i class="far fa-star" style="cursor:pointer; color:#d1d5db; transition:all 0.2s;" onclick="setRating(3)" onmouseover="hoverRating(3)" onmouseout="resetHover()" data-rating="3"></i>
                                <i class="far fa-star" style="cursor:pointer; color:#d1d5db; transition:all 0.2s;" onclick="setRating(4)" onmouseover="hoverRating(4)" onmouseout="resetHover()" data-rating="4"></i>
                                <i class="far fa-star" style="cursor:pointer; color:#d1d5db; transition:all 0.2s;" onclick="setRating(5)" onmouseover="hoverRating(5)" onmouseout="resetHover()" data-rating="5"></i>
                            </div>
                            <input type="hidden" id="review-rating" value="0">
                            <div id="rating-text" style="font-size:14px; color:#6b7280; margin-top:8px; font-weight:500;">Click a star to rate</div>
                        </div>
                        <div style="margin-bottom:10px;">
                            <label style="display:block; margin-bottom:5px; font-weight:500;">Your Review *</label>
                            <textarea id="review-comment" rows="4" placeholder="Share your experience with this product..." style="width:100%; padding:12px; border:2px solid #d1d5db; border-radius:8px; box-sizing:border-box; resize:vertical; font-size:14px;"></textarea>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

// Close review modal
function closeReviewModal() {
    const modal = document.getElementById('review-modal');
    if (modal) modal.remove();
}

// Set rating in review form
let currentRating = 0;
function setRating(rating) {
    currentRating = rating;
    document.getElementById('review-rating').value = rating;
    const stars = document.querySelectorAll('#star-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
            star.style.color = '#fbbf24';
            star.style.transform = 'scale(1.1)';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#d1d5db';
            star.style.transform = 'scale(1)';
        }
    });
    
    // Update rating text
    const ratingText = document.getElementById('rating-text');
    const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
    if (ratingText) {
        ratingText.textContent = ratingLabels[rating] || 'Click a star to rate';
        ratingText.style.color = '#f59e0b';
        ratingText.style.fontWeight = '600';
    }
}

// Hover effect for stars
function hoverRating(rating) {
    const stars = document.querySelectorAll('#star-input i');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star';
            star.style.color = '#fbbf24';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#d1d5db';
        }
    });
}

// Reset hover effect
function resetHover() {
    const stars = document.querySelectorAll('#star-input i');
    stars.forEach((star, index) => {
        if (index < currentRating) {
            star.className = 'fas fa-star';
            star.style.color = '#fbbf24';
        } else {
            star.className = 'far fa-star';
            star.style.color = '#d1d5db';
        }
    });
}

// Submit review form
function submitReviewForm(event, productId, productName) {
    event.preventDefault();
    
    // Get values
    const customerName = document.getElementById('reviewer-name').value.trim();
    const rating = parseInt(document.getElementById('review-rating').value);
    const comment = document.getElementById('review-comment').value.trim();
    
    // Validation
    if (!customerName) {
        alert('Please enter your name');
        document.getElementById('reviewer-name').focus();
        return;
    }
    
    if (rating === 0) {
        alert('Please select a star rating');
        return;
    }
    
    if (!comment) {
        alert('Please write a review');
        document.getElementById('review-comment').focus();
        return;
    }
    
    // Submit review
    submitProductReview(productId, productName, customerName, rating, comment);
    closeReviewModal();
    
    // Show success
    showNotification('Thank you! Your review has been submitted.');
}

// Add review button to product card
function addReviewButtonToProductCard(productCard, product) {
    const rating = getProductAverageRating(product.id);
    const reviewCount = getProductReviewCount(product.id);
    
    const reviewBadge = document.createElement('div');
    reviewBadge.className = 'product-reviews';
    reviewBadge.style.cssText = 'margin-top:8px; cursor:pointer; display:flex; align-items:center; gap:5px;';
    reviewBadge.innerHTML = `
        <span style="color:#fbbf24;">${getStarRatingHTML(parseFloat(rating))}</span>
        <span style="font-size:12px; color:#6b7280;">(${reviewCount})</span>
    `;
    reviewBadge.onclick = (e) => {
        e.stopPropagation();
        showReviewModal(product.id, product.name);
    };
    
    productCard.appendChild(reviewBadge);
}

// Initialize reviews on page load
function initializeProductReviews() {
    // Add review badges to all product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const productId = card.dataset.productId;
        if (productId) {
            const product = products.find(p => p.id === parseInt(productId));
            if (product) {
                addReviewButtonToProductCard(card, product);
            }
        }
    });
}
