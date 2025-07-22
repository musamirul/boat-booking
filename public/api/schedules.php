<?php
require_once __DIR__ . '/../../init.php';

use App\Models\Schedule;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');

$schedule = new Schedule($db);

// Handle preflight request (for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// GET = Fetch All Schedules
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($schedule->getAll());
    exit;
}

// POST = Create Schedule
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Basic validation
    if (!isset($data['boat_id'], $data['departure_time'], $data['available_seats'])) {
        echo json_encode(['error' => 'Missing fields']);
        exit;
    }

    // $success = $schedule->create(
    //     (int)$data['boat_id'],
    //     $data['departure_time'],
    //     (int)$data['available_seats']
    // );

    // if ($success) {
    //     echo json_encode(['success' => true]);
    // } else {
    //     echo json_encode(['error' => 'Failed to create schedule']);
    // }
    $scheduleId = $schedule->create(
        (int)$data['boat_id'],
        $data['departure_time'],
        (int)$data['available_seats']
    );
    
    if ($scheduleId !== false) {
        echo json_encode(['schedule_id' => $scheduleId]); // ✅ Return this to frontend
    } else {
        echo json_encode(['error' => 'Failed to create schedule']);
    }
    exit;
}

// If none matched
http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);