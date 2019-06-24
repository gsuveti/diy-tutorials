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
function diy_block_assets()
{ // phpcs:ignore

    // Register block editor script for backend.
    wp_register_script(
        'diy-block-runtime-js', // Handle.
        plugins_url('/build/static/js/runtime~main.a8a9905a.js', dirname(__FILE__)), // Block.build.js: We register the block here. Built with Webpack.
        array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components'), // Dependencies, defined above.
        null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
        true // Enqueue the script in the footer.
    );
//
//    // Register block editor script for backend.
//    wp_register_script(
//        'diy-block-vendor-js', // Handle.
//        plugins_url('/build/static/js/2.c606ce97.chunk.js', dirname(__FILE__)), // Block.build.js: We register the block here. Built with Webpack.
//        array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components'), // Dependencies, defined above.
//        null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
//        true // Enqueue the script in the footer.
//    );

    // Register block editor script for backend.
    wp_register_script(
        'diy-block-js', // Handle.
        plugins_url('/build/static/js/main.8b62003f.chunk.js', dirname(__FILE__)), // Block.build.js: We register the block here. Built with Webpack.
        array('wp-blocks', 'wp-i18n', 'wp-element', 'wp-editor', 'wp-components'), // Dependencies, defined above.
        null, // filemtime( plugin_dir_path( __DIR__ ) . 'dist/blocks.build.js' ), // Version: filemtime — Gets file modification time.
        true // Enqueue the script in the footer.
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
    register_block_type(
        'irian/diy-block', array(
            'script' => array('diy-block-runtime-js','diy-block-js')
        )
    );


}

// Hook: Block assets.
add_action('init', 'diy_block_assets');