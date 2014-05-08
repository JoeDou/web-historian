var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var headers = require('../web/http-helpers.js');
var request = require('http-request');


/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public/'),
  'archivedSites' : path.join(__dirname, '../archives/sites/'),
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
  fs.readFile(exports.paths.list, function(err, readData){
    if (err){
      throw err;
    }
    data = readData.toString();
    console.log('read list of data:' + data);
    data = data.split('\n');
    console.log('read list of data array:' + data);

    callback(data);
    // console.log('read list of URL: ' + data);
  });
};

exports.isUrlInList = function(dataList, userUrl){
  var array = dataList;
  // console.log('url list: ', array);
  if (array.indexOf(userUrl) !== -1){
    return true;
  }else{
    return false;
  }

};

exports.addUrlToList = function(url, callback){
  fs.appendFile (exports.paths.list, url+'\n',function(err){
    if (err){
      throw err;
    } else {
      callback();
    }
  });
};

// exports.isURLArchived = function(url, response){
//   console.log ('is url archived: ' + url);
//   var pathUrl = exports.paths.archivedSites+url;
//   pathUrl = path.normalize(pathUrl);
//   console.log('path URL normalize', pathUrl);
//   fs.exists(pathUrl, function(exists){
//     if(exists){
//       console.log('Exists!');
//       exports.readHtml(pathUrl, response);
//     } else {
//       console.log('Does not exists!');
//       exports.readHtml(undefined, response);

//     }
//   });
// };

exports.isURLArchived = function(url, response, callback){
  console.log ('is url archived: ' + url);
  var pathUrl = exports.paths.archivedSites+url;
  pathUrl = path.normalize(pathUrl);
  console.log('path URL normalize', pathUrl);
  fs.exists(pathUrl, function(exists){
    if(exists){
      console.log('Exists!');
      callback(pathUrl, response);
    } else {
      console.log('Does not exists!', (typeof callback));
      callback(undefined, response);

    }
  });
};



exports.downloadUrls = function(url){
  request.get('http://'+url, exports.paths.archivedSites + url, function(err){
    if (err){
      console.log('downloadURLs: ',url);
      throw err;
    }
  });
};


exports.readHtml = function(location, response, status){
  status = status || 200;
  location = location || exports.paths.siteAssets+'loading.html';
  console.log('read file location: ' + location);
  fs.readFile(location, function(err,data){
    if(err){
      console.log('read file error: ', err);
      throw err;
    } else {
      console.log('before send response: ' + status);
      headers.sendResponse(response, data.toString(), status);

    }
  });
};

// exports.fetchSites = function(){
//   exports.readListOfUrls(function(arrayOfSites){
//     _.each(arrayOfSites, function(url){
//       exports.isURLArchived(url, undefined, function(url2){
//         if (!url2){
//           exports.downloadUrls(url);
//         }
//       });
//     });
//   });
// };

// exports.fetchSites();

