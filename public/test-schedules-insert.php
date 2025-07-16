<?php
    require_once __DIR__ . '/../init.php';

    use App\Models\Schedule;

    $schedule = new Schedule($db);
    $boatId = 1;
    $departureTime = '2025-07-20 10:00:00';
    $availableSeats = 12;

    if ($schedule->create($boatId, $departureTime, $availableSeats)){
        echo "New schedule inserted";
    }else{
        echo "Failed to insert schedule";
    }