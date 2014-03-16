## Developer documentation for `laazy`

`laazy` use [gulp.js](http://gulpjs.com) for build

#### clean
```
gulp clean
```
#### build
```
gulp
```
or explicitelly
```
gulp build
```
#### run Node.js tests
```
gulp test
```
#### run Node.js tests & browser tests with Karma
```
gulp test --karma
gulp test --karma --no-requirejs
```
#### run browser tests with Karma
```
gulp karma
gulp karma --no-requirejs
```
#### lint all sources
```
gulp lint
```
#### generate documentation
```
gulp doc
```
#### watch
```
gulp watch
```
#### watch with Karma watcher
```
gulp watch --karma
```