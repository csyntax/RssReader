module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		less: {
			development: {
    			files: {
      				"dist/css/rssreader.css": "src/less/rssreader.less"
    			}
  			},
			production: {
				files: {
					"dist/css/rssreader.min.css": "src/less/rssreader.less"
				}
			}
		},
		uglify: {
			options: {
        		sourceMap: true
     		},
			js: {
	 			files: {
	        		"dist/js/rssreader.min.js": ["src/js/rssreader.js"]
	      		}
	      	}
		},
		watch: {
			less: {
				files: ["src/less/*.less"],
				tasks: ["less"]
			},
			js: {
				files: ["src/js/*.js"],
				tasks: ["uglify"]
			}
		}
	});

	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
};
