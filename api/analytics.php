<?php
require_once '../config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // Get analytics summary
        $analytics = [];
        
        // Total sales and orders
        $stmt = $pdo->query("SELECT COUNT(*) as total_orders, COALESCE(SUM(total), 0) as total_sales FROM orders");
        $orderStats = $stmt->fetch();
        $analytics['totalOrders'] = intval($orderStats['total_orders']);
        $analytics['totalSales'] = floatval($orderStats['total_sales']);
        
        // Daily revenue (today)
        $stmt = $pdo->prepare("SELECT COALESCE(SUM(total), 0) as daily_revenue FROM orders WHERE DATE(created_at) = CURDATE()");
        $stmt->execute();
        $analytics['dailyRevenue'] = floatval($stmt->fetch()['daily_revenue']);
        
        // Weekly revenue (last 7 days)
        $stmt = $pdo->prepare("SELECT COALESCE(SUM(total), 0) as weekly_revenue FROM orders WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)");
        $stmt->execute();
        $analytics['weeklyRevenue'] = floatval($stmt->fetch()['weekly_revenue']);
        
        // Monthly revenue (last 30 days)
        $stmt = $pdo->prepare("SELECT COALESCE(SUM(total), 0) as monthly_revenue FROM orders WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)");
        $stmt->execute();
        $analytics['monthlyRevenue'] = floatval($stmt->fetch()['monthly_revenue']);
        
        // Low stock products
        $stmt = $pdo->query("SELECT id, name, stock FROM products WHERE stock < 10 ORDER BY stock ASC");
        $analytics['lowStock'] = $stmt->fetchAll();
        
        // Recent orders
        $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC LIMIT 10");
        $recentOrders = $stmt->fetchAll();
        $analytics['recentOrders'] = array_map(function($o) {
            return [
                'id' => $o['id'],
                'orderNumber' => $o['order_number'],
                'customerName' => $o['customer_name'],
                'total' => floatval($o['total']),
                'status' => $o['status'],
                'createdAt' => $o['created_at']
            ];
        }, $recentOrders);
        
        echo json_encode($analytics);
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
