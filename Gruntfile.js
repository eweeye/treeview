const { loadNpmTasks } = require("grunt");

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';\n',
            },
            dist: {
                src: ['src/js/eweeye.js', 'src/js/load.js'],
                dest: 'dist/js/eweeye-treeview.js'
            }
        }
    });

 grunt.loadNpmTasks('grunt-contrib-concat');

 grunt.registerTask('default', ['concat:dist']);

}