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
    }

?>