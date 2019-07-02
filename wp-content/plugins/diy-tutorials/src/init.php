<?php
/**
 * Blocks Initializer
 *
 * Enqueue CSS/JS of all the blocks.
 *
 * @since   1.0.0
 * @package CGB
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
  exit;
}

/**
 * Enqueue Gutenberg block assets for both frontend + backend.
 *
 * Assets enqueued:
 * 1. blocks.style.build.css - Frontend + Backend.
 * 2. blocks.build.js - Backend.
 * 3. blocks.editor.build.css - Backend.
 *
 * @uses {wp-blocks} for block type registration & related functions.
 * @uses {wp-element} for WP Element abstraction — structure of blocks.
 * @uses {wp-i18n} to internationalize the block's text.
 * @uses {wp-editor} for WP editor styles.
 * @since 1.0.0
 */
function diy_tutorials_block_assets()
{ // phpcs:ignore

  // Register block editor script for backend.
  wp_register_script(
    'diy_tutorials_block_main_js', // Handle.
    plugins_url('/dist/diy-tutorials-backend/main-es5.js', dirname(__FILE__)),
    array('wp-blocks', 'wp-element', 'wp-editor'),
    null,
    true
  );

  // Register block editor script for backend.
  wp_register_script(
    'diy_tutorials_block_polyfills_js', // Handle.
    plugins_url('/dist/diy-tutorials-backend/polyfills-es5.js', dirname(__FILE__)),
    array('wp-blocks', 'wp-element', 'wp-editor'),
    null,
    true
  );

  // Register block editor script for backend.
  wp_register_script(
    'diy_tutorials_block_runtime_js', // Handle.
    plugins_url('/dist/diy-tutorials-backend/runtime-es5.js', dirname(__FILE__)),
    array('wp-blocks', 'wp-element', 'wp-editor'),
    null,
    true
  );

  // Register block editor script for backend.
  wp_register_script(
    'diy_tutorials_block_styles_js', // Handle.
    plugins_url('/dist/diy-tutorials-backend/styles-es5.js', dirname(__FILE__)),
    array('wp-blocks', 'wp-element', 'wp-editor'),
    null,
    true
  );

  // Register block editor script for backend.
  wp_register_script(
    'diy_tutorials_block_vendor_js', // Handle.
    plugins_url('/dist/diy-tutorials-backend/vendor-es5.js', dirname(__FILE__)),
    array('wp-blocks', 'wp-element', 'wp-editor'),
    null,
    true
  );

  /**
   * Register Gutenberg block on server-side.
   *
   * Register the block on server-side to ensure that the block
   * scripts and styles for both frontend and backend are
   * enqueued when the editor loads.
   *
   * @link https://wordpress.org/gutenberg/handbook/blocks/writing-your-first-block-type#enqueuing-block-scripts
   * @since 1.16.0
   */

  register_block_type('irian/diy-content');
  register_block_type('irian/diy-question');
  register_block_type('irian/diy-section');

  register_block_type(
    'irian/diy-tutorial', array(
      'editor_script' => array(
        'diy_tutorials_block_runtime_js',
        'diy_tutorials_block_polyfills_js',
        'diy_tutorials_block_styles_js',
        'diy_tutorials_block_main_js',
        'diy_tutorials_block_vendor_js'
      )
    )
  );

}

function frontend_enqueue_scripts()
{
  wp_enqueue_script('frontend_runtime', plugins_url('/dist/diy-tutorials-frontend/runtime-es5.js', dirname(__FILE__)), array(), null, true);
  wp_enqueue_script('frontend_polyfills', plugins_url('/dist/diy-tutorials-frontend/polyfills-es5.js', dirname(__FILE__)), array(), null, true);
  wp_enqueue_script('frontend_styles', plugins_url('/dist/diy-tutorials-frontend/styles-es5.js', dirname(__FILE__)), array(), null, true);
  wp_enqueue_script('frontend_main', plugins_url('/dist/diy-tutorials-frontend/main-es5.js', dirname(__FILE__)), array(), null, true);
  wp_enqueue_script('frontend_vendor', plugins_url('/dist/diy-tutorials-frontend/vendor-es5.js', dirname(__FILE__)), array(), null, true);
}

// Hook: Block assets.
add_action('init', 'diy_tutorials_block_assets');
add_action('wp_enqueue_scripts', 'frontend_enqueue_scripts');

define('WP_DEBUG', true);
define('DEBUG_SCRIPTS', true);

function my_deregister_scripts(){
  wp_deregister_script( 'wp-embed' );
}
add_action( 'wp_footer', 'my_deregister_scripts' );
