<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    switch ($method) {
        case 'GET':
            // Get all slides
            $stmt = $pdo->query("SELECT * FROM slides ORDER BY slide_order");
            $slides = $stmt->fetchAll();
            
            // Format to match frontend
            $formatted = array_map(function($s) {
                return [
                    'id' => $s['id'],
                    'title' => $s['title'],
                    'caption' => $s['caption'],
                    'image' => $s['image'],
                    'link' => $s['link'],
                    'order' => intval($s['slide_order'])
                ];
            }, $slides);
            
            echo json_encode($formatted);
            break;
            
        case 'POST':
            // Add new slide
            $data = json_decode(file_get_contents('php://input'), true);
            
            // Get max order
            $maxOrder = $pdo->query("SELECT MAX(slide_order) as max_order FROM slides")->fetch()['max_order'] ?? 0;
            
            $stmt = $pdo->prepare("INSERT INTO slides (title, caption, image, link, slide_order) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([
                $data['title'],
                $data['caption'] ?? '',
                $data['image'] ?? null,
                $data['link'] ?? '#',
                $maxOrder + 1
            ]);
            
            $id = $pdo->lastInsertId();
            echo json_encode(['success' => true, 'id' => $id, 'message' => 'Slide added successfully']);
            break;
            
        case 'PUT':
            // Update slide
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Slide ID required']);
                exit();
            }
            
            // Update specific slide
            $stmt = $pdo->prepare("UPDATE slides SET title = ?, caption = ?, image = ?, link = ?, slide_order = ? WHERE id = ?");
            $stmt->execute([
                $data['title'],
                $data['caption'],
                $data['image'],
                $data['link'],
                $data['order'],
                $data['id']
            ]);
            
            echo json_encode(['success' => true, 'message' => 'Slide updated successfully']);
            break;
            
        case 'DELETE':
            // Delete slide
            $data = json_decode(file_get_contents('php://input'), true);
            
            if (!isset($data['id'])) {
                http_response_code(400);
                echo json_encode(['error' => 'Slide ID required']);
                exit();
            }
            
            $stmt = $pdo->prepare("DELETE FROM slides WHERE id = ?");
            $stmt->execute([$data['id']]);
            
            // Reorder remaining slides
            $stmt = $pdo->query("SELECT id FROM slides ORDER BY slide_order");
            $slides = $stmt->fetchAll();
            
            foreach ($slides as $index => $slide) {
                $update = $pdo->prepare("UPDATE slides SET slide_order = ? WHERE id = ?");
                $update->execute([$index + 1, $slide['id']]);
            }
            
            echo json_encode(['success' => true, 'message' => 'Slide deleted successfully']);
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
