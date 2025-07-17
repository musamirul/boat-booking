<?php
require_once __DIR__ . '/../../init.php';

use App\Models\BookingDetails;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');

$input = json_decode(file_get_contents('php://input'), true);

$required = ['booking_id', 'schedule_id', 'ticket_type_id', 'quantity', 'price'];

foreach ($required as $field) {
    if (!isset($input[$field])) {
        echo json_encode(['error' => "Missing field: $field"]);
        exit;
    }
}

$bookingDetails = new BookingDetails($db);

$created = $bookingDetails->createFromApi(
    (int) $input['booking_id'],
    (int) $input['schedule_id'],
    (int) $input['ticket_type_id'],
    (int) $input['quantity'],
    (float) $input['price']
);

echo json_encode([
    'success' => $created,
    'message' => $created ? 'Booking detail added.' : 'Insert failed.'
]);