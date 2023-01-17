/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2022 HKT SmartHard
 * 
 * @product HKT-CT02
 */
function Decoder(bytes, port) {

    var decoded = {};

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
            case 0x81:// power way
                decoded.power = bytes[i];   //0 dc 1 battery 
                dataLen -= 1;
                i += 1;
                break;
            case 0x82:// ECO Mode   
                decoded.eco = bytes[i];     //0 normal 1 eco
                dataLen -= 1;
                i += 1;
                break;
            case 0x83:// Tamper
                decoded.tamper = bytes[i];     //0 install 1 uninstall
                dataLen -= 1;
                i += 1;
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
            case 0x15:// step
                decoded.step = bytes[i];
                dataLen -= 1;
                i += 1;
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



