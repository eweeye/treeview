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
                src: ['src/js/*.js'],
                dest: 'dist/js/eweeye-treeview.js'
            }
        },
        jshint: {
          beforeconcat: ['src/js/*.js'],
          afterconcat: ['dist/js/eweeye-treeview.js']
        },
        uglify: {
            dist: {
              files: {
                'dist/js/eweeye-treeview.min.js': ['src/js/*.js']
              }
            }
          }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['jshint:beforeconcat', 'concat:dist', 'jshint:afterconcat', 'uglify:dist']);
    grunt.registerTask('scrub', ['clean:dist']);

}