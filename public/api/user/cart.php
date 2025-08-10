<?php 
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../../../init.php';

use App\Models\Cart;
use App\Models\CartItems;

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$cart = new Cart($db);
$items = new CartItems($db);
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $userId = $data['user_id'] ?? null;
    $scheduleId = $data['schedule_id'] ?? null;
    $ticketTypeId = $data['ticket_type_id'] ?? null;
    $quantity = $data['quantity'] ?? 1;

    if (!$userId || !$scheduleId || !$ticketTypeId) {
        echo json_encode(['error' => 'Missing required fields']);
        exit;
    }

    $cartId = $cart->getOrCreateCart($userId);

    error_log("Adding to cart: cartId=$cartId, scheduleId=$scheduleId, ticketTypeId=$ticketTypeId, quantity=$quantity");
    $result = $items->addOrUpdateItem($cartId, $scheduleId, $ticketTypeId, $quantity);
    error_log("Result of addOrUpdateItem: " . ($result ? "Success" : "Failure"));

    if (!$result) {
        $errorInfo = $db->errorInfo(); // $db is your PDO instance
        error_log("Failed to addOrUpdateItem: " . implode(" | ", $errorInfo));
        echo json_encode(['success' => false, 'error' => 'Failed to add or update cart item']);
        exit;
    }

    echo json_encode(['success' => true, 'result' => $result]);
    exit;
}

if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    if (!$userId) {
        echo json_encode(['error' => 'Missing user_id']);
        exit;
    }
    $result = $items->getByUserId($userId);
    echo json_encode($result);
    exit;
}

if ($method === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    $itemId = $data['item_id'] ?? null;
    $userId = $data['user_id'] ?? ($_GET['user_id'] ?? null);
    $clearAll = $_GET['clear_all'] ?? ($data['clear_all'] ?? null);

    if ($clearAll && $userId) {
        $success = $cart->clearCartByUserId((int)$userId);
        echo json_encode(['success' => $success]);
        exit;
    }
    
    //If null, fallback to query string
    if (!$itemId) {
        $itemId = $_GET['cart_item_id'] ?? null;
    }

    if (!$itemId) {
        echo json_encode(['error' => 'Missing item_id']);
        exit;
    }

    
    $deleted = $items->deleteItem($itemId);
    echo json_encode(['success' => $deleted]);
    exit;
}