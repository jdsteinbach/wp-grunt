'use strict';

var themeName = 'Theme Name',
    themeUri = 'http://themeuri.com',
    author = 'Author Name',
    authorUri = 'http://yourdomain.com',
    themeSlug = 'tip-theme',
    sanitizedSlug = themeSlug.replace(/[^a-z0-9_]+/ig,'_');

module.exports = function(grunt) {
  grunt.initConfig({
    themeName: themeName,
    themeUri: themeUri,
    author: author,
    authorUri: authorUri,
    sanitizedSlug: sanitizedSlug,
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      target: {
        command: 'git clone https://github.com/Automattic/_s.git'
      }
    },
    replace: {
      slug: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: '\`_s\'',
              replacement: '\'<%= sanitizedSlug %>\''
            },
            {
              match: 'tip_theme_',
              replacement: '<%= sanitizedSlug %>_'
            },
            {
              match: ' tip_theme',
              replacement: ' <%= sanitizedSlug %>'
            },
            {
              match: 'tip_theme-',
              replacement: '<%= sanitizedSlug %>-'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: '.',
            src: [
              '*.*',
              '{inc,js,languages,layouts}/**/*.*'
            ],
            dest: '.'
          }
        ]
      },
      scss: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: 'Theme Name: tip_theme',
              replacement: 'Theme Name: <%= themeName %>'
            },
            {
              match: 'Theme URI: http://underscores.me/',
              replacement: 'Theme URI: <%= themeUri %>'
            },
            {
              match: 'Author: Automattic',
              replacement: 'Author: <%= author %>'
            },
            {
              match: 'Author URI: http://automattic.com/',
              replacement: 'Author URI: <%= authorUri %>'
            },
            {
              match: 'Text Domain: tip_theme',
              replacement: 'Text Domain: <%= sanitizedSlug %>'
            },
            {
              match: '@import "normalize";',
              replacement: '@import "normalize";\n@import "../bower_components/susy/sass/susy";\n@import "../bower_components/breakpoint-sass/stylesheets/breakpoint";'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: '.',
            src: ['style.*', 'sass/style.*']
          }
        ]
      }
    },

    sass: {
      dev: {
        options: {
          sourceMap: true,
          outputStyle: 'expanded',
          require: 'susy'
        },
        files: [
          {
            expand: true, // Recursive
            cwd: "sass", // The startup directory
            src: ["**/style.scss"], // Source files
            dest: ".", // Destination
            ext: ".css" // File extension
          }
        ]
      },
      dist: {
        options: {
          sourceMap: false,
          outputStyle: 'compressed',
          require: 'susy'
        },
        files: [
          {
            expand: true, // Recursive
            cwd: "sass", // The startup directory
            src: ["**/style.scss"], // Source files
            dest: ".", // Destination
            ext: ".css" // File extension
          }
        ]
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'last 3 versions'
        ],
        map: true // Update source map (creates one if it can't find an existing map)
      },
      dist: {
        files: [
          {
            expand: true, // Recursive
            cwd: ".", // The startup directory
            src: ["*.css"], // Source files
            dest: ".", // Destination
            ext: ".css" // File extension
          }
        ]
      }
    },

    csscomb: {
      options: {
        config: 'csscomb.json'
      },
      server: {
        files: {
          'deploy/style.css': ['deploy/style.css'],
        }
      },
    },

    cssmin: {
      server: {
        files: [{
          expand: true,
          cwd: 'deploy',
          src: 'style.css',
          dest: 'deploy',
          ext: '.css'
        }]
      }
    },

    jshint: {
      options: {
        node: true,
        reporter: require('jshint-stylish')
      },
      all: ['js/**/*.js'],
    },

    watch: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      scss: {
        files: '**/*.scss',
        tasks: ['sass:dev', 'autoprefixer']
      },
      jshint: {
        files: 'js/**/*.js',
        tasks: ['jshint']
      },
      livereload: {
        files: [
          '{,*/}*.html',
          '{,*/}*.php',
          'js/{,*/}*.js',
          'css/{,*/}*.css',
          'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      },
    },

    clean: {
      pre: ['_s'],
      post: ['deploy']

    },

    copy: {
      pre: {
        files: [
          {
            expand: true,
            cwd: '_s',
            src: [
              '**/*.*',
              '!.{*}',
              '!CONTRIBUTING.*',
              '!codesniffer.*',
              '!wpcom.*'
            ],
            dest: '.'
          }
        ]
      },
      post: {
        files: [
          {
            expand: true,
            src: [
              '**/*.*',
              '!**/*.map',
              '!sass/**/*.*',
              '!node_modules/**/*.*',
              '!bower_components/**/*.*',
              '!{package,bower,csscomb}.json',
              '!Gruntfile.js'
            ],
            dest: 'deploy/'+(__dirname.split('/').pop())
          }
        ]
      }
    },

    imageoptim: {
      options: {
        imageAlpha: true
      },
      src: ['deploy/**/*.{jpg,jpeg,png,gif}']
    },

    svgmin: {
      files: [
        {
          cwd: 'deploy',
          src: '**/*.svg',
          dest: 'deploy'
        }
      ]
    },

    uglify: {
      dist: {
        files: [
          {
            expand: true,
            cwd: 'deploy/js',
            dest: 'deploy/js',
            src: '*.js'
          }
        ]
      }
    },

    compress: {
      main: {
        options: {
          archive: 'deploy/'+(__dirname.split('/').pop())+'.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'deploy/'+(__dirname.split('/').pop()),
            src: '**/*.*'
          }
        ]
      }
    }
  });

  // Load these required NPM tasks:
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-phplint');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'watch'
    ]);
  });


  grunt.registerTask('init', [
    'shell',
    'copy:pre',
    'clean:pre',
    'replace:slug',
    'replace:scss'
  ]);
  grunt.registerTask('default', ['serve']);
  grunt.registerTask('build', [
    'sass:dist',
    'autoprefixer',
    'clean:post',
    'copy:post',
    'uglify',
    'csscomb',
    'cssmin',
    'imageoptim'
  ]);


};