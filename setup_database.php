<?php
// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection parameters
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "coke_store";

// Create connection
$conn = new mysqli($servername, $username, $password);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create database
$sql = "CREATE DATABASE IF NOT EXISTS $dbname";
if ($conn->query($sql) === TRUE) {
    echo "Database created successfully<br>";
} else {
    echo "Error creating database: " . $conn->error . "<br>";
}

// Select database
$conn->select_db($dbname);

// Create customers table
$sql = "CREATE TABLE IF NOT EXISTS customers (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(50) NOT NULL,
    zip VARCHAR(20) NOT NULL,
    country VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if ($conn->query($sql) === TRUE) {
    echo "Customers table created successfully<br>";
} else {
    echo "Error creating customers table: " . $conn->error . "<br>";
}

// Create orders table
$sql = "CREATE TABLE IF NOT EXISTS orders (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    customer_id INT(11) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    order_date DATETIME NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (customer_id) REFERENCES customers(id)
)";

if ($conn->query($sql) === TRUE) {
    echo "Orders table created successfully<br>";
} else {
    echo "Error creating orders table: " . $conn->error . "<br>";
}

// Create order_items table
$sql = "CREATE TABLE IF NOT EXISTS order_items (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    order_id INT(11) NOT NULL,
    product_id INT(11) NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    size VARCHAR(20) NOT NULL,
    quantity INT(11) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
)";

if ($conn->query($sql) === TRUE) {
    echo "Order items table created successfully<br>";
} else {
    echo "Error creating order items table: " . $conn->error . "<br>";
}

// Create products table
$sql = "CREATE TABLE IF NOT EXISTS products (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    image VARCHAR(255) NOT NULL
)";

if ($conn->query($sql) === TRUE) {
    echo "Products table created successfully<br>";
} else {
    echo "Error creating products table: " . $conn->error . "<br>";
}

// Create product_variants table
$sql = "CREATE TABLE IF NOT EXISTS product_variants (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    product_id INT(11) NOT NULL,
    size VARCHAR(20) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    stock INT(11) NOT NULL DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id)
)";

if ($conn->query($sql) === TRUE) {
    echo "Product variants table created successfully<br>";
} else {
    echo "Error creating product variants table: " . $conn->error . "<br>";
}

// Create contact_messages table
$sql = "CREATE TABLE IF NOT EXISTS contact_messages (
    id INT(11) AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read TINYINT(1) DEFAULT 0
)";

if ($conn->query($sql) === TRUE) {
    echo "Contact messages table created successfully<br>";
} else {
    echo "Error creating contact messages table: " . $conn->error . "<br>";
}

// Insert sample products
$products = [
    [
        'name' => 'Coca-Cola',
        'description' => 'The original Coca-Cola taste.',
        'category' => 'coke',
        'image' => 'images/coke.png',
        'variants' => [
            ['size' => '250ml', 'price' => 1.49, 'stock' => 100],
            ['size' => '600ml', 'price' => 2.49, 'stock' => 100],
            ['size' => '1L', 'price' => 3.49, 'stock' => 100]
        ]
    ],
    [
        'name' => 'Coca-Cola Zero',
        'description' => 'Zero Sugar Coke is a sugar-free version of Coca-Cola, offering the classic taste without the calories.',
        'category' => 'coke',
        'image' => 'images/coke-zero.png',
        'variants' => [
            ['size' => '250ml', 'price' => 1.99, 'stock' => 100],
            ['size' => '600ml', 'price' => 2.99, 'stock' => 100],
            ['size' => '1L', 'price' => 3.99, 'stock' => 100]
        ]
    ],
    [
        'name' => 'Sprite',
        'description' => 'Crisp, refreshing lemon-lime taste.',
        'category' => 'sprite',
        'image' => 'images/sprite.png',
        'variants' => [
            ['size' => '250ml', 'price' => 1.49, 'stock' => 100],
            ['size' => '600ml', 'price' => 2.49, 'stock' => 100],
            ['size' => '1L', 'price' => 3.49, 'stock' => 100]
        ]
    ],
    [
        'name' => 'Fanta',
        'description' => 'Bright, bubbly orange flavor.',
        'category' => 'fanta',
        'image' => 'images/fanta.png',
        'variants' => [
            ['size' => '250ml', 'price' => 1.49, 'stock' => 100],
            ['size' => '600ml', 'price' => 2.49, 'stock' => 100],
            ['size' => '1L', 'price' => 3.49, 'stock' => 100]
        ]
    ],
    [
        'name' => 'Thums Up',
        'description' => 'Strong, fizzy cola with a distinct taste.',
        'category' => 'thumsup',
        'image' => 'images/thumsup.png',
        'variants' => [
            ['size' => '250ml', 'price' => 1.49, 'stock' => 100],
            ['size' => '600ml', 'price' => 2.49, 'stock' => 100],
            ['size' => '1L', 'price' => 3.49, 'stock' => 100]
        ]
    ],
    [
        'name' => 'Maaza',
        'description' => 'Thick, juicy mango drink.',
        'category' => 'maaza',
        'image' => 'images/maaza.png',
        'variants' => [
            ['size' => '250ml', 'price' => 1.49, 'stock' => 100],
            ['size' => '600ml', 'price' => 2.49, 'stock' => 100],
            ['size' => '1L', 'price' => 3.49, 'stock' => 100]
        ]
    ]
];

// Prepare statements for inserting products and variants
$stmt_product = $conn->prepare("INSERT INTO products (name, description, category, image) VALUES (?, ?, ?, ?)");
$stmt_variant = $conn->prepare("INSERT INTO product_variants (product_id, size, price, stock) VALUES (?, ?, ?, ?)");

// Insert each product and its variants
foreach ($products as $product) {
    $stmt_product->bind_param("ssss", $product['name'], $product['description'], $product['category'], $product['image']);
    $stmt_product->execute();
    
    $product_id = $conn->insert_id;
    
    foreach ($product['variants'] as $variant) {
        $stmt_variant->bind_param("isdi", $product_id, $variant['size'], $variant['price'], $variant['stock']);
        $stmt_variant->execute();
    }
}

echo "Sample products inserted successfully<br>";

// Close connection
$conn->close();

echo "Database setup completed successfully!";
?>