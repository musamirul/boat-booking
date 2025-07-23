<?php
    require_once __DIR__ . '/../../init.php';

    use App\Models\User;

    // Allow all origins
    header("Access-Control-Allow-Origin: *");

    // Allow specific HTTP methods
    header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");

    // Allow specific headers
    header("Access-Control-Allow-Headers: Content-Type, Authorization");

    $data = json_decode(file_get_contents('php://input'),true);

    //Validate required fields
    if(!isset($data['name'], $data['email'], $data['password'])){
        echo json_encode(['error'=>'Missing fields']);
        exit;
    }

    $name = trim($data['name']);
    $email = trim($data['email']);
    $password = $data['password'];

    $user = new User($db);

    //Check if email already exists
    if($user->findByEmail($email)){
        echo json_encode(['error'=> 'Email already exists']);
        exit;
    }

    //HASH password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    //Create uer
    if($user->create($name,$email,$hashedPassword)){
        echo json_encode(['success'=>true]);
    }else{
        echo json_encode(['error'=>'Failed to register user']);
    }