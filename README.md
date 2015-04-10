# wp-grunt

Gruntfile for WP theme dev workflow

## Dependencies

This Gruntfile assumes the following things:

* You've got WP running & attached to your local database
* You want  to use the [_s blank theme](http://underscores.me)

This Gruntfile doesn't care about:

* Your local domain/url
* How you plan to deploy (git, FTP, rsync: that's on you, nothing here for that)

To start using this Gruntfile, navigate to your theme directory in Terminal and run the following commands. *(Replace `[repo url]` with the URL for this repo and `theme-name` with the name you want your theme folder to have.)*

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
    authorUri = 'http://yourdomain.com',
    themeSlug = 'theme_slug',
    themeColor = '000000',
    sanitizedSlug = themeSlug.replace(/[^a-z0-9_]+/ig,'_'),
    imageName = themeName.replace(/\s/gi,'+');
```

*Note: don't edit the `sanitizedSlug` or `imageName` values.*

Once you've set your values for `themeName`, `themeUri`, `author`, `authorUri`, `themeSlug`, and `themeColor`, proceed to the following tasks.

## Tasks

### `grunt init`

Run this task once when you begin the project. The `init` task first clones the files from the _s theme into your working directory (this Gruntfile should be running in `wp-content/themes/your-theme-folder/`), and runs find & replace on the theme's Text Domain slug.

The `init` task uses [placehold.it](http://placehold.it) to create `screenshot.png` based on the `themeName` and `themeColor` variables.

This task also inserts the `@import` directives for the Susy & Breakpoint Sass libraries. (The files for those libraries are already locally available after you ran `bower install`).

### `grunt watch`

The `watch` task (also accessible through `grunt` and `grunt serve`) watches & compiles Sass, runs Autoprefixer, lints JS files, and runs LiveReload.

### `grunt build`

The `build` task creates a streamlined deployable version of the theme. In a folder called `deploy` (which it creates), this task generates a copy of the theme (same folder name) containing only the necessary files needed for the theme itself. All CSS & JS files are minified, images are optimized, and node/bower/Grunt/Sass files are left out. It also creates a `.zip` copy of the theme for easier upload / transfer.

## Path Forward

There are probably some dependencies in package.json that are never referenced, as well as some Grunt tasks that are poorly written. If you can optimize things like that, please file an issue or create a pull request.