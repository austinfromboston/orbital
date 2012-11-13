var connect = require('connect');

var server = connect.createServer(
    connect.favicon()
  , connect.logger()
  , connect.static(__dirname + '/public')
).listen(8080);

var express = require('express');
var app = express.createServer();

var bundle = require('browserify')({ require:['burrito', 'traverse', 'bunker', 'mrcolor']})
app.use(bundle);

app.listen(8081);
