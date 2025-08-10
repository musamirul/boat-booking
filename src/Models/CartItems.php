<?php
    namespace App\Models;

    use PDO;

    class CartItems {
        private PDO $conn;
        private string $table = 'cart_items';

        public function __construct(PDO $db) {
            $this->conn = $db;
        }


        public function addItem(int $cartId, int $scheduleId, int $ticketTypeId, int $quantity): bool {
            $sql = "INSERT INTO {$this->table} (cart_id, schedule_id, ticket_type_id, quantity) VALUES (?,?,?,?)";
            $stmt = $this->conn->prepare($sql);
            return $stmt->execute([$cartId, $scheduleId, $ticketTypeId, $quantity]);
        }
    
        public function getItems(int $cartId): array {
            $sql = "SELECT ci.*, s.departure_time, b.name AS boat_name, tt.name AS ticket_type
                    FROM {$this->table} ci
                    JOIN schedules s ON ci.schedule_id = s.schedule_id
                    JOIN boats b ON s.boat_id = b.boat_id
                    JOIN ticket_types tt ON ci.ticket_type_id = tt.ticket_type_id
                    WHERE ci.cart_id = ?";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$cartId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getByUserId(int $userId) {
            $sql = "SELECT 
                        ci.cart_item_id, 
                        ci.cart_id, 
                        ci.schedule_id, 
                        ci.ticket_type_id, 
                        ci.quantity, 
                        s.departure_time, 
                        b.name AS boat_name, 
                        tt.name AS type_name, 
                        sp.price
                    FROM cart_items ci
                    INNER JOIN carts c 
                        ON ci.cart_id = c.cart_id
                    INNER JOIN schedules s 
                        ON ci.schedule_id = s.schedule_id
                    INNER JOIN boats b 
                        ON s.boat_id = b.boat_id
                    INNER JOIN ticket_types tt 
                        ON ci.ticket_type_id = tt.ticket_type_id
                    INNER JOIN schedule_prices sp
                        ON sp.schedule_id = ci.schedule_id
                        AND sp.ticket_type_id = ci.ticket_type_id
                    WHERE c.user_id = :user_id";
            
            $stmt = $this->conn->prepare($sql);
            $stmt->bindParam(':user_id', $userId);
            $stmt->execute();
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getCartItemsByUser($userId): array {
            $stmt = $this->conn->prepare("
                SELECT 
                    ci.cart_item_id,
                    ci.quantity,
                    tt.name AS ticket_type,
                    sp.price,
                    s.departure_time,
                    b.name AS boat_name
                FROM cart_items ci
                JOIN carts c ON ci.cart_id = c.cart_id
                JOIN schedules s ON ci.schedule_id = s.schedule_id
                JOIN boats b ON s.boat_id = b.boat_id
                JOIN ticket_types tt ON ci.ticket_type_id = tt.ticket_type_id
                JOIN schedule_prices sp 
                    ON sp.schedule_id = ci.schedule_id AND sp.ticket_type_id = ci.ticket_type_id
                WHERE c.user_id = ?
            ");
            $stmt->execute([$userId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function addOrUpdateItem($cartId, $scheduleId, $ticketTypeId, $quantity): bool {
            try {
                $query = "SELECT cart_item_id, quantity FROM cart_items 
                          WHERE cart_id = :cart_id 
                          AND schedule_id = :schedule_id 
                          AND ticket_type_id = :ticket_type_id";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([
                    ':cart_id' => $cartId,
                    ':schedule_id' => $scheduleId,
                    ':ticket_type_id' => $ticketTypeId
                ]);
                $existing = $stmt->fetch(PDO::FETCH_ASSOC);
        
                if ($existing) {
                    $newQty = max(1, $existing['quantity'] + $quantity);
                    $update = "UPDATE cart_items SET quantity = :qty WHERE cart_item_id = :id";
                    $stmt = $this->conn->prepare($update);
                    $res = $stmt->execute([
                        ':qty' => $newQty,
                        ':id' => $existing['cart_item_id']
                    ]);
                    if (!$res) {
                        error_log("Failed to update cart_item: " . implode(", ", $stmt->errorInfo()));
                    }
                    return $res;
                } else {
                    $insert = "INSERT INTO cart_items (cart_id, schedule_id, ticket_type_id, quantity) 
                               VALUES (:cart_id, :schedule_id, :ticket_type_id, :qty)";
                    $stmt = $this->conn->prepare($insert);
                    $res = $stmt->execute([
                        ':cart_id' => $cartId,
                        ':schedule_id' => $scheduleId,
                        ':ticket_type_id' => $ticketTypeId,
                        ':qty' => $quantity
                    ]);
                    if (!$res) {
                        error_log("Failed to insert cart_item: " . implode(", ", $stmt->errorInfo()));
                    }
                    return $res;
                }
            } catch (PDOException $e) {
                error_log("PDO Exception in addOrUpdateItem: " . $e->getMessage());
                return false;
            }
        }
        
        public function deleteItem(int $itemId) {
            $stmt = $this->conn->prepare("DELETE FROM cart_items WHERE cart_item_id = ?");
            return $stmt->execute([$itemId]);
        }

        public function clearCart(int $cartId): bool{
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE cart_id = ?");
            return $stmt->execute([$cartId]);
        }
    }