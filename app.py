from flask import Flask, render_template, request, redirect, session, flash
from flask_socketio import SocketIO, send, emit, join_room, leave_room
import json
import time;

app = Flask(__name__)
socketio = SocketIO()
socketio.init_app(app)

@app.route('/')
def index():
	return render_template("index.html")

@app.route('/data', methods=['POST'])
def data():
    # print(request.data)
    socketio.emit('hb_data', request.data.decode('utf-8'), broadcast=True)
    return 'success'

if __name__ == '__main__':
	socketio.run(app, host='0.0.0.0', port=80)
