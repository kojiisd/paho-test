var mqtt = require('mqtt');
var client = mqtt.connect('ws://localhost:9001');

$(document).ready(function () {

  function applyData(result) {
    console.log('Appy data started.');

    var resultJson = result;

    console.log(resultJson);
    if (resultJson.score != 0) {
        console.log('status color changed.');
        $('#' + resultJson.id).addClass('element_error');
        // $('#' + resultJson.id).css('background-color', 'rgba(255,127,127,' + (Math.random() * 0.5 + 0.25) + ')');
    } else {
        console.log('status color backed.');
        // $('#' + resultJson.id).css('background-color', 'rgba(0,127,127,0.75)');
        $('#' + resultJson.id).removeClass('element_error');
    }

    if (dataIdArray.indexOf(resultJson.id) >= 0) {
      $('#' + resultJson.id + '_symbol')[0].textContent = resultJson.value;
      console.log('Apply data finished.');
    } else {
      console.log('Apply target does not exist: id:' + resultJson.id);
    }


  }
    client.subscribe(topic);

    client.on('message', function (topic, message) {
        // message is Buffer
        console.log(JSON.parse(message.toString()));
        applyData(JSON.parse(message.toString()));
      });
});

