var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var headers = require('../web/http-helpers.js');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback){
  var data;
  fs.readFile('../archives/sites.txt', function(err, readData){
    if (err){
      throw err;
    }
    data = readData.toString();
    callback(data);
    console.log('read list of URL: ' + data);
  });
};

exports.isUrlInList = function(dataList, userUrl){
  var array = dataList.split('\n');
  console.log('url list: ', array);
  if (array.indexOf(userUrl) !== -1){
    return true;
  }else{
    return false;
  }

};

exports.addUrlToList = function(url, callback){
  fs.appendFile ('../archives/sites.txt', url+'\n',function(err){
    if (err){
      throw err;
    } else {
      callback();
    }
  });
};

exports.isURLArchived = function(url, response){
  var path = '../archives/sites/'+url;
  fs.exists(path, function(exists){
    if(exists){
      console.log('Exists!');
      exports.readHtml(path, response);
    } else {
      console.log('Does not exists!');
      exports.readHtml(undefined, response);

    }
  });
};

exports.downloadUrls = function(){
};


exports.readHtml = function(location, response){

  location = location || './public/loading.html';

  fs.readFile(location, function(err,data){
    if(err){
      throw err;
    } else {
      headers.sendResponse(response, data.toString(), 201);
      console.log('loading: ', data.toString());

    }
  });
};
