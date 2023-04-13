/**
 * Payload Decoder for The Reports
 * 
 * Copyright 2023 HKT SmartHard
 * 
 * @product gat-100
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
            case 0x03:// BATTERY
                decoded.battery = bytes[i];
                dataLen -= 1;
                i += 1;
                break;
            case 0x09:// TEM
                if(bytes[i]===0x00)
                {
                    decoded.temperature=readInt16LE(bytes.slice(7,9))/1000;
                }
                else if(bytes[i]===0x80)
                {
                    decoded.temperature=-(readInt16LE(bytes.slice(7,9)))/1000;
                }
                dataLen -= 3;
                i += 3;
                break;
            case 0x0A:// humidity
                decoded.humidity=readUInt32LE(bytes.slice(6,9))/1000;
                dataLen -= 3;
                i += 3;
                break;
            case 0x84:// Temperproof_status
                decoded.Temperproof_status=readUInt8LE(bytes.slice(6,7));
                dataLen -= 1;
                i += 1;
                break;
            case 0x86:// Data_Synchronization_cycle  
                decoded.Data_Synchronization_cycle=readUInt16LE(bytes.slice(6,8));
                dataLen -= 2;
                i += 2;
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

 function readUInt16LE(bytes) 
 {
  var value = (bytes[0] << 8) + bytes[1];
  return (value & 0xFFFF);
 }

function readInt16LE(bytes)
{
    var ref = readUInt16LE(bytes);
    return (ref > 0x7FFF) ? ref - 0x10000 : ref;
}

function readUInt32LE(bytes) 
{
    var value = (bytes[0] << 24) + (bytes[1] << 16) + (bytes[2] << 8) + bytes[3];
    return (value & 0xFFFFFFFF);
}
 
function readUInt8LE_SWP8(bytes) 
{
    return (value & 0xFF);
}
