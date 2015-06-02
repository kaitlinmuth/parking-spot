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
            },
            geolocate: {
                src: 'client/geolocate.js',
                dest: 'server/public/assets/scripts/geolocate.min.js'
            }
        },
        copy: {
            angular: {
                expand: true,
                cwd: "node_modules/",
                src: [
                    "angular/angular.min.js",
                    "angular/angular.min.js.map",
                    "angular/angular-csp.css",
                    "angular-route/angular-route.min.js",
                    "angular-route/angular-route.min.js.map"
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
            },
            views: {
                expand: true,
                cwd: "client/views/",
                src: [
                    "login.html",
                    "register.html"
                    ],
                dest:"server/public/views/"
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['copy', 'uglify']);

};