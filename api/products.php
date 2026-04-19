<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all products
            $stmt = $pdo->query("SELECT * FROM products ORDER BY category, name");
            $products = $stmt->fetchAll();
            
            // Format products to match frontend format
            $formatted = array_map(function($p) {
                return [
                    'id' => $p['id'],
                    'name' => $p['name'],
                    'category' => $p['category'],
                    'price' => floatval($p['price']),
                    'unit' => $p['unit'],
                    'stock' => intval($p['stock']),
                    'image' => $p['image'],
                    'description' => $p['description']
                ];
            }, $products);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Add new product
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO products (name, category, price, unit, stock, image, description) VALUES (?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['category'],
                $data['price'],
                $data['unit'] ?? 'each',
                $data['stock'] ?? 0,
                $data['image'] ?? null,
                $data['description'] ?? ''
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Product added successfully']);
            break;
            
        case 'PUT':
            // Update product
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE products SET name = ?, category = ?, price = ?, unit = ?, stock = ?, image = ?, description = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['category'],
                $data['price'],
                $data['unit'],
                $data['stock'],
                $data['image'],
                $data['description'],
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Product updated successfully']);
            break;
            
        case 'DELETE':
            // Delete product
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Product ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Product deleted successfully']);
            break;
            
        default:
            http_response_code(405);
            echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
