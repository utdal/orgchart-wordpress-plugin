<?php

class OrgChartPlugin {

	/** @var OrgChartLoader Maintains and registers all hooks for the plugin. */
	protected $loader;

	/** @var string The string used to uniquely identify this plugin. */
	protected $plugin_name = 'orgchart';

	/** @var string The current version of the plugin. */
	protected $version;

	/**
	 * Define the core functionality of the plugin.
	 */
	public function __construct($version)
	{
		$this->version = $version;

		$this->load_dependencies();
		$this->define_hooks();
	}

	/**
	 * Load the required dependencies for this plugin.
	 */
	private function load_dependencies()
	{
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/OrgChartLoader.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/OrgChartAdmin.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/OrgChartPublic.php';
		require_once plugin_dir_path( dirname( __FILE__ ) ) . 'includes/cmb2/init.php';

		$this->loader = new OrgChartLoader();
	}

	/**
	 * Register all of the hooks needed by the plugin.
	 */
	private function define_hooks()
	{
		$plugin_admin = new OrgChartAdmin($this->plugin_name, $this->version);
		$plugin_public = new OrgChartPublic($this->plugin_name, $this->version);

		// Register custom post types
		$this->loader->add_action( 'init', $plugin_admin, 'registerCustomPosts');

		// Register custom fields
		$this->loader->add_action( 'cmb2_admin_init', $plugin_admin, 'registerCustomFields');

		// Register the title field placeholder replacement function for custom post types
		$this->loader->add_action( 'enter_title_here', $plugin_admin, 'replaceEnterTitleHere');

		$this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_styles');
		$this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_scripts');
		
		// Register shortcodes
		$this->loader->add_action('init', $plugin_public, 'registerShortcodes');
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 */
	public function run()
	{
		$this->loader->run();
	}

}
