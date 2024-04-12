/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product USV-200
 */

var ACT_WAY = ["Fingerprint Open", "Password Open", "MF Card Open", "Fingerprint Alarm", "Password Alarm", "MF Card Alarm", "Tamper Alarm", "LoRa Open", "BLE Open", "Unknow"];

function easy_decode(bytes) {
    var decoded = {};

    if (bytes[0] == 0x68 && bytes[1] == 0x10) {
        var i = 2;
        decoded.addr = convertBCD2BIN(reverseBytes(bytes[i++])) * 1000000000000 +
            convertBCD2BIN(reverseBytes(bytes[i++])) * 10000000000 +
            convertBCD2BIN(reverseBytes(bytes[i++])) * 100000000 +
            convertBCD2BIN(reverseBytes(bytes[i++])) * 1000000 +
            convertBCD2BIN(reverseBytes(bytes[i++])) * 10000 +
            convertBCD2BIN(reverseBytes(bytes[i++])) * 100 +
            convertBCD2BIN(reverseBytes(bytes[i++]))
        decoded.control_code = convertBCD2BIN(bytes[i++]);
        decoded.data_len = bytes[i++];
        decoded.DID = convertBCD2BIN(bytes[i++])* 100 + convertBCD2BIN(bytes[i++]);
        decoded.SER = bytes[i++];
        var unit = bytes[i++];
        var value = convertBCD2BIN(bytes[i++]) + (convertBCD2BIN(bytes[i++]) * 100) + (convertBCD2BIN(bytes[i++]) * 10000) + (convertBCD2BIN(bytes[i++]) * 1000000);
        switch (unit) {  //L
            case 0x29:
                decoded.total_flow = value / 100;
                break;
            case 0x2A:
                decoded.total_flow = value / 10;
                break;
            case 0x2B:
                decoded.total_flow = value;
                break;
            case 0x2C:
                decoded.total_flow = value * 10;
                break;
            case 0x2D:
                decoded.total_flow = value * 100;
                break;
            case 0x2E:
                decoded.total_flow = value * 1000;
                break;
            default:
                break;
        }
        decoded.total_flow = decoded.total_flow + 'L';

        unit = bytes[i++];
        value = convertBCD2BIN(bytes[i++]) + (convertBCD2BIN(bytes[i++]) * 100) + (convertBCD2BIN(bytes[i++]) * 10000) + (convertBCD2BIN(bytes[i++]) * 1000000);
        switch (unit) {  //L
            case 0x29:
                decoded.settlement_day_cumulative_amount = value / 100;
                break;
            case 0x2A:
                decoded.settlement_day_cumulative_amount = value / 10;
                break;
            case 0x2B:
                decoded.settlement_day_cumulative_amount = value;
                break;
            case 0x2C:
                decoded.settlement_day_cumulative_amount = value * 10;
                break;
            case 0x2D:
                decoded.settlement_day_cumulative_amount = value * 100;
                break;
            case 0x2E:
                decoded.settlement_day_cumulative_amount = value * 1000;
                break;
            default:
                break;
        }
        decoded.settlement_day_cumulative_amount = decoded.settlement_day_cumulative_amount + "L";

        unit = bytes[i++];
        value = convertBCD2BIN(bytes[i++]) + (convertBCD2BIN(bytes[i++]) * 100) + (convertBCD2BIN(bytes[i++]) * 10000) + (convertBCD2BIN(bytes[i++]) * 1000000);
        switch (unit) {  //L
            case 0x29:
                decoded.reverse_cumulative_flow = value / 100;
                break;
            case 0x2A:
                decoded.reverse_cumulative_flow = value / 10;
                break;
            case 0x2B:
                decoded.reverse_cumulative_flow = value;
                break;
            case 0x2C:
                decoded.reverse_cumulative_flow = value * 10;
                break;
            case 0x2D:
                decoded.reverse_cumulative_flow = value * 100;
                break;
            case 0x2E:
                decoded.reverse_cumulative_flow = value * 1000;
                break;
            default:
                break;
        }
        decoded.reverse_cumulative_flow = decoded.reverse_cumulative_flow + "L";

        unit = bytes[i++];
        value = convertBCD2BIN(bytes[i++]) + (convertBCD2BIN(bytes[i++]) * 100) + (convertBCD2BIN(bytes[i++]) * 10000) + (convertBCD2BIN(bytes[i++]) * 1000000);
        switch (unit) {  
            case 0x32:
                decoded.flow_rate = value / 10000000;
                break;
            case 0x33:
                decoded.flow_rate = value / 1000000;
                break;
            case 0x34:
                decoded.flow_rate = value / 100000;
                break;
            case 0x35:
                decoded.flow_rate = value / 10000;
                break;
            case 0x36:
                decoded.flow_rate = value / 1000;
                break;
            case 0x37:
                decoded.flow_rate = value / 100;
                break;
            default:
                break;
        }
        decoded.flow_rate = decoded.flow_rate + "m³";

        decoded.temperature = (convertBCD2BIN(bytes[i++]) + (convertBCD2BIN(bytes[i++]) * 100) + (convertBCD2BIN(bytes[i++]) * 10000)) / 100 + "";
        decoded.local_time = convertBCD2BIN(bytes[i++]) +
            (convertBCD2BIN(bytes[i++]) * 100) +
            (convertBCD2BIN(bytes[i++]) * 10000) +
            (convertBCD2BIN(bytes[i++]) * 1000000) +
            (convertBCD2BIN(bytes[i++]) * 100000000) +
            (convertBCD2BIN(bytes[i++]) * 10000000000) +
            (convertBCD2BIN(bytes[i++]) * 1000000000000);

        var status = bytes[i++] | bytes[i] << 8;
        if (status & 0x03) {
            if (status == 0) {
                decoded.valve_status = "ON";
            } else if (status == 1) {
                decoded.valve_status = "OFF";
            } if (status == 3) {
                decoded.valve_status = "Fault";
            }
        }
        if (status & 0x04) {
            decoded.battery_status = "Normal";
        } else {
            decoded.battery_status = "Low";
        }
        if (status & 0x100) {
            decoded.battery_alarm = "Alarm";
        } else {
            decoded.battery_status = "Normal";
        }
        if (status & 0x200) {
            decoded.air_traffic_control_alarm = "Alarm";
        } else {
            decoded.air_traffic_control_alarm = "Normal";
        }
        if (status & 0x400) {
            decoded.back_flow_alarm = "Alarm";
        } else {
            decoded.back_flow_alarm = "Normal";
        }
        if (status & 0x800) {
            decoded.orAL = "Alarm";
        } else {
            decoded.orAL = "Normal";
        }
        if (status & 0x1000) {
            decoded.water_temperature_alarm = "Alarm";
        } else {
            decoded.water_temperature_alarm = "Normal";
        }
        if (status & 0x2000) {
            decoded.ee_alarm = "Alarm";
        } else {
            decoded.ee_alarm = "Normal";
        }
    }
    return decoded;
}



function convertBCD2BIN(bytes) {
    return (((((bytes) & 0xF0) >> 4) * 10) + ((bytes) & 0x0F));
}


function reverseBytes(bytes) {
    return ((bytes > 4) & 0x0F) | ((bytes << 4) & 0xF0);
}

function byteToUint32(bytes) {
    var value = (bytes[0] << 24) | (bytes[1] << 16) | (bytes[2] << 8) | (bytes[3] << 0);
    return value;
}

function formatDate(time, format = 'YY-MM-DD hh:mm:ss') {
    var date = new Date(time * 1000);

    var year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
    var preArr = Array.apply(null, Array(10)).map(function (elem, index) {
        return '0' + index;
    });

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
    if (len % 2 !== 0) {
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

function Decoder(bytes, port) {
    return easy_decode(bytes);
}


