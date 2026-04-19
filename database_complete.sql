-- COMPLETE Gainer Groceries Database Schema
-- Run this in phpMyAdmin to create ALL tables

-- Create database
CREATE DATABASE IF NOT EXISTS gainer_groceries CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gainer_groceries;

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) DEFAULT 'each',
    stock INT DEFAULT 0,
    image TEXT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. SLIDESHOW TABLE
CREATE TABLE IF NOT EXISTS slides (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    caption TEXT,
    image TEXT,
    link VARCHAR(255) DEFAULT '#',
    slide_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    delivery_address TEXT,
    delivery_zone VARCHAR(100),
    delivery_slot VARCHAR(100),
    delivery_instructions TEXT,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    driver_id INT DEFAULT NULL,
    items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 4. SETTINGS TABLE
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. DELIVERY ZONES TABLE
CREATE TABLE IF NOT EXISTS delivery_zones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    fee DECIMAL(10,2) NOT NULL,
    min_order DECIMAL(10,2) DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. DELIVERY SLOTS TABLE
CREATE TABLE IF NOT EXISTS delivery_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    time_slot VARCHAR(100) NOT NULL,
    capacity INT DEFAULT 10,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. DRIVERS TABLE
CREATE TABLE IF NOT EXISTS drivers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    vehicle VARCHAR(100),
    status ENUM('active', 'inactive', 'busy') DEFAULT 'active',
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    product_id INT,
    is_approved TINYINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 9. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image TEXT,
    sort_order INT DEFAULT 0,
    is_active TINYINT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 10. ORDER STATUS HISTORY TABLE
CREATE TABLE IF NOT EXISTS order_status_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    status VARCHAR(50) NOT NULL,
    notes TEXT,
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- INSERT DEFAULT DATA

-- Default Products
INSERT INTO products (name, category, price, unit, stock, image, description) VALUES
('Fresh Apples', 'Fruits', 2.99, 'kg', 50, 'your-images/apples.jpg', 'Crisp and juicy red apples'),
('Bananas', 'Fruits', 1.49, 'bunch', 40, 'your-images/bananas.jpg', 'Sweet ripe bananas'),
('Carrots', 'Vegetables', 1.99, 'kg', 60, 'your-images/carrots.jpg', 'Fresh organic carrots'),
('Tomatoes', 'Vegetables', 3.49, 'kg', 45, 'your-images/tomatoes.jpg', 'Vine-ripened tomatoes'),
('Milk', 'Dairy', 4.29, 'liter', 30, 'your-images/milk.jpg', 'Fresh whole milk'),
('Eggs', 'Dairy', 5.99, 'dozen', 25, 'your-images/eggs.jpg', 'Free-range eggs'),
('Bread', 'Bakery', 3.99, 'loaf', 20, 'your-images/bread.jpg', 'Fresh baked white bread'),
('Chicken Breast', 'Meat', 8.99, 'kg', 15, 'your-images/chicken.jpg', 'Boneless chicken breast'),
('Rice', 'Pantry', 5.49, 'kg', 50, 'your-images/rice.jpg', 'Long grain white rice'),
('Cooking Oil', 'Pantry', 7.99, 'liter', 40, 'your-images/oil.jpg', 'Vegetable cooking oil');

-- Default Slides
INSERT INTO slides (title, caption, image, link, slide_order) VALUES
('Fresh Produce', 'Get fresh vegetables daily', NULL, '#shop', 1),
('Special Offers', 'Up to 50% off selected items', NULL, '#offers', 2),
('Fast Delivery', 'Free delivery on orders over $50', NULL, '#delivery', 3);

-- Default Settings
INSERT INTO settings (setting_key, setting_value) VALUES
('store_name', 'Gainer Groceries'),
('store_phone', '+263 77 123 4567'),
('store_email', 'info@gainergroceries.co.zw'),
('store_address', '123 Main Street, Harare, Zimbabwe'),
('store_whatsapp', '263713749230'),
('delivery_fee', '5.00'),
('min_order', '20.00'),
('currency', 'USD'),
('tax_rate', '0'),
('free_delivery_threshold', '50.00'),
('order_cutoff_time', '16:00');

-- Default Delivery Zones
INSERT INTO delivery_zones (name, fee, min_order, is_active) VALUES
('Harare CBD', 2.00, 10.00, 1),
('Harare Suburbs', 3.00, 15.00, 1),
('High Density', 4.00, 20.00, 1),
('Low Density', 5.00, 25.00, 1),
('Outside Harare', 10.00, 50.00, 1);

-- Default Delivery Slots
INSERT INTO delivery_slots (time_slot, capacity, is_active) VALUES
('8:00 AM - 10:00 AM', 10, 1),
('10:00 AM - 12:00 PM', 10, 1),
('12:00 PM - 2:00 PM', 10, 1),
('2:00 PM - 4:00 PM', 10, 1);

-- Default Drivers
INSERT INTO drivers (name, phone, email, vehicle, status, is_active) VALUES
('John Doe', '0771234567', 'john@gainer.co.zw', 'Toyota HiAce', 'active', 1),
('Jane Smith', '0772345678', 'jane@gainer.co.zw', 'Nissan Van', 'active', 1),
('Mike Johnson', '0773456789', 'mike@gainer.co.zw', 'Ford Transit', 'inactive', 1);

-- Default Categories
INSERT INTO categories (name, description, sort_order, is_active) VALUES
('Fruits', 'Fresh seasonal fruits', 1, 1),
('Vegetables', 'Organic vegetables', 2, 1),
('Dairy', 'Milk, eggs, cheese', 3, 1),
('Meat', 'Fresh meat and poultry', 4, 1),
('Bakery', 'Fresh bread and pastries', 5, 1),
('Pantry', 'Rice, oil, spices', 6, 1),
('Beverages', 'Drinks and juices', 7, 1),
('Household', 'Cleaning supplies', 8, 1);

-- Sample Reviews
INSERT INTO reviews (customer_name, rating, comment, is_approved) VALUES
('Tatenda M.', 5, 'Great service and fresh produce!', 1),
('Sharon K.', 4, 'Fast delivery, good quality', 1),
('John B.', 5, 'Best online grocery store in Harare', 1);
