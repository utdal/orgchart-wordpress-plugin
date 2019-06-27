<?php

namespace OrgChart;

use OrgChart\PostTypes\Person as PersonCustomPost;
use OrgChart\Shortcodes\Orgchart;
use OrgChart\Shortcodes\PersonList;

class OrgChartPlugin
{
	/** @var string The string used to uniquely identify this plugin. */
	protected $plugin_name = 'orgchart';

	/** @var string The current version of the plugin. */
	protected $version;

	/** @var string The url of the assets folder. */
	protected $asset_url;

	/** @var array The actions registered with WordPress to fire when the plugin loads. */
	protected $actions = [];

	/** @var array The filters registered with WordPress to fire when the plugin loads. */
	protected $filters = [];

	/** @var array Custom post types */
	protected $custom_posts = [];

	/** @var array Shortcodes */
	protected $shortcodes = [];

	/**
	 * Define the core functionality of the plugin.
	 */
	public function __construct($version)
	{
		$this->version = $version;
		$this->asset_url = plugin_dir_url(__FILE__) . 'public';
		
		$this->custom_posts[] = new PersonCustomPost();
		$this->shortcodes[] = new PersonList();
        $this->shortcodes[] = new Orgchart();
		$this->load_dependencies();
	}

	/**
	 * Load the required dependencies for this plugin.
	 */
	private function load_dependencies()
	{
		require_once plugin_dir_path(__FILE__) . 'includes/cmb2/init.php';
	}

	/**
	 * Register all of the hooks needed by the plugin.
	 */
	protected function registerHooks()
	{
		// Register custom post types
		add_action('init', [$this, 'registerCustomPosts']);

		// Register custom fields
		add_action('cmb2_admin_init', [$this, 'registerCustomFields']);

		// Register the title field placeholder replacement function for custom post types
		add_action('enter_title_here', [$this, 'replaceEnterTitleHere']);

		// Register CSS and JS
		add_action('wp_enqueue_scripts', [$this, 'registerScripts']);

		// Register shortcodes
		add_action('init', [$this, 'registerShortcodes']);
	}

	/**
	 * Register the CSS and JavaScript for the public-facing side of the site.
	 */
	public function registerScripts()
	{
		// Note: orgchart and personlist styles are only loaded when the shortcode is used
		wp_register_style('fontawesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', [], '4.7.0');
		wp_register_style('orgchart_plugin', $this->asset_url . '/css/orgchart.css', ['fontawesome'], $this->version, 'all');
		wp_register_style('orgchart_plugin_personlist', $this->asset_url . '/css/personlist.css', ['fontawesome'], $this->version);

		// Note: orgchart and personlist scripts are only loaded when the shortcode is used
		wp_register_script('es6-promise', $this->asset_url . '/js/es6-promise.auto.min.js', [], '4.1.0');
		wp_register_script('html2canvas', $this->asset_url . '/js/html2canvas.min.js', ['es6-promise'], '0.5.0-beta4');
		wp_register_script('jquery-orgchart', $this->asset_url . '/js/jquery.orgchart.js', ['jquery', 'html2canvas'], '1.3.6');
		wp_register_script('bootstrap-treeview', $this->asset_url . '/js/bootstrap-treeview.min.js', ['jquery']);
		wp_register_script('orgchart_plugin', $this->asset_url . '/js/orgchart.js', ['bootstrap-treeview', 'jquery-orgchart'], $this->version);
	}

	/**
	 * Register the filters and actions with WordPress.
	 */
	public function run()
	{
		$this->registerHooks();
	}

	/**
	 * Register Custom Post Types.
	 */
	public function registerCustomPosts()
	{
		foreach ($this->custom_posts as $custom_post) {
			$custom_post->register();
		}
	}

	/**
	 * Register Custom Fields.
	 */
	public function registerCustomFields()
	{
		foreach ($this->custom_posts as $custom_post) {
			$custom_post->registerFields();
		}
	}

	/**
	 * Register shortcodes
	 */
	public function registerShortcodes()
	{
		foreach ($this->shortcodes as $shortcode) {
			$shortcode->register();
		}
	}

	/**
	 * Replaces the 'Enter Title here' placeholder text in custom post type titles.
	 *
	 * To implement on a custom post, add an 'extras' => ['enter_title_here' => 'replacement text']
	 * key to the register_post_type() options array.
	 * 
	 * @param  string $message : default message
	 * @return string
	 */
	public function replaceEnterTitleHere($message)
	{
		$screen = get_current_screen();
		$post_type_object = get_post_type_object($screen->post_type);

		if (is_object($post_type_object) && property_exists($post_type_object, 'extras')) {
			$extras = $post_type_object->extras;

			if (is_array($extras) && array_key_exists('enter_title_here', $extras)) {
				return $extras['enter_title_here'];
			}
		}

		return $message;
	}

}
