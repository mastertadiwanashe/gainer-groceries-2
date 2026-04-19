<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all delivery slots with current order count
            $stmt = $pdo->query("
                SELECT ds.*, COUNT(o.id) as orders_count 
                FROM delivery_slots ds 
                LEFT JOIN orders o ON o.delivery_slot = ds.time_slot AND DATE(o.created_at) = CURDATE() AND o.status != 'cancelled'
                WHERE ds.is_active = 1 
                GROUP BY ds.id 
                ORDER BY ds.time_slot
            ");
            $slots = $stmt->fetchAll();
            
            // Format to match frontend
            $formatted = array_map(function($s) {
                return [
                    'id' => $s['id'],
                    'time' => $s['time_slot'],
                    'capacity' => intval($s['capacity']),
                    'orders' => intval($s['orders_count']),
                    'isActive' => boolval($s['is_active'])
                ];
            }, $slots);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Add new slot
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO delivery_slots (time_slot, capacity) VALUES (?, ?)");
            $stmt->execute([
                $data['time'],
                $data['capacity'] ?? 10
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Slot added successfully']);
            break;
            
        case 'PUT':
            // Update slot
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Slot ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE delivery_slots SET time_slot = ?, capacity = ?, is_active = ? WHERE id = ?");
            $stmt->execute([
                $data['time'],
                $data['capacity'],
                $data['isActive'] ?? 1,
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Slot updated successfully']);
            break;
            
        case 'DELETE':
            // Soft delete slot
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Slot ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE delivery_slots SET is_active = 0 WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Slot deleted successfully']);
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
