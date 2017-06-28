module.exports = function(){
  var OrientDB = require('orientjs');
  var server = OrientDB({
    host: 'localhost',
    port: 2424,
    username: 'root',
    password: 'whtjdals17'
  });
  var db = server.use('chosm');
  return db;
}
