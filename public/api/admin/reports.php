<?php
    require_once __DIR__ . '/../../../init.php';
    use App\Models\Payments;

    $payments = new Payments($db);

    $sql = "SELECT DATE(paid_at) as date, SUM(amount) as total_sales FROM payments WHERE status='paid' GROUP BY DATE(paid_at)";
    $stmt = $db->query($sql);
    echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));