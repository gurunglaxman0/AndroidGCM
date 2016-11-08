/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


'use strict';
var https = require('https');
function GCM(apiKey) {
    console.log(apiKey)
    if (apiKey) {
        this.apiKey = apiKey;
    } else {
        throw Error('Please Provide API KEY');
    }
    this.gcmOptions = {
        host: 'android.googleapis.com',
        port: 443,
        path: '/gcm/send',
        method: 'POST',
        headers: {}
    };
}
exports.GCM = GCM;

GCM.prototype.send = function (packet, cb) {
    var self = this;
    var postData = JSON.stringify(packet);
    var headers = {
        'Host': self.gcmOptions.host,
        'Authorization': 'key=' + self.apiKey,
        'Content-Type': 'application/json',
        'Content-length': postData.length,
    };
    self.gcmOptions.headers = headers;
    var request = https.request(self.gcmOptions, function (res) {
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var response = data;
            cb(null, response)
        });
    });
    request.on('error', function (error) {
        cb(error, null);
    });

    request.write(postData);
    request.end();
};
