<?php
require_once __DIR__ . '/../../init.php';

use App\Models\Bookings;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Allow CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Methods: POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    exit;
}

// Routing logic
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$basePath = '/boat-booking/public/api';
$cleanUri = str_replace($basePath, '', $uri);

// POST /bookings
if ($cleanUri === '/bookings' && $method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $user_id = $data['user_id'] ?? null;
    $items = $data['items'] ?? [];

    if (!$user_id || empty($items)) {
        http_response_code(400);
        echo json_encode(['error' => 'Missing user_id or items']);
        exit;
    }

    $bookingModel = new Bookings($db);
    $booking_id = $bookingModel->createFromApi($user_id, $items);

    if ($booking_id) {
        echo json_encode(['success' => true, 'booking_id' => $booking_id]);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Booking failed']);
    }
    exit;
}

if($cleanUri === '/bookings' && $method === 'GET'){
    $bookingModel = new Bookings($db);
    $bookings = $bookingModel->getAllWithDetails();
    echo json_encode($bookings);
    exit;
}

// Fallback
http_response_code(404);
echo json_encode(['error' => 'Endpoint not found']);