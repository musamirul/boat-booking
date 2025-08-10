<?php
require_once __DIR__ . '/../../../init.php';
use App\Models\SchedulePrice;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$schedulePrice = new SchedulePrice($db);

// ✅ GET prices for a schedule
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $scheduleId = $_GET['schedule_id'] ?? null;
    if (!$scheduleId) {
        echo json_encode(['error' => 'Schedule ID is required']);
        exit;
    }
    echo json_encode($schedulePrice->getBySchedule((int)$scheduleId));
    exit;
}

// ✅ POST create new price
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (empty($data['schedule_id']) || empty($data['ticket_type_id']) || empty($data['price'])) {
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }
    $success = $schedulePrice->create((int)$data['schedule_id'], (int)$data['ticket_type_id'], (float)$data['price']);
    echo json_encode(['success' => $success]);
    exit;
}

// ✅ PATCH update price
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['schedule_price_id'], $data['price'])) {
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    $success = $schedulePrice->update((int)$data['schedule_price_id'], (float)$data['price']);
    echo json_encode(['success' => $success]);
    exit;
}

// ✅ DELETE remove price
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        echo json_encode(['error' => 'ID is required']);
        exit;
    }
    $success = $schedulePrice->delete((int)$id);
    echo json_encode(['success' => $success]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);