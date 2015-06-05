module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            app: {
                src: 'client/app.js',
                dest: 'server/public/assets/scripts/app.min.js'
            }
        },
        copy: {
            node_modules: {
                expand: true,
                cwd: "node_modules/",
                src: [
                    "angular/angular.min.js",
                    "angular/angular.min.js.map",
                    "angular/angular-csp.css",
                    "font-awesome/fonts/FontAwesome.otf",
                    "font-awesome/fonts/fontawesome-webfont.eot",
                    "font-awesome/fonts/fontawesome-webfont.svg",
                    "font-awesome/fonts/fontawesome-webfont.ttf",
                    "font-awesome/fonts/fontawesome-webfont.woff",
                    "font-awesome/fonts/fontawesome-webfont.woff2",
                    "font-awesome/css/font-awesome.min.css",
                    "font-awesome/css/font-awesome.css.map"
                ],
                dest: "server/public/vendor/"
            },
            css: {
                expand: true,
                cwd: "client/",
                src: [
                    "style.css"
                ],
                dest: "server/public/assets/css/"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify']);

};