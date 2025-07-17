<?php
require_once __DIR__ . '/../../init.php';

use App\Models\Bookings;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$model = new Bookings($db);
echo json_encode($model->getAll());