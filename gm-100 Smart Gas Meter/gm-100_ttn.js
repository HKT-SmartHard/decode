/**
 * Payload Decoder for The Things Network
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product HKT-GM-100
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
            case 0x03:// BATTERY
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x33:// unit_price
                t = bytes.slice(i, i + 4 )
                price = byteToInt32(bytes.slice(i, i + 4 ));
                if (price > 0x7FFFFFFF)
                    price = -(price & 0x7FFFFFFF);
                decoded.unit_price = byteToInt32(bytes.slice(i, i + 4))/100;
                dataLen -= 4;
                i += 4;
                break;
             case 0x35:// total_used
                used = byteToInt32(bytes.slice(i, i + 4 ));
                if (used > 0x7FFFFFFF)
                    used = -(used & 0x7FFFFFFF);
                decoded.total_used = byteToInt32(bytes.slice(i, i + 4))/100 ;
                dataLen -= 4;
                i += 4;
                break;
             case 0x36:// gas_surplus
                surplus = byteToInt32(bytes.slice(i, i + 4 ));
                if (surplus > 0x7FFFFFFF)
                    surplus = -(surplus & 0x7FFFFFFF);
                decoded.gas_surplus = byteToInt32(bytes.slice(i, i + 4)) /100;
                dataLen -= 4;
                i += 4;
                break;
            case 0x37:// gas_balance
                balance = byteToInt32(bytes.slice(i, i + 4 ));
                if (balance > 0x7FFFFFFF)
                    balance = -(balance & 0x7FFFFFFF);
                decoded.gas_balance = byteToInt32(bytes.slice(i, i + 4))/100 ;
                dataLen -= 4;
                i += 4;
                break;
            case 0x38:// VALVE_STATUS
                decoded.valve_status = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x83:// FAULT_STATUS
                decoded.fault_state = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x89:// POWER_STATUS
                decoded.power_state = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
        }
    }
    return decoded;
}

function byteToUint16(bytes) {
    var value = (bytes[1] << 8) | bytes[0];
    return value;
}

function byteToInt16(bytes) {
    var value = bytes[0] * 0xFF + bytes[1];
    return value > 0x7fff ? value - 0x10000 : value;
}

function byteToInt32(bytes) {
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
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
    if (bytes[0] == 0x68 && bytes[1] == 0x68 && bytes[2] == 0x74) {
        return true;
    }
    return false;
}
function Decoder(bytes, port) {
    return easy_decode(bytes);
}
