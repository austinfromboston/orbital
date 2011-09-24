var connect = require('connect');

var server = connect.createServer(
    connect.favicon()
  , connect.logger()
  , connect.static(__dirname + '/public')
).listen(8080);

