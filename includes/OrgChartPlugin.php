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
		$this->define_admin_hooks();
		$this->define_public_hooks();
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
	 * Register all of the hooks related to the admin area functionality
	 * of the plugin.
	 */
	private function define_admin_hooks()
	{
		$plugin_admin = new OrgChartAdmin( $this->get_plugin_name(), $this->get_version() );

		// Register custom post types
		$this->loader->add_action( 'init', $plugin_admin, 'registerCustomPosts');

		// Register custom fields
		$this->loader->add_action( 'cmb2_admin_init', $plugin_admin, 'registerCustomFields');

		// Register the title field placeholder replacement function for custom post types
		$this->loader->add_action( 'enter_title_here', $plugin_admin, 'replaceEnterTitleHere');
	}

	/**
	 * Register all of the hooks related to the public-facing functionality
	 * of the plugin.
	 */
	private function define_public_hooks()
	{
		$plugin_public = new OrgChartPublic( $this->get_plugin_name(), $this->get_version() );

		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_styles' );
		$this->loader->add_action( 'wp_enqueue_scripts', $plugin_public, 'enqueue_scripts' );
		
		// Register shortcodes
		$this->loader->add_action( 'init', $plugin_public, 'registerShortcodes');
	}

	/**
	 * Run the loader to execute all of the hooks with WordPress.
	 */
	public function run()
	{
		$this->loader->run();
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @return string The name of the plugin.
	 */
	public function get_plugin_name()
	{
		return $this->plugin_name;
	}

	/**
	 * The reference to the class that orchestrates the hooks with the plugin.
	 *
	 * @return OrgChartLoader Orchestrates the hooks of the plugin.
	 */
	public function get_loader()
	{
		return $this->loader;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @return string The version number of the plugin.
	 */
	public function get_version()
	{
		return $this->version;
	}

}
