<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all orders
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
            $orders = $stmt->fetchAll();
            
            // Format orders
            $formatted = array_map(function($o) {
                return [
                    'id' => $o['id'],
                    'orderNumber' => $o['order_number'],
                    'customerName' => $o['customer_name'],
                    'customerEmail' => $o['customer_email'],
                    'customerPhone' => $o['customer_phone'],
                    'deliveryAddress' => $o['delivery_address'],
                    'deliveryZone' => $o['delivery_zone'],
                    'deliverySlot' => $o['delivery_slot'],
                    'total' => floatval($o['total']),
                    'status' => $o['status'],
                    'items' => json_decode($o['items'], true),
                    'createdAt' => $o['created_at']
                ];
            }, $orders);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Create new order
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Generate order number
            $orderNumber = 'ORD-' . strtoupper(uniqid());
            
            $stmt = $pdo->prepare("INSERT INTO orders (order_number, customer_name, customer_email, customer_phone, delivery_address, delivery_zone, delivery_slot, total, status, items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $stmt->execute([
                $orderNumber,
                $data['customerName'] ?? '',
                $data['customerEmail'] ?? '',
                $data['customerPhone'] ?? '',
                $data['deliveryAddress'] ?? '',
                $data['deliveryZone'] ?? '',
                $data['deliverySlot'] ?? '',
                $data['total'] ?? 0,
                'pending',
                json_encode($data['items'] ?? [])
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'orderNumber' => $orderNumber, 'message' => 'Order created successfully']);
            break;
            
        case 'PUT':
            // Update order status
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Order ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$data['status'], $data['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Order updated successfully']);
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
