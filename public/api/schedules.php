<?php
    require_once __DIR__ . '/../../init.php';

    use App\Models\Schedule;

    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Header: Content-Type');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS');

    $schedule = new Schedule($db);

    $method = $_SERVER['REQUEST_METHOD'];

    //GET = FETCH ALL Schedules
    if($method === 'GET'){
        echo json_encode($schedule->getAll);
        exit;
    }

    //GET = Create Schedule
    if($method === 'POST'){
        $data = json_decode(file_get_contents('php://input'),true);

        //Basic validation
        if(!isset($data['boat_id'], $data['departure_time'], $data['available_seats'])){
            echo json_encode(['error' => 'Missing fields']);
            exit;
        }

        $success = $schedule->create(
            (int)$data['boat_id'],
            $data['departure_time'],
            (int)$data['available_seats']
        );

        if($success){
            echo json_encode(['success' => true]);
        }else{
            echo json_encode(['error' => 'Failed to create schedule']);
        }
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method Not Allowed']);