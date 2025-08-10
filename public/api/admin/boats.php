<?php
    require_once __DIR__ . '/../../../init.php';

    use App\Models\Boat;

    // Allow all origins
    header("Access-Control-Allow-Origin: *");

    // Allow specific HTTP methods
    header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");

    // Allow specific headers
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    $method = $_SERVER['REQUEST_METHOD'];

    $boatModel = new Boat($db);

    // Create boat (POST)
    if($method === 'POST'){
        $data = json_decode(file_get_contents('php://input'),true);
        $name = $data['name'] ?? null;
        $capacity = $data['capacity'] ?? 0;

        if(!$name || !$capacity){
            http_response_code(400);
            echo json_encode(['error'=>"missing name or capacity"]);
            exit;
        }

        $success = $boatModel->create($name,(int)$capacity);
        echo json_encode(['success'=>$success]);
        exit;
    }

    //List boats (GET)
    if($method === 'GET'){
        $boats = $boatModel->getAll();
        echo json_encode($boats);
        exit;
    }

    //Delete boats by id
    if($method === 'DELETE'){
        $boatId = $_GET['id'] ?? null;

        if(!$boatId){
            $data = json_decode(file_get_contents('php://input'),true);
            $boatId = $data['boat_id'] ?? null;
        }

        if(!$boatId){
            http_response_code(400);
            echo json_encode(['error' => 'Missing boat_id']);
            exit;
        }

        $success = $boatModel->delete((int) $boatId);
        echo json_encode(['success'=>$success]);
        exit;
    }


    //Update Boat
    if($method === 'PUT'){
        $data = json_decode(file_get_contents('php://input'),true);
        if(!isset($data['boat_id'], $data['name'], $data['capacity'], $data['status'])){
            echo json_encode(['error'=>'Missing fields']);
            exit;
        }

        $success = $boatModel->update(
            (int) $data['boat_id'],
            $data['name'],
            (int) $data['capacity'],
            $data['status']
        );

        echo json_encode(['success'=>$success]);
        exit;
    }
    http_respond_code(405);
    echo json_encode(['error' => 'Method Not allowed']);