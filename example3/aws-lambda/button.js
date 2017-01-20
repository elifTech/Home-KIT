'use strict'
var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-central-1.amazonaws.com'});
    var newState = Object.assign({}, event);
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var sns = new AWS.SNS();
    var params = {
        Bucket: 'gameiro21k',
        Key: 'room.json'
    };

    var payload = {
        state: {
            reported: newState
        }
    };
    var snsParams = {
        Message: newState.active ? 'Security is active' : 'Security is inactive',
        TopicArn: 'arn:aws:sns:eu-central-1:737017133357:sms'
    };
    sns.publish(snsParams, context.done);
    iotdata.updateThingShadow({
        payload: JSON.stringify(payload),
        thingName: 'button-report'
    }, function (error, data) {
        if (error) {
            return console.log(error);
        }
        console.log(data);
    });
};
