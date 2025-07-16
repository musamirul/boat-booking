<?php
require_once __DIR__ . '/../init.php';

use App\Models\Schedule;

$schedule = new Schedule($db);
$data = $schedule->getAll();

echo "<pre>";
print_r($data);