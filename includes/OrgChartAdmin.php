<?php

use OrgChart\PostTypes\Person as PersonCustomPost;

/**
 * The admin-specific functionality of the plugin.
 */
class OrgChartAdmin
{

	/** @var string The ID of this plugin. */
	private $plugin_name;

	/** @var string The current version of this plugin. */
	private $version;

	/** @var array Custom post types */
	private $custom_posts = [];

	/**
	 * Initialize the class and set its properties.
	 *
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{
		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->custom_posts[] = new PersonCustomPost();
	}

	/**
	 * Show a setting field
	 *
	 * @param array $args : ['label_for', 'description', 'type']
	 */
	public static function print_setting_field($args)
	{
	    $setting = array_key_exists('label_for', $args) ? $args['label_for'] : null;
	    if (array_key_exists('site_option', $args) && $args['site_option'] === true) {
	    	$value = get_site_option($setting);
	    } else {
	    	$value = get_option($setting);
	    }

	    if (array_key_exists('type', $args)) {
	        if ($args['type'] === 'textarea') {
	            echo "<textarea class='large-text code' rows='10' id='{$setting}' name='{$setting}'>{$value}</textarea>";
	        }
	        elseif ($args['type'] === 'text') {
	            echo "<input type='text' class='regular-text' id='{$setting}' name='{$setting}' value='{$value}'>";
	        }
	        elseif ($args['type'] === 'email') {
	            echo "<input type='email' class='regular-text' id='{$setting}' name='{$setting}' value='{$value}'>";
	        }
	    }

	    if (array_key_exists('description', $args)) {
	        echo "<p id='{$setting}_description' class='description'>{$args['description']}</p>";
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

}
