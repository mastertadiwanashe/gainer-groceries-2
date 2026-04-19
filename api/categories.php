<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all active categories
            $stmt = $pdo->query("SELECT * FROM categories WHERE is_active = 1 ORDER BY sort_order, name");
            $categories = $stmt->fetchAll();
            
            // Format to match frontend
            $formatted = array_map(function($c) {
                return [
                    'id' => $c['id'],
                    'name' => $c['name'],
                    'description' => $c['description'],
                    'image' => $c['image'],
                    'sortOrder' => intval($c['sort_order']),
                    'isActive' => boolval($c['is_active'])
                ];
            }, $categories);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Add new category
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO categories (name, description, image, sort_order) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['description'] ?? '',
                $data['image'] ?? null,
                $data['sortOrder'] ?? 0
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Category added successfully']);
            break;
            
        case 'PUT':
            // Update category
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Category ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE categories SET name = ?, description = ?, image = ?, sort_order = ?, is_active = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['description'],
                $data['image'],
                $data['sortOrder'],
                $data['isActive'] ?? 1,
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Category updated successfully']);
            break;
            
        case 'DELETE':
            // Soft delete category
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Category ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE categories SET is_active = 0 WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Category deleted successfully']);
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
