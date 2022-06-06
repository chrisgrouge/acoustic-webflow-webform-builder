# Whereoware Webflow Acoustic Webform Builder

The Acoustic Webform Builder is a static landing page which gives the Whereoware Internal Marketing team the ability to create stylized forms to be hosted on the Webflow Website but submit data directly to Acoustic Campaign. <br>


## How do I get set up?

**Requirements**: Node, Git    
**Install**: `npm install`   
**Dependencies**: browser-sync, browserify, babelify, del, gulp, gulp-rename, gulp-if, gulp-sass, gulp-autoprefixer, gulp-nunjucks-render, gulp-sourcemaps, gulp-uglify, vinyl-source-stream, vinyl-buffer   
**Run**: `gulp`
<br>


## Understanding the code

Functionality for all templating and scripting happens in the `gulpfile.js`. We'll go through that in more detail shortly but the gulp file is compiled of many javascript functions mainly for compiling, cleaning, and converting templates and code to the final output /dist folder for the browser to read.
<br>

Let's break down the folder and files individually so we can get acclimated to the project.
<br>

### gulpfile.js

We'll actually be starting the at the bottom of the file to understand how run `gulp` and what running `gulp` actually means before we go into the individual functions it's running.
<br>

We also have a few utility gulp commands we can run on a one-off basis if needed. Those commands are `gulp.copy` and `gulp.clean`. We can "export" these and give it a name like `exports.copy` is creating the `gulp.copy` commmand and it's running the function `copy()`.
<br>

**`exports.default = watchFn;` is the default run command**  
`const watchFn = series(clean, sassFn, processJS, nunjucks, copy, parallel(watchFiles, browser_sync));`
<br><br>
"watchFn" is a variable containing multiple functions to be run in sequence or in parallel so when we run gulp we're calling `watchFn` which then runs all the following:
  - series - Combines task functions and/or composed operations into larger operations that will be executed one after another, in sequential order.
    1.  `clean()` - Cleans /dist folder so when compiling is complete we can place all the new files in here for the final outputs
    1.  `sassFn()` - Converts sass to css
    1.  `processJS()` - Processes the JavaScript and bundles it into the final `bundle.js` file in the /dist folder
    1.  `nunjucks()` - For files in the /src/pages/ folder we're running them through the nunjucks rendering for final html output in the /dist folder and then uses browserSync to stream those changes in the browser for you to see live changes
    1.  `copy()` - Copys the images in the /src/assets and places them in the /dist/assets. There's potential to do image clean up and/or compressing if needed. We decided to handle that manually instead
  - parallel - Combines task functions and/or composed operations into larger operations that will be executed simultaneously
    1.  `watchFiles()` - Watches for file changes in /src folder so it knows when to refresh browserSync so you can view your changes live in the browser
    1.  `browser_sync()` - streams the /dist folder for you to see your rendered files live in the browser

### /dist

This contains your final output files to be viewed in the browser or published online. This gets replaced each time you make changes in the /src folder so it always stays up to date. You should never modify files in this folder because they will always be removed next time gulp runs.

### /src

The source of all your code. Aside from your `gulpfile.js` this is where all your coding will take place. The /src folder is broken down by each subfolder below.

### /src/assets

Folder containg all the images or documents you need to render on the front-end. Right now, this only supports the use of images with file extension containing one of the following: .png, .jpg, .gif, .jpeg, .webp, .svg. Those are the only file types the `copy()` function will copy to the /dist folder. If you need more file types than this, you'll need to add it to the `copy()` function in the `gulpfile.js`.

### /src/html

Here you can find any HTML for templating purposes. The partials folder is reserved for smaller sections of code - think of re-usable buttons, lists, text blocks, etc. Now, we only have one partial which is the modal.<br>

`base.njk` holds the main HTML document `<head>` and `<body>`. Inside the `<body>` we include the modal and include a placeholder for the rest of the body which can be found in `/src/pages/index.njk`.

### /src/js

All page functionality to make the application work can be found here. We attempted to split this document into smaller documents to then compile/bundle at the end, however, functions were bundled out of order. Future enhancements on the app will be to split this document into
smaller documents to then be compiled into one javascript file in the end.

### /src/pages

This application only has a need for one page but if subsequent pages are needed we'd created the pages here. We're extending the base around the full page and in the base.njk we have a block to input the main. The main content is found here in the index.njk. 

### /src/scss

All application styles are written in SASS which is then compiled into one document and converted to CSS in the `gulpfile.js`. Let's break down each folder and file:

  - **/global**: files needed for global styles used in the application typically branded elements.
    - **_reset.scss**: HTML and CSS resets for the full page.
    - **_typography.scss**: All typography styles which includes styles for headings, paragraphs, lists, and form inputs.
    - **_variables.scss**: Static cariables which really don't change like colors and fonts. Because these are set as global variables one change here populates through the whole document.
    - **global.scss**: Final compiled file of the above three files.
  - **/helpers**
    - **helpers.scss**: This turned into styles for the rest of the application that aren't specific to branding or can't be templatized.
  - **/layout**
    - **_padding.scss**: Standard padding classes to make it easier when building layouts. Each are built in increments of five from zero to 100. We have padding classes for top, bottom, left, and right. We also have combination classes for top & bottom and left & right.<br>
    Example, we have a `<div>` that we want to add padding of 30px on the top and bottom: `<div class="pad-tb--30">`.<br>
    Example, we have a `<div>` we want to add padding on the top of 50px then padding on the left and right of 30px: `<div class="padd-t--50 pad-lr--30">`.
    - **layout.scss**: The compiled layouts file importing the padding file.
  - **styles.scss**: The final compiled stylesheet.


## Who do I talk to?

**Repo owner**: Chris Grouge, Lead Digital Marketer, Whereoware