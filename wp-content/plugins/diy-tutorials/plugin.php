<?php
/**
 * Plugin Name: diy-tutorials — irian
 * Plugin URI: https://github.com/gsuveti/diy-tutorials/
 * Description: Gutenberg blocks & frontend scripts to create an interactive diy tutorial
 * Version: 1.1.3
 * Author: George Șuveți
 * Author URI: https://github.com/gsuveti
 *
 * @package CGB
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
  exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';
