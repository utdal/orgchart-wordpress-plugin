<?php

namespace OrgChart\Shortcodes;

use OrgChart\Models\Org;

class Orgchart extends Shortcode
{
    /** @var string Shortcode name. */
    public $name = 'orgchart';

    /** @var array Default shortcode attributes. */
    public $default_attributes = [
        'search'=> 'show',
        'graphical' => 'hide',
        'settings'  => 'hide',
        'customize' => 'hide',
        'startwith' => 'hide',
        'depth'     => 'hide',
        'color'     => 'hide',
        'contact'   => 'hide',
        'export'    => 'hide',
        'fullscreen'    => 'hide',
        'initialcontact'    => 'show',
        'initialdepth'  => 5,
        'tree'      => 'show',
        'scrolltop' => 'show',
        'expanded'  => '10',
        'tag'       => null,
        'linkto'    => null,
    ];

    /**
     * Renders the org chart shortcode.
     * 
     * @return string
     */
    public function render()
    {
        $public_dir = plugin_dir_path(dirname(__FILE__)) . 'public';
        $public_url = plugin_dir_url(dirname(__FILE__)) . 'public';
        $this->attributes['tag'] = $this->attributes['tag'] ? explode(',', $this->attributes['tag']) : [];

        $org = new Org([
            'tag_slug__in'  => $this->attributes['tag'],
            ], $this->attributes['linkto']);
        $people = $org->getPeople();
        $show_search = $this->attributes['search'] === 'show';
        $show_scrolltop = $this->attributes['scrolltop'] === 'show';
        $show_graphical = $this->attributes['graphical'] === 'show';
        $show_settings = $this->attributes['settings'] === 'show';
        $show_customize = $this->attributes['customize'] === 'show';
        $show_startwith = $this->attributes['startwith'] === 'show';
        $show_depth = $this->attributes['depth'] === 'show';
        $show_color = $this->attributes['color'] === 'show';
        $show_contact = $this->attributes['contact'] === 'show';
        $show_export = $this->attributes['export'] === 'show';
        $show_fullscreen = $this->attributes['fullscreen'] === 'show';
        $show_initialcontact = $this->attributes['initialcontact'] === 'show';
        $initial_depth = (int) $this->attributes['initialdepth'];
        $show_tree = $this->attributes['tree'] === 'show';
        $js_dependencies = ['jquery'];

        if ($show_graphical) {
            wp_enqueue_script('es6-promise', $public_url . '/js/es6-promise.auto.min.js', [], '4.1.0');
            wp_enqueue_script('html2canvas', $public_url . '/js/html2canvas.min.js', [], '0.5.0-beta4');
            wp_enqueue_script('jquery-orgchart', $public_url . '/js/jquery.orgchart.js', ['jquery', 'html2canvas'], '1.3.6');
            $js_dependencies[] = 'jquery-orgchart';
        }

        if ($show_tree) {
            wp_enqueue_script('bootstrap-treeview', $public_url . '/js/bootstrap-treeview.min.js', ['jquery']);
            $js_dependencies[] = 'bootstrap-treeview';
        }

        wp_register_script('orgchart', $public_url . '/js/orgchart.js', $js_dependencies, $this->version);
        wp_localize_script('orgchart', 'org_data', $people);
        wp_enqueue_script('orgchart');
        wp_enqueue_style('fontawesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css', [], '4.7.0');
        wp_enqueue_style('re_mods_orgchart', $public_url . '/css/re_mods-orgchart.css', [], $this->version, 'all' );

        ob_start();

        // include($public_dir . '/partials/re_mods-orgchart-display.php');
        include(plugin_dir_path(dirname(__FILE__)) . 'Views/re_mods-orgchart-display.php');

        return ob_get_clean();
    }
}