# DIVA Web Application

## DIVA: Web Application for visualizing Drug Interactions

### Install dependencies for client and server application

Open your favorite Terminal and run the following command. Make sure you have the latest npm and node version. In the root directory of the application, run these commands to get started.

```
$ npm install
$ npm install -g gulp
$ npm install -g nodemon
```

### To build front-end React app 

The following commands build and bundle react app into plain js (choose one of the following). The compiled javascript file will be in public/ directory

When quickly compiling locally run this:
```
$ npm run fdev
```
When working locally, run this to continually update saved changes:
```
$ npm run fwatch
```
When deploying and NOT DEBUGGING, build it as production app as this will minify and otherwise optimize the app:
```
$ npm run fproduction
```

### Run the server

To build typescript files into javascript files use
```
$ npm run build
```

To watch the changes of typesript files in server directory use
```
$ npm run tsc-watch
```

To start the server and watch changes made to javascript files run
```
$ npm run watch
```
You normally want to run those two commands above at the same time. One is to watch and compile typescript files and the other is to watch if there are any changes to compiled javascript files, rerun the server.
