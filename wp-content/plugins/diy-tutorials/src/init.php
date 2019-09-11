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

  // Register the environment script
  wp_register_script('frontend_environment', plugins_url('/src/environment.js', dirname(__FILE__)), null, null, true);
  $options = get_option('diy_settings');
  $translation_array = array(
    'firebase_config' => $options['firebase_config'],
    'cart_url' => $options['cart_url']
  );
  wp_localize_script('frontend_environment', 'environment', $translation_array);
  wp_enqueue_script('frontend_environment');


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

    wp_enqueue_script('frontend_' . $name,
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

function add_defer_attribute($tag, $handle)
{
  if (strpos($handle, 'frontend_') === 0)
    return str_replace(' src', ' defer src', $tag);
  return $tag;
}

add_filter('script_loader_tag', 'add_defer_attribute', 10, 2);


add_action('admin_menu', 'diy_settings_page_menu');
add_action('admin_init', 'diy_settings_page_init');

function diy_settings_page_menu()
{
  add_menu_page('DIY Settings', 'DIY Settings Page', 'manage_options', 'diy_settings_page', 'diy_settings_page_template');
}

function diy_settings_page_init()
{
  $cm_settings['codeEditor'] = wp_enqueue_code_editor(array('name' => 'javascript', 'json' => true));
  wp_localize_script('jquery', 'cm_settings', $cm_settings);
  wp_enqueue_style('wp-codemirror');


  register_setting('diy_tutorials', 'diy_settings');


  add_settings_section(
    'diy_settings_section',
    '',
    'diy_settings_section_callback',
    'diy_tutorials'
  );

  add_settings_field(
    'firebase_config',
    'Firbase config',
    'firebase_config_renderer',
    'diy_tutorials',
    'diy_settings_section'
  );

  add_settings_field(
    'cart_url',
    'Cart URL',
    'cart_url_renderer',
    'diy_tutorials',
    'diy_settings_section'
  );
}

function diy_settings_section_callback()
{
  echo '';
}

function firebase_config_renderer()
{
  $options = get_option('diy_settings');
  ?>
  <textarea type='text' class="cm-textarea"
            name='diy_settings[firebase_config]'><?php echo $options['firebase_config']; ?></textarea>
  <?php
}

function cart_url_renderer()
{
  $options = get_option('diy_settings');
  ?>
  <input style='width:100%' type='text' name='diy_settings[cart_url]' value='<?php echo $options['cart_url']; ?>'/>
  <?php
}

function diy_settings_page_template()
{
  ?>
  <form action='options.php' method='post'>
    <h1>DIY Settings Page</h1>
    <?php
    settings_fields('diy_tutorials');
    do_settings_sections('diy_tutorials');
    submit_button();
    ?>
  </form>
  <script>
    jQuery(function ($) {
      wp.codeEditor.initialize($('.cm-textarea'), {mode: 'javascript', json: true});
    });
  </script>
  <?php
}
