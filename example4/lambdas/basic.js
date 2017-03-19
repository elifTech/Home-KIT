var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {

    var value = parseInt(event.state.reported.value, 10);

    var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-west-1.amazonaws.com'});
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

    dynamodb.getItem({Key: {"name": {S: "22"}}, TableName: "room"}, function (error, data) {
        var bound = parseInt(data.Item.lightBound.N, 10);
        var curtain = true;

        if (value > bound) {
            curtain = false;
        }
        return iotdata.updateThingShadow({
            payload: JSON.stringify({
                state: {
                    desired: {
                        value: curtain
                    }
                }
            }),
            thingName: 'curtain'
        }, function (error) {
            if (error) {
                return callback(error);
            }
            iotdata.updateThingShadow({
                payload: JSON.stringify(event),
                thingName: 'light'
            }, callback)
        })

    });
};