<?php
require_once __DIR__ . '/../../../init.php';

use App\Models\Schedule;

header('Content-Type: application/json');

// ✅ CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

$schedule = new Schedule($db);

// Handle preflight request (for CORS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// GET = Fetch All Schedules
// if ($_SERVER['REQUEST_METHOD'] === 'GET') {
//     echo json_encode($schedule->getAll());
//     exit;
// }

// ✅ GET = Fetch All Schedules with Boat Name + Prices
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $boatId = $_GET['boat_id'] ?? null;

    if ($boatId) {
        $stmt = $db->prepare("
            SELECT s.schedule_id, s.boat_id, b.name AS boat_name, s.departure_time, s.available_seats,
                   sp.schedule_price_id, sp.price, tt.ticket_type_id, tt.name AS ticket_type_name
            FROM schedules s
            JOIN boats b ON s.boat_id = b.boat_id
            LEFT JOIN schedule_prices sp ON s.schedule_id = sp.schedule_id
            LEFT JOIN ticket_types tt ON sp.ticket_type_id = tt.ticket_type_id
            WHERE s.boat_id = :boat_id
            ORDER BY s.schedule_id ASC
        ");
        $stmt->execute(['boat_id' => $boatId]);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Group by schedule_id
        $schedules = [];
        foreach ($rows as $r) {
            $id = $r['schedule_id'];
            if (!isset($schedules[$id])) {
                $schedules[$id] = [
                    'schedule_id' => $r['schedule_id'],
                    'boat_id' => $r['boat_id'],
                    'boat_name' => $r['boat_name'],
                    'departure_time' => $r['departure_time'],
                    'available_seats' => $r['available_seats'],
                    'prices' => []
                ];
            }
            if (!empty($r['schedule_price_id'])) {
                $schedules[$id]['prices'][] = [
                    'schedule_price_id' => $r['schedule_price_id'],
                    'ticket_type_id' => $r['ticket_type_id'],
                    'ticket_type_name' => $r['ticket_type_name'],
                    'price' => $r['price']
                ];
            }
        }

        echo json_encode(array_values($schedules));
        exit; // ✅ Make sure we stop here
    }

    // Fallback: return all schedules if no boat_id
    $stmt = $db->query("
        SELECT s.schedule_id, s.boat_id, b.name AS boat_name, s.departure_time, s.available_seats,
               sp.schedule_price_id, sp.price, tt.ticket_type_id, tt.name AS ticket_type_name
        FROM schedules s
        JOIN boats b ON s.boat_id = b.boat_id
        LEFT JOIN schedule_prices sp ON s.schedule_id = sp.schedule_id
        LEFT JOIN ticket_types tt ON sp.ticket_type_id = tt.ticket_type_id
        ORDER BY s.schedule_id ASC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    $schedules = [];
    foreach ($rows as $r) {
        $id = $r['schedule_id'];
        if (!isset($schedules[$id])) {
            $schedules[$id] = [
                'schedule_id' => $r['schedule_id'],
                'boat_id' => $r['boat_id'],
                'boat_name' => $r['boat_name'],
                'departure_time' => $r['departure_time'],
                'available_seats' => $r['available_seats'],
                'prices' => []
            ];
        }
        if (!empty($r['schedule_price_id'])) {
            $schedules[$id]['prices'][] = [
                'schedule_price_id' => $r['schedule_price_id'],
                'ticket_type_id' => $r['ticket_type_id'],
                'ticket_type_name' => $r['ticket_type_name'],
                'price' => $r['price']
            ];
        }
    }

    echo json_encode(array_values($schedules));
    exit;
}

// ✅ PATCH = Update schedule fields
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (!isset($data['schedule_id'])) {
        echo json_encode(['error' => 'Missing schedule_id']);
        exit;
    }

    $fields = [];
    $params = [];
    foreach (['boat_id', 'departure_time', 'available_seats'] as $field) {
        if (isset($data[$field])) {
            $fields[] = "$field = :$field";
            $params[":$field"] = $data[$field];
        }
    }
    if (!$fields) {
        echo json_encode(['error' => 'No fields to update']);
        exit;
    }

    $params[':schedule_id'] = $data['schedule_id'];
    $sql = "UPDATE schedules SET " . implode(',', $fields) . " WHERE schedule_id = :schedule_id";
    $stmt = $db->prepare($sql);
    $success = $stmt->execute($params);

    echo json_encode(['success' => $success]);
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