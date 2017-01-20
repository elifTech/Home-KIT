'use strict'
var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
    var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-central-1.amazonaws.com'});
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
            var response = {
                open: false
            };
            if (event.hasOwnProperty('password')) {
                if (event.password == result.password) {
                    response.open = true;
                }
            } else if (event.hasOwnProperty('id')) {
                if (result.cards.indexOf(event.id) != -1) {
                    response.open = true;
                }
            }
            console.log("this is: ", response);
            var payload = {
                state: {
                    reported: response
                }
            };
            iotdata.updateThingShadow({
                payload: JSON.stringify(payload),
                thingName: 'door'
            }, function (error, data) {
                if (error) {
                    return console.log(error);
                }

                setTimeout(function () {

                    payload.state.reported.open = false;
                    iotdata.updateThingShadow({
                        payload: JSON.stringify(payload),
                        thingName: 'door'
                    }, function (error, data) {
                        if (error) {
                            return console.log(error);
                        }
                        console.log(data);
                    });
                }, result.doorTimeout)

            });
        }// successful response
    });
};
