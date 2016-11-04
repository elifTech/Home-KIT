'use strict'
var AWS = require('aws-sdk');
exports.handler = (event, context, callback) => {
  var iotdata = new AWS.IotData({endpoint: 'a36sxknx4xuifs.iot.eu-central-1.amazonaws.com'});
  var newState = Object.assign({}, event.state.reported);
  newState[event.state.desired.change] = !event.state.reported[event.state.desired.change];
  var payload = {
    state: {
      desired: newState
    }
  };
  iotdata.updateThingShadow({
    payload: JSON.stringify(payload),
    thingName: 'lights'
  }, function (error, data) {
    if (error) {
      return console.log(error);
    }
    console.log(data);
  });
};
