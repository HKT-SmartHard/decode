/**
 * Decoder for The Things Network
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product    MagneticSensor   DC-10
 */
function Decoder(bytes) {
    var decoded = {};
    decoded.events = {};
    decoded.events.AttributeEventV3 = {};
    decoded.events.up_raw_data = {};
    var decoded_down = {};
    decoded_down.params = {};
    if (bytes[0] === 0xfd && bytes[1] === 0xfe) {
        if (bytes[3] === 0x01 && bytes[7] === 0x17 && bytes.length === 31) {//属性帧
            decoded.events.AttributeEventV3.Heartbeat = readUInt16LE(bytes.slice(8, 10));
            decoded.events.AttributeEventV3.CarOnDecisionTime = readUInt8LE(bytes.slice(10, 11));
            decoded.events.AttributeEventV3.CarOffDecisionTime = readUInt8LE(bytes.slice(11, 12));
            decoded.events.AttributeEventV3.MagTrace = readUInt8LE(bytes.slice(12, 13));
            decoded.events.AttributeEventV3.MagSensitive = readInt8LE(bytes.slice(13, 14));
            decoded.events.AttributeEventV3.MagThreshold = readUInt8LE(bytes.slice(14, 15));
            decoded.events.AttributeEventV3.MagWorkBegin = readUInt8LE(bytes.slice(15, 16));
            decoded.events.AttributeEventV3.MagWorkEnd = readUInt8LE(bytes.slice(16, 17));
            decoded.events.AttributeEventV3.SelfAdapterRate = readUInt8LE(bytes.slice(17, 18));
            decoded.events.AttributeEventV3.SelfAdapterSsThd = readUInt8LE(bytes.slice(18, 19));
            decoded.events.AttributeEventV3.SelfAdapterSfThd = readUInt8LE(bytes.slice(19, 20));
            decoded.events.AttributeEventV3.SelfAdapterDfThd = readUInt16LE(bytes.slice(20, 22));
            decoded.events.AttributeEventV3.RadarAmpFactor = readUInt8LE(bytes.slice(22, 23));
            decoded.events.AttributeEventV3.RadarMagDiffThd = readUInt8LE(bytes.slice(23, 24));
            decoded.events.AttributeEventV3.RadarMagEdge = readUInt8LE(bytes.slice(24, 25));
            decoded.events.AttributeEventV3.RadarMagThdLL = readUInt8LE(bytes.slice(25, 26));
            decoded.events.AttributeEventV3.RadarMagThdHH = readUInt16LE(bytes.slice(26, 28));
            decoded.events.AttributeEventV3.DeviceState = readUInt8LE(bytes.slice(28, 29));
            decoded.events.AttributeEventV3.FwVersion = readUInt8LE(bytes.slice(29, 30));
            decoded.events.AttributeEventV3.HwVersion = readUInt8LE(bytes.slice(30, 31));
            decoded.events.AttributeEventV3.ServerTime = formatDate(new Date().getTime());
            decoded.events.AttributeEventV3.HexContext = bytesToHexString(bytes);
            decoded.events.up_raw_data.server_unix_time = formatDate(new Date().getTime());
            decoded.events.up_raw_data.content = bytesToHexString(bytes);
        }
        else if (bytes[3] === 0x02 && bytes[7] === 0x15 && bytes.length === 29) {//业务帧
            decoded.events.AttributeEventV3.UnixTime = readUInt32LE(bytes.slice(8, 12));
            decoded.events.AttributeEventV3.MagneticState = readUInt8LE(bytes.slice(12, 13));
            decoded.events.AttributeEventV3.CarEventCount = readUInt16LE(bytes.slice(13, 15));
            decoded.events.AttributeEventV3.Xaxis = readInt16LE(bytes.slice(15, 17));
            decoded.events.AttributeEventV3.Yaxis = readInt16LE(bytes.slice(17, 19));
            decoded.events.AttributeEventV3.Zaxis = readInt16LE(bytes.slice(19, 21));
            decoded.events.AttributeEventV3.Voltage = readUInt16LE(bytes.slice(21, 23));
            decoded.events.AttributeEventV3.Temperature = readInt8LE(bytes.slice(23, 24));
            decoded.events.AttributeEventV3.RSSI = readInt8LE(bytes.slice(24, 25));
            decoded.events.AttributeEventV3.SNR = readInt8LE(bytes.slice(25, 26));
            decoded.events.AttributeEventV3.AlarmCode = readUInt8LE(bytes.slice(26, 27)).toString(2);
            decoded.events.AttributeEventV3.RadarDistance = readUInt8LE(bytes.slice(27, 28));
            decoded.events.AttributeEventV3.DecisionInfo = readUInt8LE(bytes.slice(28, 29));
            decoded.events.AttributeEventV3.ServerTime = formatDate(new Date().getTime());
            decoded.events.AttributeEventV3.HexContext = bytesToHexString(bytes);
            decoded.events.up_raw_data.server_unix_time = formatDate(new Date().getTime());
            decoded.events.up_raw_data.content = bytesToHexString(bytes);
        }
        else if (bytes[3] === 0x03 && bytes[7] === 0x1f && bytes.length === 39) {//心跳帧
            decoded.events.AttributeEventV3.UnixTime = readUInt32LE(bytes.slice(8, 12));
            decoded.events.AttributeEventV3.MagneticState = readUInt8LE(bytes.slice(12, 13));
            decoded.events.AttributeEventV3.CarEventCount = readUInt16LE(bytes.slice(13, 15));
            decoded.events.AttributeEventV3.Xaxis = readInt16LE(bytes.slice(15, 17));
            decoded.events.AttributeEventV3.Yaxis = readInt16LE(bytes.slice(17, 19));
            decoded.events.AttributeEventV3.Zaxis = readInt16LE(bytes.slice(19, 21));
            decoded.events.AttributeEventV3.Voltage = readUInt16LE(bytes.slice(21, 23));
            decoded.events.AttributeEventV3.Temperature = readInt8LE(bytes.slice(23, 24));
            decoded.events.AttributeEventV3.RSSI = readInt8LE(bytes.slice(24, 25));
            decoded.events.AttributeEventV3.SNR = readInt8LE(bytes.slice(25, 26));
            decoded.events.AttributeEventV3.AlarmCode = readUInt8LE(bytes.slice(26, 27)).toString(2);
            decoded.events.AttributeEventV3.RadarDistance = readUInt8LE(bytes.slice(27, 28));
            decoded.events.AttributeEventV3.DecisionInfo = readUInt8LE(bytes.slice(28, 29));
            decoded.events.AttributeEventV3.BaseX = readInt16LE(bytes.slice(29, 31));
            decoded.events.AttributeEventV3.BaseY = readInt16LE(bytes.slice(31, 33));
            decoded.events.AttributeEventV3.BaseZ = readInt16LE(bytes.slice(33, 35));
            decoded.events.AttributeEventV3.ComfirmFailure = readUInt16LE(bytes.slice(35, 37));
            decoded.events.AttributeEventV3.RadarWorkTimes = readUInt16LE(bytes.slice(37, 39));
            decoded.events.AttributeEventV3.ServerTime = formatDate(new Date().getTime());
            decoded.events.AttributeEventV3.HexContext = bytesToHexString(bytes);
            decoded.events.up_raw_data.server_unix_time = formatDate(new Date().getTime());
            decoded.events.up_raw_data.content = bytesToHexString(bytes);
        }
        else if (bytes[3] === 0x05 && bytes[7] === 0x0a && bytes.length === 18) {//控制帧
            decoded_down.method = "thing.service.ControlCmdV3";
            decoded_down.id = "10003";
            decoded_down.version = "1.30";
            decoded_down.params.BusinessId = readUInt32LE(bytes.slice(8, 12));
            decoded_down.params.CommandCode = readUInt16LE(bytes.slice(12, 14));
            decoded_down.params.Key = readUInt16LE(bytes.slice(14, 16));
            decoded_down.params.Value = readUInt16LE(bytes.slice(16, 18));
            return decoded_down;
        }
        else if (bytes[3] === 0x06 && bytes[7] === 0x18 && bytes.length === 32) {//配置帧
            decoded_down.method = "thing.service.ControlCmdV3";
            decoded_down.id = "10003";
            decoded_down.version = "1.30";
            decoded_down.params.BusinessId = readUInt32LE(bytes.slice(8, 12));
            decoded_down.params.MagHeartbeat = readUInt16LE(bytes.slice(12, 14));
            decoded_down.params.MagCaron = readUInt8LE(bytes.slice(14, 15));
            decoded_down.params.MagCaroff = readUInt8LE(bytes.slice(15, 16));
            decoded_down.params.MagTrace = readUInt8LE(bytes.slice(16, 17));
            decoded_down.params.MagSensitive = readUInt8LE(bytes.slice(17, 18));
            decoded_down.params.MagThreshold = readUInt8LE(bytes.slice(18, 19));
            decoded_down.params.MagWorkBegin = readUInt8LE(bytes.slice(19, 20));
            decoded_down.params.MagWorkEnd = readUInt8LE(bytes.slice(20, 21));
            decoded_down.params.SelfAdapterRate = readUInt8LE(bytes.slice(21, 22));
            decoded_down.params.SelfAdapterSsThd = readUInt8LE(bytes.slice(22, 23));
            decoded_down.params.SelfAdapterSfThd = readUInt8LE(bytes.slice(23, 24));
            decoded_down.params.SelfAdapterDfThd = readUInt16LE(bytes.slice(24, 26));
            decoded_down.params.RadarAmpFactor = readUInt8LE(bytes.slice(26, 27));
            decoded_down.params.RadarMagDiffThd = readUInt8LE(bytes.slice(27, 28));
            decoded_down.params.RadarMagEdge = readUInt8LE(bytes.slice(28, 29));
            decoded_down.params.RadarMagThdLL = readUInt8LE(bytes.slice(29, 30));
            decoded_down.params.RadarMagThdHH = readUInt16LE(bytes.slice(30, 32));
            return decoded_down;
        }
    }

    return decoded;
}

/* ******************************************
 * bytes to number
 ********************************************/
function readUInt8LE(bytes) {
    return (bytes & 0xFF);
}

function readInt8LE(bytes) {
    var ref = readUInt8LE(bytes);
    return (ref > 0x7F) ? ref - 0x100 : ref;
}

function readUInt16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function readInt16LE(bytes) {
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) {
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
}

function readInt32LE(bytes) {
    var ref = readUInt32LE(bytes);
    return (ref > 0x7FFFFFFF) ? ref - 0x100000000 : ref;
}

/* ******************************************
 * util
 ********************************************/
function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
    var date = new Date(time);

    var year = date.getFullYear(),
        month = date.getMonth() + 1,//月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index;
    });////开个长度为10的数组 格式为 00 01 02 03

    var newTime = format.replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

    return newTime;
}

function bytesToHexString(byteArray) {
    return Array.from(byteArray, function (byte) {
        return ('0' + (byte & 0xFF).toString(16)).slice(-2);
    }).join('')
}


function HexString2Bytes(str) {
    var pos = 0;
    var len = str.length;
    if (len % 2 != 0) {
        return null;
    }
    len /= 2;
    var arrBytes = new Array();
    for (var i = 0; i < len; i++) {
        var s = str.substr(pos, 2);
        var v = parseInt(s, 16);
        arrBytes.push(v);
        pos += 2;
    }
    return arrBytes;
}
