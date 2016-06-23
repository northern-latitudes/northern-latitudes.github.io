module.exports = function (grunt) {

  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jekyll_config: grunt.file.readYAML('_config.yml'),
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
          'assets/css/main.css': 'css/main.scss'
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
        files: [
          './css/**/*.scss',
          './_sass/**/*.scss',
        ],
        tasks: ['sass','jekyll'],
        options: {
          livereload: true,
        },
      },
      scripts: {
        files: ['./assets/**/*.js'],
        tasks: ['uglify', 'jekyll'],
        options: {},
      },
      html: {
        files: [
          './_includes/**/*.html',
          './_layouts/**/*.html',
          './_posts/**/*.html',
          './_posts/**/*.md',
          './*.html',
          './*.md'
        ],
        tasks: ['default'],
        options: {},
      },
      data: {
        files: [
          './_data/**/*.yml',
        ],
        tasks: ['jekyll'],
        options: {},
      },
    },
    jekyll: { // Task
      options: { // Universal options
        bundleExec: true,
        //src: '<%= app %>'
      },
      dist: { // Target
        options: { // Target options
          //dest: '<%= dist %>',
          config: '_config.yml'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  //grunt.loadNpmTasks('grunt-sass');

  //Generate index files for Jekyll categories
  grunt.registerTask('category', 'Generate category indexes.', function() {
    var jekyll = grunt.config('jekyll_config');
    var cats = jekyll.prose.metadata._posts.find(function(itm) {
      return itm.name === 'category';
    });
    var template = grunt.file.read('_category_idx_template.md');

    if(grunt.file.isDir('categories')) {
      grunt.file.delete('categories');
    }

    cats.field.options.forEach(function(itm) {
      var data = {
        title: itm.name,
        link: itm.value,
        icon: itm.icon,
        description: itm.description,
        resource: itm.resource ? true : false
      };
      content = grunt.template.process(template, {
         data: data
       });
       grunt.file.write('./categories/' + itm.value + '.md', content);
       grunt.log.writeln('Created the "'+ itm.value +'" category.');
    });
  });

  // Default task(s).
  grunt.registerTask('default', ['category','sass', 'uglify', 'minjson']);

};
