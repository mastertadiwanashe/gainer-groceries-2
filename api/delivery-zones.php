<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all delivery zones
            $stmt = $pdo->query("SELECT * FROM delivery_zones WHERE is_active = 1 ORDER BY name");
            $zones = $stmt->fetchAll();
            
            // Format to match frontend
            $formatted = array_map(function($z) {
                return [
                    'id' => $z['id'],
                    'name' => $z['name'],
                    'fee' => floatval($z['fee']),
                    'minOrder' => floatval($z['min_order']),
                    'isActive' => boolval($z['is_active'])
                ];
            }, $zones);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Add new zone
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO delivery_zones (name, fee, min_order) VALUES (?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['fee'] ?? 0,
                $data['minOrder'] ?? 0
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Zone added successfully']);
            break;
            
        case 'PUT':
            // Update zone
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Zone ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE delivery_zones SET name = ?, fee = ?, min_order = ?, is_active = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['fee'],
                $data['minOrder'],
                $data['isActive'] ?? 1,
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Zone updated successfully']);
            break;
            
        case 'DELETE':
            // Soft delete zone (set inactive)
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Zone ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE delivery_zones SET is_active = 0 WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Zone deleted successfully']);
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
