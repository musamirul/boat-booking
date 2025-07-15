<?php
require_once __DIR__ . '/vendor/autoload.php';

use Dotenv\Dotenv;
use App\Config\Database;

$dotenv = Dotenv::createImmutable(__DIR__);
$dotenv->load();

$db = (new Database())->connect();

?>