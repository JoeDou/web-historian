var path = require('path');
var archive = require('../helpers/archive-helpers');
var headers = require('./http-helpers.js');
var urlParse = require('url');
// require more modules/folders here!

var dataCollection = function(request, callback){
  var data = '';
  request.on('data', function(partial){
    data += partial;
  });
  request.on('end', function(){
    // console.log('datacollection:' + data);
    callback(data);
  });

};

var getMessage= function(request, response){
  //console.log('request.url is: '+ request.url);
  var userUrlPath = urlParse.parse(request.url).pathname;

  if (userUrlPath === '/' && urlParse.parse(request.url).search === null){
    console.log('archived path:' + archive.paths.siteAssets);
    archive.readHtml(archive.paths.siteAssets +'index.html', response);
  } else {
    userUrlPath = userUrlPath.slice(1);
    console.log('request.url is: '+ request.url);
    var urlsite;

    console.log('user url pathname: ', userUrlPath);

    archive.readListOfUrls(function(data){
      urlsite = data;
      //console.log('readlistofURLs callback: ' + urlsite);

      if (archive.isUrlInList(urlsite, userUrlPath)){
        console.log('url in list: found ', userUrlPath);
        console.log(archive.readHtml);
        archive.isURLArchived(userUrlPath, response, archive.readHtml);
      }else{
        console.log('url in list: not found');
        archive.readHtml(archive.paths.siteAssets +'index.html', response, 404);
      }
    });
  }

};

var postMessage = function(request, response){
  var data;
  var site;
  var urlsite;

  dataCollection(request, function(postData){
    data = postData;
    var userUrl = data.split('=')[1];
    // console.log('request handler: ' + userUrl);

    archive.readListOfUrls(function(data){
      urlsite = data;
      // console.log('readlistofURLs callback: ' + urlsite);

      if (archive.isUrlInList(urlsite, userUrl)){
        // console.log('found');
        archive.isURLArchived(userUrl, response, archive.readHtml);
      }else{
        // console.log('not found');
        archive.addUrlToList(userUrl, function(){
          console.log('add url to list status: 302')
          archive.readHtml(undefined, response, 302);
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
