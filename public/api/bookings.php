<?php
    require_once __DIR__ . '/../../init.php';

    use App\Models\Bookings;

    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: POST');

    //Read raw Post JSON
    $input = json_decode(file_get_contents('php://input'), true);

    //Validate input
    if(!isset($input['user_id'])){
        echo json_encode(['error' => 'Missing user_id']);
        exit;
    }

    $booking = new Bookings($db);
    $bookingId = $booking->createFromApi((int) $input['user_id']);

    // echo json_encode($booking->getAll());
    if($bookingId){
        echo json_encode(['success' => true, 'booking_id' => $bookingId]);
    }else{
        echo json_encode(['error' => 'failed to create booking']);
    }