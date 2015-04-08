# wp-grunt

Gruntfile for WP theme dev workflow

## Dependencies

This Gruntfile assumes the following things:

* You've got WP running & attached to your local database
* You're starting with the [_s blank theme](http://underscores.me)

This Gruntfile doesn't care about:

* Your local domain/url

To start using this Gruntfile, navigate to your theme directory in Terminal and run the following commands:

`npm install`

`bower install`

## Tasks

### `grunt init`

The `init` task runs find & replace on the theme's `style.css` file. It replaces `Theme URI: http://underscores.me/` with whatever URL you save in the `betterUrl` constant. *If you're not using _s, nothing happens.*

This command also inserts the `@import` directives for the Susy & Breakpoint Sass libraries. This is _s-dependent. If you use another theme, edit this section (lines 18-27) to find a string in your theme's primary `.scss` file and insert the imports there.

### `grunt watch`

The `watch` task (also accessible through `grunt` and `grunt serve`) watches & compiles Sass, runs Autoprefixer, lints JS files, and runs LiveReload.

### `grunt build`

The `build` task creates a streamlined deployable version of the theme. In a folder called `deploy` (which it creates), it generates a copy of the theme (same folder name) containing only the necessary files needed for actual usage. All CSS & JS files are minified, images are optimized, and node/bower/Grunt/Sass stuff is left out.