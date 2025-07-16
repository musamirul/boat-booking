<?php
    namespace App\Models;

    use PDO;

    class Cart {
        private PDO $conn;
        private string $table = 'carts';

        public function __construct(PDO $db){
            $this->conn = $db;
        }

        // Create a cart for a user (only one active cart per user)
        public function createIfNotExists(int $userId): int {
            $stmt = $this->conn->prepare("SELECT cart_id FROM {$this->table} WHERE user_id = ?");
            $stmt->execute([$userId]);
            $cart = $stmt->fetch(PDO::FETCH_ASSOC);

            if($cart){
                return $cart['cart_id'];
            }

            $stmt = $this->conn->prepare("INSERT INTO {$this->table} (user_id) VALUES (?)");
            $stmt->execute([$userId]);
            return (int) $this->conn->lastInsertId();
        }

        public function getCartIdByUser(int $userId): ?int {
            $stmt = $this->conn->prepare("SELECT cart_id FROM {$this->table} WHERE user_id = ?");
            $stmt->execute([$userId]);
            $result = $stmt->fetch(PDO::FETCH_ASSOC);
            return $result ? (int) $result['cart_id'] : null;
        }

        public function deleteCart(int $cartId): bool{
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE cart_id = ?");
            return $stmt->execute([$cartId]);
        }
    }