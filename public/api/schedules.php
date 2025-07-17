<?php
    require_once __DIR__ . '/../../init.php';

    use App\Models\Schedule;

    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');

    $schedule = new Schedule($db);

    echo json_encode($schedule->getAll());