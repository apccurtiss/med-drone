from libpebble2.communication import PebbleConnection
from libpebble2.communication.transports.websocket import WebsocketTransport
from libpebble2.services.appmessage import *
from libpebble2.events.mixin import EventSourceMixin

from time import sleep

import requests

import logging
logging.basicConfig(filename='log',level=logging.DEBUG)

#pebble = PebbleConnection(WebsocketTransport("ws://172.20.10.7:9000/"), log_protocol_level=logging.DEBUG, log_packet_level=logging.DEBUG)
pebble = PebbleConnection(WebsocketTransport("ws://10.9.7.75:9000/"), log_protocol_level=logging.DEBUG, log_packet_level=logging.DEBUG)
pebble.connect()
pebble.run_async()
print pebble.watch_info.serial

def postData(heartrate):
    payload = { 'hr': heartrate}
    url = 'http://localhost/data'
    try:
        requests.post(url, payload)
    except:
        print "Error, no connection to EMS base"


def incomingMSG(id, uuid, data):
    #print id
    #print uuid
    #print data
    heart = str(data[0])
    print "Heartrate Update: " + heart

    #Send Data back to EMS base
    postData(heart)

handler = AppMessageService(pebble)

handler.register_handler("appmessage", incomingMSG)

while True:
  sleep(1)
