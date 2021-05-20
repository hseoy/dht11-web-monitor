from flask import Flask, render_template, jsonify
import serial
import threading

app = Flask(__name__)
curTemp = 0.0
curHumi = 0.0
tempDataList = []
humiDataList = []

ser = serial.Serial(
    port='COM6',
    baudrate=115200,
    parity=serial.PARITY_NONE,
    stopbits=serial.STOPBITS_ONE,
    bytesize=serial.EIGHTBITS,
    timeout=1)


def read_dht11_data():
    global curTemp, curHumi
    while True:
        # 0x02 Humi(Integer) Humi(fractional) Temp(Integer) Temp(fractional) 0x03
        while(ser.read(1) != b'\x02'):
            pass
        data = list(ser.read(5))
        curHumi = float(str(data[0]) + '.' + str(data[1]))
        curTemp = float(str(data[2]) + '.' + str(data[3]))

        if len(humiDataList) > 99:
            humiDataList.pop(0)
        if len(tempDataList) > 99:
            tempDataList.pop(0)

        tempDataList.append(curTemp)
        humiDataList.append(curHumi)


@app.route('/')
def index():
    return render_template('index.html', temp=curTemp, humi=curHumi)


@app.route('/graph')
def graph():
    return render_template('graph.html')


@app.route('/graph-data')
def graph_data():
    data = {
        'temps': tempDataList,
        'humis': humiDataList,
    }
    return jsonify(data)


if __name__ == '__main__':
    t = threading.Thread(target=read_dht11_data)
    t.daemon = True
    t.start()
    app.run(debug=True, host='127.0.0.1', port=5000, use_reloader=False)
