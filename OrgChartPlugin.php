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

		$this->custom_posts[] = new PersonCustomPost();
		$this->shortcodes[] = new PersonList($version);
		$this->shortcodes[] = new Orgchart($version);

		$this->load_dependencies();
		$this->define_hooks();
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
	private function define_hooks()
	{
		// Register custom post types
		$this->add_action('init', $this, 'registerCustomPosts');

		// Register custom fields
		$this->add_action('cmb2_admin_init', $this, 'registerCustomFields');

		// Register the title field placeholder replacement function for custom post types
		$this->add_action('enter_title_here', $this, 'replaceEnterTitleHere');

		$this->add_action('wp_enqueue_scripts', $this, 'enqueue_styles');
		$this->add_action('wp_enqueue_scripts', $this, 'enqueue_scripts');
		
		// Register shortcodes
		$this->add_action('init', $this, 'registerShortcodes');
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 */
	public function enqueue_styles()
	{

		// Note: orgchart and personlist styles are only loaded when the shortcode is used

		// wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/re_mods-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 */
	public function enqueue_scripts()
	{

		// Note: orgchart and personlist scripts are only loaded when the shortcode is used

		// wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/re_mods-public.js', array( 'jquery' ), $this->version, false );

	}

	/**
	 * Add a new action to the collection to be registered with WordPress.
	 *
	 * @param string  $hook           The name of the WordPress action that is being registered.
	 * @param object  $component      A reference to the instance of the object on which the action is defined.
	 * @param string  $callback       The name of the function definition on the $component.
	 * @param int     $priority       Optional. he priority at which the function should be fired. Default is 10.
	 * @param int     $accepted_args  Optional. The number of arguments that should be passed to the $callback. Default is 1.
	 */
	public function add_action($hook, $component, $callback, $priority = 10, $accepted_args = 1)
	{
		$this->actions[] = compact('hook', 'component', 'callback', 'priority', 'accepted_args');
	}

	/**
	 * Add a new filter to the collection to be registered with WordPress.
	 *
	 * @param string  $hook           The name of the WordPress filter that is being registered.
	 * @param object  $component      A reference to the instance of the object on which the filter is defined.
	 * @param string  $callback       The name of the function definition on the $component.
	 * @param int     $priority       Optional. he priority at which the function should be fired. Default is 10.
	 * @param int     $accepted_args  Optional. The number of arguments that should be passed to the $callback. Default is 1
	 */
	public function add_filter($hook, $component, $callback, $priority = 10, $accepted_args = 1)
	{
		$this->filters[] = compact('hook', 'component', 'callback', 'priority', 'accepted_args');
	}

	/**
	 * Register the filters and actions with WordPress.
	 */
	public function run()
	{
		foreach ($this->filters as $hook) {
			add_filter($hook['hook'], [$hook['component'], $hook['callback']], $hook['priority'], $hook['accepted_args']);
		}

		foreach ($this->actions as $hook) {
			add_action($hook['hook'], [$hook['component'], $hook['callback']], $hook['priority'], $hook['accepted_args']);
		}
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
