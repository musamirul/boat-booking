<?php
require_once __DIR__ . '/../../init.php';

use App\Models\SchedulePrices;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$schedulePrices = new SchedulePrices($db);
$method = $_SERVER['REQUEST_METHOD'];

$data = json_decode(file_get_contents('php://input'), true);
file_put_contents('log_schedule_price.txt', json_encode($data) . PHP_EOL, FILE_APPEND);

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    file_put_contents('log.txt', json_encode($data) . PHP_EOL, FILE_APPEND); // 👈 add this

    if (!isset($data['schedule_id'], $data['ticket_type_id'], $data['price'])) {
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    $success = $schedulePrices->setPrice(
        (int)$data['schedule_id'],
        (int)$data['ticket_type_id'],
        (float)$data['price']
    );

    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['error' => 'Failed to create schedule']);
    }
    exit;
}

if ($method === 'GET') {
    if (!isset($_GET['schedule_id'])) {
        echo json_encode(['error' => 'Missing schedule_id']);
        exit;
    }

    $scheduleId = (int)$_GET['schedule_id'];
    $prices = $schedulePrices->getByScheduleId($scheduleId);

    echo json_encode(['prices' => $prices]);
    exit;
}