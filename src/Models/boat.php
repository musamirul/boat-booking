<?php
    namespace App\Models;

    use PDO;

    class Boat{
        private PDO $conn;
        private string $table = 'boats';

        public function __construct(PDO $db){
            $this->conn = $db;
        }

        public function getAll(): array {
            $stmt = $this->conn->query("SELECT * FROM {$this->table} ORDER BY name ASC");
            return $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        public function getById(int $id): ?array{
            $stmt = $this->conn->prepare("SELECT * FROM {$this->table} WHERE boat_id = ?");
            $stmt->execute([$id]);
            return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        }

        public function create(string $name, string $description): bool{
            $stmt = $this->conn->prepare("INSERT INTO {$this->table} (name, description) VALUES (?,?)");
            return $stmt->execute([$name, $description]);
        }

        public function delete(int $id): bool{
            $stmt = $this->conn->prepare("DELETE FROM {$this->table} WHERE boat_id = ?");
            return $stmt->execute([$id]);
        }
    }

?>