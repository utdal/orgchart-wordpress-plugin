<?php

namespace OrgChart\Shortcodes;

use OrgChart\Models\Org;
use OrgChart\OrgChartPlugin;

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
        'settings_labels' => 'show',
        'avatar'    => 'show',
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
        $this->attributes['tag'] = $this->attributes['tag'] ? explode(',', $this->attributes['tag']) : [];
        $org = new Org([
            'tag_slug__in'  => $this->attributes['tag'],
            ], $this->attributes['linkto'], ($this->attributes['avatar'] === 'show'));
        $people = $org->getPeople();
        $show_search = $this->attributes['search'] === 'show';
        $show_scrolltop = $this->attributes['scrolltop'] === 'show';
        $show_graphical = $this->attributes['graphical'] === 'show';
        $show_settings = $this->attributes['settings'] === 'show';
        $show_customize = $this->attributes['customize'] === 'show';
        $show_startwith = $this->attributes['startwith'] === 'show';
        $show_depth = $this->attributes['depth'] === 'show';
        $show_color = $this->attributes['color'] === 'show';
        $show_settings_labels = $this->attributes['settings_labels'] === 'show';
        $show_contact = $this->attributes['contact'] === 'show';
        $show_export = $this->attributes['export'] === 'show';
        $show_avatar = $this->attributes['avatar'] === 'show';
        $show_fullscreen = $this->attributes['fullscreen'] === 'show';
        $show_initialcontact = $this->attributes['initialcontact'] === 'show';
        $initial_depth = (int) $this->attributes['initialdepth'];
        $show_tree = $this->attributes['tree'] === 'show';
        $js_dependencies = ['jquery'];

        if (!wp_script_is('orgchart_plugin', 'registered')) {
            (new OrgChartPlugin(\OrgChart\VERSION))->registerScripts();
        }

        wp_enqueue_script('orgchart_plugin');
        wp_enqueue_style('orgchart_plugin');

        wp_add_inline_script('orgchart_plugin', 'const org_data = ' . wp_json_encode($people) . ';', 'before');
        wp_add_inline_script('orgchart_plugin', 'const avatardata = ' . wp_json_encode(compact('show_avatar')) . ';', 'before');
        
        ob_start();
        include(plugin_dir_path(dirname(__FILE__)) . 'Views/orgchart-display.php');

        return ob_get_clean();
    }
}