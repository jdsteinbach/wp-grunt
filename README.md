# wp-grunt

Gruntfile for WP theme dev workflow

## Dependencies

This Gruntfile assumes the following things:

* You've got WP running & attached to your local database
* You want  to use the [_s blank theme](http://underscores.me)

This Gruntfile doesn't care about:

* Your local domain/url
* How you plan to deploy (git, FTP, rsync: that's on you, nothing here for that)

To start using this Gruntfile, navigate to your theme directory in Terminal and run the following commands. *(Replace `theme-name` with the name you want your theme folder to have.)*

```
git clone [repo URL] theme-name
cd theme-name
npm install
bower install
```

Once you've run those commands, edit the block of variables at the top of `Gruntfile.js`:

```
var themeName = 'Theme Name',
    themeUri = 'http://themeuri.com',
    author = 'Author Name',
    authorUri = 'http://authoruri.com',
    themeSlug = 'theme_slug',
    sanitizedSlug = themeSlug.replace(/[^a-z0-9_]+/ig,'_');
```

*Note: don't edit the `sanitizedSlug` value.*

Once you've put your values for `themeName`, `themeUri`, `author`, `authorUri`, and `themeSlug`, proceed to the following tasks.

## Tasks

### `grunt init`

Run this task once when you begin the project. The `init` task first clones the files from the _s theme into your working directory (this Gruntfile should be running in `wp-content/themes/your-theme-folder/`), and runs find & replace on the theme's Text Domain slug.

This command also inserts the `@import` directives for the Susy & Breakpoint Sass libraries. (The files for those libraries are already locally available after you ran `bower install`).

### `grunt watch`

The `watch` task (also accessible through `grunt` and `grunt serve`) watches & compiles Sass, runs Autoprefixer, lints JS files, and runs LiveReload.

### `grunt build`

The `build` task creates a streamlined deployable version of the theme. In a folder called `deploy` (which it creates), it generates a copy of the theme (same folder name) containing only the necessary files needed for actual usage. All CSS & JS files are minified, images are optimized, and node/bower/Grunt/Sass stuff is left out. It also creates a `.zip` copy of the theme for easier upload / transfer.