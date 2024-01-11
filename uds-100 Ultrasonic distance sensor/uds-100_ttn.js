/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2024 HKT SmartHard
 * 
 * @product UDS-100
 */

function easy_decode(bytes) {
    var decoded = {};

    if (checkReportSync(bytes) == false)
        return;
	
    var temp;
    var dataLen = bytes.length - 5;
    var i = 5;
    while (dataLen--) {
        var type = bytes[i];
        i++;
        switch (type) {
            case 0x01:  //software_ver and hardware_ver
                decoded.hard_ver = bytes[i+1];
                decoded.soft_ver = bytes[i];
                dataLen -= 2;
                i += 2;
                break;
            case 0x8B:// BATTERY
                decoded.battery = readInt16LE(bytes.slice(i, i + 2))/ 1000;
                dataLen -= 2;
                i += 2;
                break;
            case 0x09:// tamperature
       			temp = byteToInt32(bytes.slice(i, i + 3));
                if (temp > 0x7FFFFFFF)
                    temp = -(temp & 0x7FFFFFFF);
                // ℃
                decoded.temperature = byteToInt32(bytes.slice(i, i + 3)) / 1000;

                // ℉
                // decoded.temperature = byteToInt16(bytes.slice(i, i + 3)) / 1000 * 1.8 + 32;

                dataLen -= 3;
                i += 3;
                break;
            case 0x0A:// humidity
                decoded.humidity = byteToInt32(bytes.slice(i, i + 3)) / 1000;
                dataLen -= 3;
                i += 3;
                break;
			 case 0x0E:// angle
                decoded.angle = readInt16LE(bytes.slice(i, i + 2)) ;
                dataLen -= 2;
                i += 2;
                break;
			case 0x44:// angle state
                decoded.angle_state = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
			case 0x45:// GPS positioning cycle
                decoded.positioning_cycle= readInt16LE(bytes.slice(i, i + 2));
                dataLen -= 2;
                i += 2;
                break;
			case 0x46:// distance
                decoded.distance= readInt16LE(bytes.slice(i, i + 2));
                dataLen -= 2;
                i += 2;
                break;
			case 0x47:// full state
                decoded.full_state = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
			case 0x48:// full threshold set
                decoded.low_threshold_set=  readInt16LE(bytes.slice(i, i + 2));
				decoded.high_threshold_set=  readInt16LE(bytes.slice(i + 2,i + 4));
                dataLen -= 4;
                i += 4;
                break;
            case 0x10:// GPS latitude
                var value = bytes[i] << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3];
                if (value > 0x7FFFFFFF)
                    value = -(value & 0x7FFFFFFF);
                decoded.latitude = value / 1000000;
                dataLen -= 4;
                i += 4;
                break;
            case 0x11:// GPS longitude
                var value = bytes[i] << 24 | bytes[i + 1] << 16 | bytes[i + 2] << 8 | bytes[i + 3];
                if (value > 0x7FFFFFFF)
                    value = -(value & 0x7FFFFFFF);
                decoded.longitude = value / 1000000;
                dataLen -= 4;
                i += 4;
                break;
            case 0x86:// sync interval
                decoded.sync_interval = readUInt16LE(bytes.slice(i, i + 2));
                dataLen -= 2;
                i += 2;
                break;

        }
    }
    return decoded;
}


function hexToString(bytes) {

    var value = "";
    var arr = bytes.toString(16).split(",");
    for (var i = 0; i < arr.length; i++) {
        value += parseInt(arr[i]).toString(16);
    }
    return value;
}

function checkReportSync(bytes) {
    if (bytes[0] == 0x68 && bytes[1] == 0x6B && bytes[2] == 0x74) {
        return true;
    }
    return false;
}

function byteToInt32(bytes) {
    var value = bytes[0] * 0xFF * 0xFF + bytes[1] * 0xFF + bytes[2];
    return value > 0x7fffff ? value - 0x1000000 : value;
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

function readUInt8LE_SWP8(bytes) {
    return (value & 0xFF);
}

function Decoder(bytes, port) {
    return easy_decode(bytes);
}
