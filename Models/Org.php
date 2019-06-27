<?php

namespace OrgChart\Models;

class Org
{
    /** @var array arguments used to query for people */
    protected $query_config = [
        'post_type' => 'person',
        'nopaging' => true,
        'orderby' => ['menu_order' => 'ASC'],
    ];

    /** @var string common path to prefix before the Person slug when generating a link from each Person */
    protected $link_to_path = null;
    
    protected $avatar = true;

    /** @var array people in the org */
    public $people = [];

    /**
     * Org class constructor.
     */
    public function __construct(array $query_config = [], $link_to_path = null, $avatar = true)
    {
        $this->query_config = array_merge($this->query_config, $query_config);
        $this->link_to_path = $link_to_path;
        $this->avatar = $avatar;
        $this->addPeople();
        $this->organizePeople();
    }

    /**
     * Populate the organization with people from the 'person' post type
     *
     * @return void
     */
    protected function addPeople()
    {
        $people_posts = get_posts($this->query_config);

        foreach ($people_posts as $person_post) {
            $this->people[] = new Person($person_post, $this->link_to_path, $this->avatar);
        }
    }

    /**
     * Organize the people into a heirarchy
     * 
     * @return void
     */
    protected function organizePeople()
    {
        foreach ($this->people as $person) {
            $parent = $this->personWithId($person->parent);

            if ($parent) {
                $parent->addNode($person);
            }
        }
    }

    /**
     * Find a person in the Org with the given id
     * 
     * @param  int $id the ID to search for
     * @return Person|null
     */
    protected function personWithId($id)
    {
        foreach ($this->people as $person) {
            if ($person->id === $id) {
                return $person;
            }
        }

        return null;
    }

    /**
     * Determines if the person has no parent in this organization.
     * 
     * @param  Person $person
     * @return boolean
     */
    protected function personHasNoParentInOrg(Person $person)
    {
        return $this->personWithId($person->parent) === null;
    }

    /**
     * Get the people in the Org without heirarchy.
     * 
     * @return array
     */
    public function getUnorganizedPeople()
    {
        return $this->people;
    }

    /**
     * Get the people in the Org
     * 
     * @return array array of top-level people in the Org
     */
    public function getPeople()
    {
        $top_people = array_filter($this->people, function($person) {
            return $this->personHasNoParentInOrg($person);
        });

        return array_values($top_people);
    }
}