/**
 * Payload Decoder for The Chirpstack v4
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-IAQ-1000
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
                decoded.hard_ver = bytes[i];
                decoded.soft_ver = bytes[i + 1];
                dataLen -= 2;
                i += 2;
                break;
            case 0x02:  //ID
                decoded.id = hexToString(bytes.slice(i, i + 6));
                dataLen -= 6;
                i += 6;
                break;
            case 0x03:// BATTERY
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x09:// TEMPERATURE
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
            case 0x0A:// HUMIDITY
                decoded.humidity = byteToInt32(bytes.slice(i, i + 3)) / 1000;
                dataLen -= 3;
                i += 3;
                break;
            case 0x19:// PRESSURE
                decoded.pressure = byteToUint16(bytes.slice(i, i + 2));
                dataLen -= 2;
                i += 2;
                break;
            case 0x1A:// PIR
                decoded.pir = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x1B:// LIGHT
                decoded.light_level = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x1C:// PM2.5
                decoded.pm2_5 = byteToUint16(bytes.slice(i, i + 2));
                dataLen -= 2;
                i += 2;
                break;
            case 0x1D:// PM10
                decoded.pm10 = byteToUint16(bytes.slice(i, i + 2));
                dataLen -= 2;
                i += 2;
                break;
            case 0x1E:// HCHO
                decoded.hcho = byteToUint16(bytes.slice(i, i + 2)) / 1000;
                dataLen -= 2;
                i += 2;
                break;
            case 0x1F:// O3
                decoded.o3_level = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x20:// CO2
                decoded.co2 = byteToUint16(bytes.slice(i, i + 2))
                dataLen -= 2;
                i += 2;
                break;
            case 0x21:// TVOC
                decoded.tvoc = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x29:// LED mode
                decoded.led_display = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x2A:// BEEP mode
                decoded.beep = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x2B:// temp unit
                decoded.temperature_unit = bytes[i];
                if (decoded.temperature_unit) {
                    decoded.temperature = byteToInt32(bytes.slice(i, i + 3)) / 1000; // ℃
                }
                else {
                    decoded.temperature = byteToInt16(bytes.slice(i, i + 3)) / 1000 * 1.8 + 32; // ℉
                }
                dataLen -= 1;
                i += 1;
                break;
            case 0x2C:// display mode
                decoded.temperature_unit = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x2D:// display overturn
                decoded.display_overturn = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x81:// power way
                decoded.pwr_way = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x86:// sync interval
                decoded.sync_interval = readUInt16LE(bytes.slice(6, 8));
                dataLen -= 2;
                i += 2;
                break;
        }
    }
    return decoded;
}

function readUInt16LE(bytes) {
    var value = (bytes[0] << 8) + bytes[1];
    return (value & 0xFFFF);
}

function byteToUint16(bytes) {
    var value = bytes[0] * 0xFF + bytes[1];
    return value;
}

function byteToInt16(bytes) {
    var value = bytes[0] * 0xFF + bytes[1];
    return value > 0x7fff ? value - 0x10000 : value;
}

function byteToInt32(bytes) {
    var value = bytes[0] * 0xFF * 0xFF + bytes[1] * 0xFF + bytes[2];
    return value > 0x7fffff ? value - 0x1000000 : value;
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


function decodeUplink(input) {
    var decoded = easy_decode(input.bytes);
    return { data: decoded };
}
