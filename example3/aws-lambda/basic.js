'use strict'
var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-central-1.amazonaws.com'});
    var newState = Object.assign({}, event);
    newState.alarm = false;
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var params = {
        Bucket: 'gameiro21k',
        Key: 'room.json'
    };

    s3.getObject(params, function (err, data) {
        if (err) {
            console.log(err, err.stack);
        } else {
            var result = JSON.parse(data.Body.toString('utf-8'));
            var limit = result.light;
            console.log("this is: ", result.light);
            if (parseInt(newState.value) > limit) {
                newState.alarm = true;
            }
            var payload = {
                state: {
                    reported: newState
                }
            };
            iotdata.updateThingShadow({
                payload: JSON.stringify(payload),
                thingName: 'light-report'
            }, function (error, data) {
                if (error) {
                    return console.log(error);
                }
                console.log(data);
            });
        }// successful response
    });
};
