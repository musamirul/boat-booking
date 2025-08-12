<?php
require_once __DIR__ . '/../../../init.php';

use App\Models\User;

header('Content-Type: application/json');

// ✅ CORS Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

$user = new User($db);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    if (isset($_GET['user_id'])) {
        $userId = (int)$_GET['user_id'];
        $list = $user->getById($userId);
        echo json_encode($list);
        exit;
    }
}

