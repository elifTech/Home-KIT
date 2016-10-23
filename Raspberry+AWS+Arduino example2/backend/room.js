var awsIot = require('aws-iot-device-sdk');
var mqtt = require('mqtt');
var clientMosquitto = mqtt.connect('mqtt://127.0.0.1:1883');

var roomShadow= awsIot.thingShadow({
	keyPath: 'certs/Room/3da57303cb-private.pem.key',
	certPath: 'certs/Room/3da57303cb-certificate.pem.crt',
	caPath: 'certs/root-CA.crt',
	clientId: 'Room',
	region: 'eu-central-1'
});
var infoPanelShadow= awsIot.thingShadow({
	keyPath: 'certs/InfoPanel/0f3b0918b7-private.pem.key',
	certPath: 'certs/InfoPanel/0f3b0918b7-certificate.pem.crt',
	caPath: 'certs/root-CA.crt',
	clientId: 'InfoPanel',
	region: 'eu-central-1'
});
var doorShadow= awsIot.thingShadow({
	keyPath: 'certs/Door/d7b78aa12b-private.pem.key',
	certPath: 'certs/Door/d7b78aa12b-certificate.pem.crt',
	caPath: 'certs/root-CA.crt',
	clientId: 'Door',
	region: 'eu-central-1'
});
var doorInfoPanelShadow= awsIot.thingShadow({
	keyPath: 'certs/DoorInfoPanel/c87ecbc2b9-private.pem.key',
	certPath: 'certs/DoorInfoPanel/c87ecbc2b9-certificate.pem.crt',
	caPath: 'certs/root-CA.crt',
	clientId: 'DoorInfoPanel',
	region: 'eu-central-1'
});
var lockShadow=awsIot.thingShadow({
	keyPath: 'certs/Lock/ea029a1fd7-private.pem.key',
	certPath: 'certs/Lock/ea029a1fd7-certificate.pem.crt',
	caPath: 'certs/root-CA.crt',
	clientId: 'Lock',
	region: 'eu-central-1'
});


clientMosquitto.on('connect', function() {
	console.log('connected to mosquitto server');	
	clientMosquitto.subscribe('room/#');
	clientMosquitto.on('message', function(topic, message) {
        switch (topic) {
            case 'room/sensors': 
		console.log("Room sensors updated");         
		console.log(message.toString());
		var sensors=JSON.parse(message.toString());
		roomShadow.update('Room',{
		        "state": {
		            "reported": {
		                "sensors": sensors
				}
			}
		} );
                break;
		case 'room/infopanel':
			console.log("InfoPanel updated");     
			console.log(message.toString());
			var light=JSON.parse(message.toString());
			infoPanelShadow.update('InfoPanel',{
	   	             "state": {
			      	      "reported": {
			  	              "light": light
			  	          }
		 	       }
			});
		break;
		case 'room/lock':
			console.log("Attempt to open a lock");
			var lock=JSON.parse(message.toString());
			lockShadow.update('Lock',{
				"state":{
					"reported":{
						"lock":lock
					}
				}			
			});
		break;
		case 'room/door':
			console.log("Door updated");     
			console.log(message.toString());
			var doorState=JSON.parse(message.toString());
			doorShadow.update('Door',{
	   	             "state": {
			      	      "reported": doorState
		 	       }
			});
		break;
		case 'room/door/infopanel':
			console.log("Door updated");     
			console.log(message.toString());
			var doorInfoPanelState=JSON.parse(message.toString());
			doorInfoPanelShadow.update('DoorInfoPanel',{
	   	             "state": {
			      	      "reported": doorInfoPanelState
		 	       }
			});
		break;
        }
    });

	roomShadow.on('connect', function() {
		roomShadow.register('Room');
		console.log('Room connected to AWS');
	});
	infoPanelShadow.on('connect', function() {
 		infoPanelShadow.register('InfoPanel');
		console.log('InfoPanel  connected to AWS');
	});
	lockShadow.on('connect', function() {
 		lockShadow.register('Lock');
		console.log('Lock  connected to AWS');
	});
	doorShadow.on('connect', function() {
 		doorShadow.register('Door');
		console.log('Door  connected to AWS');
	});
	doorInfoPanelShadow.on('connect', function() {
 		doorInfoPanelShadow.register('DoorInfoPanel');
		console.log('DoorInfoPanel  connected to AWS');
	});
	infoPanelShadow.on('foreignStateChange',
        function(thingName, operation, stateObject) {
		console.log('InfoPanel state changed remotely');
		var desiredInfoPanelState = JSON.stringify(stateObject.state.desired.light);
		console.log(desiredInfoPanelState);
		clientMosquitto.publish('infoPanel', desiredInfoPanelState);
        });
	doorShadow.on('foreignStateChange',
        function(thingName, operation, stateObject) {
		console.log('Door state changed remotely');
		var desiredDoorState = JSON.stringify(stateObject.state.desired);
		console.log(desiredDoorState);
		clientMosquitto.publish('door', desiredDoorState);
        });
	doorInfoPanelShadow.on('foreignStateChange',
        function(thingName, operation, stateObject) {
		console.log('DoorInfoPanel state changed remotely');
		var desiredDoorInfoPanelState = JSON.stringify(stateObject.state.desired.light);
		console.log(desiredDoorInfoPanelState);
		clientMosquitto.publish('doorInfoPanel', desiredDoorInfoPanelState);
        });
});


