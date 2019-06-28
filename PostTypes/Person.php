<?php

namespace OrgChart\PostTypes;

class Person extends CustomPost
{
    /** @var string Plural name of this custom post type. */
    public $plural = 'People';

    /** @var array WordPress custom post type settings */
    public $settings = [
        'description'           => '',
        'public'                => false,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'capability_type'       => 'post',
        'map_meta_cap'          => true,
        'hierarchical'          => true,
        'rewrite'               => false,
        'query_var'             => false,
        'exclude_from_search'   => true,
        'publicly_queryable'    => false,
        'menu_icon'             => 'dashicons-id',
        'supports' => [
            'title',
            'editor',
            'revisions',
            'thumbnail',
            'page-attributes',
        ],
        'taxonomies' => ['post_tag'],
        'extras' => [
            'enter_title_here'  => "Enter person's name here.",
        ],
    ];

    /** @var array Custom field settings (CMB2) */
    public $custom_fields = [
        [
            'name'  => 'Title',
            'desc'  => 'Enter the person\'s title.',
            'id'    => '_person_title',
            'type'  => 'text',
            'column'=> [
                'position'  => 2,
                'name'      => 'Person Title',
            ],
        ],
        [
            'name'  => 'Department',
            'desc'  => 'Enter the person\'s department.',
            'id'    => '_person_department',
            'type'  => 'text',
            'column'=> [
                'position'  => 3,
                'name'      => 'Department',
            ],
        ],
        [
            'name'  => 'Show Department',
            'desc'  => 'Should we display the department?',
            'id'    => '_person_show_department',
            'type'  => 'checkbox',
        ],
        [
            'name'  => 'Secondary Title',
            'desc'  => 'Enter the person\'s secondary title.',
            'id'    => '_person_title2',
            'type'  => 'text',
        ],
        [
            'name'  => 'Secondary Department',
            'desc'  => 'Enter the person\'s secondary department.',
            'id'    => '_person_department2',
            'type'  => 'text',
        ],
        [
            'name'  => 'Email',
            'desc'  => 'Enter the person\'s email.',
            'id'    => '_person_email',
            'type'  => 'text',
        ],
        [
            'name'  => 'Phone',
            'desc'  => 'Enter the person\'s phone.',
            'id'    => '_person_phone',
            'type'  => 'text',
        ],
        [
            'name'  => 'Location',
            'desc'  => 'Enter the person\'s location.',
            'id'    => '_person_location',
            'type'  => 'text',
        ],
        [
            'name'  => 'Adjacent Employee',
            'desc'  => 'In the org chart, should this person be shown to the side of their supervisor? (e.g. an administrative assitant)',
            'id'    => '_person_adjacent',
            'type'  => 'checkbox',
        ],
        [
            'name'  => 'Hide Featured Image',
            'desc'  => 'In the org chart, don\'t show either the featured image or a placeholder image for this person.',
            'id'    => '_person_hide_headshot',
            'type'  => 'checkbox',
        ],
    ];

    /**
     * Virtual attribute to get an array of set titles.
     * 
     * @return array
     */
    public function getTitlesAttribute()
    {
        return $this->getNonEmptyFieldValues(['_person_title', '_person_title2']);
    }

    /**
     * Virtual attribute to get an array of set departments.
     * 
     * @return array
     */
    public function getDepartmentsAttribute()
    {
        return $this->getNonEmptyFieldValues(['_person_department', '_person_department2']);
    }

    /**
     * Virtual attribute to get an array of phone and location.
     * 
     * @return array
     */
    public function getPhoneAndLocationAttribute()
    {
        return $this->getNonEmptyFieldValues(['_person_phone', '_person_location']);
    }

}