# Org Chart Plugin

A WordPress plugin for managing people and generating directories and org charts.

# Features

- Manage organization people and hierarchy via Person custom post type 
	- Org Chart via shortcode
	- Directory via shortcode
	- Person list shortcode

# Installation

This plugin can be installed normally just like any other WordPress plugin. Alternatively, you can also install it with Composer.

### Regular Install

- Download the repository as a zip archive, and place it in your WordPress plugins folder.
- Activate the plugin in the admin panel

### Composer Install

If you're managing your plugins with [Composer](https://getcomposer.org), this plugin can be installed with something like the following in your `composer.json` file:

```json
{
  "repositories": [
    {
      "url": "git@github.com:utdallasresearch/orgchart-wordpress-plugin.git",
      "type": "git"
    }
  ],
  "require": {
    "composer/installers": "^1.3.0",
    "utdallasresearch/orgchart-wordpress-plugin": "dev-master"
  },
  "extra": {
    "installer­paths" : {
      "wp-content/plugins/{$name}/" : ["type:wordpress­-plugin"]
    }
  }
}

```

# Usage

## Managing People

- A Person can be added just like any other content item in WordPress. There is a Person custom post type that should show up in the sidebar of the admin area.
- You should add at least one tag to each person. Tags are used in the `[person_list]` shortcode to display a list of people by tag.
- Organization hierarchy can be created by setting each Person's parent item.
- If you want an organizational group to be displayed on the org chart (see below), create the group as a Person, entering the name of the group as the name of the Person and leaving all other fields blank. Then, set this as the parent item for all other People in that group.

## Org Charts

To display an organizational chart of the People, enter the following shortcode on a Page:

```
[orgchart tree="hide" graphical="show" search="hide"]
```

Shortcode attributes: (same as the directory below)

## Directory Trees

To display a hierarchical directory of People, enter the following shortcode on a Page:

```
[orgchart linkto="/orgchart"]
```

Shortcode Attributes:

| Option        | Default  | Description |
| ------------- | -------- | ----------- |
| search=         | "show"   | Show a search box at the top. |
| tree=           | "show"   | Show the directory tree |
| graphical=      | "hide"   | Show the graphical org chart |
| settings=       | "hide"   | Show action panel for graphical org chart|
| customize=      | "hide"   | Show customize button for graphical org chart|
| startwith=      | "hide"   | Show root node selector for graphical org chart|
| depth=          | "hide"   | Show depth selector for graphical org chart|
| color=          | "hide"   | Show color selector control for graphical org chart|
| contact=        | "hide"   | Show a button to toggle contact information on individual nodes for graphical org chart|
| export=         | "hide"   | Show a button to export graphical org chart|
| fullscreen=     | "hide"   | Show icon to view full screen for graphical org chart|
| initialcontact= | "show"   | Show contact information for each node for graphical org chart|
| iniitaldepth=   | 5        | The depth at which nodes will switch to vertical layout for graphical org chart. Range is 2-15.|
| scrolltop=      | "show"   | Show a button to scroll to the top of the page. |
| expanded=       | "10"     | In directory tree, how many levels to expand by default. |
| tag=            | ""       | Only include People with the specified tag. (Useful for showing departments.) |
| linkto=         | ""       | In directory tree, this specifies the path to the page with the graphical orgchart (if they're on different pages). |
| avatar=         | "show"   | If enabled, displays a featured image of the person OR a generic placeholder image |

## Person Lists

To display a panel-formatted list of people with certain tags, enter the following shortcode on a Page:

```
[person_list tag="tag1,tag2"]
```

Shortcode Attributes:

| Option        | Default  | Description |
| ------------- | -------- | ----------- |
| tag=          | "staff"  | A comma-separated list of People tags to include in the list. Only People with these tags will show up in the list. |
| list_class=   | "person-list" | The CSS class(es) to apply to the list container div |
| class=        | "person" | The CSS class(es) to apply to each person div. |
| bio=          | "true"   | Show the Person's bio. The bio is the contents of the wysiwyg editor of the Person. |
| header=       | "true"   | Displays each tag as a header for the list of people with that tag. |
| columns=      | "1"      | Divide the people into this many columns. Each column is wrapped in a div. |
| column_class= | "column" | The class to apply to each column div. Only used if columns > 1. |
| mail-link=    | "true"   | Whether to make the email a `mailto:` link |

# Customizing for Your Theme

## DOM

You can customize the template used to display each person with the `[person_list]` shortcode. To do so, copy the file from this plugin `Views/person-display.php` to a file in your theme named `template-parts/content-person.php` and then modify that file.

## CSS

Recommended: You can override any of this plugin's CSS classes on your theme. Note that shortcode CSS is only loaded on pages that use that shortcode.

Or you can modify this plugin's CSS directly. They are located in the `public/css` folder. This is not recommended, however, because your changes will get overwritten if you download a newer version of this plugin.

# Contributing

## Sass

This plugin's CSS is compiled from Sass. The Sass files are in the `public/css/source` folder.

Prerequisites:

- [npm/nodejs](https://docs.npmjs.com/getting-started/installing-node)
- [yarn](https://yarnpkg.com/en/docs/install)

Then, from the root of the plugin folder, install all the project dependencies with `yarn install`.

This should install the Laravel Mix Webpack task-runner. To compile the Sass, from the root of the plugin folder, run `yarn dev`. If you'd like to have it auto-compile while you're working instead, run `yarn watch`.

## Updating JS libraries

- Install the prerequisites listed under the Sass section.
- Edit the `packages.json` file and change any versions you would like to change.
- Run `yarn upgrade` to download the updated versions.
- Run `gulp copy` to copy the JS library files to their proper locations within the plugin.
