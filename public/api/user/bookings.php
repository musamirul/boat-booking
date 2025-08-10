<?php
    require_once __DIR__ . '/../../../init.php';

    use App\Models\Bookings;

    // ✅ Allow CORS
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Content-Type: application/json");

    // ✅ Handle preflight request
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200);
        exit;
    }


    $booking = new Bookings($db);
    
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        if (isset($_GET['booking_id'])) {
            $bookingId = (int)$_GET['booking_id'];
            $details = $booking->getBookingDetails($bookingId);
            echo json_encode($details);  // Return array directly
            exit;
        }elseif (isset($_GET['user_id'])) {
            $userId = (int)$_GET['user_id'];
            $list = $booking->getBookingsByUser($userId);
            echo json_encode($list);
            exit;
        }
    
    } 
    if ($method === 'POST') {
        // ✅ Create a new booking
        $input = json_decode(file_get_contents('php://input'), true);
    
        if (!isset($input['user_id']) || !isset($input['items'])) {
            echo json_encode(['error' => 'Missing user_id or items']);
            exit;
        }
    
        $bookingId = $booking->createFromApi((int)$input['user_id'], $input['items']);
    
        if ($bookingId) {
            echo json_encode(['success' => true, 'booking_id' => $bookingId]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Failed to create booking']);
        }
        exit;
    } 
    
    if ($method === 'PATCH') {
        // ✅ Update booking status (optional)
        $input = json_decode(file_get_contents('php://input'), true);
    
        if (!isset($input['booking_id'], $input['status'])) {
            echo json_encode(['error' => 'Missing booking_id or status']);
            exit;
        }
    
        $success = $booking->updateStatus((int) $input['booking_id'], $input['status']);
        echo json_encode(['success' => $success]);
    
    } else {
        http_response_code(405); // Method Not Allowed
        echo json_encode(['error' => 'Method not allowed']);
    }