var grunt = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*!<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                mangle: false
            },
            build: {
                src: 'dist/final.js',
                dest: 'public/js/final.js'
            }
        },
        concat:{
            options: {
                banner: '/*!<%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> \n*/'
            },
            build:{
                src: ['lib/config.js','lib/services/*.js', 'lib/indexController.js'],
                dest: 'public/js/final.js'
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.registerTask('default', ['concat']);
    
}

module.exports = grunt;
