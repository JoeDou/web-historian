var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = require('./http-helpers.js');
// require more modules/folders here!

var dataCollection = function(request, callback){
  var data = '';
  request.on('data', function(partial){
    data += partial;
  });
  request.on('end', function(){
    console.log('datacollection:' + data);
    callback(data);
  });

};

var getMessage= function(request, response){
  archive.readHtml('./public/index.html', response);
};

var postMessage = function(request, response){
  var data;
  var site;
  var urlsite;

  dataCollection(request, function(postData){
    data = postData;
    userUrl = data.split('=')[1];
    console.log('request handler: ' + userUrl);

    archive.readListOfUrls(function(data){
      urlsite = data;
      console.log('readlistofURLs callback: ' + urlsite);

      if (archive.isUrlInList(urlsite, userUrl)){
        console.log('found');
        archive.isURLArchived(userUrl, response);
      }else{
        console.log('not found');
        archive.addUrlToList(userUrl, function(){
          archive.readHtml(undefined, response);
        });
      }
    });

    // headers.sendResponse(response);
  });
};

var actions ={
  'GET' : getMessage,
  'POST': postMessage
};

exports.handleRequest = function (req, res) {

  console.log('Request Type: ' + req.method + ' URL: ' + req.url);

  var action = actions[req.method];
  if (action){
    action(req, res);
  }else{
    headers.send404(res);
  }


  // res.end(archive.paths.list);
};
