'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    betterUrl: 'http://yourdomain.com',
    pkg: grunt.file.readJSON('package.json'),

    replace: {
      dist: {
        options: {
          usePrefix: false,
          patterns: [
            {
              match: 'Theme URI: http://underscores.me/',
              replacement: 'Theme URI: <%= betterUrl %>'
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
            cwd: 'sass',
            src: 'style.scss',
            dest: 'sass'
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
      main: ['deploy']
    },

    copy: {
      main: {
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

  grunt.registerTask('serve', function (target) {
    grunt.task.run([
      'watch'
    ]);
  });


  grunt.registerTask('init', ['replace']);
  grunt.registerTask('default', ['serve']);
  grunt.registerTask('build', [
    'sass:dist',
    'autoprefixer',
    'clean',
    'copy',
    'uglify',
    'csscomb',
    'cssmin',
    'imageoptim'
  ]);


};