<?php
require_once __DIR__ . '/../init.php';

use App\Models\User;

$userModel = new User($db);
$user = $userModel->getById(1);
print_r($user);