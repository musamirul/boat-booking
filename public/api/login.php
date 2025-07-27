<?php
    require_once __DIR__ . '/../../init.php';

    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');

    use App\Models\User;


    $data = json_decode(file_get_contents('php://input'),true);

    if (!isset($data['email'], $data['password'])){
        echo json_encode(['error'=>'Missing fields']);
        exit;
    }

    $email = trim($data['email']);
    $password = $data['password'];

    $user = new User($db);
    $userData = $user->findByEmail($email);

    if(!$userData || !password_verify($password, $userData['password'])){
        echo json_encode(['error'=>'Invalid credentials']);
        exit;
    }

    //Login success - Return user data (without password)
    unset($userData['password']);

    //if role is missing, default to 'user'
    if (!isset($userData['role']) || empty($userData['role'])) {
        $userData['role'] = 'user';
    }

    echo json_encode(['success'=>true, 'user'=>$userData]);