'use strict';

require('dotenv').load({silent: true});

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    SERVER_IP: process.env.SERVER_IP || '127.0.0.1',
    SERVER_PORT: process.env.SERVER_PORT || 9000,
    THEME: process.env.THEME || 'zup',
    API_URL: process.env.API_URL,
    MAP_LAT: process.env.MAP_LAT,
    MAP_LNG: process.env.MAP_LNG,
    MAP_ZOOM: process.env.MAP_ZOOM,
    SENTRY_DSN: process.env.SENTRY_DSN,
    GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,
    FLOWS_ENABLED: process.env.FLOWS_ENABLED,
    DEFAULT_CITY: process.env.DEFAULT_CITY,
    DEFAULT_COUNTRY: process.env.DEFAULT_COUNTRY,
    DEFAULT_STATE: process.env.DEFAULT_STATE,
    ENV: process.env.ENV || process.env.NODE_ENV,

    // Project settings
    yeoman: {
      // configurable paths
      app: require('./bower.json').appPath || 'app',
      dist: 'dist'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      js: {
        files: [],
        tasks: [],
        options: {
          livereload: true
        }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test']
      },
      compass: {
        files: ['<%= yeoman.app %>/assets/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          //'<%= yeoman.app %>/{,*/}*.html',
          //'<%= yeoman.app %>/**/*.template.html',
          '.tmp/assets/styles/{,*/}*.css',
          '<%= yeoman.app %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        hostname: '<%= SERVER_IP %>',
        port: '<%= SERVER_PORT %>',
        livereload: 35729
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
        }
      },
      test: {
        options: {
          hostname: '<%= SERVER_IP %>',
          port: '<%= SERVER_PORT %>',
          base: '<%= yeoman.dist %>'
        }
      },
      dist: {
        options: {
          base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/**/*.route.js',
        '<%= yeoman.app %>/**/*.controller.js',
        '<%= yeoman.app %>/**/*.filter.js',
        '<%= yeoman.app %>/**/*.directive.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/assets/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/assets/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: '<%= yeoman.app %>/index.html'
      },
      options: {
        directory: '<%= yeoman.app %>/bower_components',
        ignorePath: '<%= yeoman.app %>/',
        exclude: [],
        overrides: {
          "bootstrap": {
            "main": [
              "dist/css/bootstrap.css"
            ]
          }
        }
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/assets/styles',
        cssDir: '.tmp/assets/styles',
        generatedImagesDir: '.tmp/assets/images/generated',
        imagesDir: '<%= yeoman.app %>/assets/images',
        javascriptsDir: '<%= yeoman.app %>/',
        fontsDir: '<%= yeoman.app %>/assets/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '/assets/images',
        httpGeneratedImagesPath: '/assets/images/generated',
        httpFontsPath: '/assets/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/assets/images/generated'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/**/*.route.js',
            '<%= yeoman.dist %>/**/*.controller.js',
            '<%= yeoman.dist %>/**/*.directive.js',
            '<%= yeoman.dist %>/**/*.filter.js',
            '!<%= yeoman.dist %>/config/main.constants.js',
            '<%= yeoman.dist %>/assets/styles/{,*/}*.css',
            '<%= yeoman.dist %>/assets/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '!<%= yeoman.dist %>/assets/images/icons/{,*/}*.{png,jpg,jpeg,gif,webp,svg}', // icons won't be modified
            '!<%= yeoman.dist %>/assets/images/logos/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/assets/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.app %>/index.html',
      options: {
        dest: '<%= yeoman.dist %>'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,*/}*.html', '<%= yeoman.dist %>/**/*.template.html'],
      css: ['<%= yeoman.dist %>/assets/styles/{,*/}*.css'],
      js: ['<%= yeoman.dist %>/**/*.route.js', '<%= yeoman.dist %>/**/*.controller.js', '<%= yeoman.dist %>/**/*.filter.js', '<%= yeoman.dist %>/**/*.directive.js'],
      options: {
        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/assets/images', '<%= yeoman.dist %>/assets/fonts'],
        patterns: {
          // FIXME While usemin won't have full support for revved files we have to put all references manually here
          js: [
            [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/assets/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', '**/*.template.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/assets/scripts',
          src: '*.js',
          dest: '.tmp/concat/assets/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            '**/*.template.html',
            'assets/images/**/*',
            'assets/fonts/*',
            'assets/scripts/*',
            'assets/documents/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/assets/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/assets/styles',
        dest: '.tmp/assets/styles/',
        src: '{,*/}*.css'
      }
    },

    ngconstant: {
      options: {
        name: 'config'
      },
      angularLocal: {
        options: {
          dest: '<%= yeoman.app %>/config/main.constants.js',
          space: '  ',
          wrap: '"use strict";\n\n {%= __ngModule %}',
          name: 'config'
        },
        constants: {
          ENV: {
            name: 'development',
            theme: '<%= THEME %>',
            apiEndpoint: '<%= API_URL %>',
            mapLat: '<%= MAP_LAT %>',
            mapLng: '<%= MAP_LNG %>',
            mapZoom: '<%= MAP_ZOOM %>',
            flowsEnabled: '<%= FLOWS_ENABLED %>',
            defaultCity: '<%= DEFAULT_CITY %>',
            defaultState: '<%= DEFAULT_STATE %>',
            defaultCountry: '<%= DEFAULT_COUNTRY %>'
          }
        }
      },

      angularBuild: {
        options: {
          dest: '<%= yeoman.dist %>/config/main.constants.js',
          space: '  ',
          wrap: '"use strict";\n\n {%= __ngModule %}',
          name: 'config'
        },
        constants: {
          ENV: {
            name: 'production',
            theme: '<%= THEME %>',
            apiEndpoint: '<%= API_URL %>',
            mapLat: '<%= MAP_LAT %>',
            mapLng: '<%= MAP_LNG %>',
            mapZoom: '<%= MAP_ZOOM %>',
            flowsEnabled: '<%= FLOWS_ENABLED %>'
          }
        }
      }
    },

    'string-replace': {
      dist: {
        files: {
          '<%= yeoman.dist %>/': '<%= yeoman.dist %>/index.html'
        },
        options: {
          replacements: [{
            pattern: /Raven\.config\(\'.+\', \{\}\)\.install\(\);/,
            replacement: 'Raven.config(\'<%= SENTRY_DSN %>\', {}).install();'
          }, {
            pattern: /gapi\.client\.setApiKey\(\'.+\'\);/,
            replacement: 'gapi.client.setApiKey(\'<%= GOOGLE_ANALYTICS %>\');'
          }]
        }
      }
    },

    protractor: {
      options: {
        configFile: "e2e-tests/protractor-conf.js",
        keepAlive: false,
        noColor: false
      },
      all: {}
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'compass:dist',
        'svgmin'
      ]
    }
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'wiredep',
      'ngconstant:angularLocal',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', [
    'build',
    'connect:test',
    'protractor'
  ]);

  grunt.registerTask('dist', [
    'connect:dist',
    'watch'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'ngconstant:angularBuild',
    'wiredep',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'string-replace',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
