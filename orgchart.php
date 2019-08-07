<?php
/**
 * The plugin bootstrap file
 *
 * @wordpress-plugin
 * Plugin Name:       UT Dallas Research Org Chart
 * Plugin URI:        https://github.com/utdallasresearch/orgchart-wordpress-plugin
 * Description:       A WordPress plugin for managing people and generating directories and org charts.
 * Version:           3.2.6
 * Author:            UT Dallas Research Information Systems
 * Author URI:        https://research.utdallas.edu/oris
 * License:           MIT
 * License URI:       http://opensource.org/licenses/MIT
 * Text Domain:       orgchart
 * Domain Path:       /languages
 */
define('OrgChart\VERSION', '3.2.6');

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Autoload classes
spl_autoload_register(function ($class_name) {
    $prefix = 'OrgChart\\';
    $prefix_length = strlen($prefix);

    if (strncmp($prefix, $class_name, $prefix_length) !== 0) { // Only autoload OrgChart classes
        return;
    }

    $relative_class = substr($class_name, $prefix_length);
    $filename = plugin_dir_path(__FILE__) . str_replace('\\', '/', $relative_class) . '.php';

    if (file_exists($filename)) {
        include_once $filename;
    }
});

// Load the plugin
(new OrgChart\OrgChartPlugin(OrgChart\VERSION))->run();
