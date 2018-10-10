<?php

use OrgChart\PostTypes\Person as PersonCustomPost;
use OrgChart\Shortcodes\Orgchart;
use OrgChart\Shortcodes\PersonList;

class OrgChartPlugin {

	/** @var OrgChartLoader Maintains and registers all hooks for the plugin. */
	protected $loader;

	/** @var string The string used to uniquely identify this plugin. */
	protected $plugin_name = 'orgchart';

	/** @var string The current version of the plugin. */
	protected $version;

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
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/OrgChartLoader.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/cmb2/init.php';

		$this->loader = new OrgChartLoader();
	}

	/**
	 * Register all of the hooks needed by the plugin.
	 */
	private function define_hooks()
	{
		// Register custom post types
		$this->loader->add_action( 'init', $this, 'registerCustomPosts');

		// Register custom fields
		$this->loader->add_action( 'cmb2_admin_init', $this, 'registerCustomFields');

		// Register the title field placeholder replacement function for custom post types
		$this->loader->add_action( 'enter_title_here', $this, 'replaceEnterTitleHere');

		$this->loader->add_action('wp_enqueue_scripts', $this, 'enqueue_styles');
		$this->loader->add_action('wp_enqueue_scripts', $this, 'enqueue_scripts');
		
		// Register shortcodes
		$this->loader->add_action('init', $this, 'registerShortcodes');
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 */
	public function run()
	{
		$this->loader->run();
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
