<?php
require_once __DIR__ . '/../../init.php';
use App\Models\TicketType;

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET, POST, PATCH, DELETE, OPTIONS');

// ✅ Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$ticketType = new TicketType($db);

// ✅ GET - Fetch All Ticket Types
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    echo json_encode($ticketType->getAll());
    exit;
}

// ✅ POST - Create Ticket Type
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['name'])) {
        echo json_encode(['error' => 'Name is required']);
        exit;
    }

    $success = $ticketType->create($data['name']);

    echo json_encode(['success' => $success]);
    exit;
}

// ✅ PATCH - Update Ticket Type
if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
    $data = json_decode(file_get_contents('php://input'), true);

    if (empty($data['ticket_type_id']) || empty($data['name'])) {
        echo json_encode(['error' => 'Invalid data']);
        exit;
    }

    $success = $ticketType->update((int)$data['ticket_type_id'], $data['name']);

    echo json_encode(['success' => $success]);
    exit;
}

// ✅ DELETE - Delete Ticket Type
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id = $_GET['id'] ?? null;

    if (!$id) {
        echo json_encode(['error' => 'ID is required']);
        exit;
    }

    $success = $ticketType->delete((int)$id);

    echo json_encode(['success' => $success]);
    exit;
}

// ✅ If no route matches
http_response_code(405);
echo json_encode(['error' => 'Method Not Allowed']);