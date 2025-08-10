<?php

    require_once __DIR__ . '/../init.php';

    use App\Models\Payments;

    $payments = new Payments($db);

    //create a new payment
    echo 'creating a payment\n';

    $created = $payments->create(booking_id:1, payment_method: 'ToyyibPay', amount: 150.00, transaction_id: 'TX12345688', status:'pending',paid_at:null);
    echo $created ? "payment created\n": 'payment failed\n';

    //retrieve by booking_id
    $payment = $payments->getByBookingId(1);
    print_r($payment);


    //update payment status to paid
    if($payment){
        echo "updating payment status to paid \n\n";
        $updated = $payments->updateStatus(
            payment_id: $payment['payment_id'],
            status: 'paid',
            paid_at: date('Y-m-d H:i:s')
        );
        echo $updated ? "status updated\n" : 'update failed\n';
    }
