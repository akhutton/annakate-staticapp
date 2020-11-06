# ICJ Project Rig

This project rig was developed for the [Intro to Coding for Journalists](https://github.com/utdata/icj-class) class taught by Christian McDonald, Assistant Professor of Practice at the School of Journalism, Moody College of Communication, University of Texas at Austin.

The development concepts used are similar to rigs used by news graphics teams in newsrooms like The Texas Tribune, Los Angeles Times and NPR.

## Features

This Node-based rig uses a Gulp workflow configured for Github Pages publishing. Features include:

- [Bootstrap 4.4](https://getbootstrap.com/) and [Sass](https://sass-lang.com/).
- [Nunjucks Templating](https://mozilla.github.io/nunjucks/templating.html) with [`journalize`](https://www.npmjs.com/package/journalize) filters.
- Ability to configure Google Sheets and Docs (with [ArchieML](http://archieml.org/)) to manage data and content.

## Getting started

All the necessary installations are handled in [icj-setting-up](https://github.com/utdata/icj-setting-up) parts I and II.

To start a new project:

- Create a project folder for all your code.
- Open Visual Studio Code into that folder and open the integrated Terminal.
- Run `degit utdata/icj-project-rig`.
- Initialize your repo, add and commit the files.
- Create your Github repo and connect them.

Make sure you run `degit` to get all your files _before_ you initialize your repo.

## Understanding this project rig

Most of the files you edit for this project are in the `src` directory. The Gulp production process will generate the publishable files into the `docs` folder, which you shouldn't touch.

```pre
├── src
|  ├── data (For data)
|  ├── img (For image files)
|  ├── js (For custom JavaScript)
|  ├── njk
|  |  ├── _includes (For code snippets)
|  |  ├── _macros (For reusable code)
|  |  ├── _templates (For templates)
|  |  └── index.njk (Becomes an HTML page)
|  └── scss (For Sass/CSS files)
```

Each `.njk` file inside `src/njk` or a nested folder is compiled as an HTML file in `docs/`. Folders inside `src/njk` that start with `_` support those pages through Nunjucks templates and do NOT become HTML files.

## Sass/scss

The `src/scss/` folder holds all the SCSS files. It is configured for Bootstrap and the CSS gets compiled into the `docs/css` folder for docsation.

There is an example of a Sass partial with the `src/scss/_nav.scss` file, which is imported into `src/scss/main.scss`.

## Nunjucks templates

[Nunjucks](https://mozilla.github.io/nunjucks/templating.html) allows you to write and reuse code in templates so you don't have to repeat code for each page of your site. The Nunjucks community has adopted `.njk` as the standard file extension.

Templates work off several basic concepts:

- _extends_ is used to specify template inheritance, meaning you can "build upon" templates to avoid repeating code.
- _block_ defines a section in a template and identifies it with a name. Pages that extend a template can override or append to these reserved blocks with new content.
- _include_ imports code from other files. It's useful to organize or share smaller chunks of code.
- _macro_ allows you to define reusable chunks of content. It is similar to a function in other programming language.

With these tools, you can build a site framework once as a template, and then _extend_ that template and use all its code, but swap out predefined _blocks_ specific to your new page.

### Nunjucks template examples

This project organizes Nunjucks helper files into folders that start with `_` so their contents won't be complied into full pages on your site. There are examples of **templates**, **includes** and **macros**.

- The file `src/njk/_templates/base.njk` is an example base template for a website. The idea is to build the framework of the site only once, even though you might have many pages.
- Files in `src/njk/_includes/` are snippets of code used by other templates using the _include_ tag. You can see how the  `nav.njk` and `footer.njk` includes are pulled into the `base.njk` template.

Some of the other files in those folders are discussed as advanced features later.

### Pages

All **pages** are kept in the `src/njk/` folder. Each `.njk` file (including those in a nested folder that don't start with "_") will be processed and become an `.html` file in `docs/`, and therefore a webpage on your website.

This project includes the example `src/njk/index.njk`, which is the homepage of the website. It _extends_ `src/njk/_templates/base.njk`. Using the _block_ and _extend_ features allows you to worry about only main content of the page, as it inherits the nav and other framework from the base template. This example includes some loops to build content from the example library and bookstores data, described in detail below.

To create a new webpage, just add a new file in `src/njk/` with the `.njk` extension. You'll want to _extend_ the `_templates/base.njk` template and put your content inside the `{% block content %}{% endblock %}` block.

### Deployment

This project is designed to bundle the finished website into the `docs` folder, which can then be published anywhere you have a server. We use and ,mndnsdlfkj;commit our `docs` distribution folder to Github to take advantage of [Github Pages](https://help.github.com/categories/github-pages-basics/) for free hosting of the site.

Review [Github Pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/#publishing-your-github-pages-site-from-a-docs-folder-on-your-master-branch) for specific directions on deployment using the `master/docs/` folder.

## Advanced Nunjucks features

### Using project data, loops

Nunjucks has special [tags to apply logic](https://mozilla.github.io/nunjucks/templating.html#tags), like looping through data.

Data used in the project must be saved as a JSON file in the `src/data/` folder. There are some examples in the project, including `library.json`. While not the full file, this is an example of JSON array of key-value pairs:

```json
{
  "books": [
    {
      "slug": "the-clown",
      "title": "The Clown",
      "author": "Heinrich Böll"
    },
    {
      "slug": "the-shipping-news",
      "title": "The Shipping News",
      "author": "Annie Proulx"
    }
  ]
}
```

There is an example using a loop to access data in these files in `index.njk`.

- You can add new `*.json` files into `src/data/` and they will be added to the Nunjucks context as `filename.arrayname`. Data is accessed with a Nunjucks variable `{{ arrayname.key }}`.
- Optionally, with the Google Drive authentication described below, you can store data in Google Sheets or Docs and "fetch" it as JSON arrays that will be downloaded and saved into the `src/data` folder.
- You can also create global variables in `project.config.json` as key-value pairs or arrays.

> IMPORTANT: If you add/change/delete data in JSON files, you must re-run the `gulp dev` command to make it available to Nunjucks.

### "Bake" pages from data and a template

It is possible to generate (or "bake") multiple pages from data and a Nunjucks template. Combined with Google Sheets/Docs data management, this can be a powerful tool to create and manage multi-page websites from data collections, like voter guides, restaurant databases and investigative project case studies.

The example used in the project publishes a [webpage for each book](https://utdata.github.io/icj-project-template/books/the-shipping-news.html) in a library based on "data" in a Google Doc.

The process requires three things:

- A Nunjucks template: The example in the project is: `src/njk/_templates/bake-book.njk`. The template displays the data through Nunjucks variables `{{ keyvalue }}`.
- Data: A JSON data file saved in the `src/data/` folder.
- Configuration to pair the layout with the data: This is set up in the `project.config.json` file, which has several requirements:

```json
"to_bake": [
    {
      "template": "bake-book",
      "data": "library",
      "array": "books",
      "slug": "slug",
      "path": "books"
    }
  ]
```

- **`template`** is the name of the template file stored in `src/njk/_templates` that will be used to build the pages. Note you don't need the extension in name.
- **`data`** is the name of the data file to build from. You don't need `.json` in the name.
- **`array`** is the name of the array you are using from the JSON file.
- **`slug`** is a key required from the data that will become the filename of each file created. The field used in the data needs to be in a URL-friendly format with all lowercase letters with dashes instead of spaces.
- **`path`** is an optional folder to save the files into. Use an empty string to save the files at the root of `docs/`.

You can configure more than one "bake" task by adding new configurations to the `to_bake` array.

The command to generate the files is `gulp bake`, but the task is also included in the default `gulp` and `gulp dev` commands.

### Layouts and relative paths

Since pages using layouts like `_templates/base.njk` and includes like `_includes/nav.njk` can come from nested directories on the site, the example pages in this project use a variable `{{ relative_path }}` to correct these paths.

If needed, set the variable to the path that would return you to the root/index of the site. For example, since layout `bake-book.njk` will create files inside a folder at `/books/filename.html` we set the `{{ relative_path }}` to come up one level to come out of that "books" folder.

```html
{% set relative_path = "../" %}
```

Any code written that includes `src` or `href` paths that could be called from a nested directory should include the variable `{{ relative_path }}` at the beginning of the url.

```html
<script src="{{ relative_path }}js/jquery.js"></script>
```

### More Nunjucks configuration

A collection of functions useful for making prose reader friendly is already included with [`journalize`](https://www.npmjs.com/package/journalize).

You can add [custom filters](https://mozilla.github.io/nunjucks/api.html#custom-filters) and [global variables](https://mozilla.github.io/nunjucks/api.html#addglobal) in the `manageEnv` function inside `tasks/nunjucks.js`.

In addition to data in the `src/data` folder, you can also configure data variables in the `project.config.json` file.

## Using data from Google Drive

To use Google Drive to store and "fetch" data, you have to configure a service account key. See [icj-setting-up](https://github.com/utdata/icj-setting-up) Part 2 to prepare this.

`icj-project-template` projects support downloading ArchieML-formatted Google Docs and correctly-formatted Google Sheets directly from Google Drive for use within your project. All files you want to use in your projects should be listed in `project.config.json` under the `files` key. You are not limited to one of each.

```js
{
  files: [
    {
      fileId: '<the-document-id-from-the-url>',
      type: 'doc',
      name: 'text',
    },
    {
      fileId: '<the-sheet-id-from-the-url>',
      type: 'sheet',
      name: 'data',
    }
}
```

Each object representing a Google Drive file needs three things:

- The `fileId` key represents the ID of a Google Doc or Google Sheet. This is most easily found in the URL of a document when you have it open in your browser.
- The `type` key is used to denote whether this is a Google Doc (`doc`) or a Google Sheet (`sheet`). This controls how it gets processed.
- The `name` key controls what filename it will receive as it is downloaded into the `data/` directory. So if the `name` is set as `hello`, it'll be saved to `src/data/hello.json`.

### Gulp fetch downloads the data

Once your Google Sheet or Docs are set up and entered into `project.config.json`, you can run `gulp fetch` to download the data. You must then run `gulp dev` to load that data into the Nunjucks context. If you are already running gulp dev, be sure to kill the process with Control-c, then run `gulp fetch` and restart `gulp dev` again to get the new data.

### Google Sheets

For more information about how the Google Sheets processor works, check out the [sheet-to-data library](https://github.com/rdmurphy/sheet-to-data). The example Sheet used in this project is at [Bookstores data](https://docs.google.com/spreadsheets/d/1gDwO-32cgpBDn_0niV0iu6TqQTaRDr4nmSqnT53magY/edit#gid=0).

Google Sheets used may potentially require some additional configuration. Each sheet (or tab) in a Google Sheet is converted separately by the kit, and keyed-off in the output object by the _name of the sheet_.

By default it treats every sheet in a Google Sheet as being formatted as a `table`. In other words, every _row_ is considered an item, and the _header row_ determines the key of each value in a _column_.

The Google Sheets processor also supports a `key-value` format as popularized by [`copytext`](https://github.com/nprapps/copytext) ([and its Node.js counterpart](https://github.com/rdmurphy/node-copytext)). This treats everything in the _first column_ as the key, and everything in the _second column_ as the value matched to its key. Every other column is _ignored_.

To activate the `key-value` format, add `:kv` to the end of a sheet's filename. (For consistency you can also use `:table` to tell the processor to treat a sheet as a `table`, but it is not required due to it being the default.)

If there are any sheets you want to exclude from being processed, you can do it via two ways: hide them using the native _hide_ mechanism in Google Sheets, or add `:skip` to the end of the sheet name.

### Google Docs

ArchieML Google Docs work as documented on the [ArchieML](http://archieml.org/) site. This includes the automatic conversion of links to `<a>` tags! You can use the [Archie Sandbox](http://archieml.org/sandbox.html) to see what the outputted json will look like.

- The Docs example used in this project is at [Books data](https://docs.google.com/document/d/1RgMhjtkXlbbf9uzSzy_xPRKwxcVZIZqVytgM_JoU4E4/edit).
- See [@newswire/doc-to-archieml](https://www.npmjs.com/package/@newswire/doc-to-archieml) and [ArchieML](http://archieml.org/) for more information on preparing these Google Docs as data.

### Prose macro

There is a "prose" macro that can loop through multiple paragraphs of text that have been created using [freeform arrays in ArchieML](http://archieml.org/#freeform-arrays). To use this feature on a page, you need the following in your page:

```html
{% from '_macros/prose.njk' import prose %}

{{ prose(filename.array_name) }}
```

- The first line imports the prose macro. This can near the top of the file after the template extend.
- The second line goes where you want the paragraphs of text to go. Change "filename" to your data file name and  "array_name" to the name of your array in your data.

See the `[example_multigraph]`, `[+example_prose]` and `[+example_image]` arrays in the [Books data](https://docs.google.com/document/d/1RgMhjtkXlbbf9uzSzy_xPRKwxcVZIZqVytgM_JoU4E4/edit) for some examples of how to format the Google Doc.

To use the "example_prose" array, the code would be `{{ prose(library.example_prose) }}`.

It processes paragraphs, subheads, lists, images (though the image macro might need some work). You can add other elements in `src/njk/_macros/processors.njk`.

## Technical notes

Gulp is the task runner and is configured in `gulpfile.js`. Individual tasks live in the `tasks` folder.

- The default `gulp` task runs the `styles`, `lint`, `scripts`, `images`, `nunjucks` and `bake` tasks to create the production files.
- `gulp dev` runs the default tasks above plus `serve` for the BrowserSync server.
- To run any specific gulp task use `gulp <name of task>`, e.g. `gulp clean`.

### Tasks

- `bake.js`: Generates detail pages from a layout and data as noted above.
- `clean.js`: Deletes the contents of the `docs` directory using [`del`](https://www.npmjs.com/package/del).
- `clear.js`: Clears out the gulp cache. Useful to reprocess images of the same name stuck in cache. Run `gulp clear` then re-run `gulp`.
- `copy.js`: Used to copy production-necessary JavaScript files from `node_modules` into `docs/js`.
- `fetch.js`: Downloads Google Drive files as data as configured in `project.config.json`.
- `images.js`: Optimize images using [`gulp-imagemin`](https://www.npmjs.com/package/gulp-imagemin) and [`imagemin-mozjpeg`](https://www.npmjs.com/package/imagemin-mozjpeg) packages.
- `lint.js`: Checks syntax of your (optionally ES6) javascript in `/src/js/` using [`gulp-eslint`](https://www.npmjs.com/package/gulp-eslint) -- it's a good idea to have an eslint package installed in your text editor of choice, as well.
- `nunjucks.js`: Builds out html pages using [`gulp-nunjucks-render`](https://github.com/carlosl/gulp-nunjucks-render) (see notes below).
- `scripts.js`: Babel/concat/uglify javascript in `/src/js/` using [`gulp-babel`](https://www.npmjs.com/package/gulp-babel), [`gulp-concat`](https://www.npmjs.com/package/gulp-concat) and [`gulp-uglify`](https://www.npmjs.com/package/gulp-uglify).
- `serve.js`: Spins up a [BrowserSync](https://browsersync.io/docs/gulp) server at `localhost:3000`. Bundled with watch tasks for css/js/template changes.
- `styles.js`: Processes Sass files from `/src/scss/` into minified css using [`gulp-sass`](https://www.npmjs.com/package/gulp-sass), [`gulp-sourcemaps`](https://www.npmjs.com/package/gulp-sourcemaps), [`gulp-autoprefixer`](https://www.npmjs.com/package/gulp-autoprefixer) and [`gulp-cssnano`](https://www.npmjs.com/package/gulp-cssnano).

Many thanks to [Elbert Wang](https://github.com/elbertwang3) for developing the `bake` and `fetch` tasks.
