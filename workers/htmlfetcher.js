// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.

var q = require('q');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('http-request');
var helper = require('/Users/student/code/joedou/2014-04-web-historian/helpers/archive-helpers.js');

console.log('type of archive: ', typeof helper.paths);
// var readFile = q.denodeify(fs.readFile);
// var fileExist = q.denodeify(fs.exists);

exports.fetchSites = function(){
  helper.readListOfUrls(function(arrayOfSites){
    _.each(arrayOfSites, function(url){
      helper.isURLArchived(url, undefined, function(url2){
        if (!url2){
          helper.downloadUrls(url);
        }
      });
    });
  });
};

// exports.fetchSites = function(){
//   readFile(helper.paths.list)
//     .then(function(data){
//       var dataArr = data.toString().split('\n');
//       console.log('read site File', dataArr);
//       return dataArr;
//     })
//     .then(function(dataArr){
//       console.log(dataArr);
//     });
//   console.log('outside of each');
// };
