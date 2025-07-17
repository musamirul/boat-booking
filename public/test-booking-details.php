<?php

require_once __DIR__ . '/../init.php';

use App\Models\BookingDetails;

// Initialize the model
$bookingDetails = new BookingDetails($db);

// Insert a test record
echo "🔧 Inserting booking detail...\n";
$created = $bookingDetails->create(
    booking_id: 1,
    schedule_id: 1,
    ticket_type_id: 1,
    quantity: 2,
    price: 75.00
);
echo $created ? "✅ Inserted\n" : "❌ Insert failed\n";

// Fetch all booking details for booking_id 1
echo "📄 Fetching booking details...\n";
$data = $bookingDetails->getByBookingId(1);
print_r($data);

// Optionally delete
// echo "🗑️ Deleting booking details...\n";
// $deleted = $bookingDetails->deleteByBookingId(1);
// echo $deleted ? "✅ Deleted\n" : "❌ Delete failed\n";