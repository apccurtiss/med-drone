from libpebble2.communication import PebbleConnection
from libpebble2.communication.transports.websocket import WebsocketTransport
from libpebble2.services.appmessage import *
from libpebble2.events.mixin import EventSourceMixin

from time import sleep
from time import time
current_milli_time = lambda: int(round(time() * 1000))

from random import randint

import requests
import json

import logging
logging.basicConfig(filename='log',level=logging.DEBUG)

bp_upper_base = 120
bp_lower_base = 80
variance = 10
bp_upper = bp_upper_base
bp_lower = bp_lower_base
def fakeBPupper():
    global bp_upper, bp_upper_base, variance
    bp_upper += randint(-2, 2)
    bp_upper = max(bp_upper_base - variance, min(bp_upper, bp_upper_base + variance))
    return bp_upper

def fakeBPlower():
    global bp_lower, bp_lower_base, variance
    bp_lower += randint(-2, 2)
    bp_lower = max(bp_lower_base - variance, min(bp_lower, bp_lower_base + variance))
    return bp_lower

def postData(heartrate):
    payload = [ { 'time': current_milli_time(),
                   'hr': heartrate,
                    'bp_upper': fakeBPupper(),
                    'bp_lower': fakeBPlower() } ]
    url = 'http://172.20.10.10:8080/data'
    print payload
    try:
        r = requests.post(url, json=payload)
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




pebble = PebbleConnection(WebsocketTransport("ws://172.20.10.7:9000/"), log_protocol_level=logging.DEBUG)
#pebble = PebbleConnection(WebsocketTransport("ws://10.9.7.75:9000/"), log_protocol_level=logging.DEBUG)
pebble.connect()
pebble.run_async()
print pebble.watch_info.serial

handler = AppMessageService(pebble)
handler.register_handler("appmessage", incomingMSG)

while True:
  sleep(1)
