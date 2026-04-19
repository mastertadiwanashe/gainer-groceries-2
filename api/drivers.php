<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all drivers
            $stmt = $pdo->query("SELECT * FROM drivers WHERE is_active = 1 ORDER BY name");
            $drivers = $stmt->fetchAll();
            
            // Format to match frontend
            $formatted = array_map(function($d) {
                return [
                    'id' => $d['id'],
                    'name' => $d['name'],
                    'phone' => $d['phone'],
                    'email' => $d['email'],
                    'vehicle' => $d['vehicle'],
                    'status' => $d['status'],
                    'isActive' => boolval($d['is_active'])
                ];
            }, $drivers);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Add new driver
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO drivers (name, phone, email, vehicle, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['name'],
                $data['phone'] ?? '',
                $data['email'] ?? '',
                $data['vehicle'] ?? '',
                $data['status'] ?? 'active'
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Driver added successfully']);
            break;
            
        case 'PUT':
            // Update driver
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Driver ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE drivers SET name = ?, phone = ?, email = ?, vehicle = ?, status = ?, is_active = ? WHERE id = ?");
            $stmt->execute([
                $data['name'],
                $data['phone'],
                $data['email'],
                $data['vehicle'],
                $data['status'],
                $data['isActive'] ?? 1,
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Driver updated successfully']);
            break;
            
        case 'DELETE':
            // Soft delete driver
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Driver ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE drivers SET is_active = 0 WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Driver deleted successfully']);
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
