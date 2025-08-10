<?php
    namespace App\Models;

    use PDO;

    class Cart {
        private PDO $conn;
        private string $table = 'carts';

        public function __construct(PDO $db){
            $this->conn = $db;
        }

        //Create a cart
        public function create(int $userId): int{
            $sql = "INSERT INTO {$this->table} (user_id) VALUES (?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->execute([$userId]);
            return (int) $this->conn->lastInsertId();
        }

        public function getByUser(int $userId): ?array{
            $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
            $stmt->execute([$userId]);
            $cart = $stmt->fetch(PDO::FETCH_ASSOC);
            return $cart ?: null;
        }

        public function getOrCreateCart(int $userId): int {
            // Try to find an existing cart
            $stmt = $this->conn->prepare("SELECT cart_id FROM {$this->table} WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
            $stmt->execute([$userId]);
            $cart = $stmt->fetch(PDO::FETCH_ASSOC);
        
            if ($cart) {
                return (int) $cart['cart_id'];
            }
        
            // No cart found, create one
            $stmt = $this->conn->prepare("INSERT INTO {$this->table} (user_id) VALUES (?)");
            $stmt->execute([$userId]);
            return (int) $this->conn->lastInsertId();
        }

        public function delete(int $cartId): bool{
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE cart_id = ?");
            return $stmt->execute([$cartId]);
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

        public function clearCartByUserId(int $userId): bool {
            $this->conn->beginTransaction();
            try {
                // Get cart id
                $stmt = $this->conn->prepare("SELECT id FROM carts WHERE user_id = ?");
                $stmt->execute([$userId]);
                $cartId = $stmt->fetchColumn();
        
                if (!$cartId) {
                    // No cart found, treat as success
                    return true;
                }
        
                // Delete cart items
                $stmt = $this->conn->prepare("DELETE FROM cart_items WHERE cart_id = ?");
                $stmt->execute([$cartId]);
        
                // Delete cart itself
                $stmt = $this->conn->prepare("DELETE FROM carts WHERE id = ?");
                $stmt->execute([$cartId]);
        
                $this->conn->commit();
                return true;
            } catch (Exception $e) {
                $this->conn->rollBack();
                error_log("Failed to clear cart: " . $e->getMessage());
                return false;
            }
        }
    }