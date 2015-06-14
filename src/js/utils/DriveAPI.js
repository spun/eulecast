/*global window, gapi */
/*jslint node: true, browser: true */

var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();
var clientId = '881315102635-e5rkg6qfd2vu0rbcg4j5atkj1n9ihdbt.apps.googleusercontent.com';
// var developerKey = '';
// var accessToken;


window.handleGoogleClientLoad = function () {
    'use strict';
    tryAuthorize(true);
};


function tryAuthorize(immediate) {
    'use strict';

    var config = {
        'client_id': clientId,
        'scope': ['https://www.googleapis.com/auth/drive.appfolder'], 
        immediate: immediate
    };
    gapi.auth.authorize(config, handleAuthResult);
}


function handleAuthResult(authResult) {
    'use strict';

    if (authResult && !authResult.error) {
        // accessToken = authResult.access_token;
        emitter.emit('isAuthorized', true);
    } else {
        emitter.emit('isAuthorized', false);
        if (authResult.error === 'immediate_failed') {
            tryAuthorize(false);
        }
    }
}


function subscribe(eventName, callback) {
    'use strict';
    emitter.on(eventName, callback);
}



var getFileList = function () {
    'use strict';
    return new Promise(function(resolve, reject) {
        var request = gapi.client.request({
            'path': '/drive/v2/files',
            'method': 'GET',        
            'params': {'q': '\'appfolder\' in parents'}
        });

        request.execute(function (response) {
            resolve(response.items);
        });
    });  
};

var getFile = function (fileId) {
    'use strict';

    return new Promise(function(resolve, reject) {

        var request = gapi.client.request({
            'path': '/drive/v2/files/' + fileId,
            'method': 'GET'
        });

        request.execute(function (response) {        
            resolve(response);
        });
    });    
};

var readFile = function (fileId) {
    'use strict';

    return new Promise(function(resolve, reject) {

        getFile(fileId).then(function(file) {
            return downloadFile(file);
        }).then(function(response) {     
            resolve(response);
        }).catch(function(error) {
            reject(Error("GetFile Error"));
            console.log("Failed!", error);
        });
    });
};

var searchFile = function (fileName) {
    'use strict';

    return new Promise(function(resolve, reject) {

        var request = gapi.client.request({
            'path': '/drive/v2/files',
            'method': 'GET',        
            'params': {'q': '\'appfolder\' in parents and title = \'' + fileName + '\''}
        });

        request.execute(function (response) {    
            resolve(response.items);
        });

    });
};

var createFile = function (fileName, fileContent) {
    'use strict';

    return new Promise(function(resolve, reject) {

        var boundary = '-------314159265358979323846',
            delimiter = "\r\n--" + boundary + "\r\n",
            close_delim = "\r\n--" + boundary + "--";

        var contentType = 'application/json';
        var metadata = {
            'title': fileName,
            'mimeType': contentType,
            'parents': [{'id': 'appfolder'}]
        };

        var base64Data = window.btoa(JSON.stringify(fileContent));
        var multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' + contentType + '\r\n' +
                'Content-Transfer-Encoding: base64\r\n' +
                '\r\n' +
                base64Data +
                close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {'uploadType': 'multipart'},
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });

        request.execute(function (response) {   
            resolve(response);
        });

    });
};


var updateFile = function (fileId, fileContent) {
    'use strict';

    return new Promise(function(resolve, reject) {
        var request = gapi.client.request({
            'path': '/upload/drive/v2/files/' + fileId,
            'method': 'PUT',
            'params': {'uploadType': 'media'},
            'body': JSON.stringify(fileContent)
        });

        request.execute(function (response) {
                resolve(response);
        });
    });
};


var deleteFile = function (fileId) {
    'use strict';

    return new Promise(function(resolve, reject) {

        var request = gapi.client.request({
            'path': '/drive/v2/files/' + fileId,
            'method': 'DELETE'
        });

        request.execute(function (response) {    
            resolve(response);
        });
    });
};


function downloadFile(file) {
    'use strict';

    return new Promise(function(resolve, reject) {
        if (file.downloadUrl) {
            var accessToken = gapi.auth.getToken().access_token;

            fetch(file.downloadUrl, { 
                headers: { "Authorization": 'Bearer ' + accessToken }
            }).then(function(response) { 
                response.json().then(function(data) {
                    resolve(data);            
                });
            }).catch(function(err) {
                reject(Error("Fetch Error"));
            });

        } else {
            reject(Error("DownloadUrl Error"));
        }
    });
    
}


module.exports = {
    'subscribe': subscribe,
    'getFileList': getFileList,
    'searchFile': searchFile,
    'createFile': createFile,
    'updateFile': updateFile,
    'getFile': getFile,
    'readFile': readFile,
    'deleteFile': deleteFile
};


