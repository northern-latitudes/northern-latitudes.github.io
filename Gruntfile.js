module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      options: {
        sourceMap: true,
        includePaths: ['_sass',
          'bower_components/bootstrap-sass/assets/stylesheets',
          'bower_components/hint.css',
        ]
      },
      dist: {
        files: {
          'css/main.css': 'css/main.scss'
        }
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        sourceMap: true
      },
      build: {
        src: [
          'bower_components/waypoints/lib/jquery.waypoints.js',
          'assets/js/main.js'
        ],
        dest: 'assets/js/<%= pkg.name %>.min.js'
      }
    },
    minjson: {
      compile: {
        files: {
          // Minify one json file
          'assets/lcc.min.geojson': 'assets/lcc_1.geojson',
        }
      }
    },
    watch: {
      css: {
        files: '/**/*.scss',
        tasks: ['sass'],
        options: {
          livereload: true,
        },
      },
      scripts: {
        files: ['**/*.js'],
        //tasks: ['jshint'],
        options: {},
      },
    },
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-sass');

  // Default task(s).
  grunt.registerTask('default', ['sass', 'uglify', 'minjson']);

};
