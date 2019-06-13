<?php

namespace OrgChart\Shortcodes;

use OrgChart\PostTypes\Person;

class PersonList extends Shortcode
{
    /** @var string Shortcode name. */
    public $name = 're_person_list';

    /** @var array Default shortcode attributes. */
    public $default_attributes = [
        'tag'           => 'staff',         // CSV of person tags to find
        'class'         => 'person',        // CSS class to apply to each person
        'bio'           => true,            // Whether to show the content as a bio
        'header'        => true,            // Whether or not to show the header
        'columns'       => 1,               // Number of columns
        'mail_link'     => true,            // Whether the email should be a mailto link
        'list_class'    => 'person-list',   // CSS class to apply to the overall list
        'column_class'  => 'column',        // CSS class to apply to each column
        'image_size'    => 'thumbnail',     // The size of the featured image to load
    ];

    /** @var array Filters to apply to the shortcode attributes. */
    public $attribute_filters = [
        'bio'       => FILTER_VALIDATE_BOOLEAN,
        'mail_link' => FILTER_VALIDATE_BOOLEAN,
        'header'    => FILTER_VALIDATE_BOOLEAN,
        'columns'   => FILTER_VALIDATE_INT,
        'list_class'=> FILTER_SANITIZE_FULL_SPECIAL_CHARS,
    ];

    /**
     * Renders the Person List.
     * 
     * @return string
     */
    public function render()
    {
        $results = [];
        $this->person = new Person();
        set_query_var('person_options', $this->attributes); // pass $this->attributes as $person_options to the template

        $tags = explode(',', $this->attributes['tag']);
        foreach ($tags as $tag) {
            $loop = new \WP_Query([
                'post_type' => 'person',
                'tag'       => $tag,
                'nopaging'  => true,
                'orderby'   => ['menu_order' => 'ASC', 'title' => 'ASC'],
            ]);
            if ($loop->found_posts) {

                wp_enqueue_style('orgchart_plugin_personlist');

                // Show the header
                if ($this->attributes['header']) {
                    $results[] = "<h2 class='person-list-header'>" . ucwords(str_replace("_", " ", $tag)) . "</h2>";
                }

                while ($loop->have_posts()) {
                    $loop->the_post();
                    ob_start();

                    // If the theme has a template-parts/content-person.php file, use that to render the Person.
                    // Otherwise, use the default view partial included in this theme.
                    if (locate_template('template-parts/content-person.php')) {
                        get_template_part('template-parts/content', 'person');
                    } else {
                        $person_options = $this->attributes;
                        include(plugin_dir_path(dirname(__FILE__)) . 'Views/person-display.php');
                    }
                    $results[] = ob_get_clean();
                }
            } else {
                $results[] = $tag;
            }
            wp_reset_query();
        }

        $columns = $this->attributes['columns'];
        if ($columns > 1) {
            $column_class = $this->attributes['column_class'];
            $column_length = ceil(count($results) / $columns);
            $columnized_results = [];

            for ($column=0; $column < $columns; $column++) {
                $columnized_results = array_merge(
                    $columnized_results,
                    ["<div class='{$column_class}'>"],
                    array_slice($results, $column * $column_length, $column_length),
                    ["</div>"]
                );
            }

            $results = $columnized_results;
        }

        return "<div class=\"{$this->attributes['list_class']}\">" . implode('', $results) . '</div>';
    }
}