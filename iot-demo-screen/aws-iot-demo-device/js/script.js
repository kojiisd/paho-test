var mqtt = require('mqtt');
var client = mqtt.connect('ws://localhost:9001');

var topic = "aws-iot-demo/demo"

var data = {
  messages: []
};

var body = {};

$(document).ready(function () {
  $("#sendData").click(function () {
    console.log('connect');
    var id = $('#id').val();
    var value = $('#value').val();
    var score = $('#score').val();

    if (id == "" || value == "" || score == "") {
      alert("Please fill each input boxes.");
      return;
    }

    if (!$.isNumeric(value) || !$.isNumeric(score)) {
      alert("Please input number for input field and score field.");
      return;
    }

    body.id = id;
    body.value = Number(value);
    body.score = Number(score);
    body.timestamp = new Date().toISOString();

    send(body);
  });
});


function send(content) {
    client.publish(topic, JSON.stringify(content));
}

