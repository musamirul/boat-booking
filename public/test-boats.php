<?php
    require_once __DIR__ . '/../init.php';

    use App\Models\Boat;

    $boat = new Boat($db);
    $data = $boat->getAll();

    echo "<pre>";
    print_r($data);