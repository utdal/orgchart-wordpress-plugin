<?php
/**
 * The plugin bootstrap file
 *
 * @wordpress-plugin
 * Plugin Name:       UT Dallas Research Org Chart
 * Plugin URI:        https://github.com/utdallasresearch/orgchart-wordpress-plugin
 * Description:       A WordPress plugin for managing people and generating directories and org charts.
 * Version:           3.4.0
 * Author:            UT Dallas Research Information Systems
 * Author URI:        https://research.utdallas.edu/oris
 * License:           MIT
 * License URI:       http://opensource.org/licenses/MIT
 * Text Domain:       orgchart
 * Domain Path:       /languages
 */
define('OrgChart\VERSION', '3.4.0');

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

require __DIR__ . '/vendor/autoload.php';

// Load the plugin
(new OrgChart\OrgChartPlugin(OrgChart\VERSION))->run();
