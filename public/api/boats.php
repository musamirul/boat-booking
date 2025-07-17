<?php
    require_once __DIR__ . '/../../init.php';

    use App\Models\Boat;

    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');

    $boat = new Boat($db);

    echo json_encode($boat->getAll());