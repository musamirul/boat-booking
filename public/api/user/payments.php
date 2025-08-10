<?php

    require_once __DIR__ . '/../../../init.php';
    use App\Models\Payments;
    use App\Models\Bookings;

    error_reporting(E_ALL & ~E_NOTICE & ~E_WARNING);
    ini_set('display_errors', 0);

    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");
    
    $payment = new Payments($db);
    $booking = new Bookings($db);

    $method = $_SERVER['REQUEST_METHOD'];
    
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);

        $bookingId = $data['booking_id'] ?? null;
        $amount = $data['amount'] ?? null;
        $paymentMethod = $data['payment_method'] ?? 'online';

        if (!$bookingId || !$amount) {
            echo json_encode(['success' => false, 'message' => 'Missing booking_id or amount']);
            exit;
        }

        $result = $payment->recordPayment($bookingId, $amount, $paymentMethod);

        if ($result['success']) {
            $booking->updateStatus($bookingId, 'paid');
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $result['message'] ?? 'Payment failed']);
        }
    } else {
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Method Not Allowed']);
    }