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

  $folder = '/dist/diy-tutorials-backend/';

  $jsFiles = getJSFiles($folder);
  $jsFileNames = array_map('getFileName', $jsFiles);


  $orderedJsFileNames = [
    "runtime-es5",
    "polyfills-es5",
    "styles-es5",
    "main-es5",
    "vendor-es5"
  ];

  foreach ($orderedJsFileNames as $name) {
    $key = array_search($name, $jsFileNames);
    $fullName = $jsFiles[$key];
    $scriptName = str_replace("-", "_", $name);

    wp_register_script(
      $scriptName,
      plugins_url($folder . $fullName, dirname(__FILE__)),
      array('wp-blocks', 'wp-element', 'wp-editor'),
      null,
      true
    );
  }

  register_block_type(
    'irian/diy-tutorial', array(
      'editor_script' => array(
        'runtime_es5',
        'polyfills_es5',
        'styles_es5',
        'main_es5',
        'vendor_es5'
      )
    )
  );


}

function getJSFiles($folder)
{
  $root = dirname(__FILE__, 2);
  $dirJS = new DirectoryIterator($root . $folder);
  $jsFiles = [];


  foreach ($dirJS as $file) {
    if (pathinfo($file, PATHINFO_EXTENSION) === 'js') {
      $fullName = basename($file);
      array_push($jsFiles, $fullName);
    }
  }

  return $jsFiles;

}

function getFileName($fullName)
{
  return substr(basename($fullName), 0, strpos(basename($fullName), '.'));
}

function frontend_enqueue_scripts()
{

  $folder = '/dist/diy-tutorials-frontend/';

  $jsFiles = getJSFiles($folder);
  $jsFileNames = array_map('getFileName', $jsFiles);


  $orderedJsFileNames = [
    "runtime-es5",
    "polyfills-es5",
    "main-es5",
    "vendor-es5"
  ];


  foreach ($orderedJsFileNames as $name) {
    $key = array_search($name, $jsFileNames);
    $fullName = $jsFiles[$key];

    wp_enqueue_script($name,
      plugins_url($folder . $fullName, dirname(__FILE__)), null, null, true);
  }
}


// Hook: Block assets.
add_action('init', 'diy_tutorials_block_assets');
add_action('wp_enqueue_scripts', 'frontend_enqueue_scripts');

define('WP_DEBUG', true);
define('DEBUG_SCRIPTS', true);

function my_deregister_scripts()
{
  wp_deregister_script('wp-embed');
}

add_action('wp_footer', 'my_deregister_scripts');

function add_async_attribute($tag, $handle)
{
  if (strpos($handle, 'frontend_') === 0)
    return str_replace(' src', ' async="async" src', $tag);
  return $tag;
}

add_filter('script_loader_tag', 'add_async_attribute', 10, 2);
