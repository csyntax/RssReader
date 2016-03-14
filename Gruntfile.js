module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
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
		watch: {
			less: {
				files: ["src/less/*.less"],
				tasks: ["less"]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-watch');
};