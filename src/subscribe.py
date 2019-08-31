import paho.mqtt.client as mqtt
import json
import boto3
import datetime

host = '127.0.0.1'
port = 1883
topic = 'aws-iot-demo/demo'
dynamodb_table_name = 'aws-iot-demo'
dynamodb = boto3.resource(
    'dynamodb',
    region_name='us-west-2',
    endpoint_url="http://localhost:8000",
    aws_access_key_id='ACCESS_ID',
    aws_secret_access_key='ACCESS_KEY'
    )

def on_connect(client, userdata, flags, respons_code):
    print('Connection started: status {0}'.format(respons_code))

    client.subscribe(topic)

def on_message(client, userdata, msg):
    try:
        # print(msg.topic + ' ' + str(msg.payload))
        m_decode = str(msg.payload.decode("utf-8")).strip()
        data_json = json.loads(m_decode)
        print('insert data', data_json)
        data_json['timestamp'] = datetime.datetime.now().isoformat()

        table = dynamodb.Table(dynamodb_table_name)
        table.put_item(
            Item=data_json
        )

    except Exception as e:
        print(e)
        print('Unavailable format for putting.')
        print('format: {\n  "id": "A-000",\n  "value": 000,\n  "score": 000\n}')
        raise e

if __name__ == '__main__':

    client = mqtt.Client(protocol=mqtt.MQTTv311)

    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(host, port=port, keepalive=60)

    # looping for wait.
    client.loop_forever()