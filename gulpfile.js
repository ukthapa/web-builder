var gulp = require('gulp'),     
    sass = require('gulp-sass') ,
    notify = require("gulp-notify") ,
    nunjucks = require('nunjucks'),
    markdown = require('nunjucks-markdown'),
   	marked = require('marked'),
    rename = require('gulp-rename'),
    gulpnunjucks = require('gulp-nunjucks'),
    wrap = require('gulp-wrap'),
	frontMatter = require('gulp-front-matter'),
	/*marked = require('gulp-marked'),*/
	fs = require('fs');



var paths =  {
	src: {},
  	dist: {}
}

// src paths
paths.src.root   		= 'src/';
paths.src.favicon 		= paths.src.root + 'favicon/';
paths.src.images  		= paths.src.root + 'images/';
paths.src.fonts 		= paths.src.root + 'fonts/';
paths.src.vendor 		= paths.src.root + 'js/vendor/';
paths.src.custom 		= paths.src.root + 'js/custom/';
paths.src.css			= paths.src.root + 'style/css/';
paths.src.sass			= paths.src.root + 'style/sass/';
paths.src.templates   	= paths.src.root + 'templates/';
paths.src.markdown   	= paths.src.root + 'markdown/';

//dist paths
paths.dist.root  		= 'dist/';





// The templates folder tells the nunjuck renderer where to find any *.njk files you source in your *.html files. 
 var env = new nunjucks.Environment(new nunjucks.FileSystemLoader(paths.src.templates));

// all fo the follwing is optional and this will all work just find if you don't include any of it. included it here just in case you need to configure it. 
marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false
});

// This takes the freshley created nunjucks envroment object (env) and passes it to nunjucks-markdown to have the custom tag regestered to the env object.
// The second is the marked library. anything that can be called to render markdown can be passed here. 
markdown.register(env, marked);


// =======================================================================
// Index Task (Generate pages from template *.html files.)
// =======================================================================
gulp.task('pages', function() {
    // Gets .html files. see file layout at bottom
    gulp.src(paths.src.markdown + '*.md')
    	.pipe(frontMatter({ property: 'page', remove: true }))
		.pipe(marked())
        // Renders template with nunjucks and marked
        .pipe(gulpnunjucks.compile("", {env: env}))
        // Uncomment the following if your source pages are something other than *.html. 
        .pipe(rename(function(path) {
        	path.extname=".html" 
       	}))
        // output files in dist folder
        .pipe(gulp.dest(paths.dist.root));
});



// gulp.task('pages:md', function() {
//   gulp.src(paths.src.markdown + '*.md')
//     .pipe(frontMatter())
//     .pipe(marked())
//     .pipe(wrap(function (data) {
//       return fs.readFileSync(paths.src.templates + data.file.frontMatter.layout).toString()
//     }, null, {engine: 'nunjucks'}))
//     .pipe(gulp.dest(paths.dist.root))
// });