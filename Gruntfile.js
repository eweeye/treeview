const { loadNpmTasks } = require("grunt");

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            dist: ['dist']
        },
        concat: {
            options: {
                separator: '\n',
            },
            dist: {
                src: [
                  'src/js/eweeye.js', 
                  'src/js/constants.js',
                  'src/js/node.js', 
                  'src/js/treeview.js',
                  'src/js/clicknode.js',
                  'src/js/loadtree.js'],
                dest: 'dist/js/eweeye-treeview.js'
            }
        },
        cssmin: {
          options: {
            mergeIntoShorthands: false,
            roundingPrecision: -1
          },
          target: {
            files: [{
              expand: true,
              cwd: 'src/css',
              src: ['*.css', '!*.min.css'],
              dest: 'dist/css',
              ext: '.min.css'
            }]
          }
        },
        jshint: {
          beforeconcat: ['src/js/*.js'],
          afterconcat: ['dist/js/eweeye-treeview.js']
        },
        uglify: {
            dist: {
              files: {
                'dist/js/eweeye-treeview.min.js': [
                  'src/js/eweeye.js',
                  'src/js/constants.js',
                  'src/js/node.js', 
                  'src/js/treeview.js',
                  'src/js/clicknode.js']
              }
            }
          }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint:beforeconcat', 'concat:dist', 'jshint:afterconcat', 'uglify:dist', 'cssmin']);
    grunt.registerTask('scrub', ['clean:dist']);

}