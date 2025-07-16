<?php
    require_once __DIR__ . '/../init.php';

    use App\Models\Cart;
    use App\Models\CartItem;

    $cartModel = new Cart($db);
    $cartItemModel = new CartItem($db);

    $userId = 1;

    //Step 1 : Create or get cart for user
    $cartId = $cartModel->createIfNotExists($userId);

    //Step 2 : Add adult and child tickets to cart
    $cartItemModel->addItem($cartId,1,1,2);
    $cartItemModel->addItem($cartId,1,2,1);

    //Step 3 : Show cart items
    $items = $cartItemModel->getItem($cartId);

    echo "<pre>";
    print_r($items);