<?php
    require_once __DIR__ . '/../../../init.php';
    header('Content-Type: application/json');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Methods: POST, OPTIONS');

    use App\Models\Cart;
    use App\Models\CartItems;

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

    $cart = new Cart($db);
    $items = new CartItems($db);

    $data = json_decode(file_get_contents('php://input'),true);
    $userId = $data['user_id'] ?? null;
    $paymentMethod = $data['payment_method'] ?? 'Cash';

    if (!$userId){
        echo json_encode(['error'=>'Missing user_id']);
        exit;
    }

    //Fetch cart and items
    $c = $cart->getByUser($userId);
    if(!$c){
        echo json_encode(['error'=>'Cart is empty']);
        exit;
    }
    $cartId = $c['cart_id'];
    $cartItems = $items->getItems($cartId);

    if(!$cartItems){
        echo json_encode(['error'=>'No items in cart']);
        exit;
    }

    //Create booking
    $stmt = $db->prepare("INSERT INTO bookings (user_id, status, booking_date) VALUES(?,'confirmed',NOW())");
    $stmt->execute([$userId]);
    $bookingId = $db->lastInsertId();

    //Insert booking_details
    $totalAmount = 0;
    foreach ($cartItems as $ci){
        $lineTotal = $ci['price'] * $ci['quantity'];
        $totalAmount += $lineTotal;
        $stmt = $db->prepare("INSERT INTO booking_details (booking_id, schedule_id, ticket_type_id, quantity,price) VALUES (?,?,?,?,?)");
        $stmt->execute([$bookingId, $ci['schedule_id'], $ci['ticket_type_id'], $ci['quantity'], $ci['price']]);

        //Decrement seats
        $db->prepare("UPDATE schedule SET available_seats = available_seats - ? WHERE schedule_id = ?")->execute([$ci['quantity'],$ci['schedule_id']]);
    }

    //Record payment
    $stmt = $db->prepare("INSERT INTO payment (booking_id, payment_method, amount, transaction_id, status, paid_at) VALUES (?,?,?,?,'paid',NOW())");
    $stmt->execute([$bookingId, $paymentMethod, $totalAmount, uniqid('TXN')]);

    //Clear cart
    $items->clearCart($cartId);
    $cart->delete($cartId);

    echo json_encode(['success'=>true, 'booking_id'=>$bookingId]);