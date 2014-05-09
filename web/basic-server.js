var http = require("http");
var handler = require("./request-handler");

var fetch = require('../workers/htmlfetcher.js');

var cronJob = require('cron').CronJob;
var job = new cronJob('0 */1 * * * *', function(){
  fetch.fetchSites()

  }, function () {
    console.log('cron job complete');
  },
  true /* Start the job right now */
);

job.start();

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'webhistoriantest',
  password : 'testpassword'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});
// connection.query('INSERT INTO webHistorian.webHistorianTable (website, updated) Values ("www.google.com", true)', function(err, results){
//   if (err){
//     console.log('sql error: ' + err);
//     throw(err);
//   } else {
//     console.log('sql results: ' + results);
//   }
// });

connection.query('SELECT * from webHistorian.webHistorianTable', function(err, rows, fields){
  if (err){
    console.log('sql error: ' + err);
    throw(err);
  } else {
    console.log('sql row results: ' + rows[0].website);
    console.log('sql fields results: ' + JSON.stringify(fields));

  }
});


var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

