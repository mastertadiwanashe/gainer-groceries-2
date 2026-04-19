-- Gainer Groceries Database Schema
-- Run this in phpMyAdmin to create the database tables

-- Create database
CREATE DATABASE IF NOT EXISTS gainer_groceries CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gainer_groceries;

-- Products table
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

-- Slideshow table
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

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    customer_phone VARCHAR(50),
    delivery_address TEXT,
    delivery_zone VARCHAR(100),
    delivery_slot VARCHAR(100),
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    items JSON NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Settings table
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default products
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

-- Insert default slides
INSERT INTO slides (title, caption, image, link, slide_order) VALUES
('Fresh Produce', 'Get fresh vegetables daily', NULL, '#shop', 1),
('Special Offers', 'Up to 50% off selected items', NULL, '#offers', 2),
('Fast Delivery', 'Free delivery on orders over $50', NULL, '#delivery', 3);

-- Insert default settings
INSERT INTO settings (setting_key, setting_value) VALUES
('store_name', 'Gainer Groceries'),
('store_phone', '+263 77 123 4567'),
('store_email', 'info@gainergroceries.co.zw'),
('store_address', '123 Main Street, Harare, Zimbabwe'),
('delivery_fee', '5.00'),
('min_order', '20.00'),
('currency', 'USD');
