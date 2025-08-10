<?php
    require_once __DIR__ . '/../init.php';

    use App\Models\Bookings;

    $booking = new Bookings($db);

    //create new booking
    $booking->create(1);

    //list all bookings
    print_r($booking->getAll());

    //Get single booking
    print_r($booking->getById(1));

    //Update booking status
    $booking->updateStatus(1,'paid');