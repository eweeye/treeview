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
                src: ['src/js/eweeye.js', 'src/js/load.js'],
                dest: 'dist/js/eweeye-treeview.js'
            }
        },
        jshint: {
          beforeconcat: ['src/js/eweeye.js', 'src/js/load.js'],
          afterconcat: ['dist/js/eweeye-treeview.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    grunt.registerTask('default', ['jshint:beforeconcat', 'concat:dist', 'jshint:afterconcat']);
    grunt.registerTask('scrub', ['clean:dist']);

}