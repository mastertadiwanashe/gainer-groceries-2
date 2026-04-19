<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get approved reviews
            $stmt = $pdo->query("
                SELECT r.*, p.name as product_name 
                FROM reviews r 
                LEFT JOIN products p ON r.product_id = p.id 
                WHERE r.is_approved = 1 
                ORDER BY r.created_at DESC
            ");
            $reviews = $stmt->fetchAll();
            
            // Format to match frontend
            $formatted = array_map(function($r) {
                return [
                    'id' => $r['id'],
                    'customerName' => $r['customer_name'],
                    'rating' => intval($r['rating']),
                    'comment' => $r['comment'],
                    'productId' => $r['product_id'],
                    'productName' => $r['product_name'],
                    'isApproved' => boolval($r['is_approved']),
                    'createdAt' => $r['created_at']
                ];
            }, $reviews);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Add new review (pending approval)
            $data = json_decode(file_get_contents('php://input'), true);
            
            $stmt = $pdo->prepare("INSERT INTO reviews (customer_name, rating, comment, product_id) VALUES (?, ?, ?, ?)");
            $stmt->execute([
                $data['customerName'],
                $data['rating'],
                $data['comment'] ?? '',
                $data['productId'] ?? null
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Review submitted for approval']);
            break;
            
        case 'PUT':
            // Approve/reject review
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Review ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("UPDATE reviews SET is_approved = ? WHERE id = ?");
            $stmt->execute([
                $data['isApproved'] ?? 1,
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Review updated successfully']);
            break;
            
        case 'DELETE':
            // Delete review
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Review ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("DELETE FROM reviews WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            echo json_encode(['success' => true, 'message' => 'Review deleted successfully']);
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
