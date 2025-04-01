<?php
// Create images directory if it doesn't exist
if (!file_exists('images')) {
    mkdir('images', 0777, true);
}

// Function to create a placeholder image
function createPlaceholderImage($filename, $width, $height, $bgColor, $textColor, $text) {
    $image = imagecreatetruecolor($width, $height);
    
    // Convert hex colors to RGB
    $bgRGB = sscanf($bgColor, "#%02x%02x%02x");
    $textRGB = sscanf($textColor, "#%02x%02x%02x");
    
    // Allocate colors
    $bg = imagecolorallocate($image, $bgRGB[0], $bgRGB[1], $bgRGB[2]);
    $text_color = imagecolorallocate($image, $textRGB[0], $textRGB[1], $textRGB[2]);
    
    // Fill background
    imagefill($image, 0, 0, $bg);
    
    // Add text
    $font_size = 5;
    $text_width = imagefontwidth($font_size) * strlen($text);
    $text_height = imagefontheight($font_size);
    
    $x = ($width - $text_width) / 2;
    $y = ($height - $text_height) / 2;
    
    imagestring($image, $font_size, $x, $y, $text, $text_color);
    
    // Save image
    imagepng($image, $filename);
    imagedestroy($image);
    
    echo "Created placeholder image: $filename<br>";
}

// Create placeholder images for products
createPlaceholderImage('images/coke.png', 300, 400, "#1a1a1a", "#ffffff", "Coca-Cola");
createPlaceholderImage('images/coke-zero.png', 300, 400, "#1a1a1a", "#ffffff", "Coca-Cola Zero");
createPlaceholderImage('images/sprite.png', 300, 400, "#1a1a1a", "#ffffff", "Sprite");
createPlaceholderImage('images/fanta.png', 300, 400, "#1a1a1a", "#ffffff", "Fanta");
createPlaceholderImage('images/thumsup.png', 300, 400, "#1a1a1a", "#ffffff", "Thums Up");
createPlaceholderImage('images/maaza.png', 300, 400, "#1a1a1a", "#ffffff", "Maaza");

// Create placeholder images for about page
createPlaceholderImage('images/about-coke.jpg', 600, 400, "#1a1a1a", "#ffffff", "Coca-Cola History");
createPlaceholderImage('images/coke-mission.jpg', 600, 400, "#1a1a1a", "#ffffff", "Coca-Cola Mission");

// Create placeholder for logo
createPlaceholderImage('images/coca-cola-logo.png', 200, 50, "#1a1a1a", "#e61a27", "Coca-Cola");

echo "All placeholder images created successfully!";
?>