<?php

use OrgChart\Shortcodes\Orgchart;
use OrgChart\Shortcodes\PersonList;

class OrgChartPublic
{

	/** @var string The ID of this plugin. */
	private $plugin_name;

	/** @var string The current version of this plugin. */
	private $version;

	/** @var array Shortcodes */
	private $shortcodes = [];

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->shortcodes[] = new PersonList($version);
		$this->shortcodes[] = new Orgchart($version);
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 */
	public function enqueue_styles() {

		// Note: orgchart and personlist styles are only loaded when the shortcode is used

		// wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/re_mods-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 */
	public function enqueue_scripts() {

		// Note: orgchart and personlist scripts are only loaded when the shortcode is used

		// wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/re_mods-public.js', array( 'jquery' ), $this->version, false );

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

}
