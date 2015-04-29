module.exports = function (grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);

  var config = {
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['Gruntfile.js', 'src/*.js', 'test/*.js'],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    watch: {
      options: {
        livereload: true,
      },
      html: {
        files: ['test/*.html'],
        tasks: [],
        options: {
          spawn: false
        }
      },
      js: {
        files: ['<%= jshint.files %>'],
        tasks: ['jshint'],
        options: {
          spawn: false
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: '',
          hostname: '*'
        }
      }
    },
  };

  grunt.initConfig(config);

  // refresh package information
  grunt.registerTask('refresh', function() {
    grunt.config.set('pkg', grunt.file.readJSON('package.json'));
  });

  grunt.event.on('watch', function(action, filepath, target) {
    grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
  });

  grunt.registerTask('dev', ['connect', 'watch']);
  grunt.registerTask('test', ['jshint']);
  grunt.registerTask('deploy', []);
};