'use strict';

var themeName = 'Theme Name',
    themeUri = 'http://themeuri.com',
    author = 'Author Name',
    authorUri = 'http://yourdomain.com',
    themeSlug = 'theme_slug',
    themeColor = '000000',
    sanitizedSlug = themeSlug.replace(/[^a-z0-9_]+/ig,'_'),
    imageName = themeName.replace(/\s/gi,'+');

module.exports = function(grunt) {
  grunt.initConfig({
    themeName: themeName,
    themeUri: themeUri,
    author: author,
    authorUri: authorUri,
    sanitizedSlug: sanitizedSlug,
    imageName: imageName,
    themeColor: themeColor,
    themeDir: (__dirname.split('/').pop()),
    pkg: grunt.file.readJSON('package.json'),

    shell: {
      target: {
        command: [
          'git clone https://github.com/Automattic/_s.git',
          'git clone git@hawk.tip.com:wordpress/boilerplate-sass.git'
        ]
      }
    },

    curl: {
      screenshot: {
        src: 'http://placehold.it/1200x900/<%= themeColor %>/fff/&text=<%=  imageName %>',
        dest: 'screenshot.png'
      }
    },

    replace: {
      slug: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: '\'_s\'',
              replacement: '\'<%= sanitizedSlug %>\''
            },
            {
              match: '_s_',
              replacement: '<%= sanitizedSlug %>_'
            },
            {
              match: ' _s',
              replacement: ' <%= sanitizedSlug %>'
            },
            {
              match: '_s-',
              replacement: '<%= sanitizedSlug %>-'
            },
            {
              match: 'initial-scale=1">',
              replacement: 'initial-scale=1">\n<meta name="theme-color" value="#<%= themeColor %>">'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: '.',
            src: [
              '*.{php,md,css}',
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
              match: 'Theme Name: _s',
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
              match: 'Text Domain: _s',
              replacement: 'Text Domain: <%= sanitizedSlug %>'
            },
            {
              match: '/*\nTheme Name',
              replacement: '/*!\nTheme Name'
            },
            {
              match: '@import "normalize";',
              replacement: '@import "normalize";\n@import "boilerplate/boilerplate";\n@import "../bower_components/susy/sass/susy";\n@import "../bower_components/breakpoint-sass/stylesheets/breakpoint";\n'
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
      },
      footer: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: 'Automattic',
              replacement: '<%= author %>'
            },
            {
              match: 'http://automattic.com/',
              replacement: '<%= authorUri %>'
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: '.',
            src: 'footer.php'
          }
        ]
      },
      cssMap: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: /\/\*\#\ssourceMappingURL.+\*\//gi,
              replacement: ''
            }
          ]
        },
        files: [
          {
            expand: true,
            cwd: 'deploy/<%= themeDir %>',
            src: 'style.css',
            dest: 'deploy/<%= themeDir %>'
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
            expand: true,
            cwd: 'sass',
            src: ['**/style.scss'],
            dest: '.',
            ext: '.css'
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
            expand: true,
            cwd: 'sass',
            src: ['**/style.scss'],
            dest: '.',
            ext: '.css'
          }
        ]
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          'last 3 versions'
        ],
        map: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '.',
            src: ['*.css'],
            dest: '.',
            ext: '.css'
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
      pre: ['_s','boilerplate-sass','.git','.gitignore'],
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
              '!*.md',
              '!codesniffer.*',
              '!wpcom.*'
            ],
            dest: '.'
          },
          {
            expand: true,
            cwd: 'boilerplate-sass',
            src: '**/*.*',
            dest: 'sass'
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
            dest: 'deploy/<%= themeDir %>'
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
      dist: {
        files: [
          {
            expand: true,
            cwd: 'deploy',
            src: '**/*.svg'
          }
        ]
      }
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
          archive: 'deploy/<%= themeDir %>.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'deploy/<%= themeDir %>',
            src: '**/*.*'
          }
        ]
      }
    }
  });

  // Load these required NPM tasks:
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-csscomb');
  grunt.loadNpmTasks('grunt-curl');
  grunt.loadNpmTasks('grunt-imageoptim');
  grunt.loadNpmTasks('grunt-svgmin');
  grunt.loadNpmTasks('grunt-replace');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-svgmin');

  grunt.registerTask('serve', function (target) {
    grunt.task.run(['watch']);
  });

  grunt.registerTask('init', [
    'shell',
    'copy:pre',
    'clean:pre',
    'replace:slug',
    'replace:scss',
    'curl:screenshot'
  ]);
  grunt.registerTask('default', [
    'clean:post',
    'serve'
  ]);
  grunt.registerTask('build', [
    'sass:dist',
    'autoprefixer',
    'clean:post',
    'copy:post',
    'uglify',
    'csscomb',
    'cssmin',
    'imageoptim',
    'svgmin',
    'replace:cssMap',
    'compress'
  ]);
};
