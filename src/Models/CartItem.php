<?php
    namespace App\Models;

    use PDO;

    class CartItem {
        private PDO $conn;
        private string $table = 'cart_items';

        public function __construct(PDO $db) {
            $this->conn = $db;
        }

        public function addItem(int $cartId, int $scheduleId, int $ticketTypeId, int $quantity): bool{
            $stmt = $this->conn->prepare(
                "INSERT INTO {$this->table} (cart_id, schedule_id, ticket_type_id, quantity)
                VALUES (?,?,?,?)
                ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)");
            return $stmt->execute([$cartId,$scheduleId,$ticketTypeId,$quantity]);
        }

        public function getItem(int $cartId): array{
            $stmt = $this->conn->prepare(
                "SELECT ci.*, tt.name AS ticket_type, s.departure_time
                FROM {$this->table} ci
                JOIN ticket_types tt ON ci.ticket_type_id = tt.ticket_type_id
                JOIN schedules s ON ci.schedule_id = s.schedule_id
                WHERE ci.cart_id = ?"
            );
            $stmt->execute([$cartId]);
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function deleteItem(int $cartItemId): bool{
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE cart_item_id = ?");
            return $stmt->execute([$cartItemId]);
        }

        public function clearCart(int $cartId): bool{
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE cart_id = ?");
            return $stmt->execute([$cartId]);
        }
    }