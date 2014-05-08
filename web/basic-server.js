var http = require("http");
var handler = require("./request-handler");

var fetch = require('../workers/htmlfetcher.js');

var cronJob = require('cron').CronJob;
var job = new cronJob('*/1 * * * * *', function(){
  fetch.fetchSites()

  }, function () {
    // This function is executed when the job stops
  },
  true /* Start the job right now */,
  timeZone /* Time zone of this job. */
);

job.start();


var port = 8080;
var ip = "127.0.0.1";
var server = http.createServer(handler.handleRequest);
console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

