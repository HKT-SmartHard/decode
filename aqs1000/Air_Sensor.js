/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product undefine
 */
function Decoder(bytes, port) {
    var decoded = {
        hard_ver: 0,
        soft_ver: 0,
        id: "",
        battery: 0.0,
        temperature: 0.0,
        humidity: 0.0,
        pir: 0,
        light_level: 0,
        co2: 0,
        tvoc: 0,
        pressure: 0,
        hcho: 0,
        pm2_5: 0,
        pm10: 0,
        o3_level: 0,
        pwr_way: 0,
        eco: 0,
    };

    if (checkReportSync(bytes) == false)
        return;

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
            case 0x81:// power way
                decoded.pwr_way = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x82://  Eco mode
                decoded.eco = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
        }
    }
    return decoded;
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

var test = [0x68, 0x6B, 0x74, 0x00, 0x12, 0x01, 0x03, 0x01, 0x02, 0x69, 0x06, 0x00, 0x00, 0x30, 0x6C, 0x81, 0x00, 0x82, 0x00, 0x09, 0x00, 0x7D, 0xD5, 0x0A, 0x00, 0xB3, 0x8D, 0x19, 0x03, 0xE8, 0x1A, 0x01, 0x1B, 0x04, 0x1C, 0x00, 0x10, 0x1D, 0x00, 0x10, 0x1E, 0x00, 0x29, 0x1F, 0x00, 0x20, 0x03, 0x90, 0x21, 0x01];
console.log(Decoder(test, 10))

