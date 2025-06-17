<?php
// Устанавливаем правильный заголовок, чтобы сервер отправил корректные данные
header("Content-Type: text/html; charset=UTF-8");
header("Cache-Control: no-cache, must-revalidate");
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// Проверяем, чтобы не было активного сжатия (если оно здесь не нужно)
if (ob_get_level()) {
    ob_end_clean();
}

// Включаем буферизацию вывода для отладки (если потребуется)
ob_start();

/**
 * Plugin Name: Vanlife Game
 * Description: A simple Vanlife-themed game to simulate managing a campervan. Use shortcode [vanlife_game] to display the game.
 * Version: 1.0.1
 * Author: Alexey
 * Text Domain: https://vanlife.bez.coffee/
 * Domain Path: /languages
 */

// Enqueue the required scripts and styles only on /games/ page
function vanlife_game_enqueue_scripts() {
    if (is_page('games')) {  // Проверка slug страницы
        wp_enqueue_style('vanlife-game-styles', plugin_dir_url(__FILE__) . 'css/styles.css', array(), '1.0.4', 'all');
        wp_enqueue_script('vanlife-game-scripts', plugin_dir_url(__FILE__) . 'js/script.js', array(), false, true);

        // Определяем текущий язык сайта, используя get_locale()
        $current_locale = get_locale(); // Вернёт, например, 'en_US' или 'ru_RU'
        $language_code = substr($current_locale, 0, 2); // Получаем первые два символа (например, 'en' или 'ru')

        // Формируем путь к файлу перевода
        $translation_file_path = plugin_dir_path(__FILE__) . "languages/lang_{$language_code}.json";
        $translation_url = plugin_dir_url(__FILE__) . "languages/lang_{$language_code}.json";

        // Проверка существования файла перед передачей пути
        if (file_exists($translation_file_path)) {
            // Передаём правильный путь к файлу перевода
            wp_localize_script('vanlife-game-scripts', 'vanlifeGameConfig', array(
                'translationUrl' => $translation_url,
            ));
        } else {
            // Если файл перевода не найден, используем английский по умолчанию
            $default_translation_url = plugin_dir_url(__FILE__) . "languages/lang_en.json";
            wp_localize_script('vanlife-game-scripts', 'vanlifeGameConfig', array(
                'translationUrl' => $default_translation_url,
            ));
        }
    }
}
add_action('wp_enqueue_scripts', 'vanlife_game_enqueue_scripts');

// Load plugin textdomain
function vanlife_game_load_textdomain() {
    load_plugin_textdomain('vanlife_game', false, dirname(plugin_basename(__FILE__)) . '/languages');
}
add_action('plugins_loaded', 'vanlife_game_load_textdomain');

// Create the shortcode to display the game
function vanlife_game_shortcode() {
    ob_start();
    ?>
    <!DOCTYPE html>
    <html lang="ru">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Vanlife Game</title>
    </head>
    <body>
    <div class="container">
        <h3><?php _e('My Vanlife', 'vanlife_game'); ?></h3>
        <div class="time-budget">
            <div class="left-section">
                <div id="time-display">
                    <span class="label"><?php _e('Day', 'vanlife_game'); ?></span>
                    <span id="day-time">1, 00:00</span>
                </div>
                <div id="weather-display">
                    <span id="weather-status"><?php _e('🌙 Night', 'vanlife_game'); ?></span>
                </div>
            </div>
            <div class="center-section">
                <div id="money-display">
                    <span class="label"><?php _e('Budget:', 'vanlife_game'); ?></span>
                    <span id="budget-amount">1500.00</span> €
                </div>
                <div id="voltage-display"><?php _e('🔋 12.9 V (0%)', 'vanlife_game'); ?></div>
            </div>
            <div class="right-section">
                <button onclick="earnMoney();"><?php _e('Earn Money', 'vanlife_game'); ?></button>
            </div>
        </div>

        <div class="time-budget-mobile" id="mobile-display"></div>

        <div class="game-area">
            <div class="pet">🚐...</div>
            <div class="stats">
                <div class="stat-item">
                    <span class="label"><?php _e('Water 🏠:', 'vanlife_game'); ?></span>
                    <div class="bar-container"><div class="bar" id="water-bar"><?php _e('100%', 'vanlife_game'); ?></div></div>
                    <button onclick="fillWater();"><?php _e('Fill', 'vanlife_game'); ?></button>
                </div>
                <div class="stat-item">
                    <span class="label"><?php _e('Toilet 🚽:', 'vanlife_game'); ?></span>
                    <div class="bar-container"><div class="bar" id="toilet-bar"><span id="toilet-indicator" class="indicator">⚠️</span><?php _e('0%', 'vanlife_game'); ?></div></div>
                    <button onclick="emptyToilet();"><?php _e('Empty', 'vanlife_game'); ?></button>
                </div>
                <div class="stat-item">
                    <span class="label"><?php _e('Gas 💨:', 'vanlife_game'); ?></span>
                    <div class="bar-container"><div class="bar" id="gas-bar"><?php _e('100%', 'vanlife_game'); ?></div></div>
                    <button onclick="fillGas();"><?php _e('Fill', 'vanlife_game'); ?></button>
                </div>
                <div class="stat-item">
                    <span class="label"><?php _e('Fridge 🛂:', 'vanlife_game'); ?></span>
                    <div class="bar-container"><div class="bar" id="fridge-bar"><?php _e('100%', 'vanlife_game'); ?></div></div>
                    <button onclick="fillFridge();"><?php _e('Stock', 'vanlife_game'); ?></button>
                </div>
                <div class="stat-item">
                    <span class="label"><?php _e('Diesel ⛽️:', 'vanlife_game'); ?></span>
                    <div class="bar-container"><div class="bar" id="diesel-bar"><?php _e('100%', 'vanlife_game'); ?></div></div>
                    <button onclick="fillDiesel();"><?php _e('Refuel', 'vanlife_game'); ?></button>
                </div>
                <div class="stat-item">
                    <span class="label"><?php _e('Laundry 🧺:', 'vanlife_game'); ?></span>
                    <div class="bar-container"><div class="bar" id="laundry-bar"><?php _e('0%', 'vanlife_game'); ?></div></div>
                    <button onclick="doLaundry();"><?php _e('Wash', 'vanlife_game'); ?></button>
                </div>
            </div>
        </div>
    </div>
    <button id="engine-button" style="display:none" onclick="startEngine();"><?php _e('Start Engine', 'vanlife_game'); ?></button>
    <button id="camping-button" style="display:none" onclick="goCamping();"><?php _e('Go Camping (25 euros)', 'vanlife_game'); ?></button>
    
    <div id="notification-container" class="notification-container"></div>
    </body>
    </html>
    <?php
    return ob_get_clean();
}
add_shortcode('vanlife_game', 'vanlife_game_shortcode');

// Завершаем буферизацию и отправляем контент
ob_end_flush();
?>