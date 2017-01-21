'use strict'
var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-central-1.amazonaws.com'});
    var newState = Object.assign({}, event.state.reported);
    //  newState.alarm = false;
    var s3 = new AWS.S3({apiVersion: '2006-03-01'});
    var sns = new AWS.SNS();
    var params = {
        Bucket: 'gameiro21k',
        Key: 'room.json'
    };

    iotdata.getThingShadow({
        thingName: 'button-report'
    }, function (err, data) {
        if (err) console.log(err, err.stack);
        else {
            console.log("Current state:")
            console.log(data);
            var alarm = JSON.parse(data.payload).state.reported.active;
            console.log(alarm);
            if (alarm) {
                var snsParams = {
                    Message: 'Move',
                    TopicArn: 'arn:aws:sns:eu-central-1:737017133357:sms'
                };
                if (newState.value) {
                    sns.publish(snsParams, context.done);
                    console.log('sent');
                }
                var payload = {
                    state: {
                        reported: newState
                    }
                };
                iotdata.updateThingShadow({
                    payload: JSON.stringify(payload),
                    thingName: 'pir-report'
                }, function (error, data) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log(data);
                });

            } else {
                iotdata.updateThingShadow({
                    payload: JSON.stringify({state: {reported: {value: false}}}),
                    thingName: 'pir-report'
                }, function (error, data) {
                    if (error) {
                        return console.log(error);
                    }
                    console.log(data);
                });
            }

        }
    });
};
