<?php
require_once __DIR__ . '/../init.php';

use App\Models\SchedulePrices;

$sp = new SchedulePrices($db);

//Example 
$sp->setPrice(1,1,25.00);
$sp->setPrice(1,2,15.00);

$prices = $sp->getByScheduleId(1);

echo "<pre>";
print_r($prices);