# DIVA Web Application

## DIVA: Web Application for visualizing Drug Interactions

### Install dependencies for client and server application

Open your favorite Terminal and run the following command. Make sure you have the latest npm and node version. In the root directory of the application, run these commands to get started.
```js static
$ npm install
$ npm install -g gulp
$ npm install -g nodemon
```
### How to build the front-end React app 

The following commands build and bundle react app into plain js (choose one of the following). The compiled javascript file will be in public/ directory

When quickly compiling locally run this:
```js static
$ npm run fdev
```
When working locally, run this to continually update saved changes:
```js static
$ npm run fwatch
```
When deploying and NOT DEBUGGING, build it as production app as this will minify and otherwise optimize the app:
```js static
$ npm run fproduction
```

### How to run the server

To build typescript files into javascript files use
```js static
$ npm run build
```

To watch the changes of typescript files in server directory use
```js static
$ npm run tsc-watch
```

To start the server and watch changes made to javascript files run
```js static
$ npm run watch
```
You normally want to run those two commands above at the same time. One is to watch and compile typescript files and the other is to watch if there are any changes to compiled javascript files, rerun the server.

### How to generate documentation

To watch for changes and dynamically build interactive react documentation
```js static
$ npm run styleguide
```

To build a static version of the interactive react documentation
```js static
$ npm run styleguide:build
```

To build a markdown version of the react documentation
```js static
$ npm run react-docs
```

To build a markdown version of the JavaScript documentation
```js static
$ npm run js-docs
```

To build a markdown version of the TypeScript documentation
```js static
$ npm run ts-docs
```

To build a markdown versions of all documentation (Note: they can be found in the /documentation/ directory)
```js static
$ npm run docs
```
